import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * One workspace Vitest project. Tests stay in each package under `src/`.
 * Shared defaults also live in `tooling/vitest` for reuse.
 */
export default defineConfig({
  root: repoRoot,
  test: {
    environment: "node",
    globals: false,
    passWithNoTests: true,
    include: ["packages/*/src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
