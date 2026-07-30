# Implementation plan

## Design decisions

- Add parallel Windows and macOS pull-request jobs for the existing static, native, and debug build
  suites.
- Add a dedicated Windows W3C WebDriver job using WebdriverIO's official Tauri service, its
  embedded provider, and stable DOM identifiers.
- Feature-gate the test-only embedded driver and guest plugin so release builds do not register or
  ship desktop-test support.
- Allow WebdriverIO service 1.2.0 to complete its Windows Edge compatibility preflight, including a
  service-owned driver cache when needed, while proving that the W3C session uses only the embedded
  provider.
- Upgrade vulnerable development tooling within compatible majors and run npm plus Cargo audits.
- Bump the Windows GA baseline to version `0.3.0` across all version sources.
- Split Windows release creation into build, application signing, bundling, installer signing,
  Authenticode verification, checksum, and publication phases.
- Make `eric-patton/shelf` the release and update authority for the independently maintained Shelf
  for Windows distribution.
- Use a unique Tauri application identifier and explicit MSI upgrade code while retaining compatible
  `~/.shelf` workspace configuration.
- Retain the upstream MIT grant and add a full license plus attribution notice.
- Authenticate to Azure through a protected GitHub environment and OIDC. Use Microsoft's Artifact
  Signing client tools through Tauri's post-patch `signCommand` hook so the embedded executable and
  final installers retain valid signatures.
- Upload signed MSI, NSIS, and checksum artifacts after the signing job, then require a separate
  `production-release` environment approval before public publication.
- Keep macOS CI coverage while limiting this fork's public release assets to Windows.
- Record Azure provisioning and clean Windows 10 and Windows 11 validation as unresolved human tasks.

## Verification approach

- `feat-004/AC-1` enters through workflow-contract tests and local equivalents of every command.
- `feat-004/AC-2` enters through WebdriverIO and `e2e/windows-smoke.e2e.mjs` against a debug
  executable built with the explicit `e2e` feature.
- `feat-004/AC-3` enters through `npm audit --audit-level=high` and `cargo audit`.
- `feat-004/AC-4` enters through a version-consistency script and local MSI plus NSIS packaging.
- `feat-004/AC-5` enters through workflow-contract tests and the Windows signature verifier, with the
  real Azure signature retained as human sign-off.
- `feat-004/AC-6` enters through release-workflow contract tests and checksum generation.
- `feat-004/AC-7` enters through README and Windows release documentation checks.
- `feat-004/AC-8` and `feat-004/AC-9` are recorded manual release gates.
- `feat-004/AC-10` enters through release-contract checks for package identity, update source,
  license, attribution, and fork-owned links.
- `feat-004/AC-11` enters through release-contract checks for separate signing and publication
  environments plus least-privilege job permissions.

## Commands

- `npm ci`
- `npm test`
- `npm run build`
- `npm run test:e2e`
- `npm audit --audit-level=high`
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `cargo audit --file src-tauri/Cargo.lock`
- `npm run tauri build -- --debug --no-bundle`
- `npm run tauri build -- --bundles msi,nsis`
- `pwsh -File scripts/qa/verify-release-contract.ps1`
