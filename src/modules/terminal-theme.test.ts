import { describe, expect, it } from "vitest";
import { terminalContrastOptions } from "./terminal-theme";

describe("terminal theme accessibility", () => {
  it("requests near-white contrast for dark cells in light themes [feat-002/AC-10]", () => {
    for (const mode of ["light", "github-light", "solarized-light"] as const) {
      expect(terminalContrastOptions(mode)).toEqual({ minimumContrastRatio: 15 });
    }
  });

  it("retains the standard contrast floor in dark themes [feat-002/AC-10]", () => {
    for (const mode of ["dark", "dracula", "monokai"] as const) {
      expect(terminalContrastOptions(mode)).toEqual({ minimumContrastRatio: 4.5 });
    }
  });
});

