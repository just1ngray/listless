import { Card } from "~/components/Card";


export default function NotFound() {
  return (
    <Card>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">Page not found!</h1>
        <p class="text-muted-foreground">Click <a href="/" class="underline cursor-pointer">here</a> to go back home</p>
      </div>
    </Card>
  );
}
