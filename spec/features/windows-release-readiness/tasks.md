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
- [x] T5 Replace the tag-only build with dependency-ordered macOS and signed Windows release jobs,
  Authenticode verification, checksums, and release publication. File:
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
  GitHub OIDC federation, protected environment, and repository secrets. Owner: Eric Patton.
- [H] T10 Run signed clean-system Windows 10 22H2 and Windows 11 x64 install, real-agent, SSH,
  recovery, upgrade, uninstall, signature, and checksum matrix. Owner: Eric Patton.
- [x] T11 Record touched files, validate the implemented automated scope, and append the convergence
  audit without resolving T9 or T10. Observed: automated feature validation completed with zero
  errors and zero warnings; the two human release gates remain unresolved.
