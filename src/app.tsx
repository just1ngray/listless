import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";


export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Listless</Title>
          <Meta name="description" content="E2e encrypted no login list app that supports protected lists and multi-client syncing" />

          <div class="min-h-dvh bg-background text-foreground flex flex-col font-sans">
            <Suspense>{props.children}</Suspense>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
