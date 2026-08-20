import { SupabaseError } from "./errors.js";
import {
  buildSessionPoolerEndpoint,
  buildSessionPoolerUsername,
} from "./hosts.js";
import { parseConnectionTemplate } from "./parse-template.js";
import {
  SUPABASE_MANAGEMENT_API_BASE,
  type SupabaseDatabaseEndpoint,
  type SupabaseProject,
} from "./types.js";

type ManagementProject = {
  id: string;
  ref: string;
  name: string;
  region: string;
  status: string;
};

type PoolerConfig = {
  database_type?: string;
  db_user?: string;
  db_host?: string;
  db_port?: number;
  db_name?: string;
  pool_mode?: string;
  connection_string?: string;
  connectionString?: string;
};

function mapPoolerConfig(
  config: PoolerConfig,
): SupabaseDatabaseEndpoint | null {
  const template =
    config.connection_string?.trim() || config.connectionString?.trim();

  if (template) {
    const parsed = parseConnectionTemplate(template);
    if (parsed) {
      return {
        databaseHost: parsed.host,
        databasePort: parsed.port,
        databaseUser: parsed.username,
        databaseName: parsed.database,
      };
    }
  }

  const databaseHost = config.db_host?.trim();
  const databaseUser = config.db_user?.trim();
  const databaseName = config.db_name?.trim() || "postgres";

  if (!databaseHost || !databaseUser || typeof config.db_port !== "number") {
    return null;
  }

  return {
    databaseHost,
    databasePort: config.db_port,
    databaseUser,
    databaseName,
  };
}

function pickSessionPoolerConfig(
  configs: PoolerConfig[],
): PoolerConfig | null {
  const primary = configs.filter((config) => config.database_type === "PRIMARY");
  const candidates = primary.length > 0 ? primary : configs;

  return (
    candidates.find((config) => config.pool_mode === "session") ??
    candidates.find((config) => config.db_port === 5432) ??
    candidates[0] ??
    null
  );
}

/**
 * List Supabase projects for the authorized organization.
 * Does not attach pooler endpoints — call {@link resolvePoolerEndpoint} when opening a database.
 */
export async function listProjects(
  accessToken: string,
): Promise<SupabaseProject[]> {
  const response = await fetch(`${SUPABASE_MANAGEMENT_API_BASE}/projects`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new SupabaseError(
      "management_api",
      errorBody?.message ??
        `Failed to list Supabase projects (${response.status})`,
    );
  }

  const projects = (await response.json()) as ManagementProject[];

  return projects
    .map((project) => ({
      id: project.id,
      ref: project.ref,
      name: project.name,
      region: project.region,
      status: project.status,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Resolve the preferred session-mode pooler endpoint for a project.
 */
export async function resolvePoolerEndpoint(input: {
  accessToken: string;
  projectRef: string;
  region: string;
}): Promise<SupabaseDatabaseEndpoint> {
  const response = await fetch(
    `${SUPABASE_MANAGEMENT_API_BASE}/projects/${input.projectRef}/config/database/pooler`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${input.accessToken}`,
      },
    },
  );

  if (response.ok) {
    const configs = (await response.json()) as PoolerConfig[];
    const selected = pickSessionPoolerConfig(configs);
    const mapped = selected ? mapPoolerConfig(selected) : null;

    if (mapped) {
      return {
        ...mapped,
        databaseUser:
          mapped.databaseUser || buildSessionPoolerUsername(input.projectRef),
      };
    }
  }

  return buildSessionPoolerEndpoint({
    region: input.region,
    projectRef: input.projectRef,
  });
}
