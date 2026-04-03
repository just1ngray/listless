import { useNavigate, useParams, A } from "@solidjs/router";
import { onMount } from "solid-js";
import { Card } from "~/components/Card";

import { addList } from "~/util/localstorage";


export default function Import() {
  const navigate = useNavigate();
  const params = useParams();
  const listId = params.listId as string;

  onMount(() => {
    const details = (window.location.hash || "#").slice(1);
    const params = new URLSearchParams(details);
    const e2ekey = params.get("e2e");
    const mutkey = params.get("mut");

    addList({
      id: listId,
      e2e: e2ekey,
      mut: mutkey,
    });

    navigate(`/${listId}`);
  });

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <Card>
        <div class="text-xl">
          Importing list <span class="font-mono border border-border rounded p-1">{listId}</span>...
        </div>
        <div>
          You will be redirected to the list shortly. Or click <A class="underline" href={`/${listId}`}>here</A>
        </div>
      </Card>
    </div>
  );
}
