# Tasks

- [x] T1 Add failing invocation, real-command, risk, approval, process-tree, mounted-path, and
  tool-description tests for `feat-003/AC-1` through `feat-003/AC-7`.
- [x] T2 Extract shared Windows Job Object ownership and keep PTY descendant cleanup on that module.
  Files: `src-tauri/src/process_tree.rs`, `src-tauri/src/pty_plugin.rs`,
  `src-tauri/src/lib.rs`.
- [x] T3 Implement platform-specific AI shell invocation, PowerShell fallback, actionable spawn
  errors, and platform-aware tool wording. Files: `src-tauri/src/commands/ai/shell.rs`,
  `src-tauri/src/commands/ai/tools/shell.rs`.
- [x] T4 Expand dangerous Windows command classification and preserve the existing approval boundary.
  Files: `src-tauri/src/commands/ai/shell.rs`, `src-tauri/src/commands/ai/runner.rs`.
- [x] T5 Attach AI shell commands to the shared process tree and terminate descendants on timeout or
  cancellation. Files: `src-tauri/src/commands/ai/shell.rs`,
  `src-tauri/src/process_tree.rs`.
- [x] T6 Verify mounted Windows path behavior and provider-owned record restrictions. File:
  `src-tauri/src/commands/ai/records.rs`.
- [x] T7 Run the full frontend, Rust, lint, build, and debug Tauri verification suite. Observed:
  35 Rust tests and 15 Vitest tests passed, Clippy passed with warnings denied, TypeScript built, and
  the Windows debug Tauri executable rebuilt successfully.
- [x] T8 Record touched files, validate the feature, and prepare the convergence audit. Observed:
  feature validation completed with zero errors and zero warnings.
