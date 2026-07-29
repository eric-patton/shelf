## Why

Shelf needs trustworthy Windows-native runtime primitives before its user-facing terminal, workspace,
AI Organizer, and release workflows can claim Windows support.

## User stories

- As a Windows developer, I want Shelf to select an available modern shell so that a new terminal
  opens without setup.
- As a returning user, I want Shelf to preserve my valid saved shell so that an upgrade does not
  override my preference.
- As an agent user, I want Shelf to launch Windows command wrappers safely so that installed CLIs
  work regardless of package manager.
- As a developer closing a terminal, I want Shelf to terminate the process tree it started so that
  background agent processes do not remain.
- As a maintainer, I want one Windows path comparison contract so that downstream features agree.

## Behavior & scenarios

- **Scenario: Preferred shell**
  - Given PowerShell 7 and Windows PowerShell are available
  - When Shelf detects local shells for a new or invalid configuration
  - Then it reports `pwsh` as the preferred shell and keeps every detected shell selectable
- **Scenario: Preferred shell fallback**
  - Given PowerShell 7 is unavailable and Windows PowerShell is available
  - When Shelf detects local shells
  - Then it reports `powershell` as the preferred shell
- **Scenario: Saved shell**
  - Given the saved shell is present in the detected shell list
  - When Shelf loads settings
  - Then it preserves the saved shell instead of replacing it with the preferred shell
- **Scenario: Windows wrapper**
  - Given an agent path ends in `.exe`, `.cmd`, `.bat`, or `.ps1`
  - When Shelf starts the local PTY command
  - Then it dispatches through the required Windows host and preserves each logical argument
- **Scenario: Windows environment**
  - Given Shelf runs on Windows without a Unix shell
  - When it creates a local PTY command
  - Then it inherits and augments the process environment without invoking `/bin/zsh`
- **Scenario: Path comparison**
  - Given two Windows paths differ only by slash direction, case, trailing separators, or an extended
    path prefix
  - When Shelf compares them
  - Then it treats equivalent paths as equal and nested paths only as descendants at a component
    boundary
- **Scenario: Process-tree closure**
  - Given a local PTY child starts a descendant process
  - When Shelf closes the PTY
  - Then both the child and descendant exit within 5 seconds

## Acceptance criteria

- [ ] AC-1: Windows terminal detection returns `shells` and `defaultShell`, prefers `pwsh`, falls
  back to `powershell`, and keeps `cmd` selectable when detected.
- [ ] AC-2: Loading settings preserves a valid saved shell and replaces a missing or invalid saved
  shell with `defaultShell`.
- [ ] AC-3: The Windows spawn contract launches `.exe` directly, `.cmd` and `.bat` through
  `cmd.exe`, and `.ps1` through the preferred PowerShell while preserving logical arguments.
- [ ] AC-4: Windows PTY creation performs no Unix login-shell environment capture and retains the
  inherited `PATH` plus Shelf's discovered executable directories.
- [ ] AC-5: Windows path equality and containment handle drive-letter case, both separators,
  trailing separators, drive roots, spaces, non-ASCII text, and `\\?\` prefixes.
- [ ] AC-6: Closing a Windows PTY terminates its complete Shelf-owned descendant process tree within
  5 seconds.
- [ ] AC-7: Existing macOS and Linux shell selection, login environment, path comparison, and
  process-group behavior continue to pass their regression tests.

## Known sharp edges

- Windows wrapper quoting is intentionally limited to launching a known executable with a logical
  argv. It is not a general-purpose cmd parser.

## Edge cases & errors

- Shell detection that finds no listed binary still reports the operating-system fallback.
- An unavailable saved shell falls back without corrupting the configuration file.
- Job Object creation or assignment failure aborts the PTY spawn and terminates the direct child.
- A path that only shares a string prefix, such as `C:\work` and `C:\workspace`, is not nested.
- UNC paths retain their server and share root.

## Non-functional requirements

- Performance: shell detection completes within 2 seconds and path comparison performs no file I/O
  unless canonicalization is explicitly requested by the caller.
- Security: wrapper dispatch preserves argument boundaries, disables cmd delayed expansion, and does
  not interpolate arguments into PowerShell source.
- Accessibility: shell identifiers returned to the UI remain stable so settings can provide friendly,
  localized labels without changing persisted values.
- Reliability: PTY spawn either establishes process-tree ownership or returns an actionable error.

## Open questions

None.
