export function buildDirectDatabaseHost(projectRef: string): string {
  return `db.${projectRef}.supabase.co`;
}

export function buildSessionPoolerHostCandidates(region: string): string[] {
  return [
    `aws-1-${region}.pooler.supabase.com`,
    `aws-0-${region}.pooler.supabase.com`,
  ];
}

export function buildSessionPoolerUsername(projectRef: string): string {
  return `postgres.${projectRef}`;
}

export function buildSessionPoolerEndpoint(input: {
  region: string;
  projectRef: string;
}): {
  databaseHost: string;
  databasePort: number;
  databaseUser: string;
  databaseName: string;
} {
  return {
    databaseHost: buildSessionPoolerHostCandidates(input.region)[0]!,
    databasePort: 5432,
    databaseUser: buildSessionPoolerUsername(input.projectRef),
    databaseName: "postgres",
  };
}
