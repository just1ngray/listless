import { A } from "@solidjs/router";

import { BrowseLists } from "~/components/BrowseLists";
import { Card } from "~/components/Card";
import { WordCycler } from "~/components/WordCycler";
import { Button } from "~/components/Button";
// @ts-ignore (image resizing is supported by vite-imagetools package)
import listlessLogo from "~/assets/listless.png?w=128&h=128";


export default function Home() {
  return (
    <main class="flex flex-col gap-2">
      <Card>
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-center justify-center">
            <img src={listlessLogo} class="h-8" />
            <h1 class="text-2xl text-center">Listless</h1>
          </div>

          <p>
            Listless is an end-to-end encrypted
            <span class="relative inline-block px-2 text-accent-foreground">
              <span class="absolute inset-0 bg-accent/25 blur rounded-full" />
              <WordCycler words={["list", "reminder", "to do"]} />
            </span>
            app with protected access and no logins.
          </p>

          <p class="text-muted-foreground">
            Share lists with your other devices or friends by giving them a link.
            By using this Listless you agree to the&nbsp;
            <a class="underline" href="/terms">terms of service</a>.
          </p>
        </div>
      </Card>

      <Card>
        <BrowseLists />
      </Card>

      <Card>
        <p class="mb-4">To get started, join or create a list now!</p>

        <div class="flex flex-row justify-evenly">
          <A href="/join">
            <Button col="secondary">Join list</Button>
          </A>
          <A href="/create">
            <Button col="primary">Create new list</Button>
          </A>
        </div>
      </Card>
    </main>
  );
}
