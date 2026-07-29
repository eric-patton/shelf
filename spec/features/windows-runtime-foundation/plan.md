# Implementation plan

## Design decisions

- Add a shared Rust path module with lexical Windows normalization, equality, and component-boundary
  containment. Canonicalization remains an optional caller concern.
- Return a typed-compatible terminal detection payload containing `shells` and `defaultShell`.
- Resolve Windows wrapper dispatch in the native PTY layer so every frontend command benefits.
- Use a Windows Job Object with `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`, assigned immediately after
  spawn and owned by the PTY session.
- Keep Unix login-environment and process-group behavior behind compile-time platform boundaries.
- Add Vitest for exported TypeScript configuration behavior and retain Rust tests for native seams.

## Verification approach

- `feat-001/AC-1` enters through terminal detection and tests deterministic shell ordering.
- `feat-001/AC-2` enters through the exported shell-selection helper and tests saved, missing, and
  invalid values.
- `feat-001/AC-3` enters through the native spawn-resolution helper and validates host plus logical
  arguments for each extension.
- `feat-001/AC-4` enters through PTY environment construction and proves the Windows login
  environment is empty while PATH augmentation remains.
- `feat-001/AC-5` enters through shared path equality and containment functions with a fixed Windows
  path table.
- `feat-001/AC-6` enters through the Windows process-tree owner and starts a synthetic child and
  descendant.
- `feat-001/AC-7` enters through existing Unix branches, compile checks, and platform regression
  tests.

## Commands

- `npm test`
- `npm run build`
- `cargo fmt --check --manifest-path src-tauri/Cargo.toml`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm run tauri build -- --debug --no-bundle`
