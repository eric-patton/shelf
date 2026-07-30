import { describe, expect, it } from "vitest";
import { terminalContrastOptions } from "./terminal-theme";

describe("terminal theme accessibility", () => {
  it("requests readable cell contrast from xterm [spec/design-system.md:44]", () => {
    expect(terminalContrastOptions()).toEqual({ minimumContrastRatio: 4.5 });
  });
});

