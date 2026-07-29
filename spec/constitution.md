# Constitution: Shelf

## Mission

Shelf is a local-first desktop cockpit for organizing projects and running AI coding terminals
without forcing users to abandon their preferred command-line tools.

## Non-negotiables

- Approved behavior is defined in a feature specification before product code changes.
- Each GA acceptance criterion has an executable proving test with its qualified trace token, unless
  the criterion is explicitly marked manual.
- Windows support must not regress supported macOS or Linux behavior.
- Closing a local terminal or Shelf must not leave a process tree that Shelf started running.
- User commands, project files, credentials, and session content remain local unless the user
  explicitly invokes an external provider or remote connection.

## Tech and architecture defaults

- Languages and frameworks: TypeScript with Vite for the WebView UI, Rust with Tauri 2 for the
  desktop backend, and platform APIs behind narrow platform-specific modules.
- Architecture style: modular desktop application with typed Tauri command boundaries and a
  local-first configuration and state model.
- Data and integration defaults: JSON configuration and state files, provider-owned session stores,
  local PTYs, built-in OpenSSH, and GitHub Releases.

## Security and compliance

- Never place credentials, signing material, access tokens, or private session content in source,
  fixtures, logs, release artifacts, or test output.
- Shell execution must preserve exact argument boundaries, require the existing AI approval policy,
  and reject unsafe fallback behavior.
- Dependencies with an unresolved high or critical advisory block a public release unless a narrow,
  documented waiver proves the vulnerable path is unreachable.

## Quality bar

- Testing expectation: tests first for platform abstractions and regression tests for every repaired
  Windows defect.
- Accessibility, performance, and observability: keyboard access and visible focus are preserved,
  terminal startup failures are actionable, and errors contain enough context to diagnose without
  exposing sensitive content.
- Review expectation: per-feature analyze before implementation, executable verification during
  implementation, and converge before GA completion.

## Out of scope

- Microsoft Store distribution, Windows on ARM, 32-bit Windows, bundling PowerShell 7, and replacing
  the release-page update flow with a self-updater.
