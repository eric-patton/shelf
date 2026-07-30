import { existsSync } from "node:fs";
import { resolve } from "node:path";

const appBinaryPath = resolve(
  process.env.SHELF_APP_BINARY ||
    "src-tauri/target/debug/shelf-for-windows.exe",
);

if (!existsSync(appBinaryPath)) {
  throw new Error(
    `Tauri E2E binary not found at ${appBinaryPath}. Build it with the e2e feature first.`,
  );
}

export const config = {
  runner: "local",
  specs: ["./windows-smoke.e2e.mjs"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "tauri",
      "tauri:options": {
        application: appBinaryPath,
      },
      "wdio:tauriServiceOptions": {
        appBinaryPath,
        appArgs: [],
        captureBackendLogs: false,
        captureFrontendLogs: false,
      },
    },
  ],
  logLevel: process.env.DEBUG ? "debug" : "silent",
  bail: 1,
  waitforTimeout: 20_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,
  services: [
    [
      "@wdio/tauri-service",
      {
        driverProvider: "embedded",
        embeddedPort: Number(process.env.SHELF_WEBDRIVER_PORT || 4445),
        autoDownloadEdgeDriver: true,
        captureBackendLogs: false,
        captureFrontendLogs: false,
      },
    ],
  ],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60_000,
  },
};
