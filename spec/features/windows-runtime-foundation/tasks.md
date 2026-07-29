# Tasks

- [x] T1 Add the Vitest toolchain and a cross-platform test command. Files: `package.json`,
  `package-lock.json`, `src/modules/shell-selection.test.ts`.
- [x] T2 Add failing Rust tests for `feat-001/AC-1`, `feat-001/AC-3`, `feat-001/AC-4`, and
  `feat-001/AC-5`. Files: `src-tauri/src/pty_plugin.rs`,
  `src-tauri/src/platform_paths.rs`, `src-tauri/src/commands/workspace.rs`.
- [x] T3 Add failing TypeScript tests for `feat-001/AC-2`. Files:
  `src/modules/shell-selection.ts`, `src/modules/shell-selection.test.ts`.
- [x] T4 Implement preferred-shell detection and backward-compatible settings selection. Files:
  `src/app.ts`, `src/modules/settings-panel.ts`, `src/modules/shell-selection.ts`,
  `src-tauri/src/commands/workspace.rs`.
- [x] T5 Implement Windows wrapper dispatch and Windows-safe environment construction. Files:
  `src-tauri/src/pty_plugin.rs`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`.
- [x] T6 Implement shared Windows path equality and containment and migrate native callers. Files:
  `src-tauri/src/platform_paths.rs`, `src-tauri/src/commands/sessions.rs`,
  `src-tauri/src/commands/ai/records.rs`.
- [x] T7 Add Windows Job Object ownership and an executable `feat-001/AC-6` process-tree test.
  Files: `src-tauri/src/pty_plugin.rs`.
- [x] T8 Run `feat-001/AC-7` Unix regression checks, all feature tests, and the debug Tauri build.
  Observed: 28 Rust tests and 4 Vitest tests passed, Clippy passed with warnings denied, TypeScript
  built, and the Windows debug Tauri executable built.
- [x] T9 Record touched files, run spec-flow validation, and prepare the convergence audit. Observed:
  feature validation completed with zero errors and zero warnings.
