import { Card } from "~/components/Card";
import { HomeHeader } from "~/components/HomeHeader";


export default function NotFound() {
  return (
    <div class="flex flex-col gap-2">
      <HomeHeader />
      <Card>
        <div class="flex flex-col gap-4 font-mono">
          <p>DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</p>

          <p>
            Listless is provided on an "as is" and "as available" basis, without warranties of any kind, either express
            or implied, including but not limited to implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>

          <p>
            To the maximum extent permitted by applicable law, the operators of Listless shall not be liable for any
            direct, indirect, incidental, special, consequential, or punitive damages — including loss of data,
            revenue, or goodwill — arising out of or in connection with your use of, or inability to use, this service.
          </p>

          <p>You assume full responsibility for your use of Listless.</p>

          <hr class="text-muted-foreground" />

          <a class="underline" href="https://github.com/just1ngray/listless">https://github.com/just1ngray/listless</a>
        </div>
      </Card>
    </div>
  );
}
