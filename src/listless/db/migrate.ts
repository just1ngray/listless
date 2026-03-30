import fs from "fs";
import path from "path";

import { Database } from "better-sqlite3";


export function runMigrations(
    db: Database,
    migrationsDirectory: string = "src/listless/db/migrations"
) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
            filename TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);

    const applied = db.prepare("SELECT filename FROM _migrations;")
        .all()
        .map((row: any) => ({
            filename: row.filename as string,
            appliedAt: row.applied_at as string,
        }));
    const current = applied.at(-1);
    console.log(`Database is currently at version: '${current?.filename}' since ${current?.appliedAt}`);

    const migrationFiles = fs.readdirSync(migrationsDirectory)
        .filter(f => f.endsWith(".sql"))
        .sort();
    console.log(`Found ${migrationFiles.length} migration files!`);
    const startIndex = current === undefined ? 0 : migrationFiles.indexOf(current!.filename) + 1;

    for (const migrationFile of migrationFiles.slice(startIndex)) {
        console.log(`Migrating to '${migrationFile}'`);

        const sql = fs.readFileSync(path.join(migrationsDirectory, migrationFile), "utf-8");

        db.transaction(() => {
            db.exec(sql);
            db.prepare("INSERT INTO _migrations (filename) VALUES (?)")
                .run(migrationFile);
        })();
    }

    console.log("Database migrations complete!");
}
