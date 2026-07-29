# Implementation plan

## Design decisions

- Extract Windows Job Object ownership into a shared native module used by PTY terminals and AI
  commands.
- Select the AI shell through a small invocation contract: `pwsh` first, Windows PowerShell second,
  and `zsh -lc` on macOS or Linux.
- Pass the command as one process argument and retain the existing working directory, timeout, and
  output limits.
- Expand the platform-aware risk classifier with destructive Windows disk, partition, service, and
  process commands.
- Preserve the existing prompt hook as the approval boundary and add a pure approval-decision helper
  for direct coverage.
- Keep mounted-record access on the shared native path comparison contract.

## Verification approach

- `feat-003/AC-1` enters through invocation-contract tests for preferred, fallback, and Unix shells.
- `feat-003/AC-2` enters through a real PowerShell execution test with stdout, stderr, exit code,
  working directory, and limit metadata.
- `feat-003/AC-3` enters through platform-specific risk tables and nested-shell cases.
- `feat-003/AC-4` enters through the pure approval-decision seam used by the prompt hook.
- `feat-003/AC-5` enters through a Windows timeout fixture that starts a descendant and verifies the
  descendant exits.
- `feat-003/AC-6` enters through mounted-workspace matching and existing provider-file guards.
- `feat-003/AC-7` enters through platform-aware tool-definition tests and spawn-error assertions.

## Commands

- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm test`
- `npm run build`
- `npm run tauri build -- --debug --no-bundle`
