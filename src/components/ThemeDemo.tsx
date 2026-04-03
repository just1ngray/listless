import { Button } from "./Button";
import { Card } from "./Card";


export default function Theme() {
  return (
    <div class="min-h-dvh bg-background text-foreground flex flex-col font-sans">

      {/* Structural Elements: Header using Surface and Border */}
      <header class="bg-surface border-b border-border p-4 shadow-sm flex items-center justify-between">
        <div class="font-bold text-lg flex gap-2 items-center">
          <div class="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          My Solid App
        </div>
        {/* Nav placeholder text using muted colors */}
        <span class="text-muted-foreground text-sm">Navigation Area</span>
      </header>

      <main class="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">

        {/* Structural Elements: Card using Surface and Border */}
        <Card>
          <h2 class="text-2xl font-semibold mb-1">UI Components</h2>

          {/* Secondary/Muted: Subtitle text */}
          <p class="text-muted-foreground mb-6">
            Testing the semantic color palette across different elements.
          </p>

          <div class="flex flex-wrap gap-4 mb-8 border-b border-border pb-8">
            <Button col="primary">Primary Button</Button>
            <Button col="secondary">Secondary Button</Button>
            <Button col="highlight">Accent Highlight</Button>
            <Button col="muted">Muted Button</Button>

            <Button col="primary" disabled>DISABLED Primary</Button>
            <Button col="secondary" disabled>DISABLED Secondary</Button>
            <Button col="highlight" disabled>DISABLED Accent</Button>
            <Button col="muted" disabled>DISABLED Muted</Button>
          </div>

          {/* System States */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 border-l-4 border-error bg-background rounded-r-md">
              <p class="font-semibold text-error mb-1">Error State</p>
              <p class="text-sm text-muted-foreground">Unable to connect to the server.</p>
            </div>

            <div class="p-4 border-l-4 border-success bg-background rounded-r-md">
              <p class="font-semibold text-success mb-1">Success State</p>
              <p class="text-sm text-muted-foreground">Changes saved to the database.</p>
            </div>
          </div>
        </Card>

      </main>
    </div>
  );
}
