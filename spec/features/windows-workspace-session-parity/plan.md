# Implementation plan

## Design decisions

- Add exported TypeScript path helpers that infer Windows or POSIX flavor from the path and accept an
  explicit remote flag where the destination determines semantics.
- Use the feat-001 Rust path contract for local backend workspace and session matching.
- Preserve original paths for display and provider argv. Normalize only comparison and relative-path
  calculations.
- Choose insertion syntax from tab destination: SSH, agent prompt, PowerShell, cmd, or POSIX shell.
- Test provider and SSH argv through existing exported command builders without credentials.
- Exercise state restoration through exported saved-state helpers and Windows desktop E2E in the
  release-readiness feature.

## Verification approach

- `feat-002/AC-1` enters through TypeScript and Rust path contracts with a shared fixed path table.
- `feat-002/AC-2` enters through `buildLocalCliCommand` for all providers.
- `feat-002/AC-3` enters through relative-path and basename helpers.
- `feat-002/AC-4` enters through destination-aware insertion formatting.
- `feat-002/AC-5` enters through native file commands and a synthetic Windows file.
- `feat-002/AC-6` enters through remote command and SSH argv builders for all providers.
- `feat-002/AC-7` enters through saved-tab serialization and restoration selection, with desktop E2E
  completing the process boundary.
- `feat-002/AC-8` enters through workspace matching, pending-session selection, and existing session
  command tests.

## Commands

- `npm test`
- `npm run build`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm run tauri build -- --debug --no-bundle`
