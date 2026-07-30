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
- [x] T9 Add a failing terminal contrast regression test traced to `spec/design-system.md` readable
  contrast and theming guidance. Files: `src/modules/terminal-theme.ts`,
  `src/modules/terminal-theme.test.ts`, `src/modules/terminal.ts`. Observed: the new test failed before
  the xterm option existed, then passed with a fixed 4.5:1 minimum contrast request.
- [x] T10 Add failing custom-title normalization, precedence, and saved-state tests for
  `feat-002/AC-9`. Files: `src/modules/tab-title.ts`, `src/modules/tab-title.test.ts`,
  `src/modules/saved-state.ts`, `src/modules/saved-state.test.ts`. Observed: tests failed before the
  custom-title seam existed, then passed for trimming, blank rejection, precedence, and saved state.
- [x] T11 Implement persistent tab renaming through the existing dialog and context menu, prevent
  automatic session refresh from overwriting a custom title, and add accessible localized labels.
  Files: `src/types.ts`, `src/app.ts`, `src/modules/app-state.ts`,
  `src/modules/session-actions.ts`, `src/modules/tab-actions.ts`,
  `src/modules/workspace-view.ts`, `src/modules/i18n.ts`. Observed: rename is available by right-click,
  double-click, F2, and Shift+F10; the dialog exposes an accessible Tab name field.
- [x] T12 Run the full frontend, Rust, lint, build, and debug Tauri verification suite. Verify the
  light-theme Codex prompt and tab rename plus restart recovery in the Windows desktop app. Observed:
  20 Vitest tests and 36 Rust tests passed, TypeScript and Vite built, formatting and Clippy passed
  with warnings denied, the debug Tauri app built, and the self-signed pilot contract passed. In the
  installed app, the Codex prompt was readable in light theme and a renamed PowerShell tab retained
  its custom title after restart.
- [x] T13 Fold the approved delta into the canonical feature spec, validate the feature, and run the
  convergence audit. Observed: the canonical spec now includes AC-9, feature validation completed
  with zero errors and zero warnings, and convergence found no open drift.
