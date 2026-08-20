export type ParsedConnectionTemplate = {
  host: string;
  port: number;
  username: string;
  database: string;
};

const PASSWORD_PLACEHOLDERS = [
  "[YOUR-PASSWORD]",
  "[DB-PASSWORD]",
  "[PASSWORD]",
] as const;

/**
 * Parse a Supabase pooler connection template that may contain a password placeholder.
 */
export function parseConnectionTemplate(
  connectionString: string,
): ParsedConnectionTemplate | null {
  let normalized = connectionString.trim();

  for (const placeholder of PASSWORD_PLACEHOLDERS) {
    normalized = normalized.replaceAll(placeholder, "placeholder");
  }

  try {
    const url = new URL(normalized);
    const database = url.pathname.replace(/^\//, "");

    if (!url.hostname || !url.username || !database) {
      return null;
    }

    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      username: decodeURIComponent(url.username),
      database: decodeURIComponent(database),
    };
  } catch {
    return null;
  }
}
