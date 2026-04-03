
/**
 * Replacement for missing Buffer::toString("base64") in browser runtime.
 */
export function toBase64(buffer: Uint8Array | ArrayBuffer): string {
    if (buffer instanceof ArrayBuffer) {
        buffer = new Uint8Array(buffer);
    }
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Replacement for missing Buffer.from(..., "base64") in browser runtime.
 */
export function fromBase64(base64: string): Uint8Array {
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
        throw new Error(`Invalid base64 string`);
    }
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
