import { A, useLocation } from "@solidjs/router";
import { HiSolidArrowLeft } from "solid-icons/hi";
import { ParentProps } from "solid-js";

import { Card } from "~/components/Card";


export function NavHome(props: ParentProps) {
  const location = useLocation();

  return (
    <div class="flex flex-col gap-2">
      {location.pathname === "/"
        ? null
        : (
          <Card>
            <A href="/" class="font-bold text-2xl flex gap-2 items-center">
              <HiSolidArrowLeft size={24} />
              Listless
            </A>
          </Card>
        )}
      {props.children}
    </div>
  );
}
