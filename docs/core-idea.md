# Core idea

DB SDK is a **runtime database adapter**. It gives an application one way to connect, describe, and safely read a data store — including a store it only learned about at runtime.

## One sentence

Connect to a database whose schema you don't control at compile time, understand what is in it, and run a bounded read through a shared interface, without forcing every engine into one query language.

## Not an ORM

| | ORM (Prisma, Drizzle, Kysely) | DB SDK |
| --- | --- | --- |
| Whose database? | Yours | Often the customer’s |
| When is the schema known? | Compile time, in a file you wrote | Runtime, after `introspect()` |
| Do engines change? | Rarely; you picked one | Per connection, at runtime |
| Query style | Typed API generated from *your* schema | Provider-native, then validated |
| Writes and migrations? | Yes | Out of scope |

If Postgres is *your* application database, use an ORM. If the product must attach to **someone else’s** database — or to several different ones in one workflow — use DB SDK.

## Not an AI framework

DB SDK does not talk to a model and does not take an AI API key.

An AI-powered host may:

1. Call `introspect()` and pass the catalog to its own model
2. Let the model draft a provider-native query
3. Send that query to DB SDK

The SDK’s job is connection, catalog, validation, execution, and results. The generated query is **untrusted input**, the same as a query typed by a human. Validation is a best-effort check, not the security boundary — see [Security](security.md).

## Shared lifecycle, native queries

Every provider implements the same verbs:

```text
connect({ provider })  →  test  →  introspect  →  query  →  close
```

1. **Connect** — `connect({ provider })` turns credentials into a handle. It does not create a database.
2. **Test** — prove the credential works before the host saves it.
3. **Introspect** — return a **catalog**: namespaces, tables or collections, field names and types.
4. **Query** — run a read in that store’s native shape and return a shared result envelope.

The catalog is shared so UIs and models have one picture of “what exists.” The query language is not shared. PostgreSQL takes SQL. Firestore takes collection queries. A host should not send `SELECT` to Firestore.

## Several databases in one workflow

A host can open more than one connection and use them in the same request or investigation:

```text
postgres://customer-a   →  catalog + SQL reads
firestore://customer-a  →  catalog + collection reads
```

DB SDK does not merge those stores. It makes each connection independently testable, introspectable, and safely readable.

## Providers, not special cases

PostgreSQL and Firestore are different products. They should still sit behind one **provider contract** so the host does not grow a query module per engine.

Capabilities (`relational`, `document`, later maybe `kv` or `warehouse`) classify engines. They do not invent a universal query AST. See [Architecture](architecture.md).
