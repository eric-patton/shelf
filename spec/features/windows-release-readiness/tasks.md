# Tasks

- [x] T1 Add failing release-contract, version-consistency, checksum, documentation, and desktop E2E
  tests for `feat-004/AC-1` through `feat-004/AC-7`.
- [x] T2 Upgrade vulnerable development dependencies within compatible majors and add the desktop
  and release scripts. Files: `package.json`, `package-lock.json`.
- [x] T3 Implement the dependency-free Windows W3C desktop smoke and stable semantic selectors.
  Files: `e2e/windows-smoke.e2e.mjs`, `index.html`,
  `scripts/qa/ensure-msedgedriver.ps1`.
- [x] T4 Add pull-request Windows and macOS quality, audit, build, and Windows desktop jobs. File:
  `.github/workflows/ci.yml`.
- [x] T5 Replace the tag-only build with a signed Windows release job, Authenticode verification,
  checksums, artifact upload, and protected release publication. File:
  `.github/workflows/build.yml`.
- [x] T6 Bump all version sources to `0.3.0` and add local MSI plus NSIS packaging and release
  verification scripts. Files: `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`,
  `src-tauri/Cargo.lock`, `src-tauri/tauri.conf.json`, `scripts/qa/`.
- [x] T7 Update public Windows support, install, security, upgrade, uninstall, and troubleshooting
  documentation. Files: `README.md`, `docs/windows.md`, `docs/releasing-windows.md`.
- [x] T8 Run the complete unit, lint, audit, debug build, desktop E2E, and unsigned local installer
  suite. Observed: 35 Rust tests and 15 Vitest tests passed, formatting and Clippy passed, npm had
  zero vulnerabilities, Cargo audit had no blocking advisories, the real desktop smoke passed, and
  local MSI plus NSIS bundles were generated.
- [H] T9 Provision and approve Azure Artifact Signing identity, Public Trust certificate profile,
  fork-bound GitHub OIDC federation, both protected environments, and repository configuration.
  Owner: Eric Patton.
- [H] T10 Run signed clean-system Windows 10 22H2 and Windows 11 x64 install, real-agent, SSH,
  recovery, upstream migration, fork upgrade, uninstall, signature, and checksum matrix. Owner:
  Eric Patton.
- [x] T11 Record touched files, validate the implemented automated scope, and append the convergence
  audit without resolving T9 or T10. Observed: automated feature validation completed with zero
  errors and zero warnings; the two human release gates remain unresolved.
- [x] T12 Add failing release-contract coverage for `feat-004/AC-10` and `feat-004/AC-11`, covering
  fork identity, MIT attribution, update ownership, distinct installer identity, and two-stage
  publication. Observed: the updated contract failed on the old package, Tauri, and installer
  identities before production files changed.
- [x] T13 Apply the Shelf for Windows package, application, installer, update, and documentation
  identities. Add the full MIT license and upstream attribution notice. Files: `package.json`,
  `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`,
  `src-tauri/tauri.conf.json`, `src-tauri/src/commands/update.rs`, `README.md`, `README_zh.md`,
  `docs/windows.md`, `LICENSE`, and `NOTICE`.
- [x] T14 Limit public release assets to signed Windows installers, add the protected
  `production-release` publication gate, and update the release-owner runbook. Observed:
  `npm run test:release` passed with separate signing and publication environments, fork-owned
  release links, no macOS release artifact, and no Azure authority in the publication job.
- [x] T15 Run the complete unit, lint, audit, release-contract, debug build, desktop E2E, and unsigned
  local installer suite. Fold the approved delta and append a new convergence audit. Observed: 15
  Vitest tests and 36 Rust tests passed; TypeScript/Vite, formatting, Clippy, npm audit, Cargo audit,
  release contract, debug build, real Tauri WebDriver smoke, MSI, and NSIS packaging passed. `cwin`
  confirmed the Shelf for Windows home, quit dialog, and complete process-tree exit. Local MSI
  SHA-256 is `a9d4b035d088df47b2dcdb642d50de53ec4b6ed6890aa710a33be40bb7565bf4`;
  local NSIS SHA-256 is `2f142e0b0d347c831ddb5910f70435c5952cbaa801e305f3b3fbe2272f3db476`.
- [x] T16 Make the dangerous shell approval proof portable across Windows and macOS by using an
  explicitly invoked PowerShell command. File: `src-tauri/src/commands/ai/shell.rs`. Trace:
  `feat-003/AC-4`, `feat-004/AC-1`.
