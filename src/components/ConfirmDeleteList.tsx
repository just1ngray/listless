import * as ed from "@noble/ed25519";

import { Button } from "./Button";
import { getList } from "~/util/localstorage";
import { fromBase64, toBase64 } from "~/util/buffers";


export function ConfirmDeleteList(props: { id: string }) {1
  async function submit(e: SubmitEvent) {
    e.preventDefault();

    const list = getList(props.id);
    if (list === null) {
      throw new Error("List not found");
    }

    const headers: Record<string, string> = {};
    if (list.mut !== null) {
      const signature = await ed.signAsync(
        new TextEncoder().encode(props.id),
        fromBase64(list.mut)
      );
      headers["X-Signature"] = toBase64(signature);
    }

    const res = await fetch(`/api/lists/${props.id}`, { method: "DELETE", headers });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }

    window.location.href = "/";
  }

  return (
    <form onSubmit={submit} class="flex flex-col">
      <p>
        This will permanently delete the list and all of its items for you and anyone else with access to the list.
      </p>
      <div class="text-center my-2">
        <Button type="submit" col="primary">Permanently Delete</Button>
      </div>
    </form>
  );
}
