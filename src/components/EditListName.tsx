import { createSignal } from "solid-js";
import * as ed from "@noble/ed25519";

import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { getList } from "~/util/localstorage";
import * as e2ekey from "~/util/e2e-encrypt";
import { fromBase64, toBase64 } from "~/util/buffers";


export function EditListName(props: { currentName: string, id: string }) {
  const [name, setName] = createSignal(props.currentName);

  async function submit(e: SubmitEvent) {
    e.preventDefault();

    const list = getList(props.id);
    if (list === null) {
      throw new Error("List not found");
    }

    let newNameEncrypted = btoa(name());
    if (list.e2e !== null) {
      newNameEncrypted = btoa(await e2ekey.encrypt(
        name(),
        await e2ekey.importKey(list.e2e),
      ));
    }
    const newNamePayload = fromBase64(newNameEncrypted);

    const headers: Record<string, string> = {};
    if (list.mut !== null) {
      const signature = await ed.signAsync(newNamePayload, fromBase64(list.mut));
      headers["X-Signature"] = toBase64(signature);
    }

    const res = await fetch(`/api/lists/${props.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ newName: newNameEncrypted }),
    });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }

    location.reload();
  }

  return (
    <form onSubmit={submit} class="flex flex-col">
      <div class="">
        <TextInput
          value={name()}
          onInput={val => setName(val)}
          label="New list name" maxlen={32}
        />
      </div>

      <div class="text-center my-2">
        <Button type="submit" col="primary">Rename</Button>
      </div>
    </form>
  );
}
