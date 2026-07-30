import assert from "node:assert/strict";

describe("Shelf for Windows desktop", () => {
  it("feat-004/AC-2 exercises the real app and PowerShell terminal", async () => {
    const homeTab = await $('[data-tab-id="__start__"]');
    await homeTab.waitForClickable();
    await homeTab.click();

    const homeTitle = await $(".start-page h2");
    await homeTitle.waitForDisplayed();
    assert.match(await homeTitle.getText(), /Shelf for Windows/);

    const settingsButton = await $("#settings-btn");
    await settingsButton.click();

    const shellOptions = await $("#settings-shell");
    await shellOptions.waitForDisplayed();
    assert.match(await shellOptions.getText(), /PowerShell/);

    await $("#settings-cancel").click();
    await $("#tab-add-btn").click();

    const terminal = await $('.terminal-wrapper[style*="visible"] .xterm-screen');
    await terminal.waitForDisplayed();
    await terminal.click();
    const terminalInput = await $(
      '.terminal-wrapper[style*="visible"] .xterm-helper-textarea',
    );
    await terminalInput.addValue("Write-Output SHELF_WINDOWS_E2E_OK");
    await terminalInput.addValue("\uE007");

    await browser.waitUntil(
      async () => (await $("#terminal-container").getText()).includes("SHELF_WINDOWS_E2E_OK"),
      {
        timeout: 30_000,
        timeoutMsg: "PowerShell command output did not appear",
      },
    );
  });
});
