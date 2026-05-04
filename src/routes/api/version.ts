import type { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";


/**
 * Returns the current version of the built application
 */
export async function GET(event: APIEvent) {
    return json(__LISTLESS_VERSION__);
}
