import { describe, expect, it } from "vitest";
import type { Session } from "../types";
import { findPendingSession } from "./pending-session";

function session(id: string, cwd: string, updatedAt: string): Session {
  return {
    id,
    cwd,
    updated_at: updatedAt,
    provider: "codex",
  } as Session;
}

describe("pending session linking", () => {
  it("links the newest unclaimed session in an equivalent Windows workspace [feat-002/AC-8]", () => {
    const result = findPendingSession(
      {
        workspacePath: "C:\\Work\\Shelf",
        baselineIds: new Set(["baseline"]),
      },
      [
        session("baseline", "C:\\Work\\Shelf", "2026-01-01T00:00:00Z"),
        session("other", "C:\\Work\\Other", "2026-01-04T00:00:00Z"),
        session("older", "c:/work/shelf", "2026-01-02T00:00:00Z"),
        session("newest", "C:\\WORK\\SHELF\\src", "2026-01-03T00:00:00Z"),
      ],
      new Set(),
    );
    expect(result?.id).toBe("newest");
  });

  it("does not reuse a session claimed by another tab [feat-002/AC-8]", () => {
    const result = findPendingSession(
      { workspacePath: "C:\\Work\\Shelf", baselineIds: new Set() },
      [
        session("claimed", "C:\\Work\\Shelf", "2026-01-03T00:00:00Z"),
        session("available", "C:\\Work\\Shelf", "2026-01-02T00:00:00Z"),
      ],
      new Set(["claimed"]),
    );
    expect(result?.id).toBe("available");
  });
});
