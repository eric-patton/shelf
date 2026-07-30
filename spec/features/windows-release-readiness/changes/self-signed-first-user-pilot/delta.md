# Delta - self-signed first-user pilot

> The change expressed against the current spec as explicit operations.

## ADDED

- A local first-user pilot build creates or reuses a SHA-256 code-signing certificate whose private
  key is non-exportable and remains in the current user's Windows certificate store. It trusts only
  the public certificate in the current user's Root and TrustedPublisher stores, signs the Shelf for
  Windows application plus MSI and NSIS installers through a pilot-only Tauri signing configuration,
  verifies the expected subject, valid Authenticode chain, and RFC3161 timestamp, and writes
  SHA-256 checksums plus the public certificate to an ignored local artifact directory. The pilot
  path must not export a PFX, enter GitHub Actions, satisfy the public-release signing gates, or
  authorize public distribution.
- **Acceptance criterion to append as AC-12:** Running the documented Windows pilot command creates
  or reuses the current-user self-signed pilot certificate, signs and validates the application,
  MSI, and NSIS artifacts with the expected subject and timestamp, writes checksums and a public
  certificate without exporting private signing material, and leaves the Azure-backed public tag
  workflow unchanged.

## MODIFIED

- **Local release candidate**
  - Was: Local MSI and NSIS packaging is unsigned and for verification only.
  - Now: Maintainers may use the separate self-signed local pilot path for first-user testing while
    ordinary local packaging remains unsigned and the public tag workflow remains Azure-only.

## REMOVED

- None.
