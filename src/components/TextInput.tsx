import { Show } from "solid-js"


export function TextInput(props: {
  label?: string,
  value: string,
  onInput?: (value: string) => {}
  maxlen?: number,
  name?: string,
}) {
  function onInput(e: InputEvent & { currentTarget: HTMLInputElement; target: Element }) {
    const value = e.currentTarget.value;
    if (props.onInput !== undefined) {
      props.onInput(value);
    }
  }

  return (
    <div class="relative mt-6">
      <input
        class="peer bg-background border border-border rounded-md px-3 py-2.5 w-full
               text-foreground placeholder-transparent outline-none
               focus:border-primary transition-colors"
        type="text"
        id={props.label}
        maxlength={props.maxlen}
        value={props.value || ""}
        onInput={onInput}
        placeholder=" "
        name={props.name}
      />

      <Show when={props.label}>
        <label
          for={props.label}
          class="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground
                 bg-background rounded px-1 pointer-events-none transition-all
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-primary
                 peer-[:not(:placeholder-shown)]:top-0
                 peer-[:not(:placeholder-shown)]:text-sm"
        >
          {props.label}
        </label>
      </Show>

      <Show when={props.maxlen}>
        <span class={`
            absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none
            ${props.value.length < props.maxlen! ? "text-muted-foreground" : "text-error animate-pulse"}
          `}
          style={{ "animation-duration": "1s" }}
        >
          {props.value.length}/{props.maxlen}
        </span>
      </Show>
    </div>
  );
}
