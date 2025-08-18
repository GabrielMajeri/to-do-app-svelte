import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    // For testing components client-side we need to setup a DOM environment.
    environment: "jsdom",
    // Setup custom assertions/matchers before running each test.
    setupFiles: ["./src/lib/vitest-setup.ts"],
  },
  // Tell Vitest to use the `browser` entry points in `package.json` files,
  // even though it's running in Node.
  resolve: process.env.VITEST
    ? {
        conditions: ["browser"],
      }
    : undefined,
});
