import { test, expect } from "vitest";

import { ListService } from "./list_service";
import { getDb } from "./db";


const ED25519_PUBKEY = Buffer.from("04E3F4DE0B25E67D5D84FEE3506D6A2853FA6B3E99A5CA2073034FF4FC238730", "hex");

test("given empty db when get by missing id then returns null", () => {
    const svc = new ListService(getDb({ reset: true }));
    const list = svc.get("dne");
    expect(list).toBeNull();
});

test.each([
    { label: "no mutkey", mutkey: null },
    { label: "mutkey", mutkey: ED25519_PUBKEY },
])("given name and $label when createList then getList finds by id with correct values", ({ mutkey }) => {
    const svc = new ListService(getDb({ reset: true }));
    const name = Buffer.from("client-side-encrypted");

    const id = svc.create(name, mutkey);

    const list = svc.get(id);
    expect(list).not.toBeNull();
    expect(list!.id).toEqual(id);
    expect(list!.name).toEqual(name);
    expect(list!.mutkey).toEqual(mutkey);
    expect(list!.createdAt).closeTo(Date.now(), 1000);
});

test("given malformed mutkey when create then throws", () => {
    const svc = new ListService(getDb({ reset: true }));
    const name = Buffer.from("name");
    const mutkey = Buffer.from("mutkey is not a valid Ed25519 public key");
    expect(() => svc.create(name, mutkey)).toThrow();
});

test("given name too long when create then throws", () => {
    const svc = new ListService(getDb({ reset: true }));
    const name = Buffer.from("a".repeat(1000));
    expect(() => svc.create(name, null)).toThrow();
});

test("given name when create multiple times then ids are unique", () => {
    const svc = new ListService(getDb({ reset: true }));
    const name = Buffer.from("name");
    const list_ids = [];
    const n = 1000;
    for (let i = 0; i < n; i++) {
        const list_id = svc.create(name, null);
        list_ids.push(list_id)
    }

    expect(new Set(list_ids)).toHaveLength(n);
});

test("given does not exist id when rename then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    await expect(svc.rename("dne", Buffer.from("newName"), null)).rejects.toThrow();
});

test("given newName too long when rename then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), null);
    await expect(svc.rename(id, Buffer.from("a".repeat(1000)), null)).rejects.toThrow();
});

test("given unprotected list when rename with good name then changes name", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), null);
    const newName = Buffer.from("newName");
    await svc.rename(id, newName, null);
    expect(svc.get(id)!.name).toEqual(newName);
});

test("given no signature when rename protected list then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    await expect(svc.rename(id, Buffer.from("newName"), null)).rejects.toThrow();
});

test("given invalid signature when rename protected list then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    await expect(svc.rename(id, Buffer.from("newName"), Buffer.from("invalid"))).rejects.toThrow();
});

test("given valid signature when rename protected list then throws", async () => {
    const mockVerifyMutation = () => Promise.resolve(true);
    const svc = new ListService(getDb({ reset: true }), mockVerifyMutation);
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    const newName = Buffer.from("newName");
    await svc.rename(id, newName, Buffer.from("mock valid"));
    expect(svc.get(id)!.name).toEqual(newName);
});

test("given missing id when delete list then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    await expect(svc.delete("dne", null)).rejects.toThrow();
});

test("given no signature when delete protected list then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    await expect(svc.delete(id, null)).rejects.toThrow();
});

test("given invalid signature when delete protected list then throws", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    await expect(svc.delete(id, Buffer.from("invalid"))).rejects.toThrow();
});

test("given unprotected empty list when delete then deletes", async () => {
    const svc = new ListService(getDb({ reset: true }));
    const id = svc.create(Buffer.from("name"), null);
    await svc.delete(id, null);
    expect(svc.get(id)).toBeNull();
});

test("given protected empty list when delete with valid signature then deletes", async () => {
    const mockVerifyMutation = () => Promise.resolve(true);
    const svc = new ListService(getDb({ reset: true }), mockVerifyMutation);
    const id = svc.create(Buffer.from("name"), ED25519_PUBKEY);
    await svc.delete(id, Buffer.from("mock valid"));
    expect(svc.get(id)).toBeNull();
});

test("given unprotected list with items when delete then deletes", async () => {
    const db = getDb({ reset: true });
    const svc = new ListService(db);
    db.exec(`
        INSERT INTO lists (id, mutkey, name, created_at)
        VALUES ('mock_id', NULL, 'Groceries', 1743600000000);

        INSERT INTO list_items (list_id, item, created_at, updated_at)
        VALUES
            ('mock_id', '{"label":"Milk","qty":2,"done":false}',   1743600000000, 1743600000000),
            ('mock_id', '{"label":"Eggs","qty":12,"done":false}',  1743600000000, 1743600000000),
            ('mock_id', '{"label":"Bread","qty":1,"done":true}',   1743600000000, 1743600000000);
    `);

    await svc.delete("mock_id", null);
    expect(svc.get("mock_id")).toBeNull();
});

test("given protected list with items when delete with valid signature then deletes", async () => {
    const mockVerifyMutation = () => Promise.resolve(true);
    const db = getDb({ reset: true });
    const svc = new ListService(db, mockVerifyMutation);
    db.exec(`
        INSERT INTO lists (id, mutkey, name, created_at)
        VALUES ('mock_id', NULL, 'Groceries', 1743600000000);

        INSERT INTO list_items (list_id, item, created_at, updated_at)
        VALUES
            ('mock_id', '{"label":"Milk","qty":2,"done":false}',   1743600000000, 1743600000000),
            ('mock_id', '{"label":"Eggs","qty":12,"done":false}',  1743600000000, 1743600000000),
            ('mock_id', '{"label":"Bread","qty":1,"done":true}',   1743600000000, 1743600000000);
    `);

    await svc.delete("mock_id", null);
    expect(svc.get("mock_id")).toBeNull();
});
