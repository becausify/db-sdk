# 0005. Scoped core package

Status: **accepted**

## Context

The first release used the unscoped npm name `db-sdk`. npm rejected it because its anti-typosquatting rules consider it too similar to the existing `dbsdk` package. The driver and provider packages already use the `@db-sdk` organization scope.

## Decision

Publish the core package as `@db-sdk/core`. Imports, dependencies, install commands, and docs use that name.

Keep the repository and product name **DB SDK**. Only the npm package name changes.

## Consequences

- `@db-sdk/postgres` and `@db-sdk/supabase` depend on `@db-sdk/core`.
- The already-published `0.1.0` driver and provider releases remain broken because they reference unavailable `db-sdk`. Their first repair release is `0.1.1`.
- If npm later approves the unscoped name, changing back requires an explicit update to this ADR and a migration plan. Do not maintain two core package names by default.
