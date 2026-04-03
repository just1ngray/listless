import { HiSolidBars3 } from "solid-icons/hi";
import { Card } from "~/components/Card";
import { CreateList } from "~/components/CreateList";


export default function Home() {
  return (
    <div>

      <header class="bg-surface border-b border-border p-4 shadow-sm flex items-center justify-between">
        <div class="font-bold text-2xl flex gap-2 items-center">
          <HiSolidBars3 size={32} />
          Listless
        </div>
      </header>

      <main class="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
        <Card>
          <CreateList />
        </Card>
      </main>

    </div>
  );
}
