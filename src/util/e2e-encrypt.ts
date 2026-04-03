import { toBase64, fromBase64 } from "./buffers";


/**
 * Generates a new AES-GCM key that can be used for encryption, decryption, and is allowed to be extracted.
 * @returns the key
 */
export async function generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
}

/**
 * Extracts a key into its base64 representation
 * @param key to extract
 * @returns the extracted key, encoded as base64
 */
export async function exportKey(key: CryptoKey): Promise<string> {
    const arr = await crypto.subtle.exportKey("raw", key);
    return toBase64(arr);
}

/**
 * Imports a base64 raw CryptoKey back into a usable CryptoKey
 * @param base64 encoded key to import
 * @returns the ready CryptoKey
 */
export async function importKey(base64: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
        "raw",
        new Uint8Array(fromBase64(base64).buffer as ArrayBuffer),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypts and serializes some text using a key.
 * @param text the text to encrypt
 * @param key to use for encryption
 * @returns the serialized representation of the encrypted text
 */
export async function encrypt(text: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(
        await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            new TextEncoder().encode(text)
        )
    );

    // json stringify over concat to avoid assuming length 12 is constant forever
    return JSON.stringify({
        iv: toBase64(iv),
        ct: toBase64(ct),
    });
}

/**
 * Decrypts a serialized encrypted text from `encrypt` function.
 * @param encrypted and serialized text to decrypt back into the original text argument from `encrypt`
 * @param key to use for decryption
 * @returns the original text argument used from `encrypt`
 */
export async function decrypt(encrypted: string, key: CryptoKey): Promise<string> {
    const { iv, ct } = JSON.parse(encrypted);
    const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(fromBase64(iv).buffer as ArrayBuffer) },
        key,
        new Uint8Array(fromBase64(ct).buffer as ArrayBuffer),
    );
    return new TextDecoder().decode(plaintext);
}
