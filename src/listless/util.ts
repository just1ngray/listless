
export function bigintToUint8Array(n: bigint): Uint8Array {
    const hex = n.toString(16).padStart(2, '0');
    const padded = hex.length % 2 ? '0' + hex : hex;
    return Uint8Array.from(Buffer.from(padded, 'hex'));
}
