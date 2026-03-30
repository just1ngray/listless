import { test } from "vitest";
import Database from "better-sqlite3";

import { runMigrations } from "./migrate";


test("given empty db when runMigrations then no error", () => {
    const db = new Database(":memory:", {});
    db.pragma("journal_mode = WAL");
    runMigrations(db);
});

test("given migrated db when runMigrations then no error", () => {
    const db = new Database(":memory:", {});
    db.pragma("journal_mode = WAL");
    runMigrations(db);
    runMigrations(db);
});
