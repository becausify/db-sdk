import { describe, expect, it } from "vitest";

import {
  buildDirectDatabaseHost,
  buildSessionPoolerEndpoint,
  buildSessionPoolerHostCandidates,
  buildSessionPoolerUsername,
} from "./hosts.js";

describe("supabase hosts", () => {
  it("builds direct and pooler hosts", () => {
    expect(buildDirectDatabaseHost("abcdef")).toBe("db.abcdef.supabase.co");
    expect(buildSessionPoolerHostCandidates("eu-west-1")).toEqual([
      "aws-1-eu-west-1.pooler.supabase.com",
      "aws-0-eu-west-1.pooler.supabase.com",
    ]);
    expect(buildSessionPoolerUsername("abcdef")).toBe("postgres.abcdef");
  });

  it("builds a default session pooler endpoint", () => {
    expect(
      buildSessionPoolerEndpoint({
        region: "eu-west-1",
        projectRef: "abcdef",
      }),
    ).toEqual({
      databaseHost: "aws-1-eu-west-1.pooler.supabase.com",
      databasePort: 5432,
      databaseUser: "postgres.abcdef",
      databaseName: "postgres",
    });
  });
});
