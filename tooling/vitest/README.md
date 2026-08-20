# `@db-sdk/vitest`

Shared Vitest helpers for the monorepo. The **workspace** entry is the root
`vitest.config.ts`, which globs `packages/*/src/**/*.test.ts`.

Keep tests next to the code they cover. Run from the repo root:

```bash
pnpm test
pnpm test:watch
pnpm --filter @db-sdk/postgres test   # one package
```
