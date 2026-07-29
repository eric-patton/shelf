# Interaction model

## Flow 1: Run a normal AI Organizer command

- Primary: AI Organizer proposes a read-only command, Shelf shows the existing tool activity, runs it
  through the platform shell, and streams the bounded result back to the organizer.
- Empty: an empty command returns the existing required-command result.
- Error: a missing shell or working directory produces an actionable tool result and leaves the
  organizer available for another request.

## Flow 2: Approve a dangerous Windows command

- Primary: AI Organizer proposes a dangerous PowerShell or cmd command, Shelf opens the existing
  approval dialog with command, working directory, limits, and dangerous risk, and executes only
  after approval.
- Empty: dismissing the dialog leaves the command unexecuted.
- Error: a failed approved execution reports the shell error without marking the operation
  successful.

## Flow 3: Stop a long-running command

- Primary: the user stops AI Organizer, Shelf terminates the owned command tree, closes inherited
  output handles, and reports cancellation.
- Empty: stopping while no tool is active remains a harmless request.
- Error: direct-child kill is retained as a backstop if process-tree teardown reports an error.

## Flow 4: Work with mounted session records

- Primary: AI Organizer lists mounted paths, searches records, reads a mounted session, and organizes
  references without altering provider ownership.
- Empty: no matching records returns the existing empty result.
- Error: an unmounted path or invalid record returns the existing restricted-access error.

## Components

- Existing AI Organizer panel, tool activity row, approval dialog, stop control, and result rendering.
- Platform-specific tool descriptions and native process ownership add no new visible component.

## Review

Every story has a primary, empty, and error flow. The design preserves the current interface and
changes only platform wording and native command behavior.
