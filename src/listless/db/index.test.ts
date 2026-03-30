import fs from "fs";
import os from "os";
import path from "path";

import { expect, test, describe, beforeEach, afterEach } from "vitest";

import { getDb } from ".";


test("given db when getDb reset true then returns new db", () => {
    const db1 = getDb({ reset: true });
    const db2 = getDb({ reset: true });
    expect(db1).is.not.toBe(db2);
});

test("given db when getDb reset false then returns same db", () => {
    const db1 = getDb({ reset: true });
    const db2 = getDb({ reset: false });
    expect(db1).is.toBe(db2);
});

describe("(with temporary directory)", () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "listless-test"));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test("given folder when getDb with filename in folder then creates files in folder", () => {
        const filename = path.join(tmpDir, "sqlite.db");
        const _db = getDb({ reset: true, filename });
        expect(fs.existsSync(filename)).toBeTruthy();
    });

    test("given two distinct file names when getDb then creates different databases", () => {
        const filenameA = path.join(tmpDir, "a.db");
        const filenameB = path.join(tmpDir, "b.db");
        const dbA = getDb({ filename: filenameA });
        const dbB = getDb({ filename: filenameB });
        expect(fs.existsSync(filenameA)).toBeTruthy();
        expect(fs.existsSync(filenameB)).toBeTruthy();
        expect(dbA).is.not.toBe(dbB);
    });

    test("given nested filename when getDb then creates parental folders", () => {
        const folder = path.join(tmpDir, "folder");
        expect(fs.existsSync(folder)).toBeFalsy();
        const filename = path.join(folder, "sqlite.db");
        const _db = getDb({ reset: true, filename });
        expect(fs.existsSync(filename)).toBeTruthy();
    });
});
