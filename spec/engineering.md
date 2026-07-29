# Engineering standards: Shelf

## Code organization

- ENG-1: Keep UI behavior in focused TypeScript modules and native behavior in focused Rust modules.
  Put platform differences behind shared helpers instead of scattering operating-system checks.

## Naming and style

- ENG-2: Use product-global glossary terms in public types, commands, functions, and user-facing text.
- ENG-3: TypeScript must pass `tsc`; Rust must pass `cargo fmt --check` and Clippy without warnings.

## Patterns and idioms

- ENG-4: Return actionable errors at Tauri boundaries, with the failed operation and safe context.
- ENG-5: Log lifecycle and failure metadata, never command content, credentials, or session content.
- ENG-6: Preserve backward-compatible persisted configuration and apply defaults only to missing or
  invalid values.
- ENG-7: Cancellation and application shutdown must release I/O handles and terminate owned process
  trees deterministically.

## APIs and contracts

- ENG-8: Tauri commands use serializable request and response types. Add fields compatibly unless a
  specification explicitly approves a breaking change.

## Data access

- ENG-9: Normalize paths only for comparison. Preserve the user's original path for display and
  provider invocation.

## Security and secrets

- ENG-10: Agent authentication remains provider-owned and must not be proxied or persisted by Shelf.
- ENG-11: CI uses OIDC for Azure authentication. Long-lived signing secrets are prohibited.
- ENG-12: Test fixtures use synthetic paths and content and must not copy real session data.

## Testing

- ENG-13: Rust tests cover native contracts, Vitest covers exported UI helpers, WebDriver covers
  desktop flows, and PowerShell scripts cover installer and process-lifecycle checks.
- ENG-14: Every GA acceptance criterion has an independent test through a public seam and cites its
  `feat-NNN/AC-N` trace token, unless explicitly manual.

## Dependencies and tooling

- ENG-15: Prefer standard-library and existing dependencies. Pin CI actions by supported major
  version and audit npm and Cargo dependencies.

## Build, release, and environments

- ENG-16: Every pull request runs TypeScript, Rust, dependency, build, and Windows desktop checks.
- ENG-17: Public Windows releases are signed, timestamped, checksumed, and validated on clean
  Windows 10 and Windows 11 systems.
- ENG-18: Development may use local credentials, but automated tests must pass without agent,
  GitHub, SSH, or Azure credentials.

## Observability

- ENG-19: Platform failures identify the subsystem, attempted executable or normalized path when
  safe, and recovery action without exposing command or session contents.
