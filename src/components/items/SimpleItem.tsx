import { createSignal, Show } from "solid-js";
import { Button } from "../Button";


export function SimpleItem(props: {
  text: string,
  del: () => Promise<void>,
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
        <span
          onClick={async () => await props.del()}
          class="w-6 h-6 mx-1 rounded-full border-2 border-border bg-muted cursor-pointer"
        />

        <input
          value={val()}
          onInput={e => setVal(e.currentTarget.value)}
          class="w-0 grow p-2 border-0 focus:outline-none focus:ring-0"
        />
      </div>

      <Show when={val() !== props.text}>
        <span class="absolute top-0 right-0">
          <Show when={props.text.length > 0}>
            <Button type="reset" col="secondary">
              Undo
            </Button>
          </Show>
          <Button type="submit" col="primary">
            {val().length === 0 ? "Delete" : "Save"}
          </Button>
        </span>
      </Show>
    </form>
  );
}
