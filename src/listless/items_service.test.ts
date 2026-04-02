import * as ed from "@noble/ed25519";
import { test, expect } from "vitest";

import { ListService } from "./list_service";
import { ItemsService } from "./items_service";
import { getDb } from "./db";


const ED25519_PRIVKEY = Buffer.from("DED760FA67008A28BA29A9D9D3918DF52E2BFC8F2741C66765202EC69A8421E8", "hex");
const ED25519_PUBKEY = Buffer.from("04E3F4DE0B25E67D5D84FEE3506D6A2853FA6B3E99A5CA2073034FF4FC238730", "hex");

test("given empty list when all then returns empty list", () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    expect(items.all()).toEqual([]);
});

test("given unprotected list when add then adds item", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;

    const item = Buffer.from("item");
    const itemId = await items.add(item, null);

    expect(items.get(itemId)).toEqual(item);
});

test("given list when add too long then throws", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;

    const item = Buffer.from("a".repeat(6*1024));
    await expect(items.add(item, null)).rejects.toThrow();
});

test.each([
    { label: "null", sig: null },
    { label: "invalid", sig: Buffer.from("invalid") },
])("given protected list when add with invalid signature $label then throws", async ({ sig }) => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    const item = Buffer.from("item");
    await expect(items.add(item, sig)).rejects.toThrow();
});

test("given protected list when add with good signature then adds item", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;

    const item = Buffer.from("item");
    const sig = await ed.signAsync(item, ED25519_PRIVKEY);
    const itemId = await items.add(item, sig);

    expect(items.get(itemId)).toEqual(item);
});

test("given empty unprotected list when delete the no op", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;
    await items.delete(BigInt(314), null);
});

test("given empty protected list when delete the no op", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    const id = BigInt(159);
    const sig = await ed.signAsync(ItemsService.delete_messageToSign(id), ED25519_PRIVKEY);
    await items.delete(id, sig);
});

test("given unprotected list when delete then removes item", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;
    const item = Buffer.from("item");
    const itemId = await items.add(item, null);
    await items.delete(itemId, null);
});

test("given protected list when delete with valid signature then removes item", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    const item = Buffer.from("item");
    const addItemSig = await ed.signAsync(item, ED25519_PRIVKEY);
    const itemId = await items.add(item, addItemSig);
    const deleteItemSig = await ed.signAsync(ItemsService.delete_messageToSign(itemId), ED25519_PRIVKEY);
    await items.delete(itemId, deleteItemSig);
});

test.each([
    { label: "null", sig: null },
    { label: "invalid", sig: Buffer.from("invalid") }
])("given protected list when delete $label signature then throws", async ({ sig }) => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    const item = Buffer.from("item");
    const addItemSig = await ed.signAsync(item, ED25519_PRIVKEY);
    const itemId = await items.add(item, addItemSig);
    await expect(items.delete(itemId, sig)).rejects.toThrow();
});

test("given unprotected list when set missing item id then no op", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;
    await items.set(BigInt(100), Buffer.from("whatever"), null);
});

test("given list item when set item too long then throws", async () => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), null);
    const items = listService.items(listId)!;
    const itemId = await items.add(Buffer.from("item"), null);

    const item = Buffer.from("a".repeat(6 * 1024));
    await expect(items.set(itemId, item, null)).rejects.toThrow();
});

test.each([
    { label: "null", sig: null },
    { label: "invalid", sig: Buffer.from("invalid") },
])("given protected list when set with $label signature then throws", async ({ sig }) => {
    const listService = new ListService(getDb({ reset: true }));
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;
    const item = Buffer.from("item");
    const addSig = await ed.signAsync(item, ED25519_PRIVKEY)
    const itemId = await items.add(item, addSig);
    await expect(items.set(itemId, item, sig)).rejects.toThrow();
});

test("given new item when set with valid signature then updates", async () => {
    const db = getDb({ reset: true });
    const listService = new ListService(db);
    const listId = listService.create(Buffer.from("name"), ED25519_PUBKEY);
    const items = listService.items(listId)!;

    const item = Buffer.from("item");
    const addSig = await ed.signAsync(item, ED25519_PRIVKEY)
    const itemId = await items.add(item, addSig);

    const newItem = Buffer.from("newItem");
    const setSig = await ed.signAsync(ItemsService.set_messageToSign(itemId, newItem), ED25519_PRIVKEY)
    await items.set(itemId, newItem, setSig);

    const rows = db.prepare(`
        SELECT item, created_at, updated_at
        FROM list_items;
    `).all() as { item: Uint8Array, created_at: number, updated_at: number }[];
    expect(rows[0].item).toEqual(newItem);
    expect(rows[0].updated_at).toBeGreaterThan(rows[0].created_at);
});
