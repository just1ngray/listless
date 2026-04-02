import * as ed from "@noble/ed25519";
import { test, expect } from "vitest";

import { verifyMutation } from "./verify";


const ED25519_PRIVKEY = Buffer.from("DED760FA67008A28BA29A9D9D3918DF52E2BFC8F2741C66765202EC69A8421E8", "hex");
const ED25519_PUBKEY = Buffer.from("04E3F4DE0B25E67D5D84FEE3506D6A2853FA6B3E99A5CA2073034FF4FC238730", "hex");


test("given no mutkey when verifyMutation with any other args then return true", async () => {
    const msg = Buffer.from("message");
    const sig = Buffer.from("sig");

    expect(await verifyMutation(null, null, null)).toBeTruthy();
    expect(await verifyMutation(null, null, sig)).toBeTruthy();
    expect(await verifyMutation(null, msg, null)).toBeTruthy();
    expect(await verifyMutation(null, msg, sig)).toBeTruthy();
});

test("given mutkey but missing other args when verifyMutation then return false", async () => {
    const msg = Buffer.from("message");
    const sig = Buffer.from("sig");

    expect(await verifyMutation(ED25519_PUBKEY, null, null)).toBeFalsy();
    expect(await verifyMutation(ED25519_PUBKEY, null, sig)).toBeFalsy();
    expect(await verifyMutation(ED25519_PUBKEY, msg, null)).toBeFalsy();
});

test("given invalid signature for message when verifyMutation then return false", async () => {
    const msg = Buffer.from("message");
    const sig = Buffer.from("sig");
    expect(await verifyMutation(ED25519_PUBKEY, msg, sig)).toBeFalsy()
});

test("given bad signature for message when verifyMutation then return false", async () => {
    const msg = Buffer.from("message");
    const sig = Buffer.from("s".repeat(64));
    expect(await verifyMutation(ED25519_PUBKEY, msg, sig)).toBeFalsy()
});

test("given valid signature for message when verifyMutation then return false", async () => {
    const msg = Buffer.from("message");
    const sig = await ed.signAsync(msg, ED25519_PRIVKEY);
    expect(await verifyMutation(ED25519_PUBKEY, msg, sig)).toBeTruthy()
});
