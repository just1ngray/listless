import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";
import { json } from "@solidjs/router";

import { listService } from "~/listless";


const CreateListItemSchema = z.object({
    item: z.base64(),
});

/**
 * Add a new item to an existing list
 *
 * POST /api/lists/[listId]/items
 * H["X-Signature"] = optional | "base64 encoded signature of the item being added"
 * { "item": "base64 bytes of the item" }
 *
 * 200 - { "itemId": number }
 */
export async function POST(event: APIEvent) {
    const listId = event.params["listId"];

    const body = await new Response(event.request.body).json();
    const parsed = CreateListItemSchema.safeParse(body);
    if (parsed.error) {
        return json(parsed.error, { status: 400 });
    }
    const item = Buffer.from(parsed.data.item, "base64");

    const headerSig = event.request.headers.get("X-Signature");
    const signature = headerSig === null ? null : Buffer.from(headerSig, "base64");


    try {
        const items = listService.items(listId)!;
        const itemId = await items.add(item, signature);
        return json({ itemId });
    }
    catch (e) {
        return json(e, { status: 400 });
    }
}
