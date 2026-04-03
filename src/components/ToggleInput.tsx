import { Show } from "solid-js"


export function ToggleInput(props: {
  label?: string,
  value: boolean,
  toggle?: () => {},
  name?: string,
}) {
  function toggle() {
    if (props.toggle !== undefined) {
      props.toggle();
    }
  }

  return (
    <div>
      <Show when={props.name}>
        <input type="hidden" name={props.name} value={props.value ? "true" : "false"} />
      </Show>

      <div onClick={toggle} class="cursor-pointer flex flex-row items-center gap-2">
        <button
          type="button"
          role="switch"
          class={`
            relative inline-flex h-6 w-11 shrink-0 pointer-events-none rounded-full border border-border
            transition-colors duration-200
            ${props.value ? "bg-primary" : "bg-muted"}
          `}
        >
          <span class={`
            inline-block h-5 w-5 rounded-full bg-foreground shadow
            transition-transform duration-200 mt-[1px]
            ${props.value ? "translate-x-[21px]" : "translate-x-[1px]"}
          `} />
        </button>

        <Show when={props.label}>
          <span class="text-base text-muted-foreground">{props.label}</span>
        </Show>
      </div>
    </div>
  )
}
