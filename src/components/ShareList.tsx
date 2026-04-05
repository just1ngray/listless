import { createEffect, createSignal } from "solid-js";

import { getList } from "~/util/localstorage";
import { CopyBox } from "./CopyBox";
import { Show } from "solid-js";


export function ShareList(props: { id: string }) {
  const [e2ekey, setE2eKey] = createSignal<null | string>(null);
  const [mutkey, setMutkey] = createSignal<null | string>(null);

  createEffect(() => {
    const list = getList(props.id);
    if (list === null) {
      throw new Error("List not found");
    }
    setE2eKey(list.e2e);
    setMutkey(list.mut);
  });

  const rw = () => {
    const params = new URLSearchParams();
    if (e2ekey()) {
      params.append("e2e", e2ekey()!);
    }
    if (mutkey()) {
      params.append("mut", mutkey()!);
    }
    return `${window.location.origin}/join/${props.id}#${params.toString()}`;
  };

  const ro = () => {
    const params = new URLSearchParams();
    if (e2ekey()) {
      params.append("e2e", e2ekey()!);
    }
    return `${window.location.origin}/join/${props.id}#${params.toString()}`;
  };

  return (
    <div class="flex flex-col gap-4">
      <p class="text-muted-foreground text-xs">
        Lists can be shared among devices using the <u>full</u> links below.
      </p>

      <Show when={ro() && ro() !== rw()}>
        <div>
          <p>Share link to view the list</p>
          <CopyBox text={ro()!} />
        </div>
      </Show>

      <Show when={rw()}>
        <div>
          <p>Share link to view and edit the list</p>
          <CopyBox text={rw()!} />
        </div>
      </Show>
    </div>
  );
}
