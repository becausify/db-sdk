import { nextJsConfig } from "@db-sdk/eslint/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [".next/**", ".source/**", "out/**", "next-env.d.ts"],
  },
];
