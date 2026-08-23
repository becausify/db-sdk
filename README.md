# DB SDK

A TypeScript SDK for query-only access to databases through **providers** and **drivers**.

Use it when you don't control the database schema at compile time: customer databases connected at runtime, developer tools that work across drivers, or AI-powered applications that generate queries.

DB SDK is **not an ORM**. It does not own your schema, generate clients, or hide databases behind one query language.

DB SDK is **not an AI framework**. It does not call a model and does not need an AI API key. Query generation stays in the application. The SDK connects, introspects, validates, executes, and returns results.

## Why it exists

ORMs assume you chose one database and wrote the schema. Many products cannot do that:

- A SaaS app attaches to **each customer’s** Postgres or other store
- Developer tools and investigation consoles work **across drivers**
- An AI app asks a model to write a query, then must **run it safely**

Those apps still need to connect, describe the store, run a bounded read, and return a usable result. DB SDK does that:

- Resolve a connection and open it
- Introspect a **catalog** the UI or a model can use as context
- Treat queries as **untrusted input**
- Run **reads only**, with timeouts and result limits
- Return a normalized result envelope

It does not generate queries, require an AI key, migrate schemas, write data, or pretend every database is Postgres. SDK validation is **not** a security boundary by itself — prefer a read-only database user. See [Security](docs/security.md).

## Providers and drivers

A **driver** is a shared database implementation (Postgres). A **provider** is what you `connect()` with — a raw driver or a hosted product (Supabase) that opens a driver. See the [docs](https://db-sdk.dev/docs).

[See what is available](https://db-sdk.dev/providers).

## Usage

Connect, then `test` / `introspect` / `query` / `close`. Query shapes stay native to the database. See the [docs](https://db-sdk.dev/docs).

## AI coding agents

If you use an AI coding agent such as Cursor, Claude Code, or Codex, install the DB SDK skill so it knows the lifecycle, provider-native queries, and security model before writing code.

```bash
npx skills add becausify/db-sdk
```

## Docs

Developer API reference (Fumadocs, types from source): `pnpm --filter web dev` → [http://localhost:3000/docs](http://localhost:3000/docs). Decisions that bind later work (and agents) are in [docs/decisions](docs/decisions/README.md).

| Doc | Contents |
| --- | --- |
| [Core idea](docs/core-idea.md) | Mental model: SDK vs ORM vs AI framework |
| [Product](docs/product.md) | Audience, scope, what exists vs what is planned |
| [Architecture](docs/architecture.md) | Provider contract, drivers, runtime resolution, catalog |
| [Decisions](docs/decisions/README.md) | ADRs — why the stack and API look this way |
| [Security](docs/security.md) | Query-only model and defense in depth |
| [Releasing](docs/releasing.md) | Versions, changelogs, and npm publish |

## Security

DB SDK is designed to **query**, never write. Credentials stay in the host app; the SDK accepts them in memory and should not persist them.

Do not rely on the SDK to prove a statement is harmless. Determining whether arbitrary SQL is read-only is subtle. Treat generated queries as untrusted, and use a **read-only database user** as the real lock. SDK checks, provider validation, and runtime caps are extra layers. Details: [Security](docs/security.md).

## License

[MIT](LICENSE)
