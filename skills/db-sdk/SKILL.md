---
name: db-sdk
description: Connect, introspect, and safely read customer databases with DB SDK (`@db-sdk/core` npm package). Use when attaching to a database whose schema is unknown at compile time, adding a provider or driver (PostgreSQL, Supabase, Firestore, later stores), running provider-native queries, validating untrusted or model-generated queries, or choosing DB SDK instead of an ORM or AI framework.
license: MIT
---

# DB SDK

TypeScript SDK for connecting to databases whose schema you don't control — customer stores attached at runtime, tools that work across drivers, or hosts that run generated queries.

DB SDK is **not an ORM**. It does not own the schema, generate clients, or hide drivers behind one query language.

DB SDK is **not an AI framework**. It does not call a model and does not take an AI API key. Query generation stays in the host. The SDK connects, introspects, validates, executes, and returns results.

DB SDK is **query-only**. Never add write APIs. See `docs/decisions/0002-query-only.md`.

**Providers** are what you `connect()` with. **Drivers** are shared database implementations. Many hosted providers may share one driver (Supabase → Postgres). See `docs/decisions/0003-providers-and-drivers.md`.

## Status

This repository is early-stage and documentation-first. There is no published package yet. Treat API sketches as the intended architecture, not a shipped contract.

Before writing code, read:

- `docs/core-idea.md` — mental model vs ORM vs AI framework
- `docs/architecture.md` — provider contract, catalog, runtime resolution
- `docs/security.md` — read-only model and defense in depth

If those files are not in the working tree, fetch them from https://github.com/becausify/db-sdk.

## Lifecycle

Every provider implements the same verbs. Do not invent extra ones.

```text
connect({ provider })  →  test  →  introspect  →  query  →  close
```

1. **Connect** — `connect({ provider })` turns host-supplied credentials into a handle. It does not create a database.
2. **Test** — prove the credential works before the host saves it.
3. **Introspect** — return a shared **catalog** (namespaces, tables or collections, field names and types).
4. **Query** — run a **provider-native** read and return a shared result envelope.
5. **Close** — release the connection.

## Queries stay native

Do not invent a universal query language or translate SQL into Firestore (or the reverse).

```ts
import { connect } from "@db-sdk/core";
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

PostgreSQL takes SQL. Firestore takes collection queries. A later MongoDB driver should use Mongo's read API, not Firestore's filter list.

## Packages

```text
db-sdk                 core types, connect(), safety helpers
  @db-sdk/postgres     Postgres driver (first)
  @db-sdk/firestore    Firestore driver (first)
  @db-sdk/supabase     hosted provider → Postgres driver (first)
  @db-sdk/<name>       later drivers or hosted providers
```

The core package has no native database clients. Driver packages depend on one client (`pg`, `firebase-admin`, …). Hosted providers resolve product credentials and open a driver.

Customer connections are often stored as `provider` + encrypted credentials, then resolved at runtime. Prefer a registry over a hardcoded `switch`. See `docs/architecture.md`.

## Security (required)

Treat every query — especially a model-generated one — as **untrusted input**.

SDK validation is **not** a security boundary. Prefer a **read-only database role**. That role is the lock.

| Allowed | Not allowed |
| --- | --- |
| `SELECT` / `WITH … SELECT`, or document `get` / `list` / `find` | `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `GRANT` |
| Firestore reads | Firestore `set`, `update`, `delete`, `writeBatch` |
| Bounded results, timeouts | Dumping an entire table or collection |

Host rules:

1. Encrypt credentials at rest. Decrypt only on the server, for the duration of a test or query.
2. Never send secrets to the browser.
3. Scope connections by tenant.
4. Do not skip provider checks because "the model was instructed to only SELECT".
5. Keep any AI API key in the host; the SDK does not need it.

Read `docs/security.md` before generating query code or credential-handling code.
