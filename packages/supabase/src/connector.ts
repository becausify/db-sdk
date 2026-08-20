import {
  buildAuthorizeUrl,
  exchangeAuthorizationCode,
  generatePkcePair,
  refreshAccessToken,
  signOAuthState,
  verifyOAuthState,
} from "./oauth.js";
import { listProjects } from "./management.js";
import { resolveDatabase, supabase } from "./supabase.js";
import type {
  SupabaseConnectorConfig,
  SupabaseOAuthTokens,
  SupabaseProject,
} from "./types.js";
import type {
  ResolveSupabaseDatabaseInput,
  ResolvedSupabaseDatabase,
  SupabaseProviderOptions,
} from "./supabase.js";
import type { DatabaseProvider } from "@db-sdk/core";
import type { PostgresQuery } from "@db-sdk/postgres";

export type SupabaseConnector = {
  oauth: {
    begin: (input?: { data?: unknown }) => {
      authorizeUrl: string;
      state: string;
    };
    exchange: (input: {
      code: string;
      state: string;
    }) => Promise<{ tokens: SupabaseOAuthTokens; data?: unknown }>;
    refresh: (refreshToken: string) => Promise<SupabaseOAuthTokens>;
  };
  listProjects: (accessToken: string) => Promise<SupabaseProject[]>;
  resolveDatabase: (
    input: ResolveSupabaseDatabaseInput,
  ) => Promise<ResolvedSupabaseDatabase>;
  open: (
    options: SupabaseProviderOptions,
  ) => Promise<DatabaseProvider<PostgresQuery>>;
};

/**
 * Create a Supabase hosted connector.
 *
 * The host supplies OAuth app credentials, redirect URI, and a state signing
 * secret. The connector never stores tokens — encrypt them in the host.
 */
export function createSupabaseConnector(
  config: SupabaseConnectorConfig,
): SupabaseConnector {
  return {
    oauth: {
      begin(input) {
        const { codeVerifier, codeChallenge } = generatePkcePair();
        const state = signOAuthState({
          stateSecret: config.stateSecret,
          codeVerifier,
          data: input?.data,
        });
        const authorizeUrl = buildAuthorizeUrl({
          clientId: config.clientId,
          redirectUri: config.redirectUri,
          state,
          codeChallenge,
        });

        return { authorizeUrl, state };
      },

      async exchange(input) {
        const verified = verifyOAuthState({
          state: input.state,
          stateSecret: config.stateSecret,
          stateMaxAgeMs: config.stateMaxAgeMs,
        });

        const tokens = await exchangeAuthorizationCode({
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          code: input.code,
          redirectUri: config.redirectUri,
          codeVerifier: verified.codeVerifier,
        });

        return { tokens, data: verified.data };
      },

      refresh(refreshToken) {
        return refreshAccessToken({
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          refreshToken,
        });
      },
    },

    listProjects,
    resolveDatabase,
    open: supabase,
  };
}
