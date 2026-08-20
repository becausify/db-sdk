# 0004. Docs for every driver and hosted provider

Status: **accepted**

## Context

API field tables come from TypeScript via `AutoTypeTable` ([ADR 0001](0001-developer-docs.md)). The generator was initially pointed only at `packages/core`, so new driver and hosted provider packages (`@db-sdk/postgres`, `@db-sdk/supabase`, …) could not feed live type tables without a special-case change each time.

We will keep adding small packages. Docs and agents need one rule: new package → docs page with live types, using repo terminology.

## Decision

1. **Docs TypeScript project is monorepo-wide for library sources.** Root [`tsconfig.docs.json`](../../tsconfig.docs.json) includes `packages/*/src/**/*.ts` (excluding tests). [`apps/web/lib/type-table.tsx`](../../apps/web/lib/type-table.tsx) points `fumadocs-typescript` at that file — not at a single package tsconfig.
2. **Every new driver or hosted provider package ships a curated `/docs` page in the same PR** (or the same change set). The page lives under `apps/web/content/docs/`, is linked from `apps/web/content/docs/meta.json`, and documents how to connect and query.
3. **Public options and query types use `<AutoTypeTable />`**, not handwritten field tables. Path is repo-relative, e.g. `packages/postgres/src/options.ts`. TSDoc on the export is required so the table has descriptions.
4. **Narrative and examples stay curated** (ADR 0001). Do not dump every internal symbol. Prefer: short intro, install/connect example, `id` / `driver` / query shape, safety notes, then AutoTypeTable sections for the public surface.
5. **Terminology matches the codebase and [ADR 0003](0003-providers-and-drivers.md):** say **provider** and **driver**, not engine/connector. Hosted products open a driver; raw URI users call the driver factory. Query-only ([ADR 0002](0002-query-only.md)).
6. **Homepage / Providers catalogue** stay in sync when the package is user-facing (status, package name, “via driver” label). Agents must update those when adding a first-class package.
7. **AI agents follow this checklist** whenever they create `@db-sdk/<name>` for a driver or hosted provider. Do not leave docs as a follow-up.

## Checklist (new `@db-sdk/*` driver or hosted provider)

1. Package under `packages/<name>` with TSDoc on public exports.
2. `apps/web/content/docs/<name>.mdx` (or a clear slug) with prose + `<AutoTypeTable path="packages/<name>/src/…" name="…" />` for public options/query types.
3. Entry in `apps/web/content/docs/meta.json`.
4. Providers strip / `/providers` data if the product is listed on the site.
5. Use provider/driver wording only.

No per-package change to `type-table.tsx` is required when the source already matches `packages/*/src/**/*.ts`.

## Consequences

- Adding a package does not require widening the generator by hand — the glob picks up new `packages/*/src` trees.
- Missing TSDoc still yields empty descriptions in the table.
- UI or app packages that are not SDK API should not rely on this docs project for their public site API reference.

## Not decided here

- Auto-generating the entire MDX page from the package name with no human/agent prose (pages stay curated).
- API Extractor (still deferred per ADR 0001).
