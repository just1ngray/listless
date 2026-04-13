import { createContext, useContext, createSignal, For, Show } from "solid-js";
import { HiOutlineXMark } from "solid-icons/hi";


type Toast = {
  time: number,
  messages: string[],
  type: ToastTypes,
  duration: number,
};

type ToastTypes = "success" | "error" | "warn";

const NotificationContext = createContext <{
  notify: (type: ToastTypes, msg: string | string[], opts: { closeTimeout?: number }) => void
}>();

export function NotificationProvider(props: { children: any }) {
  const [toasts, setToasts] = createSignal<Toast[]>([]);

  function showToast(type: ToastTypes, msg: string | string[], opts: { closeTimeout?: number } = {}) {
    const timeout = opts.closeTimeout !== undefined
      ? opts.closeTimeout
      : {
        "success": 5_000,
        "warn": 7_500,
        "error": 10_000,
      }[type];

    const time = Date.now()
    const messages = typeof msg === "string" ? [msg] : msg;
    setToasts(t => [...t, { time, messages, type, duration: timeout }]);

    if (timeout >= 0) {
      setTimeout(() => {
        setToasts(current => current.filter(t => t.time !== time));
      }, timeout);
    }
  }

  return (
    <NotificationContext.Provider value={{ notify: showToast }}>
      {props.children}

      <div class="fixed bottom-8 right-8 z-10 flex flex-col items-end max-w-3/4">
        <For each={toasts().reverse()}>
          {(toast) => (
            <div
              onClick={() => setToasts(current => current.filter(t => t.time !== toast.time))}
              class={`
                relative w-fit max-w-fit cursor-pointer p-4 my-2 rounded-xl shadow-2xl text-white font-bold overflow-hidden
                ${{
                  "error": "bg-error",
                  "success": "bg-success",
                  "warn": "bg-amber-600",
                }[toast.type]}
              `}
            >
              <div class="flex flex-row justify-between items-center">
                <div class="font-bold text-xs opacity-60">{toast.type.toUpperCase()}</div>
                <HiOutlineXMark size={24} />
              </div>
              <For each={toast.messages}>
                {message => <p>{message}</p>}
              </For>

              <Show when={toast.duration > 0}>
                <div
                  class="absolute bottom-0 left-0 h-2 bg-white/40 animate-progress"
                  style={{
                    "--animate-progress": `${toast.duration}ms`,
                  }}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext)!;
