# Interaction model

## Flow 1: Select and navigate a Windows workspace

- Primary: the user adds or selects a workspace, Shelf reuses an equivalent saved path, highlights the
  provider workspace, shows sessions, and loads the file tree.
- Empty: a workspace with no provider sessions shows the existing empty-session state and new-session
  action.
- Error: a failed scan shows no sessions for that provider, logs the cause, and leaves other
  workspaces usable.

## Flow 2: Start or resume a local agent

- Primary: the user chooses new or selects an existing Claude, Codex, or pi session, Shelf opens a tab
  in the original workspace, and links a newly created provider record when it appears.
- Empty: an unavailable CLI opens the existing terminal failure state with a settings recovery path.
- Error: failed launch or malformed provider data affects only that tab or record.

## Flow 3: Work with files

- Primary: the user expands folders, previews text, copies relative or absolute paths, reveals a file,
  deletes to the Recycle Bin, or drags a path into the active destination.
- Empty: a directory with no visible entries shows the existing empty-file state.
- Error: preview, reveal, and delete failures leave the tree unchanged and use the existing error
  treatment.

## Flow 4: Start or resume an SSH agent

- Primary: the user selects an SSH workspace and provider session, Shelf opens a remote agent tab with
  the original POSIX path.
- Empty: missing remote agent installation leaves the SSH error visible in that tab.
- Error: connection and authentication failures remain isolated to the remote tab.

## Flow 5: Restore the previous desktop

- Primary: Shelf loads saved window, workspace, and tab records, restores valid tabs, selects the prior
  active context, and resumes state saving.
- Empty: no saved state opens the normal start tab.
- Error: an invalid or unavailable tab is skipped while remaining valid tabs restore.

## Components

- Existing workspace tree, session rows, terminal tabs, file tree, context menus, settings rows,
  toasts, and dialogs.
- Shared path and insertion helpers have no new visible component.

## Review

Every story has a primary, empty, and error flow. The design reuses existing Shelf states and adds no
new workflow outside the specification.
