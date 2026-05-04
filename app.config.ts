import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getVersion(): string {
    if (process.env.LISTLESS_VERSION !== undefined) {
        return process.env.LISTLESS_VERSION;
    }

    const commit = execSync("git rev-parse --short HEAD").toString().trim();
    const dirty = execSync("git status --porcelain").toString().trim();
    return dirty.length > 0
        ? `${commit}+`
        : commit;
}

export default defineConfig({
    vite: {
        plugins: [
            tailwindcss(),
            imagetools(),
        ],
        define: {
            __LISTLESS_VERSION__: JSON.stringify(getVersion()),
        }
    },
    server: {
        plugins: [
            path.resolve(__dirname, "src/server-plugins/listless.ts"),
        ],
    },
    ssr: false,
});
