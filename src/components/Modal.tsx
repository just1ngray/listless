import { createContext, createSignal, JSX, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { HiOutlineXMark } from "solid-icons/hi";

import { Card } from "./Card";

type ModalContextType = {
  display: (title: string, component: () => JSX.Element) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType>();

export function ModalProvider(props: { children: JSX.Element }) {
  const [content, setContent] = createSignal<() => JSX.Element>(() => null);
  const [title, setTitle] = createSignal("");

  function display(title: string, component: () => JSX.Element) {
    setContent(_ => component);
    setTitle(title);
  }

  function close() {
    setContent(_ => () => null);
  }

  return (
    <ModalContext.Provider value={{ display, close }}>
      {props.children}
      <Portal>
        <Show when={content()()}>
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={close}
          >
            <div onClick={e => e.stopPropagation()} class="p-2">
              <Card>
                <div class="flex flex-row justify-between pb-4 mb-4 gap-4 border-b border-border">
                  <h1 class="text-2xl">{title()}</h1>
                  <HiOutlineXMark size={32} class="cursor-pointer" onClick={close} />
                </div>
                {content()()}
              </Card>
            </div>
          </div>
        </Show>
      </Portal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
