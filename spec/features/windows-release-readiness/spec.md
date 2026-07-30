## Why

Functional Windows code is not a supported Shelf for Windows release until changes are continuously
verified, the independent distribution identity is explicit, installers carry a trusted publisher
signature, artifacts are integrity-checked, and clean supported systems complete the release matrix.

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
- As a Windows user, I want the distribution, updater, installer identity, license, and attribution
  to identify the independently maintained fork without implying upstream endorsement.
- As a release owner, I want signed artifacts reviewed before public publication.
- As the first Shelf for Windows user, I want a locally trusted pilot installer so that I can test
  the real installed application before funding public code signing.

## Behavior & scenarios

- **Scenario: Pull request**
  - Given a change targets Shelf
  - When GitHub Actions evaluates the pull request
  - Then frontend, Rust, audit, Windows, macOS, and Windows desktop checks report independently
- **Scenario: Windows desktop smoke**
  - Given a debug Shelf for Windows executable built with the explicit `e2e` feature
  - When the official WebdriverIO Tauri service starts Shelf for Windows through its embedded W3C
    WebDriver provider
  - Then it observes the home screen, detects Windows shells, creates a terminal, and executes a
    PowerShell command
- **Scenario: Release tag**
  - Given a version tag and approved `windows-release` and `production-release` GitHub environments
  - When the release workflow runs
  - Then Azure OIDC authenticates, signs the application executable, bundles MSI and NSIS, signs both
    installers, verifies signatures, privately uploads Windows artifacts for review, and publishes
    them only after the separate publication approval
- **Scenario: Missing signing setup**
  - Given Azure identity, profile, or repository secrets are absent
  - When a release tag runs
  - Then the protected Windows release job fails before publishing an unsigned Windows asset
- **Scenario: Self-signed first-user pilot**
  - Given the maintainer is running Windows under a personal user account
  - When the documented local pilot command runs
  - Then it creates or reuses a non-exportable current-user code-signing key, explicitly trusts its
    public certificate for that user, signs and verifies the application plus MSI and NSIS
    installers, and stages checksummed local artifacts that are prohibited from public distribution
- **Scenario: Install or upgrade**
  - Given a clean supported x64 Windows system
  - When the user verifies and runs the installer
  - Then Shelf for Windows installs with a distinct identity, reuses compatible `~/.shelf`
    workspace configuration, upgrades over a prior fork release when one exists, and uninstalls
    without leaving an active process
- **Scenario: Troubleshooting**
  - Given PowerShell, WebView2, an agent CLI, SSH, or signing trust is unavailable
  - When the user reads the Windows documentation
  - Then it identifies the requirement and a safe recovery action

## Acceptance criteria

- [ ] AC-1: Pull requests and main-branch pushes run locked dependency install, Vitest, TypeScript
  build, Rust formatting, Clippy with warnings denied, Rust tests, and debug Tauri no-bundle builds on
  Windows and macOS.
- [ ] AC-2: Windows CI drives the real debug Tauri executable through the official WebdriverIO
  Tauri service and its embedded W3C WebDriver provider, verifies the home and settings shell UI,
  creates a PowerShell terminal, and observes command output without a high or critical dependency
  advisory.
- [ ] AC-3: npm and Cargo audits run in CI, and the committed dependency graph has no known high or
  critical npm advisories.
- [ ] AC-4: A local or CI Windows release build produces x64 MSI and NSIS installers with consistent
  Shelf for Windows package, executable, application, installer, Cargo, Tauri, and `0.3.0` version
  identities.
- [ ] AC-5: The protected tag workflow uses GitHub OIDC and Azure Artifact Signing through Tauri's
  post-patch signing hook, signs the Shelf executable before it is embedded, signs final MSI and NSIS
  assets, and verifies valid Authenticode status before upload. No unsigned Windows fallback is
  published.
- [ ] AC-6: A tag release privately uploads Windows MSI, NSIS, and SHA-256 checksum artifacts, then
  publishes the reviewed Windows assets with generated release notes only after
  `production-release` approval.
