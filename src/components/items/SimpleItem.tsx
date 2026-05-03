import { createSignal, Show } from "solid-js";
import { HiOutlineArrowUturnLeft, HiOutlineCheck, HiOutlineTrash } from "solid-icons/hi";

import { Button } from "../Button";


export function SimpleItem(props: {
  text: string,
  del: null | (() => Promise<void>),
  set: (newVal: string) => Promise<void>,
}) {
  const [val, setVal] = createSignal<string>(props.text);

  async function submit(e: SubmitEvent) {
    e.preventDefault();

    const value = val();
    if (value.length === 0) {
      await props.del();
    }
    else {
      await props.set(value);
    }

    setVal(props.text);
  }

  function reset(e: Event & { currentTarget: HTMLFormElement }) {
    e.preventDefault();
    setVal(props.text);
  }

  return (
    <form onSubmit={submit} onReset={reset} class="relative">
      <div class="flex flex-row items-center">
        <Show when={props.del}>
          <button
            type="button"
            onClick={async () => await props.del!()}
            class="w-8 h-8 rounded-full border-2 border-border bg-muted cursor-pointer"
          />
        </Show>

        <input
          value={val()}
          onInput={e => setVal(e.currentTarget.value)}
          class="w-0 grow p-2 border-0 focus:outline-none focus:ring-0"
        />

        <Show when={val() !== props.text}>
          <Show when={props.text.length > 0}>
            <Button type="reset" col="secondary" narrow>
              <HiOutlineArrowUturnLeft />
            </Button>
          </Show>
          <Button type="submit" col="primary" narrow>
            {val().length === 0
              ? <HiOutlineTrash />
              : <HiOutlineCheck />
            }
          </Button>
        </Show>
      </div>
    </form>
  );
}
