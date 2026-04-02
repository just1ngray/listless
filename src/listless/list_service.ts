import { nanoid } from "nanoid";
import { Database } from "better-sqlite3";
import * as ed from "@noble/ed25519";

import { ListRecord } from "./list_record";
import { verifyMutation } from "./verify";
import { ItemsService } from "./items_service";


export class ListService {
    constructor(
        private db: Database,
        private verify = verifyMutation,
    ) { }

    /**
     * Gets a list by its ID
     * @param id of the list to query
     * @returns null if the list does not exist, or the list otherwise
     */
    get(id: string): ListRecord | null {
        const rows = this.db.prepare(`
            SELECT name, mutkey, created_at
            FROM lists
            WHERE id = ?
            LIMIT 1;
        `).all(id) as { name: Uint8Array, mutkey: Uint8Array, created_at: number }[];

        if (rows.length === 0) {
            return null;
        }
        else {
            return {
                id: id,
                name: rows[0].name,
                mutkey: rows[0].mutkey,
                createdAt: rows[0].created_at,
            };
        }
    }

    /**
     * Adjust a list's items.
     * @param id of the list adjust the items of
     * @returns items service that can modify the retrieved list
     */
    items(id: string): ItemsService | null {
        const record = this.get(id);
        if (record === null) {
            return null;
        }
        return new ItemsService(record, this.db, this.verify);
    }

    /**
     * Creates a new list with a given name and public key
     * @param name name of the list (client-side encrypted)
     * @param mutkey optional, public 32-byte ed25519 key for verifying future mutations
     * @returns the id of the created list
     * @throws an exception if the `name` is longer than 128 bytes
     * @throws an exception if `mutkey` is given but not a valid 32-byte ed25519 public key
     */
    create(name: Uint8Array, mutkey: Uint8Array | null): string {
        if (name.length > 128) {
            throw new Error("name is too long (aim for name to be less than 64 letters before AES-GCM encryption)")
        }
        if (mutkey !== null) {
            ed.Point.fromBytes(mutkey);
        }

        const id = nanoid();

        this.db.prepare(`
            INSERT INTO lists (id, mutkey, name, created_at)
            VALUES (?, ?, ?, unixepoch('now') * 1000);
        `).run(id, mutkey, name);

        return id;
    }

    /**
     * Renames a list
     * @param id the list you wish to modify
     * @param newName the new display name of the list (client-side encrypted)
     * @param signature signature of `newName` signed by ed25519 private key and verified using the list's saved public
     *                  mutkey
     * @throws if the list with the given id is not found
     * @throws if `newName` is too long
     * @throws if the list is protected against unverified mutations but either no signature is provided or the signature
     *         is invalid
     */
    async rename(id: string, newName: Uint8Array, signature: Uint8Array | null) {
        if (newName.length > 128) {
            throw new Error("newName is too long (aim for name to be less than 64 letters before AES-GCM encryption)")
        }

        const list = this.get(id);
        if (list === null) {
            throw new Error(`List with id '${id}' not found`);
        }

        if (!await this.verify(list.mutkey, newName, signature)) {
            throw new Error("Invalid signature");
        }

        this.db.prepare(`
            UPDATE lists
            SET name = ?
            WHERE id = ?;
        `).run(newName, id);
    }

    /**
     * Deletes a list and all of its items forever and permanently
     * @param id of the list to delete
     * @param signature ed25519 signature of the list `id` is required if the list is protected with a mutkey
     */
    async delete(id: string, signature: Uint8Array | null) {
        const list = this.get(id);
        if (list === null) {
            throw new Error(`List with id '${id}' not found`);
        }

        if (!await this.verify(list.mutkey, Buffer.from(id), signature)) {
            throw new Error("Invalid signature");
        }

        this.db.transaction(() => {
            this.db.prepare(`
                DELETE FROM list_items
                WHERE list_id = ?;
            `).run(id);
            this.db.prepare(`
                DELETE FROM lists
                WHERE id = ?;
            `).run(id);
        })();
    }
}
