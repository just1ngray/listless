import { useNavigate, A, useLocation, useSearchParams } from "@solidjs/router";
import { onMount, createSignal } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { TextInput } from "~/components/TextInput";

import { addList } from "~/util/localstorage";


export default function Join() {
  const [joinLink, setJoinLink] = createSignal("");
  const location = useLocation<{ hash: string }>();
  const navigate = useNavigate();

  onMount(() => {
    // grab the list's e2e/mut keys from the hash part of the url
    // route 1: from 'CreateList'
    //          the url lags behind mounting the component so we pass the 'state' with the navigate
    // route 2: from a link entered into the browser (e.g., sharing a list)
    //          we have no state and instead can grab these keys from window.location.hash properly
    let hash: string;
    if (location.state && location.state.hash !== undefined) {
      hash = location.state.hash;
    }
    else {
      hash = (window.location.hash || "#").slice(1);
    }

    if (hash.length > 0) {
      const fullLink = `${window.location.origin}/join#${hash}`;
      setJoinLink(fullLink);
      join(null);
    }
  });

  function join(e: SubmitEvent | null) {
    if (e) {
      e.preventDefault();
    }

    const url = new URL(joinLink());
    const search = new URLSearchParams(url.hash.slice(1));
    const e2ekey = search.get("e2e");
    const mutkey = search.get("mut");
    const listId = search.get("listId");

    if (listId === null) {
      throw new Error("Cannot join null list id");
    }

    addList({
      id: listId,
      e2e: e2ekey,
      mut: mutkey,
    });
    navigate(`/lists/${listId}`);
  }

  return (
    <Card>
      <form onSubmit={join} class="flex flex-col gap-2">
        <div class="text-xl">
          Join list
        </div>

        <p class="text-muted-foreground">
          Copy and paste a <u>full</u> share link to join a list.
        </p>

        <TextInput
          value={joinLink()}
          onInput={link => setJoinLink(link)}
          label="Join link"
        />

        <div class="flex flex-row justify-center">
          <Button col="primary" type="submit" disabled={joinLink().length === 0}>
            Join
          </Button>
        </div>

      </form>
    </Card>
  );
}
