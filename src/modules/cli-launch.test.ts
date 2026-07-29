import { describe, expect, it } from "vitest";
import { buildLocalCliCommand, buildRemoteCliCommand } from "./cli-launch";
import { buildSshArgs } from "./ssh";

describe("provider command construction", () => {
  it("builds local new and resume argv for every provider [feat-002/AC-2]", () => {
    const cwd = "C:\\Work Trees\\项目";
    expect(buildLocalCliCommand("claude", "claude.cmd", ["--model", "opus"], cwd))
      .toEqual({ bin: "claude.cmd", args: ["--model", "opus"] });
    expect(buildLocalCliCommand("claude", "claude.cmd", [], cwd, "claude-id"))
      .toEqual({ bin: "claude.cmd", args: ["--resume", "claude-id"] });
    expect(buildLocalCliCommand("codex", "codex.exe", ["--profile", "work"], cwd))
      .toEqual({ bin: "codex.exe", args: ["--profile", "work", "-C", cwd] });
    expect(buildLocalCliCommand("codex", "codex.exe", [], cwd, "codex-id"))
      .toEqual({ bin: "codex.exe", args: ["resume", "codex-id", "-C", cwd] });
    expect(buildLocalCliCommand("pi", "pi.cmd", ["--model", "test"], cwd))
      .toEqual({ bin: "pi.cmd", args: ["--model", "test"] });
    expect(buildLocalCliCommand("pi", "pi.cmd", [], cwd, "pi-id"))
      .toEqual({ bin: "pi.cmd", args: ["--session", "pi-id"] });
  });

  it("builds remote new and resume commands for every provider [feat-002/AC-6]", () => {
    const cwd = "/srv/Work Trees/项目";
    expect(buildRemoteCliCommand("claude", [], cwd, "claude-id"))
      .toBe("'claude' '--resume' 'claude-id'");
    expect(buildRemoteCliCommand("codex", [], cwd, "codex-id"))
      .toBe("'codex' 'resume' 'codex-id' '-C' '/srv/Work Trees/项目'");
    expect(buildRemoteCliCommand("pi", [], cwd, "pi-id"))
      .toBe("cd -- '/srv/Work Trees/项目' && 'pi' '--session' 'pi-id'");
  });

  it("keeps remote commands in one SSH argv item [feat-002/AC-6]", () => {
    const remote = buildRemoteCliCommand("codex", [], "/srv/project", "codex-id");
    const args = buildSshArgs(
      { host: "example.test", user: "dev", port: 2222, identityFile: "C:\\Keys\\id key" },
      remote,
    );
    expect(args.slice(0, 9)).toEqual([
      "-o",
      "StrictHostKeyChecking=accept-new",
      "-o",
      "ConnectTimeout=10",
      "-t",
      "-p",
      "2222",
      "-i",
      "C:\\Keys\\id key",
    ]);
    expect(args[9]).toBe("dev@example.test");
    expect(args[10]).toBe("--");
    expect(args).toHaveLength(12);
    expect(args[11]).toContain("codex");
    expect(args[11]).toContain("codex-id");
    expect(args[11]).toContain("/srv/project");
  });
});
