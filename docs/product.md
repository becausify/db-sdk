# Product

## What it is

**DB SDK** is an open-source TypeScript library for **runtime, read-focused access** to databases through a consistent provider interface.

It is aimed at applications that cannot hard-code one schema and one database:

- Products that **dynamically connect to customer databases**
- Developer tools that work **across drivers**
- **AI-powered applications** that generate queries and need safe execution

The SDK should be useful on its own. It is not a feature of a single host product.

## What it is not

- An ORM or query builder for *your* application database
- An AI framework, agent runtime, or prompt library
- A universal query language (no SQL-over-Firestore)
- A GraphQL layer, migration tool, or sync engine
- A hosted connection proxy or credential vault

## Who it is for

**Product builders and developer-tool authors.** You need to say “connect Postgres or Firestore” without forking connect / introspect / query for each driver. You may resolve the provider at runtime from customer config. Hosted products (Supabase) get their own provider package on top of a shared driver.

**AI application authors.** You already have a model and tools. You need a catalog for context and a read-only execution path that treats model output as untrusted. The model key stays in your app.

**Customers of those products.** You are asked for a connection string or service account. You need an auditable story: this library is designed to read, not write, and you can inspect the query path. That story is in [Security](security.md).

## What exists today

Documentation of the product, security model, and intended architecture. Public types and a thin `connect()` handle live in `packages/core`. A Fumadocs API reference at `/docs` on the web app renders those types from TSDoc.

No provider packages or published npm API yet.

## Intended first capabilities

These are the first things implementation should prove:

| Piece | Job |
| --- | --- |
| `@db-sdk/core` | Types, `connect()`, catalog and result shapes, errors, abort, shared safety helpers |
| `@db-sdk/postgres` | Postgres **driver**: connection, introspection, parameterized `SELECT`, limits and timeouts |
| `@db-sdk/firestore` | Firestore **driver**: connection, catalog from collections/samples, read-only queries |
| `@db-sdk/supabase` | Hosted **provider**: OAuth / Management API / resolve → opens the Postgres driver |

Together they force the design to stay driver-agnostic at the core and prove N providers can share one driver. If the core only works for SQL, it is wrong.

The host application owns encryption at rest, auth, org scoping, UI, and any AI calls. DB SDK never stores credentials.

## Planned later

- More drivers: MySQL, SQL Server, MongoDB, warehouse drivers, and others that fit the contract
- More hosted providers on existing drivers (for example Neon on Postgres)
- A **registry** so a stored `provider` id + credentials can be resolved at runtime without a compile-time switch
- Richer catalog metadata (keys, relationships, approximate counts) if drivers can supply it cheaply
- Additional capability classes (`warehouse`, …) only if a real driver needs them

Nothing in that list is implemented. Package names are a working convention, not a publish plan.

## Success

1. A host adds a database by depending on a provider or driver package, not by copying connection code.
2. PostgreSQL and Firestore share `test` / `introspect` / `query` / `close` and do **not** share a query language.
3. Supabase and raw Postgres both set `driver: "postgres"` and accept the same SQL query shape.
4. An AI host can generate a query from a catalog without giving DB SDK a model key.
5. A customer can read this repo and see a bounded, query-only path, with read-only credentials documented as the real lock.
6. One workflow can query more than one connected database.

## Non-goals

- **Writes of any kind** (`INSERT`, `UPDATE`, `DELETE`, Firestore `set` / `update` / `delete`, and equivalents) — settled in [ADR 0002](decisions/0002-query-only.md)
- Schema migrations or schema design
- Translating SQL ↔ Firestore (or any cross-driver rewrite)
- Running in the browser
- Hosted pooling, tunnels, or credential storage
- Calling an LLM
