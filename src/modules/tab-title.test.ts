import { describe, expect, it } from "vitest";
import {
  applyCustomTabTitle,
  restoreCustomTabTitle,
  shouldApplyAutomaticTabTitle,
} from "./tab-title";

describe("custom tab titles", () => {
  it("trims and applies a nonempty title [feat-002/AC-9]", () => {
    const tab = { title: "Terminal" };

    expect(applyCustomTabTitle(tab, "  Build logs  ")).toBe(true);
    expect(tab).toEqual({ title: "Build logs", customTitle: "Build logs" });
  });

  it("rejects a blank title without changing the tab [feat-002/AC-9]", () => {
    const tab = { title: "Terminal" };

    expect(applyCustomTabTitle(tab, "   ")).toBe(false);
    expect(tab).toEqual({ title: "Terminal" });
  });

  it("restores and preserves a custom title over automatic updates [feat-002/AC-9]", () => {
    const restored = restoreCustomTabTitle(
      { title: "Generated session", customTitle: undefined },
      "  Release work  ",
    );

    expect(restored).toEqual({ title: "Release work", customTitle: "Release work" });
    expect(shouldApplyAutomaticTabTitle(restored)).toBe(false);
    expect(shouldApplyAutomaticTabTitle({ customTitle: undefined })).toBe(true);
  });
});
