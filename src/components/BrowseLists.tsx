import { For, Suspense } from "solid-js";
import { createSignal, onMount } from "solid-js";

import { getLists, removeList } from "~/util/localstorage";
import * as e2ekey from "~/util/e2e-encrypt";
import { A } from "@solidjs/router";


export function BrowseLists() {
  const [lists, setLists] = createSignal<undefined | { id: string, name: string, size: number }[]>(undefined);

  onMount(async () => {
    const localstorageLists = getLists();

    const fetched = [];
    for (const list of localstorageLists) {
      const res = await fetch(`/api/lists/${list.id}`);
      if (res.status !== 200) {
        console.log(await res.text());
        removeList(list.id);
        continue;
      }

      const json = await res.json() as {
          id: string,
          name: string,
          createdAt: number,
          items: { id: number, item: string }[],
      };

      let name = atob(json.name);
      if (list.e2e !== null) {
        const key = await e2ekey.importKey(list.e2e);
        name = await e2ekey.decrypt(name, key);
      }

      fetched.push({
        id: json.id,
        size: json.items.length,
        name: name || "Unnamed list",
      });
    }

    setLists(fetched);
  });

  return (
    <div>
      <h2 class="text-xl p-2">Lists</h2>

      <Suspense fallback="Loading...">
        <For each={lists()} fallback={<p class="text-muted-foreground text-sm">No lists</p>}>
          {list => (
            <A href={`/${list.id}`}
              class="
                flex flex-row items-center gap-2
              bg-background
                p-2 my-1
                rounded-md border border-border border-dashed
                hover:bg-muted
              "
            >
              <div>{list.name}</div>
              <div class="text-muted-foreground text-sm">({list.size})</div>
            </A>
          )}
        </For>
      </Suspense>
    </div>
  );
}
