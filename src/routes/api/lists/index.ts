import type { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";
import { z } from "zod";

import { listService } from "~/listless";


const CreateListSchema = z.object({
    name: z.base64(),
    mutkey: z.base64().optional(),
});

/**
 * POST /api/lists
 * {
 *      "name": "base64 encoded bytes",
 *      "mutkey": undefined | "base64 encoded ed25519 public key for verifying future changes"
 * }
 *
 * 200 - { "listId": "id string" }
 */
export async function POST(event: APIEvent) {
    const body = await new Response(event.request.body).json();
    const parsed = CreateListSchema.safeParse(body);
    if (parsed.error) {
        return json(parsed.error, { status: 400 });
    }

    const name = Buffer.from(parsed.data.name, "base64");
    const mutkey = parsed.data.mutkey !== undefined
        ? Buffer.from(parsed.data.mutkey, "base64")
        : null;

    try {
        const id = listService.create(name, mutkey);
        return json({ listId: id });
    }
    catch (e) {
        return json(e, { status: 400 });
    }
}
