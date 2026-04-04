import { useParams } from "@solidjs/router";
import { For } from "solid-js";
import { createResource, Suspense } from "solid-js";

import { Card } from "~/components/Card";
import * as e2ekey from "~/util/e2e-encrypt";
import { getList } from "~/util/localstorage";


async function fetchList(listId: string) {
  const localList = getList(listId);
  const cryptokey = localList?.e2e ? await e2ekey.importKey(localList?.e2e) : null;
  let decrypt = (str: string) => Promise.resolve(str);
  if (cryptokey) {
    decrypt = (str: string) => e2ekey.decrypt(str, cryptokey);
  }

  const res = await fetch(`/api/lists/${listId}`);

  if (res.status !== 200) {
    alert(await res.text());
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
    name: await decrypt(atob(body.name)),
    createdAt: body.createdAt,
    items: await Promise.all(
      body.items.map(async ({ id, item }) => ({ id, item: await decrypt(atob(item)) }))
    )
  };
}

export default function List() {
  const params = useParams();
  const listId = params.listId as string;

  const [data] = createResource(async () => await fetchList(listId), {
    initialValue: undefined,
  });

  return (
    <Card>
      <Suspense fallback={<p>Loading...</p>}>
        <h1 class="text-2xl">{data()?.name}</h1>

        <For each={data()?.items}>
          {item => <p>{item.item}</p>}
        </For>
      </Suspense>
    </Card>
  );
}
