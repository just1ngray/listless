import { BrowseLists } from "~/components/BrowseLists";
import { Card } from "~/components/Card";
import { CreateList } from "~/components/CreateList";
import { WordCycler } from "~/components/WordCycler";


export default function Home() {
  return (
    <main class="flex flex-col gap-2">
      <Card>
        <div class="flex flex-col gap-4">
          <h1 class="text-2xl text-center">Listless</h1>

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
            To get started, create a list below! By using this Listless you agree
            to the <a class="underline" href="/terms">terms of service</a>.
          </p>
        </div>
      </Card>

      <Card>
        <BrowseLists />
      </Card>

      <Card>
        <CreateList />
      </Card>
    </main>
  );
}
