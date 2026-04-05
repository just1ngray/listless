import { A } from "@solidjs/router";
import { HiSolidArrowLeft } from "solid-icons/hi";

import { Card } from "~/components/Card";


export function HomeHeader() {
  return (
    <Card>
      <A href="/" class="font-bold text-2xl flex gap-2 items-center">
        <HiSolidArrowLeft size={24} />
        Listless
      </A>
    </Card>
  );
}
