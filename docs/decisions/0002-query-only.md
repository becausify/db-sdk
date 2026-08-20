# 0002. Query-only — no writes

Status: **accepted**

## Context

DB SDK attaches to databases whose schema and ownership often belong to the customer. Host products (for example Becausify) need connect, introspect, and safe reads — including untrusted or model-generated queries — without becoming a mutation or migration tool.

Earlier docs said mutations were a non-goal for v1 and that writes, if ever added, should be a separate default-disabled method. That left the door open. Product direction is now firm: the library must stay a **read path only**.

## Decision

1. **DB SDK never implements writing.** There is no `insert`, `update`, `delete`, `set`, `mutate`, or equivalent on the public API — not as a flag on `query()`, not as a separate method, and not as an opt-in provider capability.
2. **`query()` is read-only by contract.** Providers may only execute reads (for example parameterized `SELECT`, Firestore get/list/query). Anything that can change data must fail closed before the driver runs.
3. **Schema changes and migrations stay out of scope** (unchanged): create/alter/drop, seed scripts, and sync engines are not part of this library.
4. **Read-only database credentials remain the security boundary.** SDK and provider checks are defense in depth, not a substitute for a read-only role or IAM principal.

## Consequences

- Hosts that need writes use a different stack (ORM, native driver, admin tooling) — never DB SDK.
- Security and product copy can state unconditionally: this library is designed to query, not modify.
- Provider implementations must reject write statements and write APIs; there is no “later we’ll add mutate()” escape hatch in this ADR.
- Docs that previously hedged with “if writes ever exist…” should be updated to match this decision.

## Not decided here

- How aggressive SQL / API validation is per provider (still open in architecture).
- Whether hosted Postgres products (for example Supabase) are separate providers or credential flows into `@db-sdk/postgres`.
- Default row caps and timeouts.
