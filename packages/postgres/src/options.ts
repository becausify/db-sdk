/**
 * Options for {@link postgres}.
 *
 * Prefer `connectionString`. Discrete fields are merged when no URI is given.
 * Hosted providers (Supabase) may set `id` while keeping `driver` as `"postgres"`.
 */
export type PostgresOptions = {
  /**
   * Registry id. Defaults to `"postgres"`. Hosted providers pass their product id.
   */
  id?: string;
  /**
   * Postgres connection URI (`postgresql://…` or `postgres://…`).
   */
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  /**
   * SSL setting passed to `pg`. Defaults to `true` for non-local hosts.
   */
  ssl?: boolean | object;
  /**
   * Max rows returned in a {@link import("db-sdk").QueryResult}. Default `100`.
   */
  maxRows?: number;
  /**
   * Statement timeout in milliseconds. Default `30_000`.
   */
  statementTimeoutMs?: number;
};

/**
 * Native query shape for the Postgres driver.
 */
export type PostgresQuery = {
  /**
   * Parameterized SQL. Values must go in `params`, never concatenated.
   */
  sql: string;
  /**
   * Bound parameters for `$1`, `$2`, …
   */
  params?: unknown[];
};

export const DEFAULT_MAX_ROWS = 100;
export const DEFAULT_STATEMENT_TIMEOUT_MS = 30_000;
