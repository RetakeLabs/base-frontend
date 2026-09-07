import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Async Server Components (e.g. `src/app/dashboard/page.tsx`) can't be
// unit-tested here — Vitest/RTL don't support them yet. Cover those with
// E2E instead; this config is for sync Server/Client components and hooks.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
