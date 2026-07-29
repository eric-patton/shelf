## Why

AI Organizer is part of Shelf's core workflow. Windows support is incomplete while that workflow
depends on zsh or can leave descendant processes running after timeout or cancellation.

## User stories

- As a Windows developer, I want AI Organizer commands to run in PowerShell so that local
  organization works on a standard supported system.
- As a cautious user, I want destructive Windows commands to require explicit approval so that an AI
  cannot execute them silently.
- As a user stopping a long operation, I want the entire command process tree terminated so that no
  hidden child keeps running.
- As a mounted-session user, I want equivalent Windows paths to resolve the same records so that case
  and separator differences do not hide sessions.
- As a macOS or Linux user, I want the existing zsh behavior preserved.

## Behavior & scenarios

- **Scenario: Windows command**
  - Given Shelf runs on Windows and PowerShell 7 is available
  - When AI Organizer executes a normal command
  - Then it invokes `pwsh` non-interactively with the command as one argument and returns bounded
    output metadata
- **Scenario: Windows PowerShell fallback**
  - Given Shelf runs on Windows and PowerShell 7 is unavailable
  - When AI Organizer executes a command
  - Then it invokes Windows PowerShell non-interactively and reports an actionable spawn error if
    that host is also unavailable
- **Scenario: Dangerous Windows command**
  - Given a PowerShell or cmd command can delete data, alter disks or partitions, stop services, or
    terminate processes
  - When the model proposes the command and automatic approval is disabled
  - Then Shelf emits the approval payload and does not execute until the user approves
- **Scenario: Timeout or cancellation**
  - Given an AI shell command owns child and descendant processes
  - When its timeout expires or the user stops AI Organizer
  - Then Shelf terminates the full owned process tree and returns the bounded partial result
- **Scenario: Mounted Windows record**
  - Given a mounted workspace path differs only by Windows-equivalent spelling
  - When AI Organizer lists, searches, or reads mounted records
  - Then it resolves the existing workspace and retains provider-owned file validation
- **Scenario: Unix command**
  - Given Shelf runs on macOS or Linux
  - When AI Organizer executes a command
  - Then it continues to invoke `zsh -lc`

## Acceptance criteria

- [ ] AC-1: Windows AI shell execution prefers `pwsh`, falls back to `powershell`, passes
  `-NoLogo -NoProfile -NonInteractive -Command`, and preserves the command as one argument. macOS
  and Linux continue to use `zsh -lc`.
- [ ] AC-2: A real Windows command returns stdout, stderr, exit code, working directory, duration,
  timeout, byte, line, and truncation metadata through the existing response contract.
- [ ] AC-3: Windows delete, disk, partition, service-stop, and process-stop commands are dangerous,
  including nested `cmd`, `powershell`, and `pwsh` forms, while representative read-only commands
  remain normal.
- [ ] AC-4: A dangerous command with automatic approval disabled emits an approval payload and cannot
  reach the shell tool until approved. Normal commands and explicitly approved reruns continue.
- [ ] AC-5: Timeout and cancellation terminate the complete owned Windows process tree before
  returning, including descendants that inherited stdout or stderr handles.
- [ ] AC-6: AI Organizer list, search, read, and mounted-session validation accept equivalent Windows
  workspace paths while rejecting unmounted record files.
- [ ] AC-7: The AI shell tool describes the active platform shell and produces actionable errors when
  no usable Windows PowerShell host can be spawned.

## Known sharp edges

- PowerShell intentionally interprets the command string. Shelf protects the process boundary by
  passing that string as one argument, not by escaping the PowerShell language.

## Edge cases & errors

- An empty command returns the existing required-command error without spawning a process.
- A missing working directory returns an actionable spawn error.
- PowerShell 7 absence is normal and selects Windows PowerShell.
- Failure to establish Windows process-tree ownership fails closed and kills the direct child.
- Output truncation applies independently to stdout and stderr.
- An unmounted session id or path remains inaccessible.

## Non-functional requirements

- Performance: shell-host detection completes before spawn and does not scan the filesystem
  recursively.
- Security: command argv boundaries, approval checks, mounted-record restrictions, and output limits
  remain enforced.
- Accessibility: the existing approval dialog and streaming status remain keyboard reachable and
  expose the command risk state.
- Reliability: process-tree ownership is established before output readers begin waiting.

## Open questions

None.
