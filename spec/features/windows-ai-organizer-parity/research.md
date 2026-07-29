# Discovery

## Users and jobs

- Windows developers need AI Organizer to inspect mounted workspaces and session records without a
  Unix shell dependency.
- Users need dangerous PowerShell and cmd commands to pause for the same explicit approval used on
  macOS and Linux.
- Maintainers need bounded output, cancellation, timeout, and descendant cleanup to behave
  consistently across platforms.

## Pain landscape

- The AI shell tool always spawns `zsh -lc`, so it cannot execute on a standard Windows install.
- The tool description teaches the model to generate zsh commands even on Windows.
- Timeout and cancellation kill only the direct shell process on Windows.
- Existing risk parsing recognizes basic Windows delete commands, but does not cover destructive
  disk, partition, service, or process commands.
- Mounted record lookup already uses the shared path contract, but lacks feature-level traceability.

## Constraints and risks

- AI Organizer command content can be untrusted and must remain a single shell argument.
- Dangerous commands require approval unless the existing user setting explicitly enables automatic
  approval.
- Commands may spawn children that keep pipes open after the direct shell exits.
- Session records remain provider-owned and may only be read or edited through mounted identifiers.
- macOS and Linux continue to use the current zsh behavior.

## Candidate success signals

- A Windows AI shell command returns stdout, stderr, exit code, and working directory metadata.
- The preferred available PowerShell host is selected without requiring user configuration.
- Representative destructive PowerShell and cmd commands request approval.
- Timeout or cancellation leaves no owned descendant process running.
- Equivalent Windows mounted paths resolve the same workspace and session records.

## Explicit unknowns

- None. The approved port defines Windows PowerShell host order and keeps the existing approval
  setting.

## Problem brief

### Problem statement

Windows users cannot rely on AI Organizer because its local command tool requires zsh and only owns
the direct child process. A solution should execute through the preferred Windows PowerShell host,
preserve approval and output limits, terminate the owned process tree, and keep mounted-record safety
without changing Unix behavior.

### Target users

Windows developers using AI Organizer with mounted Claude Code, Codex, or pi sessions.

### Jobs to be done

Ask AI Organizer to inspect, classify, and safely operate on mounted development records from a
Windows workstation.

### Success signals and how we will know

Native Rust tests execute a real PowerShell command, exercise risk and approval decisions, confirm
timeout cleanup, verify mounted-path equivalence, and retain Unix invocation coverage.

### Constraints

No arbitrary record-file access, no command interpolation outside the intended shell script
argument, no credentialed fixtures, and no macOS or Linux regression.

### Explicitly out of scope

Changing the AI provider model, adding arbitrary shell selection to AI Organizer, Windows installer
signing, and Microsoft Store distribution.

### Open questions

None.
