import { BrowseLists } from "~/components/BrowseLists";
import { Card } from "~/components/Card";
import { CreateList } from "~/components/CreateList";


export default function Home() {
  return (
    <main class="flex flex-col gap-2">
      <Card>
        <BrowseLists />
      </Card>

      <Card>
        <CreateList />
      </Card>
    </main>
  );
}
