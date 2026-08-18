# Security

Public security model for anyone who connects a database to a product that uses DB SDK.

**Status:** this is the intended model. The controls below are not implemented yet. Until they are, do not treat this file as a runtime guarantee.

**Short version:** DB SDK is designed to read, not write. It should not store credentials. Treat every query — especially a model-generated one — as untrusted.

**SDK validation is not a security boundary.** Deciding whether arbitrary SQL is truly read-only is subtle, especially on PostgreSQL. Use a **read-only database user**. That role is the lock. SDK and provider checks are extra layers.

## Threat model

The dangerous case is a host that runs queries it did not write: customer-supplied SQL, admin consoles, or AI-generated statements.

Assume:

- Queries are untrusted
- Credentials are powerful unless the customer restricts them
- A sanitizer or SQL classifier can miss an edge case
- A compromised host can use whatever role it stored

Defense in depth exists because no single layer is enough. In particular, do not treat “the SDK rejected writes” as proof that a statement was safe.

## Defense in depth

| Layer | What it should do |
| --- | --- |
| SDK | Read-oriented `query()` path. No persist of credentials. Fail closed when a statement cannot be shown to be a read. Apply default time and row limits. **Not a security boundary.** |
| Provider | Engine-specific checks. Relational providers reject obvious non-`SELECT` SQL. Document providers expose read APIs only and never call write methods. **Not a security boundary.** |
| Runtime | Timeouts, injected or required limits, abort signals, bounded result payloads. |
| Database | **Security boundary:** a dedicated read-only role, restricted schemas/collections, TLS, and network controls. |

If the stored user can `DELETE`, a missed validation case is a write. Prefer credentials that cannot write even if the SDK is wrong.

## What DB SDK should be allowed to do

| Allowed | Not allowed |
| --- | --- |
| Open a connection with credentials the host provides in memory | Persist those credentials, log them, or send them to a third party |
| `SELECT` / `WITH … SELECT`, or document `get` / `list` / `find` | `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `GRANT`, and equivalents |
| Firestore reads | Firestore `set`, `update`, `delete`, `writeBatch` |
| Return a bounded result | Dump an entire table or collection |
| Time out a slow query | Hold an unbounded session |

If a statement cannot be shown to be a read, it should not run. That fail-closed rule is a goal, not a substitute for a read-only role.

## AI-generated queries

DB SDK does not call a model. Hosts that do must:

1. Use `introspect()` as context — do not give the model raw credentials
2. Pass the model output into `query()` as untrusted input
3. Never skip provider checks because “the model was instructed to only SELECT”
4. Keep the AI API key in the host; the SDK does not need it

Prompt instructions are not a security boundary. Neither is SDK SQL validation.

## What the host must do

1. **Encrypt credentials at rest.** Decrypt only on the server, for the duration of a test or query.
2. **Never send secrets to the browser.** Clients may see connection names and catalogs, not URLs or keys.
3. **Scope by tenant.** An agent or user may only use connections that tenant attached.
4. **Prefer a dedicated role.** Ask customers for a read-only user, not a superuser URL.
5. **Do not treat the SDK as a warehouse.** Avoid archiving full result dumps.

If a host skips these, that is a host bug, not “DB SDK has write access.”

## What the customer should do

Treat a DB SDK host like any BI or support tool:

1. Create a **read-only** role (`SELECT` only, or Firestore/IAM that can only read).
2. Restrict schemas and collections. Do not expose payroll or secrets tables if the product does not need them.
3. Use TLS. Do not disable SSL in production.
4. Network-restrict if you can (allowlist, VPC, tunnel, private link).
5. Rotate credentials when people leave, and revoke access in the product when you disconnect.

## Intended query controls

**Relational (Postgres first, then other SQL engines):**

- Reject statements that are not `SELECT` or `WITH … SELECT`
- Reject mutation and DDL keywords and multi-statement batches
- Use parameterized queries — values are never concatenated into SQL
- Enforce a row cap even if the query omits `LIMIT` / `TOP`
- Enforce a statement timeout
- Keep dialect details in the provider (`LIMIT` vs `TOP`, quoting)

**Document (Firestore first):**

- Call read APIs only
- Require a collection from the catalog or an explicit allow list
- Require a limit on every query
- Do not run write aggregations, `$out` / `$merge`, or write transactions
- Infer schema by sampling, not by downloading the collection

Default numeric caps will be chosen in implementation. Hosts should be able to tighten them.

## Credentials

| Provider | Typical credential | Prefer |
| --- | --- | --- |
| Postgres | URI or host/user/password | User with `CONNECT` + `SELECT` only |
| Firestore | Service account JSON | Read-only IAM, not Editor |
| Later SQL / document engines | URI or provider config | Equivalent read-only role |

DB SDK should accept credentials as in-memory input only.

## Data flow

```text
Client
  │  never sees the connection secret
  ▼
Host server
  │  decrypts credentials, checks tenant access
  │  optional: model drafts a query from the catalog
  ▼
DB SDK provider
  │  validate → bounded read-only query
  ▼
Customer database
  │  returns a bounded result
  ▼
Host server → client
     answer and/or a small result table
```

Nothing in this path should write to the customer database.

## What this project does not do

- Train models on customer data
- Sell or share rows
- Bypass RLS, grants, or Firestore rules — the SDK authenticates as the principal you provided
- Require a public IP if the host can use a tunnel or private network

## Audit

Once implemented, the files that matter are:

- Relational validation and limit injection
- Each provider’s `query` method (must not call write APIs)
- Timeout and abort handling
- Credential handling (no persistence, no logging)

A write that runs through `query()` is a vulnerability. See [SECURITY.md](../SECURITY.md).

## Incident posture

If a host is compromised, an attacker may **read** whatever the stored role can read. They should not be able to **change** data through DB SDK. That is why the read-only database user matters: stolen credentials should still be read-only.
