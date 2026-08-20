export { createSupabaseConnector } from "./connector.js";
export type { SupabaseConnector } from "./connector.js";

export { supabase, resolveDatabase } from "./supabase.js";
export type {
  ResolveSupabaseDatabaseInput,
  ResolvedSupabaseDatabase,
  SupabaseProviderOptions,
} from "./supabase.js";

export { listProjects, resolvePoolerEndpoint } from "./management.js";
export { buildConnectionString } from "./connection-string.js";
export {
  buildDirectDatabaseHost,
  buildSessionPoolerHostCandidates,
  buildSessionPoolerUsername,
  buildSessionPoolerEndpoint,
} from "./hosts.js";
export { parseConnectionTemplate } from "./parse-template.js";
export type { ParsedConnectionTemplate } from "./parse-template.js";
export { SupabaseError } from "./errors.js";

export type {
  SupabaseConnectorConfig,
  SupabaseDatabaseEndpoint,
  SupabaseOAuthTokens,
  SupabaseProject,
} from "./types.js";
