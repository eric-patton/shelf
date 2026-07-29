# Discovery

## Users and jobs

- Windows users need a trustworthy installer, predictable upgrade and uninstall behavior, and clear
  requirements before treating Shelf as supported software.
- Maintainers need pull-request evidence for Windows and macOS, plus a reproducible signed tag
  workflow.
- Release owners need explicit gates for Azure publisher identity and clean Windows 10 and Windows 11
  validation.

## Pain landscape

- The existing workflow runs only for tags and does not protect pull requests.
- Windows bundles are published unsigned, and the executable inside the installer is not signed.
- There is no automated desktop workflow test.
- Current frontend audit results include high and critical advisories in development tooling.
- The README advertises only macOS and Linux and tells every user to download a DMG.
- There is no checksum generation, Authenticode verification, or clean-system release checklist.

## Constraints and risks

- Public signing requires an externally provisioned Azure Artifact Signing account, verified identity,
  certificate profile, and GitHub OIDC federation.
- Windows 10 22H2 and Windows 11 x64 clean-system tests require separate machines or virtual machines.
- GitHub-hosted Windows runners can build and drive WebView2, but they do not replace clean-system
  installer validation.
- macOS release behavior must remain available while Windows signing is introduced.
- Signing must cover both the application executable and the final MSI and NSIS installers.

## Candidate success signals

- Every pull request runs unit, lint, audit, native build, and Windows desktop smoke checks.
- A tag builds Shelf, signs the Windows executable, bundles signed installers, signs the bundles,
  verifies Authenticode, generates checksums, and publishes platform assets.
- The dependency audit has no high or critical findings.
- README and release documentation describe Windows support and troubleshooting.
- Release owners can complete a concise Windows 10 and Windows 11 sign-off checklist.

## Explicit unknowns

- The Azure endpoint, signing account, certificate profile, tenant, client, and subscription values
  do not exist in the repository and must be provisioned by the release owner.
- Clean-system results cannot be observed from this workstation alone.

## Problem brief

### Problem statement

Shelf has substantial Windows functionality but lacks the assurance and distribution controls needed
to call Windows supported. A solution should add continuous Windows evidence, signed installers,
dependency gates, release integrity, and public documentation while preserving macOS builds and
making external release gates explicit.

### Target users

Windows 10 and Windows 11 x64 users, Shelf maintainers, and the owner publishing releases from a fork
or upstream repository.

### Jobs to be done

Review a change, produce a release, verify its identity and integrity, install or upgrade it on a
clean system, and troubleshoot common platform requirements.

### Success signals and how we will know

CI configuration and local equivalents pass, desktop WebDriver smoke executes on Windows, unsigned
installers build locally, release scripts verify signatures and checksums, and the remaining Azure
and clean-machine checks are recorded as human sign-offs.

### Constraints

No long-lived Azure signing credential, no unsigned public Windows release, no hidden manual gate,
and no removal of macOS release assets.

### Explicitly out of scope

Microsoft Store distribution, Windows on ARM, Linux release automation changes, and purchasing or
provisioning an Azure identity on the user's behalf.

### Open questions

None.
