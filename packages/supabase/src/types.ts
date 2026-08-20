export type SupabaseOAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type SupabaseProject = {
  id: string;
  ref: string;
  name: string;
  region: string;
  status: string;
};

export type SupabaseDatabaseEndpoint = {
  databaseHost: string;
  databasePort: number;
  databaseUser: string;
  databaseName: string;
};

export type SupabaseConnectorConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  /**
   * Secret used to HMAC-sign OAuth `state`. Host-owned; never hard-code a product auth secret.
   */
  stateSecret: string;
  /**
   * Max age for OAuth state in milliseconds. Default one hour.
   */
  stateMaxAgeMs?: number;
};

export const SUPABASE_OAUTH_AUTHORIZE_URL =
  "https://api.supabase.com/v1/oauth/authorize";
export const SUPABASE_OAUTH_TOKEN_URL =
  "https://api.supabase.com/v1/oauth/token";
export const SUPABASE_MANAGEMENT_API_BASE = "https://api.supabase.com/v1";
