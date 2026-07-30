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
- Preserve readable terminal content in light application themes by requiring xterm's standard
  minimum contrast adjustment for terminal cells.
- Use a stronger, mode-aware xterm contrast target for light themes so applications that paint dark
  cells receive near-white adjusted foregrounds. Keep the standard accessibility floor for dark
  themes.
- Disable WebView2 browser-only accelerator keys on Windows so terminal shortcuts such as `Ctrl+J`
  reach the page instead of opening browser features. Translate exact `Ctrl+J` keydown at Shelf's
  xterm boundary. Standard terminals receive LF, while Codex receives one bracketed-paste newline
  with a trailing-space guard and a cursor-left correction. The guard keeps Codex from discarding
  an otherwise empty final pasted line while leaving the caret ready for more text.
  Omit the WebView2 setting in embedded WebDriver builds because its automation input transport
  becomes unresponsive when the COM setting is changed.
- Store a custom tab title as an optional backward-compatible saved-state field. Keep automatic
  provider and pending-session titles as the default only while no custom title exists.
- Reuse the existing dialog and context-menu components for Rename, with double-click as a convenient
  second entry point. The Home tab remains outside the closable-tab action surface.

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
- The terminal contrast regression enters through the exported terminal options used to construct
  xterm and is completed by Windows desktop observation in a light theme.
- `feat-002/AC-10` enters through the exported mode-aware terminal options and is completed by
  Windows desktop observation of Codex in a light theme.
- `feat-002/AC-11` enters through the exported terminal control-key translator and a native WebView2
  settings test, then is completed by observing a physical `Ctrl+J` chord produce a persistent
  multiline Codex draft in the installed Windows desktop app.
- `feat-002/AC-9` enters through tab-title normalization and saved-state round trips, with Windows
  desktop E2E covering both rename entry points and restart recovery.

## Commands

- `npm test`
- `npm run build`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm run tauri build -- --debug --no-bundle`
