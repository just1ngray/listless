import fs from "fs";
import path from "path"

import Database from "better-sqlite3";

import { runMigrations } from "./migrate";


const dbs: Record<string, Database.Database> = {};

interface Options {
    reset: boolean;
    filename: string;
}

const IN_MEMORY = ":memory:";

const defaults: Options = {
    reset: false,
    filename: process.env.LISTLESS_DB_FILENAME || IN_MEMORY,
};

export function getDb(options: Partial<Options> = {}): Database.Database {
    const opts = { ...defaults, ...options };

    if (dbs[opts.filename]) {
        if (opts.reset) {
            dbs[opts.filename].close();
            delete dbs[opts.filename];
        }
        else {
            return dbs[opts.filename];
        }
    }

    // if it's a file database ensure that the parent folder(s) exist
    if (opts.filename !== IN_MEMORY) {
        fs.mkdirSync(path.dirname(opts.filename), { recursive: true });
    }
    else {
        console.warn("Using an in-memory database. Set LISTLESS_DB_FILENAME env var to adjust");
    }

    dbs[opts.filename] = new Database(opts.filename, {});
    dbs[opts.filename].pragma("journal_mode = WAL");
    dbs[opts.filename].pragma("foreign_keys = ON");
    runMigrations(dbs[opts.filename]);
    return dbs[opts.filename];
}
