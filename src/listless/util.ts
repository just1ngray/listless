
export function bigintToUint8Array(n: bigint): Uint8Array {
    return Buffer.from(n.toString());
}
