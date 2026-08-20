# DB SDK

A TypeScript SDK for query-only access to databases through **providers** and **drivers**.

Use it when you don't control the database schema at compile time: customer databases connected at runtime, developer tools that work across drivers, or AI-powered applications that generate queries.

DB SDK is **not an ORM**. It does not own your schema, generate clients, or hide databases behind one query language.

DB SDK is **not an AI framework**. It does not call a model and does not need an AI API key. Query generation stays in the application. The SDK connects, introspects, validates, executes, and returns results.

## Status

This repository is **early-stage**. Public types and `connect()` exist in `packages/core`. There is no published package and no driver or hosted provider implementation yet.

The API sketches in these docs are the **intended architecture**, not a shipped contract.

| Today | Intended first implementation | Later |
| --- | --- | --- |
| Product and architecture docs | Postgres + Firestore drivers, Supabase hosted provider | More drivers and hosted providers |
| Core types + `connect()` | Query-only path, introspection, result handling | Runtime provider registry |
| Fumadocs API reference | | Warehouse and other capability classes |
| Release pipeline (Changesets) | | |

## Why it exists

ORMs assume you chose one database and wrote the schema. Many products cannot do that:

- A SaaS app attaches to **each customer’s** Postgres, Firestore, or other store
- Developer tools and investigation consoles work **across drivers**
- An AI app asks a model to write a query, then must **run it safely**

Those apps still need to connect, describe the store, run a bounded read, and return a usable result. DB SDK is that layer. Adding a database type means adding a **driver**. Adding a hosted product (Supabase) means adding a **provider** that opens that driver. See [ADR 0003](docs/decisions/0003-providers-and-drivers.md).

## Intended usage

Provider-native queries, shared lifecycle:

```ts
import { connect } from "db-sdk";
import { postgres } from "@db-sdk/postgres";
import { firestore } from "@db-sdk/firestore";

const warehouse = await connect({
  provider: postgres({ connectionString: process.env.DATABASE_URL }),
});

await warehouse.test();
const catalog = await warehouse.introspect();
const users = await warehouse.query({
  sql: "SELECT id, email FROM users WHERE plan = $1",
  params: ["pro"],
});

const events = await connect({
  provider: firestore({ serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT }),
});

const sessions = await events.query({
  collection: "sessions",
  filters: [{ field: "plan", op: "==", value: "pro" }],
  limit: 20,
});
```

`test`, `introspect`, `query`, and `close` are the same for every provider. The **query input is not**. Postgres speaks SQL. Firestore does not. DB SDK does not translate one into the other.

Connections should also be resolvable at runtime from stored customer config (`provider` + credentials). See [Architecture](docs/architecture.md).

## What the SDK does

- Resolve a provider and open a connection
- Introspect a **catalog** the UI or a model can use as context
- Treat queries as **untrusted input**
- Run **reads only**, with timeouts and result limits ([ADR 0002](docs/decisions/0002-query-only.md))
- Return a normalized result envelope

SDK validation is **not** a security boundary by itself — especially for SQL. Prefer a read-only database user. See [Security](docs/security.md).

What it does not do: generate queries, require an AI key, migrate schemas, write data, or pretend every database is Postgres.

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
