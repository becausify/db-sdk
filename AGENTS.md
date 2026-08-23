# Agent notes

Product, architecture, and tooling decisions live in [`docs/decisions/`](docs/decisions/README.md). Treat a settled ADR as a constraint unless the user asks to reopen it.

The core npm package is `@db-sdk/core`, not unscoped `db-sdk` ([ADR 0005](docs/decisions/0005-scoped-core-package.md)).

Developer API docs: Fumadocs in `apps/web` at `/docs`, behind the same site header as marketing. Public types and TSDoc in `packages/*` are the source of truth; the site embeds them with `AutoTypeTable` via root `tsconfig.docs.json`. See [`docs/decisions/0001-developer-docs.md`](docs/decisions/0001-developer-docs.md) and [`docs/decisions/0004-docs-for-providers.md`](docs/decisions/0004-docs-for-providers.md).

Query-only: DB SDK never implements writes — only connect, introspect, and read queries. See [`docs/decisions/0002-query-only.md`](docs/decisions/0002-query-only.md).

Providers and drivers: packages are providers; shared database implementations are drivers (`id` vs `driver`). Many hosted providers may share one driver. See [`docs/decisions/0003-providers-and-drivers.md`](docs/decisions/0003-providers-and-drivers.md). When an ADR changes product language, update the homepage, `/providers`, `/security`, and Resources pages too.

Firebase is a hosted provider on the Firestore driver. Use Google OAuth. Do not ask the host for a service account JSON. See [`docs/decisions/0006-firebase-google-oauth.md`](docs/decisions/0006-firebase-google-oauth.md).

Every new driver or hosted provider ships a curated `/docs` page with `AutoTypeTable` in the same change, using provider/driver terminology. See [ADR 0004](docs/decisions/0004-docs-for-providers.md) and [`.cursor/rules/provider-docs.mdc`](.cursor/rules/provider-docs.mdc).

Do not let source files become catch-all blobs — see [`.cursor/rules/no-blob-files.mdc`](.cursor/rules/no-blob-files.mdc).

Keep `README.md` product-facing (no Changesets / `link:` chatter) — see [`.cursor/rules/readme.mdc`](.cursor/rules/readme.mdc).

Do not mention ADRs in `/docs`, package READMEs, or TSDoc on public types — see [`.cursor/rules/no-adr-in-docs.mdc`](.cursor/rules/no-adr-in-docs.mdc).

Generic docs do not teach from a named hosted provider or a named driver pair — see [`.cursor/rules/docs-no-named-providers.mdc`](.cursor/rules/docs-no-named-providers.mdc).

Do not stamp “query-only” on every docs page — see [`.cursor/rules/docs-no-query-only-refrain.mdc`](.cursor/rules/docs-no-query-only-refrain.mdc).

Do not explain the docs stack (TSDoc, AutoTypeTable, Fumadocs) on public pages — see [`.cursor/rules/docs-no-tooling-talk.mdc`](.cursor/rules/docs-no-tooling-talk.mdc).

Tests: Vitest from the repo root (`pnpm test`). Config globs `packages/*/src/**/*.test.ts`; keep tests colocated with the code. Shared helper: [`tooling/vitest`](tooling/vitest).
