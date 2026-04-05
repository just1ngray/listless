import { createSignal } from "solid-js";
import * as ed from "@noble/ed25519";

import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { ToggleInput } from "./ToggleInput";
import * as e2ekey from "~/util/e2e-encrypt";
import { useNavigate } from "@solidjs/router";
import { toBase64 } from "~/util/buffers";


export function CreateList() {
  const [name, setName] = createSignal<string>("");
  const [e2e, setE2e] = createSignal(true);
  const [auth, setAuth] = createSignal(true);
  const [creatingFlag, setCreatingFlag] = createSignal(false);
  const navigate = useNavigate();

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    setCreatingFlag(true);

    const redirect = new URLSearchParams();

    let listE2eKey: CryptoKey | null = null;
    let reqName = name() || `New list (${new Date().toLocaleDateString()})`;
    if (e2e()) {
      listE2eKey = await e2ekey.generateKey();
      reqName = await e2ekey.encrypt(reqName, listE2eKey);
      redirect.append("e2e", await e2ekey.exportKey(listE2eKey));
    }

    let listMutKeyPriv: ed.Bytes | null = null;
    let listMutKeyPub: undefined | string = undefined;
    if (auth()) {
      listMutKeyPriv = ed.utils.randomSecretKey();
      const pub = await ed.getPublicKeyAsync(listMutKeyPriv);
      listMutKeyPub = toBase64(pub);
      redirect.append("mut", toBase64(listMutKeyPriv));
    }

    const res = await fetch("/api/lists", {
      method: "POST",
      body: JSON.stringify({
        name: btoa(reqName),
        mutkey: listMutKeyPub,
      })
    });

    if (res.status !== 200) {
      alert(await res.text());
      setCreatingFlag(false);
      return;
    }

    const body = await res.json() as any as { listId: string };

    navigate(`/join/${body.listId}#${redirect.toString()}`, {
      state: { hash: redirect.toString() }
    });
  }

  return (
    <div>
      <h1 class="text-xl">Create a New List</h1>

      <form onSubmit={onSubmit}>
        <TextInput label="List name" maxlen={64} value={name()} onInput={n => setName(n)} />

        <div class="my-2 py-2 px-4 border-2 border-border rounded border-dashed flex flex-col gap-2">
          <h3 class="text-lg">Advanced Settings</h3>
          <p class="text-muted-foreground text-sm mb-2">These settings cannot be changed later</p>
          <ToggleInput
            label="Use end-to-end encryption to prevent others from reading the list"
            value={e2e()}
            toggle={() => setE2e(!e2e())}
          />
          <ToggleInput
            label="Prevent others from changing the list without special access"
            value={auth()}
            toggle={() => setAuth(!auth())}
          />
        </div>

        <div class="text-center">
          <Button col="primary" type="submit" disabled={creatingFlag()}>Create List</Button>
        </div>
      </form>

    </div>
  );
}
