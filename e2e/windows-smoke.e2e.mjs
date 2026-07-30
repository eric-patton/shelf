import assert from "node:assert/strict";

describe("Shelf for Windows desktop", () => {
  it("feat-004/AC-2 exercises the real app and PowerShell terminal", async () => {
    const clickInPage = async (selector) => {
      await browser.execute((target) => {
        document.querySelector(target)?.click();
      }, selector);
    };

    const homeTab = await $('[data-tab-id="__start__"]');
    await homeTab.waitForClickable();
    await clickInPage('[data-tab-id="__start__"]');

    const homeTitle = await $(".start-page h2");
    await homeTitle.waitForDisplayed();
    assert.match(await homeTitle.getText(), /Shelf for Windows/);

    await clickInPage("#settings-btn");

    const shellOptions = await $("#settings-shell");
    await shellOptions.waitForDisplayed();
    assert.match(await shellOptions.getText(), /PowerShell/);

    await clickInPage("#settings-cancel");
    await clickInPage("#tab-add-btn");

    const terminal = await $('.terminal-wrapper[style*="visible"] .xterm-screen');
    await terminal.waitForDisplayed();
    const terminalInput = await $(
      '.terminal-wrapper[style*="visible"] .xterm-helper-textarea',
    );
    await browser.execute(() => {
      document
        .querySelector('.terminal-wrapper[style*="visible"] .xterm-helper-textarea')
        ?.focus();
    });
    await terminalInput.addValue("Write-Output SHELF_WINDOWS_E2E_OK");
    await terminalInput.addValue("\uE007");

    await browser.waitUntil(
      async () => (await $("#terminal-container").getText()).includes("SHELF_WINDOWS_E2E_OK"),
      {
        timeout: 30_000,
        timeoutMsg: "PowerShell command output did not appear",
      },
    );

    await terminalInput.addValue("Write-Output SHELF_CTRL_J_E2E_OK");
    // spec/design-system.md:16: exact Ctrl+J must reach the PTY as standard LF.
    await browser.keys(["\uE009", "j", "\uE000"]);

    await browser.waitUntil(
      async () => (await $("#terminal-container").getText()).includes("SHELF_CTRL_J_E2E_OK"),
      {
        timeout: 30_000,
        timeoutMsg: "Ctrl+J did not reach the PowerShell PTY as LF",
      },
    );
  });
});
