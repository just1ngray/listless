import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    vite: {
        plugins: [
            tailwindcss(),
            imagetools(),
        ],
    },
    server: {
        plugins: [
            path.resolve(__dirname, "src/server-plugins/listless.ts"),
        ],
    },
    ssr: false,
});
