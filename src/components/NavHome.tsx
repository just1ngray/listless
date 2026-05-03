import { A, useLocation } from "@solidjs/router";
import { HiSolidArrowLeft } from "solid-icons/hi";
import { ParentProps } from "solid-js";

import { Card } from "~/components/Card";
// @ts-ignore (image resizing is supported by vite-imagetools package)
import listlessLogo from "~/assets/listless.png?w=64&h=64";


export function NavHome(props: ParentProps) {
  const location = useLocation();

  return (
    <div class="flex flex-col gap-2">
      {location.pathname === "/"
        ? null
        : (
          <Card>
            <div class="flex flex-row justify-between">
              <A href="/" class="text-2xl flex gap-2 items-center">
                <HiSolidArrowLeft size={24} />
                Listless
              </A>
              <img src={listlessLogo} class="h-8" />
            </div>
          </Card>
        )}
      {props.children}
    </div>
  );
}
