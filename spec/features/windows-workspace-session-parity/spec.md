## Why

Windows support is only useful when Shelf's complete project and session workflow behaves consistently
across local Windows paths and remote Unix paths.

## User stories

- As a Windows developer, I want equivalent local paths to resolve to one workspace so that sessions
  and tabs do not fragment.
- As an agent user, I want to start and resume Claude, Codex, and pi from Windows workspaces so that
  provider choice does not limit the platform.
- As a project user, I want file-tree actions and file drops to use Windows-aware paths so that copied
  and inserted paths work.
- As an SSH user, I want to start and resume all supported agents on Unix hosts from Windows.
- As a returning user, I want Shelf to restore my Windows tabs and project context after restart.

## Behavior & scenarios

- **Scenario: Equivalent local workspace**
  - Given a saved Windows workspace and a session path that differs only by case, slash direction,
    trailing separator, or extended prefix
  - When Shelf matches the session or tab to a workspace
  - Then it uses the existing workspace
- **Scenario: Nested local path**
  - Given a blank terminal starts inside a nested directory
  - When Shelf associates it with a workspace
  - Then it selects the deepest component-boundary workspace
- **Scenario: Local agent**
  - Given a discovered Claude, Codex, or pi CLI and a Windows workspace
  - When the user starts or resumes a session
  - Then Shelf passes the provider's managed argv and the original workspace path
- **Scenario: File actions**
  - Given a file under a Windows workspace
  - When the user copies its relative path, reveals it, previews it, or deletes it
  - Then Shelf uses the correct relative path, invokes the native reveal behavior, and sends deletion
    to the Recycle Bin
- **Scenario: Terminal file insertion**
  - Given a file path with spaces or single quotes
  - When it is dropped into a local PowerShell terminal, local cmd terminal, remote SSH terminal, or
    agent prompt
  - Then Shelf emits syntax appropriate to that destination
- **Scenario: SSH agent**
  - Given built-in OpenSSH can reach a Unix workspace
  - When the user starts or resumes Claude, Codex, or pi
  - Then Shelf invokes `ssh` with a POSIX-quoted remote command and the provider's managed argv
- **Scenario: State recovery**
  - Given Shelf saved blank terminal, local session, new-agent, and SSH tabs
  - When Shelf starts again
  - Then it restores each valid tab and keeps invalid records from blocking the rest
- **Scenario: Rename a tab**
  - Given a closable blank-terminal, local-session, new-agent, or SSH tab
  - When the user opens Rename from its context menu or double-clicks the tab and saves a nonempty name
  - Then Shelf immediately shows the trimmed custom title
  - And Shelf restores that title after restart
  - And provider or pending-session refresh does not overwrite it
- **Scenario: Dark TUI surface in a light theme**
  - Given Shelf uses a light application theme
  - And a terminal application paints a dark input surface
  - When text is rendered on that surface
  - Then Shelf requests near-white foreground adjustment for low-contrast cells
  - And the text remains clearly legible without changing the surrounding light terminal background
- **Scenario: Codex multiline input on Windows**
  - Given Codex is running in a Shelf terminal on Windows
  - When the user presses exact `Ctrl+J`
  - Then Shelf inserts one persistent newline in the Codex composer
  - And the caret remains on the new line ready for more text
  - And Shelf does not submit the draft

## Acceptance criteria

- [ ] AC-1: Frontend and backend workspace equality and containment agree for Windows drive case,
  separators, trailing separators, extended prefixes, roots, spaces, non-ASCII text, and component
  boundaries.
- [ ] AC-2: Claude, Codex, and pi local new-session and resume commands preserve the original Windows
  workspace and the provider-specific managed argv.
- [ ] AC-3: File-tree relative paths and drag labels work for Windows and POSIX paths without changing
  the displayed absolute path.
- [ ] AC-4: File insertion uses PowerShell single-quote doubling, cmd quoting, POSIX SSH quoting, and
  readable agent-prompt quoting for paths with spaces, quotes, and non-ASCII text.
- [ ] AC-5: Local reveal, preview, and delete operations accept Windows paths, and delete continues to
  use the operating-system Recycle Bin.
- [ ] AC-6: Windows OpenSSH new-session and resume commands for Claude, Codex, and pi preserve remote
  POSIX paths and provider argv.
- [ ] AC-7: Restart recovery independently restores valid blank-terminal, local-session, new-agent,
  and SSH tab records and skips an invalid record without aborting recovery.
- [ ] AC-8: Pin, rename, provider-owned delete or archive, refresh, and pending-session linking continue
  to operate on the intended Windows workspace.
- [ ] AC-9: Every closable tab can be renamed from an accessible dialog opened by its context menu or
  by double-click. A trimmed nonempty custom title is persisted across restart and takes precedence
  over automatic session-title updates. The Home tab remains immutable.
- [ ] AC-10: In light application themes, terminal cells with a dark background target at least 15:1
  foreground contrast. When the target is mathematically unavailable, xterm uses the brightest
  available adjusted foreground. Dark application themes retain the standard 4.5:1 minimum.
- [ ] AC-11: Exact `Ctrl+J` in a Windows Codex tab inserts one persistent composer newline without
  submitting the draft. Standard terminal tabs continue to receive the LF control byte.

## Known sharp edges

- A remote SSH workspace uses POSIX path semantics even when Shelf itself runs on Windows.

## Edge cases & errors

- `C:\work` is not the parent of `C:\workspace`.
- A drive root remains `C:\`, and a UNC share root remains identifiable.
- A failed reveal or preview does not remove the file.
- An SSH failure affects only the requested remote tab.
- An unavailable provider CLI produces the existing terminal error and leaves other providers usable.
- Invalid saved tabs are skipped and logged without deleting valid saved state.
- A blank or whitespace-only custom tab title is not saved.
- Canceling a tab rename leaves the current title unchanged.
- Existing saved state without a custom tab title restores with its existing generated title.
- Other `J` modifier combinations and key-release events remain under the terminal application's
  normal input handling.

## Non-functional requirements

- Performance: lexical path operations complete synchronously without filesystem access, and session
  scans remain off the UI thread.
- Security: path insertion never executes automatically, SSH retains strict argv boundaries, and
  delete remains routed through the native trash API.
- Accessibility: file and session actions remain keyboard reachable and errors use existing accessible
  toast and dialog patterns.
- Reliability: one malformed session, file, workspace, or saved tab cannot abort other providers or
  workspaces.

## Open questions

None.
