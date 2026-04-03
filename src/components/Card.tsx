import type { ParentProps } from "solid-js";


export function Card(props: ParentProps) {
  return (
    <div class="bg-surface border border-border rounded-xl p-6 shadow-md">
      {props.children}
    </div>
  );
}
