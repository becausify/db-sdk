# 0003. Providers and drivers

Status: **accepted**

## Context

Many hosted products (Supabase, Neon, RDS, …) speak one underlying database (Postgres). Others (Firestore, Firebase Realtime Database, Snowflake) need their own query language and client. Host products need a vocabulary customers recognize, and a packaging model where N products share one implementation without forking SQL policy or catalog code.

Earlier drafts used "engine" and "connector." Those terms confuse DB people (storage engines) and are weaker than everyday SDK language (Auth.js / AI SDK "providers," JDBC "drivers").

## Decision

1. **Provider** — anything a host `connect()`s with and that we may publish as `@db-sdk/<name>`. Customer speech: "add the Supabase provider."
2. **Driver** — the shared database implementation (wire protocol, native query shape, catalog, read policy). Customer speech: "it uses the Postgres driver." Field on the handle: `driver` (for example `"postgres"`, `"firestore"`, `"snowflake"`).
3. **Many providers may share one driver.** Hosted providers own product OAuth/API and credential resolve, then **delegate** read execution to the driver. They do not reimplement `query` / SQL policy / catalog.
4. **Raw driver factories stay.** Connection-string users call `postgres({ connectionString })` with `id` and `driver` both `"postgres"`.
5. **`id` vs `driver`:** `id` is the registry / stored key (`supabase` | `neon` | `postgres`). `driver` is the query family. Hosts pick agent tools by `driver` (or `capability`); UI labels use `id`.
6. **Capabilities** (`relational` | `document`, later `warehouse` / others) group tools. They do not invent a universal query AST. New store kinds add a driver (and capability when needed), not a redesign of `connect` → `test` → `introspect` → `query` → `close`.
7. **One product may open more than one driver** (for example Firebase → Firestore or Realtime Database). The provider resolves which driver; query shapes stay native.
8. **Site and docs use provider + driver only** — not engine / connector.

## Consequences

- First packages: `@db-sdk/postgres` (driver), `@db-sdk/supabase` (hosted provider → Postgres driver), `@db-sdk/firestore` (driver).
- Homepage and `/providers` describe drivers and hosted providers; Supabase is not "URI only, no package."
- Extending IAM or TLS for Postgres lands on the driver once; every Postgres-backed provider benefits.
- Terminology ADR; packaging and APIs must match.

## Not decided here

- Exact Neon / Snowflake / RTDB APIs
- Registry API details
- Default row caps and timeouts
