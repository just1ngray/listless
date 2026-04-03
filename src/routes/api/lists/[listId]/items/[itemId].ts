import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";
import { json } from "@solidjs/router";

import { listService } from "~/listless";


/**
 * Deletes an item from a list.
 *
 * DELETE /api/lists/[listId]/items/[itemId]
 * H["X-Signature"] = undefined | "base64 encoded signature of the list id as a decimal string"
 *
 * 200 - {}
 */
export async function DELETE(event: APIEvent) {
    const listId = event.params["listId"];
    const itemId = event.params["itemId"];

    const headerSignature = event.request.headers.get("X-Signature");
    const signature = headerSignature === null ? null : Buffer.from(headerSignature, "base64");

    try {
        const items = listService.items(listId)!;
        await items.delete(BigInt(itemId), signature);
        return json({});
    }
    catch (e) {
        return json(e, { status: 400 });
    }
}


const SetListItemSchema = z.object({
    item: z.base64(),
});

/**
 * Set an existing item with an existing list
 *
 * PUT /api/lists/[listId]/items/[itemId]
 * H["X-Signature"] = optional | "base64 encoded signature of the concatenation of the decimal string itemId with the item"
 * { "item": "base64 bytes of the item" }
 *
 * 200 - {}
 */
export async function PUT(event: APIEvent) {
    const listId = event.params["listId"];
    const itemId = event.params["itemId"];

    const body = await new Response(event.request.body).json();
    const parsed = SetListItemSchema.safeParse(body);
    if (parsed.error) {
        return json(parsed.error, { status: 400 });
    }
    const item = Buffer.from(parsed.data.item, "base64");

    const headerSig = event.request.headers.get("X-Signature");
    const signature = headerSig === null ? null : Buffer.from(headerSig, "base64");

    try {
        const items = listService.items(listId)!;
        await items.set(BigInt(itemId), item, signature);
        return json({ itemId });
    }
    catch (e) {
        return json(e, { status: 400 });
    }
}
