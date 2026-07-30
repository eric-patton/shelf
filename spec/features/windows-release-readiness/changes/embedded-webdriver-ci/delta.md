# Delta - embedded-webdriver-ci

> The change expressed against the current spec as explicit operations.

## ADDED

- Test-only Tauri WebDriver plugins are available only when the explicit `e2e` Cargo feature is
  enabled. Normal development and release builds do not register or ship them.

## MODIFIED

- **Windows desktop smoke scenario**
  - Was: Given a debug Shelf for Windows executable and the Windows WebView2 driver, external
    `tauri-driver` starts the app and exposes a W3C session.
  - Now: Given a debug Shelf for Windows executable built with the explicit `e2e` feature, the
    official WebdriverIO Tauri service starts the app through its embedded W3C WebDriver provider.
- **AC-2**
  - Was: Windows CI drives the real debug Tauri executable through a W3C harness and
    `tauri-driver`, verifies the home and settings shell UI, creates a PowerShell terminal, and
    observes command output without adding a vulnerable browser-test dependency graph.
  - Now: Windows CI drives the real debug Tauri executable through the official WebdriverIO Tauri
    service and its embedded W3C WebDriver provider, verifies the home and settings shell UI,
    creates a PowerShell terminal, and observes command output without a high or critical
    dependency advisory.
- **Verification architecture**
  - Was: Keep the desktop harness dependency-free, install an Edge WebDriver matched to the hosted
    WebView2 runtime, and run external `tauri-driver`.
  - Now: Use the official WebdriverIO Tauri service with test-only Rust and frontend plugins,
    feature-gate the embedded provider out of release builds, and connect the W3C session only to
    that embedded provider. The current service may cache a matching Edge WebDriver during its
    Windows compatibility preflight, but it does not launch that driver for the test session.

## REMOVED

- The `windows-2022` runner pin, repository-maintained Evergreen WebView2 updater, matching Edge
  WebDriver installer, and external `tauri-driver` installation are removed because the embedded
  provider owns the W3C server and no longer uses that failing launch path.
