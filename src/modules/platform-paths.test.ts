import { describe, expect, it } from "vitest";
import {
  formatPathForInsertion,
  pathBasename,
  pathEqualOrNested,
  pathsEqual,
  relativePath,
} from "./platform-paths";

describe("platform paths", () => {
  it("matches equivalent Windows paths and component boundaries [feat-002/AC-1]", () => {
    expect(pathsEqual("C:\\Work\\Shelf\\", "c:/work/shelf")).toBe(true);
    expect(pathsEqual("\\\\?\\C:\\Users\\Ursin\\项目", "c:/users/ursin/项目")).toBe(true);
    expect(pathEqualOrNested("C:\\Work\\Shelf\\src", "c:/work/shelf")).toBe(true);
    expect(pathEqualOrNested("C:\\Work\\Shelf-old", "C:\\Work\\Shelf")).toBe(false);
    expect(pathEqualOrNested("C:\\Windows", "c:\\")).toBe(true);
  });

  it("keeps remote POSIX paths case-sensitive [feat-002/AC-1]", () => {
    expect(pathsEqual("/srv/Project", "/srv/project", true)).toBe(false);
    expect(pathEqualOrNested("/srv/project/src", "/srv/project", true)).toBe(true);
    expect(pathEqualOrNested("/srv/project-old", "/srv/project", true)).toBe(false);
  });

  it("builds relative paths and labels for both path flavors [feat-002/AC-3]", () => {
    expect(relativePath("C:\\Work\\Shelf\\src\\main.ts", "c:/work/shelf")).toBe("src\\main.ts");
    expect(relativePath("/srv/shelf/src/main.rs", "/srv/shelf", true)).toBe("src/main.rs");
    expect(pathBasename("C:\\Work\\Shelf\\main.ts")).toBe("main.ts");
    expect(pathBasename("/srv/shelf/main.rs", true)).toBe("main.rs");
  });

  it("formats file insertion for every destination [feat-002/AC-4]", () => {
    const windowsPath = "C:\\User's Files\\项目.txt";
    expect(formatPathForInsertion(windowsPath, "powershell"))
      .toBe("'C:\\User''s Files\\项目.txt'");
    expect(formatPathForInsertion('C:\\A "quoted" File.txt', "cmd"))
      .toBe('"C:\\A ""quoted"" File.txt"');
    expect(formatPathForInsertion("/srv/user's file.txt", "posix"))
      .toBe("'/srv/user'\\''s file.txt'");
    expect(formatPathForInsertion('C:\\A "quoted" File.txt', "agent"))
      .toBe('"C:\\A \\"quoted\\" File.txt"');
  });
});
