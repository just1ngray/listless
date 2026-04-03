import { test, expect } from "vitest";

import * as e2e from "./e2e-encrypt";


test.each([
    "",
    "text to encrypt",
    "héllo wörld 🔐",
])("given $0 and key when encrypt then decrypt recovers text", async (text) => {
    const key = await e2e.generateKey();
    const encrypted = await e2e.encrypt(text, key);
    const decrypted = await e2e.decrypt(encrypted, key);
    expect(decrypted).toEqual(text);
});

test("given text and same key when encrypt then different each time from random iv", async () => {
    const text = "text";
    const key = await e2e.generateKey();
    const encrypted1 = await e2e.encrypt(text, key);
    const encrypted2 = await e2e.encrypt(text, key);
    expect(encrypted1).not.toEqual(encrypted2);
});

test("given text and key when encrypt then decrypt with wrong key fails", async () => {
    const text = "text";
    const key1 = await e2e.generateKey();
    const key2 = await e2e.generateKey();
    const encrypted = await e2e.encrypt(text, key1);
    expect(e2e.decrypt(encrypted, key2)).rejects.toThrow();
});

test("given encrypted text when decrypt with tampered ciphertext then throws", async () => {
    const key = await e2e.generateKey();
    const encrypted = await e2e.encrypt("secret", key);

    const parsed = JSON.parse(encrypted);
    const ct = Buffer.from(parsed.ct, "base64");
    ct[0] ^= 0xff;
    const tampered = JSON.stringify({ ...parsed, ct: ct.toString("base64") });

    expect(e2e.decrypt(tampered, key)).rejects.toThrow();
});

test("given generated key when extract for serialization then is allowed", async () => {
    const key = await e2e.generateKey();
    const exported = await crypto.subtle.exportKey("raw", key);
    expect(new Uint8Array(exported).byteLength).toBe(256 / 8);
});

test("given cryptokey when exportKey then importKey loads the same key", async () => {
    const key = await e2e.generateKey();
    const exported = await e2e.exportKey(key);
    const imported = await e2e.importKey(exported);
    expect(key).toEqual(imported);
});
