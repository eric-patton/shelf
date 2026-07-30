# Proposal - embedded-webdriver-ci

**Trigger:** Clean GitHub hosted Windows runners repeatedly fail before session creation with
`DevToolsActivePort file doesn't exist` when the external `tauri-driver` launches WebView2. The
same failure is present in Tauri's official WebDriver example workflow.

**Summary:** Preserve the real W3C desktop acceptance test, but replace the failing external
`tauri-driver` and Edge WebDriver chain with WebdriverIO's official Tauri service and its embedded
WebDriver provider. The embedded provider starts inside a feature-gated debug application, so
normal development and release builds do not register or ship test-only plugins. This removes the
failing external driver launch path without weakening the desktop proof. WebdriverIO service 1.2.0
still performs its own Windows compatibility preflight and may cache a matching Edge WebDriver,
but the test session connects only to the embedded provider.

## Blast radius

- Requirements affected: `feat-004/AC-2` and its Windows desktop smoke scenario.
- Design decisions affected: external `tauri-driver`, dependency-free harness, matched Edge
  WebDriver installation, and the pinned desktop runner.
- Tasks affected: T3 and T17 through T20 remain historical implementation records; new tasks cover
  the embedded provider, test harness, workflow, contract proof, and hosted verification.
- Already-built code affected: `e2e/windows-smoke.e2e.mjs`, `.github/workflows/ci.yml`,
  `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`,
  `src-tauri/src/lib.rs`, `src-tauri/capabilities/default.json`, and obsolete external-driver
  setup scripts.

## Status

- [x] delta reviewed by analyze
- [x] implemented and verified
- [x] folded into the canonical feature spec
