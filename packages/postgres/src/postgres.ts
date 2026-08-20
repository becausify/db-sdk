import {
  type Catalog,
  type CatalogField,
  type CatalogItem,
  type CatalogNamespace,
  type DatabaseProvider,
} from "db-sdk";
import pg from "pg";

import { PostgresQueryError } from "./errors.js";
import { mapQueryResult } from "./map-result.js";
import {
  DEFAULT_MAX_ROWS,
  DEFAULT_STATEMENT_TIMEOUT_MS,
  type PostgresOptions,
  type PostgresQuery,
} from "./options.js";
import { assertReadOnlySql } from "./sql-policy.js";

const { Pool } = pg;

type PoolConfig = pg.PoolConfig;

function isLocalHost(host: string | undefined): boolean {
  if (!host) {
    return false;
  }
  const normalized = host.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1"
  );
}

function hostFromConnectionString(connectionString: string): string | undefined {
  try {
    const url = new URL(connectionString);
    return url.hostname || undefined;
  } catch {
    return undefined;
  }
}

function buildPoolConfig(options: PostgresOptions): PoolConfig {
  const statementTimeoutMs =
    options.statementTimeoutMs ?? DEFAULT_STATEMENT_TIMEOUT_MS;
  const timeoutOption = `-c statement_timeout=${statementTimeoutMs}`;

  if (options.connectionString) {
    const host = hostFromConnectionString(options.connectionString);
    const ssl =
      options.ssl ?? (isLocalHost(host) ? undefined : true);

    return {
      connectionString: options.connectionString,
      ssl,
      options: timeoutOption,
      connectionTimeoutMillis: Math.min(statementTimeoutMs, 15_000),
    };
  }

  if (!options.host || !options.user || !options.database) {
    throw new PostgresQueryError(
      "invalid_options",
      "Provide connectionString, or host, user, and database",
    );
  }

  const ssl =
    options.ssl ?? (isLocalHost(options.host) ? undefined : true);

  return {
    host: options.host,
    port: options.port ?? 5432,
    user: options.user,
    password: options.password,
    database: options.database,
    ssl,
    options: timeoutOption,
    connectionTimeoutMillis: Math.min(statementTimeoutMs, 15_000),
  };
}

type ColumnRow = {
  table_schema: string;
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
};

function buildCatalog(rows: ColumnRow[]): Catalog {
  const bySchema = new Map<string, Map<string, CatalogField[]>>();

  for (const row of rows) {
    let tables = bySchema.get(row.table_schema);
    if (!tables) {
      tables = new Map();
      bySchema.set(row.table_schema, tables);
    }

    let fields = tables.get(row.table_name);
    if (!fields) {
      fields = [];
      tables.set(row.table_name, fields);
    }

    fields.push({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === "YES",
    });
  }

  const namespaces: CatalogNamespace[] = [...bySchema.entries()].map(
    ([name, tables]) => {
      const items: CatalogItem[] = [...tables.entries()].map(
        ([tableName, fields]) => ({
          name: tableName,
          fields,
        }),
      );
      return { name, items };
    },
  );

  namespaces.sort((a, b) => a.name.localeCompare(b.name));
  for (const namespace of namespaces) {
    namespace.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    capability: "relational",
    namespaces,
  };
}

class PostgresProvider implements DatabaseProvider<PostgresQuery> {
  readonly id: string;
  readonly driver = "postgres";
  readonly capability = "relational" as const;

  private readonly maxRows: number;
  private readonly pool: pg.Pool;
  private closed = false;

  constructor(options: PostgresOptions) {
    this.id = options.id ?? "postgres";
    this.maxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
    this.pool = new Pool(buildPoolConfig(options));
  }

  async test(signal?: AbortSignal): Promise<void> {
    signal?.throwIfAborted();
    const client = await this.pool.connect();
    try {
      signal?.throwIfAborted();
      await client.query("SELECT 1");
    } finally {
      client.release();
    }
  }

  async introspect(signal?: AbortSignal): Promise<Catalog> {
    signal?.throwIfAborted();
    const client = await this.pool.connect();
    try {
      signal?.throwIfAborted();
      const result = await client.query<ColumnRow>({
        text: `
          SELECT
            table_schema,
            table_name,
            column_name,
            data_type,
            is_nullable
          FROM information_schema.columns
          WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          ORDER BY table_schema, table_name, ordinal_position
        `,
      });
      return buildCatalog(result.rows);
    } finally {
      client.release();
    }
  }

  async query(
    input: PostgresQuery,
    signal?: AbortSignal,
  ): Promise<ReturnType<typeof mapQueryResult>> {
    signal?.throwIfAborted();

    const policy = assertReadOnlySql(input.sql);
    if (!policy.ok) {
      throw new PostgresQueryError("forbidden_sql", policy.reason);
    }

    const client = await this.pool.connect();
    try {
      signal?.throwIfAborted();
      const result = await client.query({
        text: policy.sql,
        values: input.params ?? [],
        rowMode: "array",
      });

      return mapQueryResult(result.fields, result.rows as unknown[][], this.maxRows);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.closed) {
      return;
    }
    this.closed = true;
    await this.pool.end();
  }
}

/**
 * Create a Postgres driver provider.
 *
 * Hosted providers (Supabase) should call this with `id` set to the product id
 * after resolving a connection string — do not reimplement SQL policy.
 */
export function postgres(
  options: PostgresOptions,
): DatabaseProvider<PostgresQuery> {
  return new PostgresProvider(options);
}
