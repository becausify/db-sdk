# Architecture

Status: **intended design**. Public types and `connect()` live in `packages/core`. Provider packages are not implemented yet. Developer API docs are generated from those types — see [ADR 0001](decisions/0001-developer-docs.md).

## Shape

```text
db-sdk                 core types, connect(), safety helpers
  @db-sdk/postgres     Postgres driver (first)
  @db-sdk/firestore    Firestore driver (first)
  @db-sdk/supabase     hosted provider → Postgres driver (first)
  @db-sdk/<name>       later drivers or hosted providers
```

**Providers** are what hosts `connect()` with. **Drivers** are shared database implementations. Many hosted providers may share one driver (Supabase and Neon both use Postgres). See [ADR 0003](decisions/0003-providers-and-drivers.md).

The core package has **no native database clients**. Driver packages depend on one client (`pg`, `firebase-admin`, …). Hosted providers depend on a driver package and product APIs (OAuth, management).

## Provider contract

Every provider implements the same lifecycle. Query input stays generic so each **driver** keeps its native shape:

```ts
type DatabaseCapability = "relational" | "document";

interface DatabaseProvider<TQuery = unknown> {
  readonly id: string;       // registry key: "supabase" | "postgres" | …
  readonly driver: string;   // query family: "postgres" | "firestore" | …
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
// @db-sdk/postgres (and Supabase via the same driver)
type PostgresQuery = { sql: string; params?: unknown[] };

// @db-sdk/firestore
type FirestoreQuery = {
  collection: string;
  filters?: DocumentFilter[];
  limit?: number;
};
```

A later MongoDB driver should use Mongo’s read API, not Firestore’s filter list. Capabilities group tools (`query_sql` vs `query_documents`). They do not flatten drivers into one AST.

`warehouse` (Snowflake, …) and similar classes are possible later. They are not part of the first design.

## Runtime resolution

Customer connections are not known at compile time. The host typically stores `provider` + encrypted credentials, then resolves a provider when a request arrives.

Intended direction: factory functions **and** a registry.

```ts
import { connect, createRegistry } from "@db-sdk/core";
import { postgres } from "@db-sdk/postgres";
import { firestore } from "@db-sdk/firestore";
import { supabase } from "@db-sdk/supabase";

const registry = createRegistry({ postgres, firestore, supabase });

const db = await connect({
  provider: await registry.resolve(connection.provider, connection.credentials),
});
// db.id === "supabase", db.driver === "postgres"
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

Mutations are never part of DB SDK. See [ADR 0002](decisions/0002-query-only.md).

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

## Adding a driver or hosted provider

**Driver** (new database type):

1. Decide whether it fits an existing capability or needs a new one.
2. Implement `test`, `introspect`, `query`, `close` with native query input.
3. Map native types into `Catalog` field strings.
4. Enforce that driver’s read-only policy in `query`.
5. Export a factory; set `id` and `driver` (often the same string).

**Hosted provider** (product on an existing driver):

1. Own product OAuth/API and credential resolve.
2. Open the underlying driver (do not fork SQL policy or catalog).
3. Set `id` to the product and `driver` to the shared implementation.
4. Export a factory and register under the product id.

## Settled (see also [decisions](decisions/README.md))

- Package names: `@db-sdk/core` + `@db-sdk/*`
- `connect` is generic over `TQuery` so typed queries stay narrow
- `connect` constructs a handle; it does not eagerly open the client
- Developer API docs: Fumadocs + TSDoc + `AutoTypeTable` ([0001](decisions/0001-developer-docs.md))
- Query-only forever — no write API ([0002](decisions/0002-query-only.md))
- Providers and drivers; N providers → 1 driver; `id` vs `driver` ([0003](decisions/0003-providers-and-drivers.md))

## Open decisions

These should be settled during implementation, not treated as shipped API:

- Registry API and how much config validation lives in core vs the provider
- How far shared result/catalog types go vs provider-specific extras
- Whether SQL validation is a shared helper used by several SQL drivers, or fully per-driver
- Default numeric limits (row cap, timeout) and whether hosts can override them per query
