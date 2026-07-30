import { describe, expect, it } from "vitest";
import type { TabInfo } from "../types";
import { savedTabsFromRuntime, validSavedTabStates } from "./saved-state";

function tab(values: Partial<TabInfo> & Pick<TabInfo, "id" | "title">): TabInfo {
  return {
    closable: true,
    restoreKind: "terminal",
    ...values,
  } as TabInfo;
}

describe("saved tab recovery", () => {
  it("serializes blank, local session, new agent, and SSH tabs [feat-002/AC-7]", () => {
    const entries = [
      tab({ id: "blank", title: "Terminal", shell: "pwsh" }),
      tab({
        id: "session",
        title: "Session",
        restoreKind: "session",
        sessionId: "s-1",
        sessionProvider: "codex",
        workspacePath: "C:\\Work\\Shelf",
      }),
      tab({
        id: "new",
        title: "New Claude",
        restoreKind: "new-session",
        sessionProvider: "claude",
        workspacePath: "C:\\Work\\Shelf",
      }),
      tab({
        id: "ssh",
        title: "SSH",
        shell: "ssh",
        ssh: { host: "example.test", user: "dev" },
        workspacePath: "/srv/shelf",
      }),
    ];
    const map = new Map(entries.map((entry) => [entry.id, entry]));
    expect(savedTabsFromRuntime(entries.map((entry) => entry.id), map, "start"))
      .toHaveLength(4);
  });

  it("skips invalid and duplicate records without dropping valid tabs [feat-002/AC-7]", () => {
    const valid = { id: "valid", kind: "terminal", title: "Terminal" } as const;
    const invalid = { id: "invalid", kind: "session", title: "Broken" } as const;
    expect(validSavedTabStates([valid, invalid, valid])).toEqual([valid]);
  });

  it("round trips an optional custom title without requiring it from older state [feat-002/AC-9]", () => {
    const renamed = tab({ id: "renamed", title: "Build logs", customTitle: "Build logs" });
    const legacy = tab({ id: "legacy", title: "Terminal" });
    const map = new Map([[renamed.id, renamed], [legacy.id, legacy]]);

    expect(savedTabsFromRuntime([renamed.id, legacy.id], map, "start")).toEqual([
      expect.objectContaining({ id: "renamed", customTitle: "Build logs" }),
      expect.not.objectContaining({ customTitle: expect.anything() }),
    ]);
  });
});
