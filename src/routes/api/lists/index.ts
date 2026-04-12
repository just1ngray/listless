import type { APIEvent } from "@solidjs/start/server";
import { CustomResponse, json } from "@solidjs/router";
import { z } from "zod";

import { listService } from "~/listless";


const PostListRequestSchema = z.object({
    name: z.base64(),
    mutkey: z.base64().optional(),
});

export type PostListRequest = z.infer<typeof PostListRequestSchema>;

type PostListOk = {
    listId: string,
};

type PostListError = {
    error: any,
};

export type PostListResponse = PostListOk | PostListError;

/**
 * POST /api/lists
 * {
 *      "name": "base64 encoded bytes",
 *      "mutkey": undefined | "base64 encoded ed25519 public key for verifying future changes"
 * }
 */
export async function POST(event: APIEvent): Promise<CustomResponse<PostListResponse>> {
    const body = await new Response(event.request.body).json();
    const parsed = PostListRequestSchema.safeParse(body);
    if (parsed.error) {
        return json({ error: parsed.error }, { status: 400 });
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
        return json({ error: e }, { status: 400 });
    }
}
