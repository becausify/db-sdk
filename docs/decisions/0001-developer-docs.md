# 0001. Developer API docs

Status: **accepted**

## Context

The public site needs an API reference in the same spirit as [chat-sdk.dev/docs](https://chat-sdk.dev/docs): curated pages, type tables, examples, **on the same origin as the product site**.

Chat SDK’s tables are **hand-copied** into MDX `<TypeTable>` objects. That drifts from TypeScript. We want the same *shape* of docs without a second copy of every field.

## Decision

1. **Fumadocs lives in `apps/web` at `/docs`.** Marketing pages (`/`, `/resources`, …) and the API reference share one Next.js app, one origin, and **one site header** — the same pattern as chat-sdk.dev. Fumadocs is the docs shell (sidebar, article, TOC, search dialog), not a second brand. Do not ship the default Fumadocs navbar, sidebar Docs/Resources links, or `--color-fd-*` gray palette.
2. **Public types in `packages/*` library sources are the source of truth.** Document them with TSDoc on the export. The site embeds those types with `fumadocs-typescript` `AutoTypeTable`, which reads the compiler at build time via root [`tsconfig.docs.json`](../../tsconfig.docs.json) (all `packages/*/src`). See also [ADR 0004](0004-docs-for-providers.md) for new drivers and hosted providers.
3. **Pages stay curated.** Write MDX for narrative, examples, and page structure. Do not generate a TypeDoc dump of every symbol as the primary reference.
4. **Do not duplicate type fields in handwritten `<TypeTable>` objects** unless the type cannot be imported from source (rare). Prefer `<AutoTypeTable path="…" name="…" />`.
5. **API Extractor is deferred** until the published surface is real and we need breaking-change reports in PRs. Changesets stay the release tool.
6. **Mintlify, Docusaurus, a standalone TypeDoc site, and a separate `apps/docs` server are out.**

## Consequences

- Changing a public field or its TSDoc updates the API table on the next web build. Missing TSDoc means an empty description in the table.
- New `@db-sdk/*` drivers and hosted providers must add a curated docs page with AutoTypeTable in the same change ([0004](0004-docs-for-providers.md)).
- `docs/*.md` remains the product/architecture source for humans (and for the marketing Resources pages). It is not the API reference.
- Local: `pnpm --filter web dev` → [http://localhost:3000/docs](http://localhost:3000/docs).

## Not decided here

- Registry API, default row/time limits, and provider implementations — still open in [Architecture](../architecture.md).
- When to turn on API Extractor (after a usable npm API, not at 0.0.0).
