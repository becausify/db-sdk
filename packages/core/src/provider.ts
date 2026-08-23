import type { Catalog, DatabaseCapability, QueryResult } from "./types.js";

/**
 * Contract every provider package implements.
 *
 * Query input stays generic so each driver keeps its native shape. PostgreSQL
 * takes SQL. Firestore takes collection queries. The core does not translate
 * one into the other.
 */
export interface DatabaseProvider<TQuery = unknown> {
  /**
   * Registry id, for example `"postgres"`, `"supabase"`, or `"firestore"`.
   */
  readonly id: string;
  /**
   * Shared database implementation this provider reads through, for example
   * `"postgres"` or `"firestore"`. Hosted products (Supabase) keep their own
   * `id` and set `driver` to the underlying database.
   */
  readonly driver: string;
  /**
   * Capability class for tool grouping (`relational`, `document`, …).
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
   * Run a read in this store’s native query shape.
   *
   * Intended to be read-only and fail-closed. SDK checks are extra; a
   * read-only database role is the security boundary.
   */
  query(input: TQuery, signal?: AbortSignal): Promise<QueryResult>;
  /**
   * Release the underlying client.
   */
  close(): Promise<void>;
}
