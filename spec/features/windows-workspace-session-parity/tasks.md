# Tasks

- [x] T1 Add failing TypeScript path, relative-path, basename, and insertion tests for
  `feat-002/AC-1`, `feat-002/AC-3`, and `feat-002/AC-4`. Files:
  `src/modules/platform-paths.ts`, `src/modules/platform-paths.test.ts`.
- [x] T2 Migrate frontend workspace, pending-session, file-tree, and drag/drop comparisons to the
  shared path helpers. Files: `src/app.ts`, `src/modules/session-actions.ts`,
  `src/modules/workspace.ts`, `src/modules/workspace-view.ts`, `src/modules/files.ts`,
  `src/modules/dragdrop.ts`, `src/modules/pending-session.ts`.
- [x] T3 Add local Claude, Codex, and pi command tests for `feat-002/AC-2`. File:
  `src/modules/cli-launch.test.ts`.
- [x] T4 Add remote Claude, Codex, and pi command tests for `feat-002/AC-6`. File:
  `src/modules/cli-launch.test.ts`.
- [x] T5 Migrate local backend workspace equality and session safety checks to the feat-001 path
  contract and verify `feat-002/AC-5` and `feat-002/AC-8`. Files:
  `src-tauri/src/commands/workspace.rs`, `src-tauri/src/commands/sessions.rs`,
  `src-tauri/src/commands/files.rs`, `src/modules/pending-session.test.ts`.
- [x] T6 Add saved-state regression coverage for `feat-002/AC-7`. Files:
  `src/modules/saved-state.ts`, `src/modules/saved-state.test.ts`, `src/modules/app-state.ts`.
- [x] T7 Run the full frontend, Rust, lint, build, and debug Tauri verification suite. Observed:
  30 Rust tests and 15 Vitest tests passed, Clippy passed with warnings denied, TypeScript built, and
  the Windows debug app started a PowerShell terminal, executed `SHELF_WINDOWS_OK`, and restored a
  blank terminal after a clean restart.
- [x] T8 Record touched files, validate the feature, and prepare the convergence audit. Observed:
  feature validation completed with zero errors and zero warnings.
