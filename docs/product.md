# Product

## What it is

**DB SDK** is an open-source TypeScript library for **runtime, read-focused access** to databases through a consistent provider interface.

It is aimed at applications that cannot hard-code one schema and one engine:

- Products that **dynamically connect to customer databases**
- Developer tools that work **across database engines**
- **AI-powered applications** that generate queries and need safe execution

The SDK should be useful on its own. It is not a feature of a single host product.

## What it is not

- An ORM or query builder for *your* application database
- An AI framework, agent runtime, or prompt library
- A universal query language (no SQL-over-Firestore)
- A GraphQL layer, migration tool, or sync engine
- A hosted connection proxy or credential vault

## Who it is for

**Product builders and developer-tool authors.** You need to say “connect Postgres or Firestore” without forking connect / introspect / query for each engine. You may resolve the provider at runtime from customer config.

**AI application authors.** You already have a model and tools. You need a catalog for context and a read-only execution path that treats model output as untrusted. The model key stays in your app.

**Customers of those products.** You are asked for a connection string or service account. You need an auditable story: this library is designed to read, not write, and you can inspect the query path. That story is in [Security](security.md).

## What exists today

Documentation of the product, security model, and intended architecture.

No npm packages, providers, or runtime code have landed yet.

## Intended first capabilities

These are the first things implementation should prove:

| Piece | Job |
| --- | --- |
| `db-sdk` | Types, `connect()`, catalog and result shapes, errors, abort, shared safety helpers |
| `@db-sdk/postgres` | Relational provider: connection, introspection, parameterized `SELECT`, limits and timeouts |
| `@db-sdk/firestore` | Document provider: connection, catalog from collections/samples, read-only queries |

Together they force the design to stay provider-agnostic. If the core only works for SQL, it is wrong.

The host application owns encryption at rest, auth, org scoping, UI, and any AI calls. DB SDK never stores credentials.

## Planned later

- More providers: MySQL, SQL Server, MongoDB, and others that fit the contract
- A **registry** so a stored `provider` id + credentials can be resolved at runtime without a compile-time switch
- Richer catalog metadata (keys, relationships, approximate counts) if providers can supply it cheaply
- Additional capability classes (key-value, warehouse) only if a real provider needs them

Nothing in that list is implemented. Package names are a working convention, not a publish plan.

## Success

1. A host adds an engine by depending on a provider package, not by copying connection code.
2. PostgreSQL and Firestore share `test` / `introspect` / `query` / `close` and do **not** share a query language.
3. An AI host can generate a query from a catalog without giving DB SDK a model key.
4. A customer can read this repo and see a bounded, read-oriented query path, with read-only credentials documented as the real lock.
5. One workflow can query more than one connected database.

## Non-goals (v1)

- Mutations (`INSERT`, `UPDATE`, Firestore `set`, and equivalents)
- Schema migrations or schema design
- Translating SQL ↔ Firestore (or any cross-engine rewrite)
- Running in the browser
- Hosted pooling, tunnels, or credential storage
- Calling an LLM

If writes ever exist, they should be a separate, default-disabled method — not a flag on `query()`.
