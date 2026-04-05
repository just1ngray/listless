import { createSignal, onCleanup, For } from "solid-js";


export function WordCycler(props: { words: string[]; interval?: number }) {
  const [index, setIndex] = createSignal(0);

  const timer = setInterval(() => {
    setIndex((i) => (i + 1) % props.words.length);
  }, props.interval ?? 2000);

  onCleanup(() => clearInterval(timer));

  return (
    <span
      class="inline-grid text-center"
    >
      <For each={props.words}>
        {(word, i) => (
          <span
            class={`
              col-start-1 row-start-1 transition-opacity duration-500 ease-in-out
              ${index() === i() ? "opacity-100" : "opacity-0"}
            `}
            aria-hidden={index() !== i()}
          >
            {word}
          </span>
        )}
      </For>
    </span>
  );
}
