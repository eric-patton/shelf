# Change record

## 2026-07-29: desktop driver harness

### Evidence

Installing WebdriverIO 9.30 and `@wdio/tauri-service` 1.2.0 introduced 24 high-severity npm
advisories. npm reported no available fix for the affected WebdriverIO dependency graph.

### Decision

Keep the real Tauri and W3C WebDriver boundary, but drive `tauri-driver` through a dependency-free
Node harness instead of WebdriverIO. The test still launches the debug application, uses Microsoft
Edge WebDriver, locates semantic controls, creates a terminal, sends a PowerShell command, and
observes output.

### Propagation

- `spec.md` AC-2 names the W3C harness rather than WebdriverIO.
- `plan.md`, `tasks.md`, and package scripts point to `e2e/windows-smoke.e2e.mjs`.
- CI installs only `tauri-driver` and the matching Microsoft Edge WebDriver.
- The npm graph remains free of known vulnerabilities at high or critical severity.

## 2026-07-29: signing order

### Evidence

The local Tauri bundle log showed that Tauri patches `shelf.exe` separately for MSI and NSIS. Signing
the executable before `tauri bundle` would therefore invalidate the signature before packaging.

### Decision

Use Tauri's Windows `signCommand` hook with Microsoft Artifact Signing Client Tools. Tauri invokes
the hook after patching the executable and when each final installer is ready for signing.

### Propagation

- The tag workflow installs the official client tools after Azure OIDC login.
- `tauri.windows-release.conf.json` enables signing only for the protected release build.
- `sign-windows-artifact.ps1` invokes the x64 Windows SDK SignTool and Artifact Signing dlib.
- The workflow verifies the executable, MSI, and NSIS signatures before upload.
