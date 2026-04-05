import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { ModalProvider } from "./components/Modal";


export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Listless</Title>
          <Meta name="description" content="E2e encrypted no login list app that supports protected lists and multi-client syncing" />

          <div class="min-h-dvh bg-background text-foreground flex justify-center">
            <div class="w-full max-w-md p-2 font-sans">
              <ModalProvider>
                <Suspense>{props.children}</Suspense>
              </ModalProvider>
            </div>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
