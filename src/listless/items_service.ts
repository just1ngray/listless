import { Database } from "better-sqlite3";

import { ListRecord } from "./list_record";
import { verifyMutation } from "./verify";
import { bigintToUint8Array } from "./util";



export class ItemsService {
    constructor(
        private list: ListRecord,
        private db: Database,
        private verify = verifyMutation,
    ) { }

    all() {
        return this.db.prepare(`
            SELECT id, item
            FROM list_items
            WHERE list_id = ?;
        `).all(this.list.id) as { id: bigint, item: Uint8Array }[];
    }

    get(id: bigint): Uint8Array | null {
        const rows = this.db.prepare(`
            SELECT item
            FROM list_items
            WHERE id = ?
                AND list_id = ?;
        `).all(id, this.list.id) as { item: Uint8Array }[];
        return rows[0].item;
    }

    async add(item: Uint8Array, sig: Uint8Array | null): Promise<bigint> {
        ItemsService.validateItem(item);

        if (!await this.verify(this.list.mutkey, item, sig)) {
            throw new Error("Invalid signature");
        }

        const now = Date.now();
        return this.db.prepare(`
            INSERT INTO list_items (list_id, item, created_at, updated_at)
            VALUES (?, ?, ?, ?);
        `).run(this.list.id, item, now, now).lastInsertRowid as bigint;
    }

    async delete(id: bigint, sig: Uint8Array | null): Promise<void> {
        if (!await this.verify(this.list.mutkey, ItemsService.delete_messageToSign(id), sig)) {
            throw new Error("Invalid signature");
        }

        this.db.prepare(`
            DELETE FROM list_items
            WHERE id = ?
                AND list_id = ?;
        `).run(id, this.list.id);
    }

    async set(id: bigint, item: Uint8Array, sig: Uint8Array | null): Promise<void> {
        ItemsService.validateItem(item);

        const msg = ItemsService.set_messageToSign(id, item);
        if (!await this.verify(this.list.mutkey, msg, sig)) {
            throw new Error("Invalid signature");
        }

        const now = Date.now();
        this.db.prepare(`
            UPDATE list_items
            SET item = ?,
                updated_at = ?
            WHERE id = ?
                AND list_id = ?;
        `).run(item, now, id, this.list.id);
    }

    static delete_messageToSign(id: bigint): Uint8Array {
        return bigintToUint8Array(id);
    }

    static set_messageToSign(id: bigint, item: Uint8Array): Uint8Array {
        const idBytes = bigintToUint8Array(id);
        const result = new Uint8Array(idBytes.length + item.length);
        result.set(idBytes);
        result.set(item, idBytes.length);
        return result;
    }

    static validateItem(item: Uint8Array): void {
        if (item.length > 5 * 1024) {
            throw new Error("Item is too long");
        }
    }
}
