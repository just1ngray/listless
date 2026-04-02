import * as ed from "@noble/ed25519";


export async function verifyMutation(mutkey: Uint8Array | null, message: Uint8Array | null, signature: Uint8Array | null): Promise<boolean> {
    // if the list is not protected, then anything is "verified"
    if (mutkey === null) {
        return true;
    }

    // the list is protected with a mutkey but is missing args
    if (signature === null || message === null) {
        return false;
    }

    // check whether the message's signature is valid
    try {
        return await ed.verifyAsync(signature, message, mutkey);
    }
    catch {
        return false;
    }
}
