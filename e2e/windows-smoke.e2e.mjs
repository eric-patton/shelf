import { access } from "node:fs/promises";
import { delimiter, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const binary = resolve(
  process.env.SHELF_APP_BINARY ||
    "src-tauri/target/debug/shelf-for-windows.exe",
);
const driverDirectory = resolve(
  process.env.SHELF_WEBDRIVER_DIR || "src-tauri/target/webdriver",
);
const tauriDriver =
  process.env.TAURI_DRIVER_PATH ||
  resolve(process.env.USERPROFILE || "", ".cargo/bin/tauri-driver.exe");
const endpoint = "http://127.0.0.1:4444";
const elementKey = "element-6066-11e4-a52e-4f735466cecf";

await access(binary);
await access(tauriDriver);

const driver = spawn(tauriDriver, [], {
  cwd: root,
  env: {
    ...process.env,
    PATH: `${driverDirectory}${delimiter}${process.env.PATH || ""}`,
  },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

let driverOutput = "";
driver.stdout.on("data", (chunk) => {
  driverOutput += chunk.toString();
});
driver.stderr.on("data", (chunk) => {
  driverOutput += chunk.toString();
});

let sessionId = null;

async function request(method, path, body) {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.value?.error) {
    throw new Error(
      `${method} ${path} failed (${response.status}): ${JSON.stringify(payload)}`,
    );
  }
  return payload.value;
}

async function waitFor(description, operation, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const result = await operation();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
  }
  throw new Error(
    `Timed out waiting for ${description}${lastError ? `: ${lastError.message}` : ""}`,
  );
}

async function find(css) {
  const value = await request(
    "POST",
    `/session/${sessionId}/element`,
    { using: "css selector", value: css },
  );
  return value[elementKey];
}

async function click(css) {
  const element = await waitFor(css, () => find(css));
  await request("POST", `/session/${sessionId}/element/${element}/click`, {});
}

async function text(css) {
  const element = await find(css);
  return request("GET", `/session/${sessionId}/element/${element}/text`);
}

async function sendKeys(value) {
  await click('.terminal-wrapper[style*="visible"] .xterm-screen');
  const actions = [];
  for (const key of value) {
    actions.push({ type: "keyDown", value: key });
    actions.push({ type: "keyUp", value: key });
  }
  await request(
    "POST",
    `/session/${sessionId}/actions`,
    {
      actions: [
        {
          type: "key",
          id: "keyboard",
          actions,
        },
      ],
    },
  );
}

function terminateOwnedDriver() {
  if (driver.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill.exe", ["/PID", String(driver.pid), "/T", "/F"], {
      windowsHide: true,
      stdio: "ignore",
    });
  } else {
    driver.kill("SIGTERM");
  }
}

try {
  await waitFor("tauri-driver status", async () => {
    const response = await fetch(`${endpoint}/status`);
    return response.ok;
  });

  const session = await request("POST", "/session", {
    capabilities: {
      alwaysMatch: {
        "tauri:options": {
          application: binary,
        },
      },
    },
  });
  sessionId = session.sessionId;

  // feat-004/AC-2
  await click('[data-tab-id="__start__"]');
  const homeTitle = await waitFor("Shelf for Windows home", async () => {
    const value = await text(".start-page h2");
    return value.includes("Shelf for Windows") ? value : null;
  });
  if (!homeTitle.includes("Shelf for Windows")) {
    throw new Error(`unexpected home title: ${homeTitle}`);
  }

  await click("#settings-btn");
  const shellOptions = await waitFor("Windows shell options", async () => {
    const value = await text("#settings-shell");
    return /PowerShell|Command Prompt/.test(value) ? value : null;
  });
  if (!/PowerShell/.test(shellOptions)) {
    throw new Error(`PowerShell was not detected: ${shellOptions}`);
  }
  await click("#settings-cancel");

  await click("#tab-add-btn");
  await sendKeys("Write-Output SHELF_WINDOWS_E2E_OK\uE007");
  await waitFor(
    "PowerShell command output",
    async () => {
      const value = await text("#terminal-container");
      return value.includes("SHELF_WINDOWS_E2E_OK");
    },
    30_000,
  );

  process.stdout.write("Windows Tauri desktop smoke passed.\n");
} catch (error) {
  process.stderr.write(`${error.stack || error}\n${driverOutput}\n`);
  process.exitCode = 1;
} finally {
  if (sessionId) {
    await request("DELETE", `/session/${sessionId}`).catch(() => {});
  }
  terminateOwnedDriver();
}
