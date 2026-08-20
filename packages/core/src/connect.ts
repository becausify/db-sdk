import type { DatabaseProvider } from "./provider.js";
import type { Catalog, DatabaseCapability, QueryResult } from "./types.js";

/**
 * Options for {@link connect}.
 */
export interface ConnectOptions<TQuery = unknown> {
  /**
   * Provider instance created by a driver or hosted provider package
   * (for example `postgres({ connectionString })` or `supabase({ … })`).
   */
  provider: DatabaseProvider<TQuery>;
}

/**
 * Handle returned by {@link connect}.
 *
 * Same lifecycle on every provider: `test`, `introspect`, `query`, `close`.
 * The query input type comes from the provider. Use {@link Database.driver}
 * to pick the query tool.
 */
export interface Database<TQuery = unknown> {
  /**
   * Provider registry id.
   */
  readonly id: string;
  /**
   * Shared database implementation (`postgres`, `firestore`, …).
   */
  readonly driver: string;
  /**
   * Capability class of the underlying provider.
   */
  readonly capability: DatabaseCapability;
  /**
   * Prove the credential works before the host saves it.
   */
  test(signal?: AbortSignal): Promise<void>;
  /**
   * Return a catalog the UI or a model can use as context.
   */
  introspect(signal?: AbortSignal): Promise<Catalog>;
  /**
   * Run a read in the provider’s native query shape.
   */
  query(input: TQuery, signal?: AbortSignal): Promise<QueryResult>;
  /**
   * Release the underlying client.
   */
  close(): Promise<void>;
}

class DatabaseHandle<TQuery> implements Database<TQuery> {
  constructor(private readonly provider: DatabaseProvider<TQuery>) {}

  get id(): string {
    return this.provider.id;
  }

  get driver(): string {
    return this.provider.driver;
  }

  get capability(): DatabaseCapability {
    return this.provider.capability;
  }

  test(signal?: AbortSignal): Promise<void> {
    return this.provider.test(signal);
  }

  introspect(signal?: AbortSignal): Promise<Catalog> {
    return this.provider.introspect(signal);
  }

  query(input: TQuery, signal?: AbortSignal): Promise<QueryResult> {
    return this.provider.query(input, signal);
  }

  close(): Promise<void> {
    return this.provider.close();
  }
}

/**
 * Open a handle to an existing database. Does not create a database and does
 * not open the client until the provider does so on `test` / `introspect` /
 * `query`.
 */
export async function connect<TQuery>(
  options: ConnectOptions<TQuery>,
): Promise<Database<TQuery>> {
  return new DatabaseHandle(options.provider);
}
