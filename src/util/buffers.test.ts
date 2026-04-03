import { test, expect } from "vitest";

import { toBase64, fromBase64 } from "./buffers";


test.each([
    "",
    "YWJj",
    "dGVzdCBzdHJpbmc=",
    "dGVzdA==",
])("given $0 when fromBase64 then toBase64 returns the same string", (str) => {
    const arr = fromBase64(str);
    const back = toBase64(arr);
    expect(back).toEqual(str);
});

test("given invalid base64 string when fromBase64 then throws error", () => {
    const notBase64 = "this string is not base 64";
    expect(() => fromBase64(notBase64)).toThrow();
});

test.each([
    new Uint8Array([]),
    new Uint8Array([1, 2, 3]),
    new Uint8Array([0xFF, 0x00, 0xAB]),
])("given %o when toBase64 then fromBase64 returns the same bytes", (bytes) => {
    const b64 = toBase64(bytes);
    const back = fromBase64(b64);
    expect(back).toEqual(bytes);
});

test.each([
    new Uint8Array([1, 2, 3]).buffer,
    new Uint8Array([0xFF, 0x00, 0xAB]).buffer,
])("given %o when toBase64 then fromBase64 returns the same inner bytes", (bytes) => {
    const b64 = toBase64(bytes);
    const back = fromBase64(b64);
    expect(back).toEqual(new Uint8Array(bytes));
});
