import { A, useLocation } from "@solidjs/router";
import { HiSolidArrowLeft } from "solid-icons/hi";
import { createResource, Match, ParentProps, Switch } from "solid-js";

import { Card } from "~/components/Card";
// @ts-ignore (image resizing is supported by vite-imagetools package)
import listlessLogo from "~/assets/listless.png?w=64&h=64";


async function getServerVersion(): Promise<ServerVersion> {
  const res = await fetch("/api/version", { method: "GET" });
  if (!res.ok) {
    return {
      status: "unknown",
      reason: await res.text(),
    };
  }
  const ver = await res.json() as unknown as string;
  return {
    status: "ok",
    version: ver,
  };
}

type ServerVersion = { status: "pending" } | { status: "unknown", reason: string } | { status: "ok", version: string };

export function NavHome(props: ParentProps) {
  const location = useLocation();
  const [serverVersion] = createResource<ServerVersion>(getServerVersion, {
    initialValue: { status: "pending" }
  });

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

      <div class="text-muted-foreground text-xs">
        <Switch>
          <Match when={serverVersion().status == "pending"}>
            Client version {__LISTLESS_VERSION__}
          </Match>
          <Match when={serverVersion().status == "unknown"}>
            Client version {__LISTLESS_VERSION__} (server is unreachable)
          </Match>
          <Match when={serverVersion().status == "ok"}>
            {__LISTLESS_VERSION__ === serverVersion().version
              ? `Version ${__LISTLESS_VERSION__}`
              : `Running old version ${__LISTLESS_VERSION__} when ${serverVersion().version} is available`
            }
          </Match>
        </Switch>
      </div>
    </div>
  );
}
