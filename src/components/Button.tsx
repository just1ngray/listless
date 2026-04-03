import type { ParentProps } from "solid-js";

export function Button(props: ParentProps & {
  col: "primary" | "secondary" | "highlight" | "muted",
  disabled?: boolean,
  type?: "reset" | "submit" | "button" | "menu" | undefined,
  onClick?: () => {},
}) {
  const col = () => ({
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    highlight: "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(217,70,239,0.3)]",
    muted: "bg-muted text-muted-foreground",
  }[props.col]);

  return (
    <button type={props.type} disabled={props.disabled} onClick={props.onClick}
      class={`
        ${col()}
        px-5 py-2.5 rounded-md transition
        ${props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}
      `}
    >
      {props.children}
    </button>
  );
}
