/**
 * Best-effort read-only SQL policy for Postgres.
 *
 * Not a security boundary — prefer a read-only database role.
 */

const FORBIDDEN = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "CREATE",
  "ALTER",
  "TRUNCATE",
  "GRANT",
  "REVOKE",
  "EXECUTE",
  "EXEC",
  "CALL",
  "COPY",
  "MERGE",
  "VACUUM",
  "REINDEX",
  "CLUSTER",
  "COMMENT",
  "INTO",
] as const;

const SINGLE_LINE_COMMENT = /--.*$/gm;
const MULTI_LINE_COMMENT = /\/\*[\s\S]*?\*\//g;
const STRING_LITERAL = /'(?:''|[^'])*'/g;
const DOLLAR_QUOTE = /\$([A-Za-z_]*)\$[\s\S]*?\$\1\$/g;

export type SqlPolicyResult =
  | { ok: true; sql: string }
  | { ok: false; reason: string };

function stripNoise(sql: string): string {
  return sql
    .replace(SINGLE_LINE_COMMENT, " ")
    .replace(MULTI_LINE_COMMENT, " ")
    .replace(DOLLAR_QUOTE, " ")
    .replace(STRING_LITERAL, " ");
}

function hasForbiddenKeyword(normalized: string): string | null {
  for (const keyword of FORBIDDEN) {
    const pattern = new RegExp(`\\b${keyword}\\b`, "i");
    if (pattern.test(normalized)) {
      return keyword;
    }
  }
  return null;
}

function isSelectOrWithSelect(normalized: string): boolean {
  const trimmed = normalized.trim();
  if (trimmed.startsWith("SELECT")) {
    return true;
  }
  return trimmed.startsWith("WITH") && /\bSELECT\b/i.test(trimmed);
}

function hasMultipleStatements(normalized: string): boolean {
  const withoutTrailing = normalized.replace(/;\s*$/, "").trim();
  return withoutTrailing.includes(";");
}

/**
 * Validate that `sql` looks like a single read (`SELECT` or `WITH … SELECT`).
 * Returns the trimmed original SQL on success (does not inject LIMIT).
 */
export function assertReadOnlySql(sql: string): SqlPolicyResult {
  if (!sql.trim()) {
    return { ok: false, reason: "SQL query cannot be empty" };
  }

  const normalized = stripNoise(sql);

  if (hasMultipleStatements(normalized)) {
    return { ok: false, reason: "Multiple SQL statements are not allowed" };
  }

  const forbidden = hasForbiddenKeyword(normalized);
  if (forbidden) {
    return {
      ok: false,
      reason: `Statement contains forbidden keyword: ${forbidden}`,
    };
  }

  if (!isSelectOrWithSelect(normalized)) {
    return {
      ok: false,
      reason: "Only SELECT or WITH … SELECT statements are allowed",
    };
  }

  return { ok: true, sql: sql.trim() };
}
