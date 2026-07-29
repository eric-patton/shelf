# Discovery

## Users and jobs

- Windows developers need to add projects, discover sessions, start or resume any supported agent,
  manage files, and recover tabs after restart.
- Developers using Windows as an SSH client need the same Shelf project model for Unix hosts.
- Maintainers need path and quoting rules that distinguish local Windows paths from remote POSIX paths.

## Pain landscape

- Frontend session and workspace matching uses case-sensitive slash-only string comparisons.
- File-tree relative paths and drag labels assume `/`.
- Dropping a file into PowerShell emits POSIX single-quote escaping.
- Several local workspace comparisons treat an equivalent Windows path as a different workspace.
- Agent, SSH, and state-recovery flows exist but lack Windows-focused executable evidence.

## Constraints and risks

- Provider-owned session formats remain authoritative.
- Local Windows comparison is case-insensitive, while remote POSIX comparison stays case-sensitive.
- File deletion must keep using the operating-system trash.
- SSH commands target Unix hosts and continue using POSIX quoting.
- Real provider authentication cannot be placed in automated fixtures.

## Candidate success signals

- Equivalent Windows paths select one workspace and discover the same sessions.
- Claude, Codex, and pi fixture CLIs start and resume with exact argv.
- File operations produce correct relative paths and Recycle Bin deletion.
- File drops emit valid text for PowerShell, cmd, SSH, and agent prompts.
- Saved tabs and workspaces restore after restart.

## Explicit unknowns

- None. The approved port defines local Windows and remote POSIX semantics.

## Problem brief

### Problem statement

Windows developers struggle to complete Shelf's normal project workflow because workspace matching,
file actions, terminal insertion, and session restoration still assume POSIX paths. This makes
otherwise functional agent and SSH support unreliable. A solution should provide full Windows
workflow parity while preserving provider formats and remote Unix behavior.

### Target users

Windows developers using local Claude, Codex, or pi projects and Windows developers connecting to
Unix workspaces over SSH.

### Jobs to be done

Add, select, scan, open, resume, manage, and restore a project without path-format surprises.

### Success signals and how we will know

Pure path and quoting suites, fixture-agent tests, SSH argv tests, file-operation tests, and desktop
state-recovery E2E all pass on Windows.

### Constraints

No credentials in fixtures, no provider-format migrations, and no regression to remote POSIX paths.

### Explicitly out of scope

AI Organizer shell execution, installer signing, Microsoft Store distribution, and Windows SSH server
support.

### Open questions

None.