- [x] T17 Isolate the hosted Windows desktop smoke in an explicit writable WebView2 user-data
  folder, report the matched runtime and driver versions, clean the owned folder, and move
  first-party GitHub actions to their Node 24 releases. Files: `e2e/windows-smoke.e2e.mjs`,
  `scripts/qa/ensure-msedgedriver.ps1`, `.github/workflows/ci.yml`,
  `.github/workflows/build.yml`. Trace: `feat-004/AC-1`, `feat-004/AC-2`.
- [x] T18 Make the release version contract accept both LF and CRLF Cargo files so the same proof
  works in Windows and macOS checkouts. File: `scripts/qa/verify-release-contract.ps1`. Trace:
  `feat-004/AC-1`, `feat-004/AC-4`.
- [x] T19 Update the hosted Windows runner to Microsoft's latest Evergreen WebView2 Runtime before
  installing the exactly matching Edge WebDriver, and report bounded host-process and profile
  diagnostics if session startup fails. Files: `scripts/qa/update-webview2-runtime.ps1`,
  `.github/workflows/ci.yml`, `e2e/windows-smoke.e2e.mjs`,
  `scripts/qa/verify-release-contract.ps1`. Trace: `feat-004/AC-1`, `feat-004/AC-2`.
- [x] T20 Pin the blocking real desktop smoke to the supported `windows-2022` image after
  `windows-latest` reproduced the same WebView2 automation-port failure as Tauri's official
  WebDriver example. Keep the general Windows quality matrix on `windows-latest`. File:
  `.github/workflows/ci.yml`. Trace: `feat-004/AC-1`, `feat-004/AC-2`.
- [x] T21 Add the official WebdriverIO Tauri service, guest plugin, and embedded provider as
  test-only dependencies. Feature-gate both Rust plugins behind `e2e`, and load the guest plugin
  only in an E2E frontend build. Files: `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, `src-tauri/src/lib.rs`,
  `src-tauri/tauri.conf.json`, `src-tauri/tauri.e2e.conf.json`, and `src/app.ts`. Observed: normal
  Cargo resolution excludes both optional plugins, the E2E build registers them through the
  explicit feature, and npm audit reports zero vulnerabilities. Trace: `feat-004/AC-2`.
- [x] T22 Replace the raw external-driver harness with a WebdriverIO configuration and test that
  proves the home, Windows shell settings, PowerShell terminal creation, and command output through
  the embedded provider. Files: `e2e/wdio.conf.mjs`, `e2e/windows-smoke.e2e.mjs`. Observed: the
  real local app passed the traced WebdriverIO smoke through the embedded W3C session. Trace:
  `feat-004/AC-2`.
- [x] T23 Update Windows desktop CI to build with the explicit `e2e` feature on `windows-latest`,
  remove all external WebView2 and `tauri-driver` setup, and extend the release contract to enforce
  the test-only boundary and embedded provider. Permit the official service to own its current
  Edge compatibility preflight without using the external driver launch path. Remove obsolete
  setup scripts. Files: `.github/workflows/ci.yml`,
  `scripts/qa/verify-release-contract.ps1`, `scripts/qa/update-webview2-runtime.ps1`, and
  `scripts/qa/ensure-msedgedriver.ps1`. Observed: the release contract passed and verifies that
  public release builds cannot enable the E2E feature or capability. Trace: `feat-004/AC-1`,
  `feat-004/AC-2`.
- [x] T24 Run the local E2E, build, lint, unit, release-contract, and dependency-audit gates, then
  push and confirm the complete hosted workflow passes. Fold the approved delta and append a
  convergence audit. Observed: clean npm install, 15 Vitest tests, TypeScript and Vite, normal and
  E2E Rust Clippy, 36 Rust tests, npm audit, Cargo audit, normal and E2E Tauri builds, release
  contract, embedded real-app PowerShell smoke, and process teardown passed locally. GitHub Actions
  run `30552560129` passed Windows quality, macOS quality, dependency audit, and Windows desktop
  smoke. Trace: `feat-004/AC-1`, `feat-004/AC-2`, `feat-004/AC-3`.
- [x] T25 Add a failing release-contract assertion for the fork's exact immutable OIDC subject and
  remove the stale name-only assertion. File: `scripts/qa/verify-release-contract.ps1`. Trace:
  `feat-004/AC-8`. Observed: the updated contract failed against the stale name-only runbook before
  the documentation changed.
- [x] T26 Update the Windows release runbook with the live owner ID, repository ID, immutable
  subject, federation values, and verification command. File: `docs/releasing-windows.md`. Trace:
  `feat-004/AC-8`.
- [ ] T27 Verify the subject against the live GitHub API, pass the release contract and workspace
  validation, fold the delta, append convergence run 7, commit, push, and confirm hosted CI.
  Trace: `feat-004/AC-8`.