- [ ] AC-7: Public documentation lists Windows 10 22H2 and Windows 11 x64 support, WebView2 and agent
  requirements, installer choices, PowerShell selection, SSH behavior, upgrade and uninstall steps,
  signature verification, upstream migration, independent maintenance, attribution, and common
  troubleshooting.
- [ ] AC-8: Azure Artifact Signing Public Trust and protected release setup are approved. (manual)
  This covers the identity, certificate profile, exact immutable GitHub OIDC subject
  `repo:eric-patton@248889511/shelf@1316644982:environment:windows-release`, repository
  configuration, and protected `windows-release` plus `production-release` environments.
- [ ] AC-9: Signed bundles pass the clean Windows 10 and Windows 11 release matrix. (manual)
  This covers MSI and NSIS install, launch, terminal, real Claude, Codex, and pi, SSH, restart
  recovery, upstream Shelf 0.2.27 migration, applicable fork upgrade, uninstall, signature, and
  checksum checks on clean supported x64 systems.
- [ ] AC-10: Package metadata, Tauri identity, update source, public documentation, license, and
  attribution consistently identify Shelf for Windows as an independently maintained distribution
  from `eric-patton/shelf`, with a unique application identifier and MSI upgrade code.
- [ ] AC-11: The tag workflow uploads signed Windows artifacts before a distinct protected
  `production-release` approval, and only the signing job receives Azure OIDC permission.
- [ ] AC-12: Running the documented Windows pilot command creates or reuses the current-user
  self-signed pilot certificate, signs and validates the application, MSI, and NSIS artifacts with
  the expected subject and timestamp, writes checksums and a public certificate without exporting
  private signing material, and leaves the Azure-backed public tag workflow unchanged.

## Known sharp edges

- A new non-Store publisher may still encounter Microsoft Defender SmartScreen reputation warnings
  while reputation accumulates, even when Authenticode is valid.
- A self-signed pilot certificate is trusted only for the Windows user who explicitly installs its
  public certificate. It is not public publisher identity and must not be distributed.
- WebdriverIO Tauri service 1.2.0 performs a Windows Edge compatibility preflight and may cache a
  matching Edge WebDriver, even though the W3C test session uses only the embedded provider.

## Edge cases & errors

- A pull request from an untrusted fork never receives Azure signing permissions.
- The GitHub OIDC subject is exactly
  `repo:eric-patton@248889511/shelf@1316644982:environment:windows-release`. An ordinary rename
  retains the immutable owner and repository IDs, while a transfer or replacement repository does
  not inherit signing access.
- A tag without the protected environment or required secrets cannot publish Windows assets.
- Rejecting or withholding `production-release` approval leaves signed artifacts private and creates
  no public release.
- A signature with an invalid status, missing timestamp, or unexpected publisher fails the workflow.
- A local pilot certificate is reusable only when its subject, thumbprint, code-signing EKU,
  private-key presence, non-exportability, and validity satisfy the pilot contract.
- Pilot signing and trust operations use the exact validated thumbprint. No subject-only signing
  fallback or PFX export is permitted.
- Removing the pilot certificate requires its exact thumbprint and exact expected subject.
- A checksum script excludes its own output file and uses relative asset names.
- WebdriverIO closes Shelf and its terminal tree even when an assertion fails.
- A missing agent CLI is documented as a requirement, not treated as an installer failure.

## Non-functional requirements

- Performance: pull-request jobs run in parallel and cache Rust artifacts without sharing signed
  release state.
- Security: release authentication uses OIDC, protected environment approval, least-privilege
  permissions, and no long-lived client secret.
- Pilot security: the local pilot uses current-user certificate stores, a bounded non-exportable
  private key, exact-thumbprint selection, fail-closed timestamp and signature verification, and an
  ignored local artifact directory.
- Test security: Tauri WebDriver plugins and capabilities are registered only in an explicit E2E
  build. Normal development and release builds exclude them.
- Accessibility: the desktop smoke locates controls by stable semantic identifiers and the existing
  keyboard-accessible UI.
- Reliability: build, sign, verify, checksum, and publish are separate failure boundaries.
- Distribution integrity: the application update source, public release links, installer identity,
  and documented maintainer agree on the user-owned fork.

## Open questions

None.
