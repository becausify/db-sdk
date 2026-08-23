/**
 * Capability class for a provider. Groups hosts that want one tool per class
 * (for example `query_sql` vs `query_documents`). Does not imply a shared
 * query AST.
 */
export type DatabaseCapability = "relational" | "document";

/**
 * A field discovered during introspection.
 */
export interface CatalogField {
  /**
   * Column or document key name.
   */
  name: string;
  /**
   * Engine-native type string, for example `"uuid"` or `"string"`.
   */
  type: string;
  /**
   * Whether the field may be null or missing.
   */
  nullable?: boolean;
}

/**
 * A table or collection inside a namespace.
 */
export interface CatalogItem {
  /**
   * Table or collection name.
   */
  name: string;
  /**
   * Fields known for this item.
   */
  fields: CatalogField[];
}

/**
 * A schema, dataset, or placeholder namespace.
 */
export interface CatalogNamespace {
  /**
   * Schema or dataset name. Use `"-"` when the engine has no namespaces.
   */
  name: string;
  /**
   * Tables or collections in this namespace.
   */
  items: CatalogItem[];
}

/**
 * Shared picture of a store after `introspect()`.
 *
 * Relational providers fill this from `information_schema` or equivalent.
 * Document providers sample documents and union keys. Caching is a host
 * concern; the SDK should always be able to refresh.
 */
export interface Catalog {
  /**
   * Capability of the provider that produced this catalog.
   */
  capability: DatabaseCapability;
  /**
   * Namespaces (schemas, datasets) and the items inside them.
   */
  namespaces: CatalogNamespace[];
}

/**
 * Normalized envelope returned by `query()`.
 *
 * Relational providers set `columns` and `rows`. Document providers set
 * `documents`. Exact cell types and document encoding may change.
 */
export interface QueryResult {
  /**
   * Capability of the provider that produced this result.
   */
  capability: DatabaseCapability;
  /**
   * Column names, when the result is tabular.
   */
  columns?: string[];
  /**
   * Tabular cells, aligned with `columns`.
   */
  rows?: Array<Array<string | number | boolean | null>>;
  /**
   * Document payloads, when the result is a collection read.
   */
  documents?: unknown[];
  /**
   * Number of rows or documents in this envelope.
   */
  total: number;
  /**
   * Whether the provider cut the result at a limit.
   */
  truncated: boolean;
}
