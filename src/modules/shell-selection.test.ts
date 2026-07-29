import { describe, expect, it } from "vitest";
import { selectShell, shellDisplayName } from "./shell-selection";

describe("shell selection", () => {
  it("preserves a valid saved shell [feat-001/AC-2]", () => {
    expect(selectShell("powershell", {
      shells: ["pwsh", "powershell", "cmd"],
      defaultShell: "pwsh",
    })).toBe("powershell");
  });

  it("uses the preferred shell for a missing saved shell [feat-001/AC-2]", () => {
    expect(selectShell(undefined, {
      shells: ["pwsh", "powershell", "cmd"],
      defaultShell: "pwsh",
    })).toBe("pwsh");
  });

  it("uses the preferred shell for an invalid saved shell [feat-001/AC-2]", () => {
    expect(selectShell("zsh", {
      shells: ["powershell", "cmd"],
      defaultShell: "powershell",
    })).toBe("powershell");
  });

  it("provides Windows-friendly shell labels [feat-001/AC-1]", () => {
    expect(shellDisplayName("pwsh")).toBe("PowerShell 7");
    expect(shellDisplayName("powershell")).toBe("Windows PowerShell");
    expect(shellDisplayName("cmd")).toBe("Command Prompt");
  });
});
