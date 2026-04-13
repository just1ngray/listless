import * as ed from "@noble/ed25519";

import { Button } from "./Button";
import { getList, removeList } from "~/util/localstorage";
import { fromBase64, toBase64 } from "~/util/buffers";
import { useNotification } from "~/components/NotificationsProvider";
import { useNavigate } from "@solidjs/router";
import { useModal } from "./Modal";


export function ConfirmDeleteList(props: { id: string }) {
  const modal = useModal();
  const { notify } = useNotification();
  const navigate = useNavigate();

  async function deleteList(deleteRemote: boolean) {
    // while technically this component doesn't care whether it's displayed in a modal or not,
    // this happens to be the quickest implementation for the only use-case we actually use...
    modal.close();

    const list = getList(props.id);
    if (list === null) {
      removeList(props.id);
      notify("warn", "List does not exist", {});
      return;
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
        notify("error", await res.text(), {});
        return;
      }
      notify("success", "Deleted list!", {});
    }
    else {
      notify("success", [
        "Left list!",
        "You can rejoin later with a share link"
      ], {});
    }

    removeList(list.id);
    navigate("/");
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
