import { useNavigate, useParams } from "@solidjs/router";
import { For } from "solid-js";
import { createResource, Suspense } from "solid-js";
import * as ed from "@noble/ed25519";
import {
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineArrowPath,
} from "solid-icons/hi";

import { Card } from "~/components/Card";
import * as e2ekey from "~/util/e2e-encrypt";
import { getList } from "~/util/localstorage";
import { fromBase64, toBase64 } from "~/util/buffers";
import { ItemsService } from "~/listless/items_service";
import { SimpleItem } from "~/components/items/SimpleItem";
import { useModal } from "~/components/Modal";
import { EditListName } from "~/components/EditListName";
import { ConfirmDeleteList } from "~/components/ConfirmDeleteList";
import { ShareList } from "~/components/ShareList";
import { useNotification } from "~/components/NotificationsProvider";


export default function List() {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const modal = useModal();
  const params = useParams();
  const listId = params.listId as string;

  async function fetchList() {
    const localList = getList(listId);
    const cryptokey = localList?.e2e ? await e2ekey.importKey(localList?.e2e) : null;
    let decrypt = (str: string) => Promise.resolve(str);
    if (cryptokey) {
      decrypt = (str: string) => e2ekey.decrypt(str, cryptokey);
    }

    const res = await fetch(`/api/lists/${listId}`);

    if (!res.ok) {
      let msg = await res.text();
      if (res.status === 404) {
        msg = `List with ID '${listId}' not found`;
      }

      notify("error", msg, {});
      navigate("/");
      return;
    }

    const body = await res.json() as {
      id: string,
      name: string,
      createdAt: number,
      items: {
        id: number,
        item: string,
      }[]
    };

    return {
      id: body.id,
      name: await decrypt(atob(body.name)) || "Unnamed list",
      createdAt: body.createdAt,
      items: await Promise.all(
        body.items.map(async ({ id, item }) => ({ id, item: await decrypt(atob(item)) }))
      )
    };
  }

  const [data, { refetch, mutate }] = createResource(async () => await fetchList());

  async function deleteItem(itemId: number) {
    const list = getList(listId)!;

    const headers: Record<string, string> = {};
    if (list.mut !== null) {
      const signature = await ed.signAsync(
        ItemsService.delete_messageToSign(BigInt(itemId)),
        fromBase64(list.mut)
      );
      headers["X-Signature"] = toBase64(signature);
    }

    const res = await fetch(`/api/lists/${listId}/items/${itemId}`, { method: "DELETE", headers });
    if (res.status !== 200) {
      throw new Error(`Could not delete item: ${await res.text()}`);
    }

    mutate(prev => prev && ({
      ...prev,
      items: prev.items.filter(item => item.id != itemId)
    }));
  }

  async function updateItem(itemId: number, item: string) {
    const list = getList(listId)!;

    let itemPayloadStr = btoa(item);
    if (list.e2e !== null) {
      itemPayloadStr = btoa(await e2ekey.encrypt(
        item,
        await e2ekey.importKey(list.e2e),
      ));
    }
    const itemPayload = fromBase64(itemPayloadStr);

    const headers: Record<string, string> = {};
    if (list.mut !== null) {
      const signature = await ed.signAsync(
        ItemsService.set_messageToSign(BigInt(itemId), itemPayload),
        fromBase64(list.mut)
      );
      headers["X-Signature"] = toBase64(signature);
    }

    const res = await fetch(`/api/lists/${listId}/items/${itemId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        item: itemPayloadStr,
      }),
    });
    if (res.status !== 200) {
      throw new Error(`Could not update item: ${await res.text()}`);
    }

    mutate(prev => prev && ({
      ...prev,
      items: prev.items.map(i => ({ id: i.id, item: i.id == itemId ? item : i.item }))
    }));
  }

  async function addItem(item: string) {
    const list = getList(listId)!;

    let itemPayloadStr = btoa(item);
    if (list.e2e !== null) {
      itemPayloadStr = btoa(await e2ekey.encrypt(
        item,
        await e2ekey.importKey(list.e2e),
      ));
    }
    const itemPayload = fromBase64(itemPayloadStr);

    const headers: Record<string, string> = {};
    if (list.mut !== null) {
      const signature = await ed.signAsync(
        itemPayload,
        fromBase64(list.mut)
      );
      headers["X-Signature"] = toBase64(signature);
    }

    const res = await fetch(`/api/lists/${listId}/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        item: itemPayloadStr,
      }),
    });
    if (res.status !== 200) {
      throw new Error(`Could not update item: ${await res.text()}`);
    }
    const json = await res.json() as { itemId: number };

    mutate(prev => prev && ({
      ...prev,
      items: [
        ...prev.items,
        { id: json.itemId, item }
      ]
    }));
  }

  return (
    <Card>
      <Suspense fallback={<p>Loading...</p>}>

        <div class="flex flex-row items-items-start justify-between">
          <h1 class="text-2xl">{data()?.name}</h1>
          <div class="flex flex-row gap-2">
            <HiOutlineArrowPath
              size={20}
              class="cursor-pointer"
              onClick={refetch}
            />
            <HiOutlinePencilSquare
              size={20}
              class="cursor-pointer"
              onClick={() => modal.display(
                "Edit list name",
                () => <EditListName currentName={data()!.name} id={listId} />
              )}
            />
            <HiOutlineShare
              size={20}
              class="cursor-pointer"
              onClick={() => modal.display(
                "Share list",
                () => <ShareList id={listId} />
              )}
            />
            <HiOutlineTrash
              size={20}
              class="cursor-pointer"
              onClick={() => modal.display(
                `Delete '${data()?.name}'`,
                () => <ConfirmDeleteList id={listId} />
              )}
            />
          </div>
        </div>

        <For each={data()?.items}>
          {item => (
            <div class="bg-background p-2 my-1 rounded-md border border-border border-dashed">
              <SimpleItem
                text={item.item}
                del={() => deleteItem(item.id)}
                set={(newVal) => updateItem(item.id, newVal)}
              />
            </div>
          )}
        </For>

        <div class="bg-background p-2 my-1 rounded-md border border-border border-dashed">
          <div class="flex flex-row items-center gap-2">
            <div>Add item</div>
            <div class="grow border-b border-border">
              <SimpleItem
                text={""}
                del={() => Promise.resolve()}
                set={(newVal) => addItem(newVal)}
              />
            </div>
          </div>
        </div>

      </Suspense>
    </Card>
  );
}
