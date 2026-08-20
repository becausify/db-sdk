import type { SupabaseDatabaseEndpoint } from "./types.js";

/**
 * Build a Postgres URI for a Supabase database endpoint.
 */
export function buildConnectionString(
  endpoint: SupabaseDatabaseEndpoint,
  password: string,
): string {
  const user = encodeURIComponent(endpoint.databaseUser);
  const pass = encodeURIComponent(password);
  const database = encodeURIComponent(endpoint.databaseName);

  return `postgresql://${user}:${pass}@${endpoint.databaseHost}:${endpoint.databasePort}/${database}?sslmode=require`;
}
