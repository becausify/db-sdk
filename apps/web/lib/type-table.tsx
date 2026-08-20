import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript";
import {
  AutoTypeTable as GeneratedTypeTable,
  type AutoTypeTableProps,
} from "fumadocs-typescript/ui";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

/**
 * One generator for every library package under `packages/*/src`.
 * See ADR 0004 and `tsconfig.docs.json` — do not point this at a single package.
 */
const generator = createGenerator({
  tsconfigPath: path.join(repoRoot, "tsconfig.docs.json"),
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
});

export async function AutoTypeTable(
  props: Omit<AutoTypeTableProps, "generator">,
) {
  return (
    <GeneratedTypeTable
      {...props}
      generator={generator}
      options={{ basePath: repoRoot, ...props.options }}
    />
  );
}
