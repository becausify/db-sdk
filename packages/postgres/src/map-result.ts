import type { QueryResult } from "@db-sdk/core";

function cellValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Buffer.isBuffer(value)) {
    return value.toString("base64");
  }
  return JSON.stringify(value);
}

/**
 * Map a `pg` result into the shared {@link QueryResult} envelope.
 */
export function mapQueryResult(
  fields: Array<{ name: string }>,
  rows: unknown[][],
  maxRows: number,
): QueryResult {
  const truncated = rows.length > maxRows;
  const sliced = truncated ? rows.slice(0, maxRows) : rows;

  return {
    capability: "relational",
    columns: fields.map((field) => field.name),
    rows: sliced.map((row) => row.map(cellValue)),
    total: sliced.length,
    truncated,
  };
}
