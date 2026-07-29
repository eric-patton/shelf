#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
use windows_sys::Win32::{
    Foundation::{CloseHandle, HANDLE, INVALID_HANDLE_VALUE},
    System::{
        Diagnostics::ToolHelp::{
            CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, Thread32First, Thread32Next,
            PROCESSENTRY32W, TH32CS_SNAPPROCESS, TH32CS_SNAPTHREAD, THREADENTRY32,
        },
        JobObjects::{
            AssignProcessToJobObject, CreateJobObjectW, JobObjectExtendedLimitInformation,
            SetInformationJobObject, TerminateJobObject, JOBOBJECT_EXTENDED_LIMIT_INFORMATION,
            JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
        },
        Threading::{
            OpenProcess, OpenThread, ResumeThread, TerminateProcess, CREATE_NO_WINDOW,
            PROCESS_QUERY_LIMITED_INFORMATION, PROCESS_SET_QUOTA, PROCESS_TERMINATE,
            THREAD_SUSPEND_RESUME,
        },
    },
};

#[cfg(target_os = "windows")]
pub(crate) fn preferred_windows_powershell() -> String {
    let pwsh_available = std::process::Command::new("where.exe")
        .arg("pwsh.exe")
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false);
    if pwsh_available {
        "pwsh.exe".to_string()
    } else {
        "powershell.exe".to_string()
    }
}

#[cfg(target_os = "windows")]
pub(crate) fn resume_windows_process(process_id: u32) -> Result<(), String> {
    if process_id == 0 {
        return Err("child did not report a Windows process id".to_string());
    }

    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
        if snapshot == INVALID_HANDLE_VALUE {
            return Err(format!(
                "CreateToolhelp32Snapshot failed: {}",
                std::io::Error::last_os_error()
            ));
        }

        let mut entry: THREADENTRY32 = std::mem::zeroed();
        entry.dwSize = std::mem::size_of::<THREADENTRY32>() as u32;
        let mut found = false;
        let mut has_entry = Thread32First(snapshot, &mut entry) != 0;
        while has_entry {
            if entry.th32OwnerProcessID == process_id {
                let thread = OpenThread(THREAD_SUSPEND_RESUME, 0, entry.th32ThreadID);
                if thread.is_null() {
                    let error = std::io::Error::last_os_error();
                    CloseHandle(snapshot);
                    return Err(format!("OpenThread for suspended child failed: {error}"));
                }
                let previous_count = ResumeThread(thread);
                let resume_error = std::io::Error::last_os_error();
                CloseHandle(thread);
                if previous_count == u32::MAX {
                    CloseHandle(snapshot);
                    return Err(format!("ResumeThread failed: {resume_error}"));
                }
                found = true;
            }
            has_entry = Thread32Next(snapshot, &mut entry) != 0;
        }
        CloseHandle(snapshot);

        if found {
            Ok(())
        } else {
            Err("suspended child thread was not found".to_string())
        }
    }
}

#[cfg(target_os = "windows")]
pub(crate) struct WindowsProcessTree {
    job: HANDLE,
    process_id: u32,
}

#[cfg(target_os = "windows")]
unsafe impl Send for WindowsProcessTree {}

#[cfg(target_os = "windows")]
unsafe impl Sync for WindowsProcessTree {}

#[cfg(target_os = "windows")]
impl WindowsProcessTree {
    pub(crate) fn attach(process_id: u32) -> Result<Self, String> {
        if process_id == 0 {
            return Err("child did not report a Windows process id".to_string());
        }

        unsafe {
            let job = CreateJobObjectW(std::ptr::null(), std::ptr::null());
            if job.is_null() {
                return Err(format!(
                    "CreateJobObjectW failed: {}",
                    std::io::Error::last_os_error()
                ));
            }

            let mut limits: JOBOBJECT_EXTENDED_LIMIT_INFORMATION = std::mem::zeroed();
            limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
            if SetInformationJobObject(
                job,
                JobObjectExtendedLimitInformation,
                &limits as *const _ as *const std::ffi::c_void,
                std::mem::size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
            ) == 0
            {
                let error = std::io::Error::last_os_error();
                CloseHandle(job);
                return Err(format!("SetInformationJobObject failed: {error}"));
            }

            let process = OpenProcess(
                PROCESS_SET_QUOTA | PROCESS_TERMINATE | PROCESS_QUERY_LIMITED_INFORMATION,
                0,
                process_id,
            );
            if process.is_null() {
                let error = std::io::Error::last_os_error();
                CloseHandle(job);
                return Err(format!("OpenProcess for child failed: {error}"));
            }

            let assigned = AssignProcessToJobObject(job, process);
            let assignment_error = std::io::Error::last_os_error();
            CloseHandle(process);
            if assigned == 0 {
                CloseHandle(job);
                return Err(format!(
                    "AssignProcessToJobObject failed: {assignment_error}"
                ));
            }

            Ok(Self { job, process_id })
        }
    }

    pub(crate) fn terminate(&self) -> Result<(), String> {
        unsafe {
            let descendants = windows_descendant_processes(self.process_id);
            for process_id in descendants.into_iter().rev() {
                let process = OpenProcess(PROCESS_TERMINATE, 0, process_id);
                if !process.is_null() {
                    let _ = TerminateProcess(process, 1);
                    CloseHandle(process);
                }
            }
            if TerminateJobObject(self.job, 1) == 0 {
                Err(format!(
                    "TerminateJobObject failed: {}",
                    std::io::Error::last_os_error()
                ))
            } else {
                Ok(())
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn windows_descendant_processes(root_process_id: u32) -> Vec<u32> {
    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if snapshot == INVALID_HANDLE_VALUE {
            return Vec::new();
        }

        let mut entry: PROCESSENTRY32W = std::mem::zeroed();
        entry.dwSize = std::mem::size_of::<PROCESSENTRY32W>() as u32;
        let mut processes = Vec::new();
        let mut has_entry = Process32FirstW(snapshot, &mut entry) != 0;
        while has_entry {
            processes.push((entry.th32ProcessID, entry.th32ParentProcessID));
            has_entry = Process32NextW(snapshot, &mut entry) != 0;
        }
        CloseHandle(snapshot);

        let mut tree = vec![root_process_id];
        let mut index = 0;
        while index < tree.len() {
            let parent = tree[index];
            for (process_id, parent_process_id) in &processes {
                if *parent_process_id == parent && !tree.contains(process_id) {
                    tree.push(*process_id);
                }
            }
            index += 1;
        }
        tree
    }
}

#[cfg(target_os = "windows")]
impl Drop for WindowsProcessTree {
    fn drop(&mut self) {
        unsafe {
            if !self.job.is_null() {
                CloseHandle(self.job);
                self.job = std::ptr::null_mut();
            }
        }
    }
}
