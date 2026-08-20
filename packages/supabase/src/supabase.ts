import { postgres } from "@db-sdk/postgres";
import type { DatabaseProvider } from "db-sdk";
import type { PostgresQuery } from "@db-sdk/postgres";

import { buildConnectionString } from "./connection-string.js";
import { SupabaseError } from "./errors.js";
import {
  buildDirectDatabaseHost,
  buildSessionPoolerHostCandidates,
  buildSessionPoolerUsername,
} from "./hosts.js";
import { resolvePoolerEndpoint } from "./management.js";
import type { SupabaseDatabaseEndpoint } from "./types.js";

function isTenantOrUserError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /tenant or user not found|tenant\/user/i.test(message);
}

function uniqueEndpoints(
  preferred: SupabaseDatabaseEndpoint,
  region: string,
  projectRef: string,
): SupabaseDatabaseEndpoint[] {
  const hosts = [
    preferred.databaseHost,
    ...buildSessionPoolerHostCandidates(region),
    buildDirectDatabaseHost(projectRef),
  ];

  const seen = new Set<string>();
  const endpoints: SupabaseDatabaseEndpoint[] = [];

  for (const host of hosts) {
    const key = host.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    endpoints.push({
      ...preferred,
      databaseHost: host,
      databaseUser:
        preferred.databaseUser || buildSessionPoolerUsername(projectRef),
    });
  }

  return endpoints;
}

async function probeEndpoint(
  endpoint: SupabaseDatabaseEndpoint,
  password: string,
): Promise<void> {
  const provider = postgres({
    connectionString: buildConnectionString(endpoint, password),
    statementTimeoutMs: 10_000,
  });

  try {
    await provider.test();
  } finally {
    await provider.close();
  }
}

export type ResolveSupabaseDatabaseInput = {
  accessToken: string;
  projectRef: string;
  region: string;
  password: string;
  /**
   * Probe candidate hosts until one accepts the password. Default `true`.
   */
  probe?: boolean;
};

export type ResolvedSupabaseDatabase = {
  endpoint: SupabaseDatabaseEndpoint;
  connectionString: string;
};

/**
 * Resolve a Postgres URI for a Supabase project (pooler / direct host discovery).
 */
export async function resolveDatabase(
  input: ResolveSupabaseDatabaseInput,
): Promise<ResolvedSupabaseDatabase> {
  const preferred = await resolvePoolerEndpoint({
    accessToken: input.accessToken,
    projectRef: input.projectRef,
    region: input.region,
  });

  const shouldProbe = input.probe ?? true;
  const candidates = uniqueEndpoints(
    preferred,
    input.region,
    input.projectRef,
  );

  if (!shouldProbe) {
    const endpoint = candidates[0]!;
    return {
      endpoint,
      connectionString: buildConnectionString(endpoint, input.password),
    };
  }

  let lastError: unknown;

  for (const candidate of candidates) {
    try {
      await probeEndpoint(candidate, input.password);
      return {
        endpoint: candidate,
        connectionString: buildConnectionString(candidate, input.password),
      };
    } catch (error) {
      lastError = error;
      if (!isTenantOrUserError(error)) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new SupabaseError(
        "resolve_failed",
        "Could not connect to Supabase database endpoint",
      );
}

export type SupabaseProviderOptions = ResolveSupabaseDatabaseInput & {
  maxRows?: number;
  statementTimeoutMs?: number;
  ssl?: boolean | object;
};

/**
 * Open a query-only provider for a Supabase project.
 * `id` is `"supabase"`; `driver` is `"postgres"`.
 */
export async function supabase(
  options: SupabaseProviderOptions,
): Promise<DatabaseProvider<PostgresQuery>> {
  const resolved = await resolveDatabase(options);

  return postgres({
    id: "supabase",
    connectionString: resolved.connectionString,
    maxRows: options.maxRows,
    statementTimeoutMs: options.statementTimeoutMs,
    ssl: options.ssl ?? true,
  });
}
