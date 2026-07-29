## Why

Functional Windows code is not a supported Windows release until changes are continuously verified,
installers carry a trusted publisher signature, artifacts are integrity-checked, and clean supported
systems complete the release matrix.

## User stories

- As a reviewer, I want Windows and macOS checks on every pull request so that platform regressions
  do not wait for a tag.
- As a maintainer, I want an automated Windows desktop smoke test so that the real Tauri boundary is
  exercised.
- As a Windows user, I want a signed installer and executable so that I can verify the publisher and
  file integrity.
- As a release owner, I want short-lived OIDC authentication so that signing does not require a
  long-lived Azure secret.
- As a new Windows user, I want accurate requirements, installation, and troubleshooting guidance.
- As a release owner, I want a repeatable Windows 10 and Windows 11 matrix before declaring GA.

## Behavior & scenarios

- **Scenario: Pull request**
  - Given a change targets Shelf
  - When GitHub Actions evaluates the pull request
  - Then frontend, Rust, audit, Windows, macOS, and Windows desktop checks report independently
- **Scenario: Windows desktop smoke**
  - Given a debug Shelf executable and the Windows WebView2 driver
  - When WebDriver starts Shelf
  - Then it observes the home screen, detects Windows shells, creates a terminal, and executes a
    PowerShell command
- **Scenario: Release tag**
  - Given a version tag and an approved `windows-release` GitHub environment
  - When the release workflow runs
  - Then Azure OIDC authenticates, signs the application executable, bundles MSI and NSIS, signs both
    installers, verifies signatures, and publishes checksums with macOS and Windows assets
- **Scenario: Missing signing setup**
  - Given Azure identity, profile, or repository secrets are absent
  - When a release tag runs
  - Then the protected Windows release job fails before publishing an unsigned Windows asset
- **Scenario: Install or upgrade**
  - Given a clean supported x64 Windows system
  - When the user verifies and runs the installer
  - Then Shelf installs, launches with WebView2, upgrades over the prior release, and uninstalls
    without leaving an active process
- **Scenario: Troubleshooting**
  - Given PowerShell, WebView2, an agent CLI, SSH, or signing trust is unavailable
  - When the user reads the Windows documentation
  - Then it identifies the requirement and a safe recovery action

## Acceptance criteria

- [ ] AC-1: Pull requests and main-branch pushes run locked dependency install, Vitest, TypeScript
  build, Rust formatting, Clippy with warnings denied, Rust tests, and debug Tauri no-bundle builds on
  Windows and macOS.
- [ ] AC-2: Windows CI drives the real debug Tauri executable through a W3C harness and
  `tauri-driver`, verifies the home and settings shell UI, creates a PowerShell terminal, and
  observes command output without adding a vulnerable browser-test dependency graph.
- [ ] AC-3: npm and Cargo audits run in CI, and the committed dependency graph has no known high or
  critical npm advisories.
- [ ] AC-4: A local or CI Windows release build produces x64 MSI and NSIS installers with consistent
  `0.3.0` application, package, Cargo, and Tauri versions.
- [ ] AC-5: The protected tag workflow uses GitHub OIDC and Azure Artifact Signing through Tauri's
  post-patch signing hook, signs the Shelf executable before it is embedded, signs final MSI and NSIS
  assets, and verifies valid Authenticode status before upload. No unsigned Windows fallback is
  published.
- [ ] AC-6: A tag release publishes Windows MSI and NSIS, the existing macOS DMG, and SHA-256 checksum
  files with generated release notes.
- [ ] AC-7: Public documentation lists Windows 10 22H2 and Windows 11 x64 support, WebView2 and agent
  requirements, installer choices, PowerShell selection, SSH behavior, upgrade and uninstall steps,
  signature verification, and common troubleshooting.
- [ ] AC-8: Azure Artifact Signing Public Trust and protected release setup are approved. (manual)
  This covers the identity, certificate profile, GitHub OIDC federation, repository secrets, and
  protected `windows-release` environment.
- [ ] AC-9: Signed bundles pass the clean Windows 10 and Windows 11 release matrix. (manual)
  This covers MSI and NSIS install, launch, terminal, real Claude, Codex, and pi, SSH, restart
  recovery, upgrade, uninstall, signature, and checksum checks on clean supported x64 systems.

## Known sharp edges

- A new non-Store publisher may still encounter Microsoft Defender SmartScreen reputation warnings
  while reputation accumulates, even when Authenticode is valid.

## Edge cases & errors

- A pull request from an untrusted fork never receives Azure signing permissions.
- A tag without the protected environment or required secrets cannot publish Windows assets.
- A signature with an invalid status, missing timestamp, or unexpected publisher fails the workflow.
- A checksum script excludes its own output file and uses relative asset names.
- WebDriver closes Shelf and its terminal tree even when an assertion fails.
- A missing agent CLI is documented as a requirement, not treated as an installer failure.

## Non-functional requirements

- Performance: pull-request jobs run in parallel and cache Rust artifacts without sharing signed
  release state.
- Security: release authentication uses OIDC, protected environment approval, least-privilege
  permissions, and no long-lived client secret.
- Accessibility: the desktop smoke locates controls by stable semantic identifiers and the existing
  keyboard-accessible UI.
- Reliability: build, sign, verify, checksum, and publish are separate failure boundaries.

## Open questions

None.
