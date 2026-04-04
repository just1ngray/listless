import { useNavigate, useParams, A, useLocation } from "@solidjs/router";
import { onMount } from "solid-js";
import { Card } from "~/components/Card";

import { addList } from "~/util/localstorage";


export default function Import() {
  const navigate = useNavigate();
  const location = useLocation<{ hash: string }>();
  const params = useParams();
  const listId = params.listId as string;

  onMount(() => {
    // grab the list's e2e/mut keys from the hash part of the url
    // route 1: from 'CreateList'
    //          the url lags behind mounting the component so we pass the 'state' with the navigate
    // route 2: from a link entered into the browser (e.g., sharing a list)
    //          we have no state and instead can grab these keys from window.location.hash properly
    let details: string;
    if (location.state && location.state.hash !== undefined) {
      details = location.state.hash;
    }
    else {
      details = (window.location.hash || "#").slice(1);
    }

    const search = new URLSearchParams(details);
    const e2ekey = search.get("e2e");
    const mutkey = search.get("mut");

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
        <div class="mt-2">
          You will be redirected to the list in a moment. Or click <A class="underline" href={`/${listId}`}>here</A>
        </div>
      </Card>
    </div>
  );
}
