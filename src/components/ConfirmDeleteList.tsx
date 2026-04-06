import * as ed from "@noble/ed25519";

import { Button } from "./Button";
import { getList, removeList } from "~/util/localstorage";
import { fromBase64, toBase64 } from "~/util/buffers";


export function ConfirmDeleteList(props: { id: string }) {1
  async function deleteList(deleteRemote: boolean) {
    const list = getList(props.id);
    if (list === null) {
      throw new Error("List not found");
    }

    if (deleteRemote) {
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
    }

    removeList(list.id);
    window.location.href = "/";
  }

  return (
    <div class="flex flex-col gap-4">
      <p>
        Leaving the list will delete it <i>for you only</i>.
      </p>
      <p>
        Deleting the list will permanently delete the list and all of its items for you and
        anyone else with access to the list.
      </p>
      <div class="flex flex-row justify-evenly">
        <Button col="primary" onClick={async () => await deleteList(false)}>Leave</Button>
        <Button col="secondary" onClick={async () => await deleteList(true)}>Delete</Button>
      </div>
    </div>
  );
}
