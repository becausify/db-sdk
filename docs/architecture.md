# Architecture

Status: **intended design**. No packages or provider implementations exist in this repository yet.

## Shape

```text
db-sdk                 core types, connect(), safety helpers
  @db-sdk/postgres     relational provider (first)
  @db-sdk/firestore    document provider (first)
  @db-sdk/<engine>     later providers
```

The core package should have **no native drivers**. Each provider depends on one client (`pg`, `firebase-admin`, …).

This is the same ecosystem shape as a multi-provider SDK: one core, many adapters, provider-specific options where the engines actually differ.

## Provider contract

Every provider implements the same lifecycle. Query input stays generic so each engine keeps its native shape:

```ts
type DatabaseCapability = "relational" | "document";

interface DatabaseProvider<TQuery = unknown> {
  readonly id: string;
  readonly capability: DatabaseCapability;
  test(signal?: AbortSignal): Promise<void>;
  introspect(signal?: AbortSignal): Promise<Catalog>;
  query(input: TQuery, signal?: AbortSignal): Promise<QueryResult>;
  close(): Promise<void>;
}
```

`connect({ provider })` is the entry point. It opens a handle to an existing database; it does not create a database.

Illustrative query inputs — **not a shared language**:

```ts
// @db-sdk/postgres
type PostgresQuery = { sql: string; params?: unknown[] };

// @db-sdk/firestore
type FirestoreQuery = {
  collection: string;
  filters?: DocumentFilter[];
  limit?: number;
};
```

A later MongoDB provider should use Mongo’s read API, not Firestore’s filter list. Capabilities group engines for hosts that want one tool per class (`query_sql` vs `query_documents`). They do not flatten engines into one AST.

`kv` and `warehouse` are possible later classifications. They are not part of the first design.

## Runtime resolution

Customer connections are not known at compile time. The host typically stores `provider` + encrypted credentials, then resolves a provider when a request arrives.

Intended direction: factory functions **and** a registry.

```ts
import { connect, createRegistry } from "db-sdk";
import { postgres } from "@db-sdk/postgres";
import { firestore } from "@db-sdk/firestore";

const registry = createRegistry({ postgres, firestore });

const db = await connect({
  provider: registry.resolve(connection.provider, connection.credentials),
});
```

Exact registry API is not decided. The requirement is: a stored provider id plus credentials must be enough to open a connection without a hardcoded `switch`.

## Catalog

Introspection returns one catalog shape so UIs and models share a picture of the store:

```ts
type Catalog = {
  capability: DatabaseCapability;
  namespaces: Array<{
    name: string; // schema, dataset, or "-"
    items: Array<{
      name: string; // table or collection
      fields: Array<{
        name: string;
        type: string; // engine-native, e.g. "uuid", "string"
        nullable?: boolean;
      }>;
    }>;
  }>;
};
```

Relational providers fill this from `information_schema` / equivalent. Document providers sample documents and union keys. Caching is a **host** concern; the SDK should always be able to refresh.

## Results

```ts
type QueryResult = {
  capability: DatabaseCapability;
  columns?: string[];
  rows?: Array<Array<string | number | boolean | null>>;
  documents?: unknown[];
  total: number;
  truncated: boolean;
};
```

The host can render relational `rows` as a table and flatten `documents` when keys are stable. Exact cell types and document encoding may change during implementation.

## Safety

`query()` is intended to be read-only and fail-closed. Policy is applied **before** the driver runs, in layers.

SDK and provider validation are **not a security boundary** by themselves. Deciding whether arbitrary SQL is truly read-only is subtle, especially on PostgreSQL. The database role is the lock; SDK checks are extra.

| Layer | Responsibility |
| --- | --- |
| SDK | Read-oriented API surface, abort, default row/time limits, fail closed when unsure |
| Provider | Dialect- or API-specific checks (SQL policy vs Firestore read APIs) |
| Runtime | Statement timeout, injected `LIMIT` / `TOP` or required `limit`, bounded payload |
| Database | **Security boundary:** host/customer supplies a read-only role or IAM principal |

Do not add Firestore by extending a SQL sanitizer. Add `@db-sdk/firestore` with its own read-only checks.

Mutations, if ever added, are a separate method, default-disabled.

## Host vs library

```text
┌─────────────────────────────────────────────┐
│ Host application                            │
│  auth, orgs, encryption, UI, optional AI    │
│  stores encrypted credentials + provider id │
└─────────────────┬───────────────────────────┘
                  │ decrypted credentials in-process
┌─────────────────▼───────────────────────────┐
│ db-sdk                                      │
│  connect({ provider }) →                    │
│  test / introspect / query / close          │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   customer Postgres   customer Firestore
```

DB SDK does not know about workspaces, billing, or source control. The host does not import `pg` or `firebase-admin` directly.

## Adding an engine

1. Decide whether it fits an existing capability or needs a new one.
2. Implement `test`, `introspect`, `query`, `close`.
3. Map native types into `Catalog` field strings.
4. Enforce that provider’s read-only policy in `query`.
5. Export a factory and a registry id (`postgres`, `firestore`, …).

## Open decisions

These should be settled during implementation, not treated as shipped API:

- Package names: `db-sdk` + `@db-sdk/*` vs a scoped org name
- Registry API and how much config validation lives in core vs the provider
- How far shared result/catalog types go vs provider-specific extras
- Whether SQL validation is a core helper used by several relational providers, or fully per-provider
- Whether hosted Postgres products (for example Supabase) are separate providers or host-side credential flows into `@db-sdk/postgres`
- Default numeric limits (row cap, timeout) and whether hosts can override them per query
- Whether `connect` is generic over `TQuery` so typed queries stay narrow
- Whether `connect` eagerly opens the client or only constructs a handle
