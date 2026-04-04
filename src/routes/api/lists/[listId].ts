import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";
import { json } from "@solidjs/router";

import { listService } from "~/listless";


/**
 * Get a list and all of its items.
 *
 * GET /api/lists/[listId]
 *
 * 200 - {
 *      "id": "id",
 *      "name": "base64 encoded list name",
 *      "createdAt": number, // epoch millis when the list was created
 *      "items": { "id": number, "item": "base64 encoded list item" }[]
 * }
 */
export function GET(event: APIEvent) {
    const requestedId = event.params["listId"];
    const listRecord = listService.get(requestedId);
    if (listRecord === null) {
        return json("Not found", { status: 404 });
    }

    const items = listService.items(requestedId)!.all();

    return json({
        id: listRecord.id,
        name: Buffer.from(listRecord.name).toString("base64"),
        createdAt: listRecord.createdAt,
        items: items.map(({ id, item }) => ({
            id: id,
            item: Buffer.from(item).toString("base64"),
        })),
    });
}


const RenameSchema = z.object({
    newName: z.base64(),
});

/**
 * Rename a list.
 *
 * PATCH /api/lists/[id]
 * { "newName": "base64 encoded bytes" }
 * H["X-Signature"] = undefined | "base64 ed25519 signature bytes of the newName"
 *
 * 200 - {}
 */
export async function PATCH(event: APIEvent) {
    const id = event.params["id"];
    const body = await new Response(event.request.body).json();
    const parsed = RenameSchema.safeParse(body);
    if (parsed.error) {
        return json(parsed.error, { status: 400 });
    }
    const headerSignature = event.request.headers.get("X-Signature");

    const newName = Buffer.from(parsed.data.newName, "base64");
    const signature = headerSignature !== null
        ? Buffer.from(headerSignature, "base64")
        : null;

    try {
        await listService.rename(id, newName, signature);
        return json({});
    }
    catch (e) {
        return json(e, { status: 400 });
    }
}


/**
 * Deletes a list by its id
 *
 * DELETE /api/lists/[id]
 * H["X-Signature"] = undefined | "base64 encoded signature of the id being deleted"
 *
 * 200 - {}
 */
export async function DELETE(event: APIEvent) {
    const id = event.params["id"];
    const sigHeader = event.request.headers.get("X-Signature");
    const signature = sigHeader === null ? null : Buffer.from(sigHeader, "base64");

    try {
        await listService.delete(id, signature);
        return json({});
    }
    catch (e) {
        // todo better identification of status codes
        return json(e, { status: 400 });
    }
}
