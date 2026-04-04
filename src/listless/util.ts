import { fromBase64 } from "../util/buffers";

export function bigintToUint8Array(n: bigint): Uint8Array {
    return new TextEncoder().encode(n.toString());
}
