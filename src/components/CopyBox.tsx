import { createSignal } from "solid-js";
import { HiOutlineClipboardDocument, HiOutlineClipboardDocumentCheck } from "solid-icons/hi";
import { Match } from "solid-js";
import { Switch } from "solid-js";


export function CopyBox(props: { text: string }) {
  const [copied, setCopied] = createSignal(false);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(props.text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div class="
      border border-border rounded-md bg-secondary
      p-2 flex flex-row justify-between gap-2
    ">
      <a class="text-nowrap overflow-x-scroll font-mono tracking-tighter text-secondary-foreground">
        {props.text}
      </a>
      <button onClick={copyToClipboard} class="flex flex-row items-center cursor-pointer text-muted-foreground text-sm">
        <Switch>
          <Match when={!!copied()}>
            <HiOutlineClipboardDocumentCheck size={18} />
            Copied
          </Match>
          <Match when={!copied()}>
            <HiOutlineClipboardDocument size={18} />
            Copy
          </Match>
        </Switch>
      </button>
    </div>
  );
}
