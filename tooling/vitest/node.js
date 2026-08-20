import { defineConfig } from "vitest/config";

/**
 * Shared Vitest defaults for Node library packages.
 * Prefer the root `vitest.config.ts` for the workspace glob.
 *
 * @param {import("vitest/config").UserConfig} [overrides]
 */
export function createNodeVitestConfig(overrides = {}) {
  const { test, ...rest } = overrides;

  return defineConfig({
    ...rest,
    test: {
      environment: "node",
      globals: false,
      passWithNoTests: true,
      ...test,
    },
  });
}
