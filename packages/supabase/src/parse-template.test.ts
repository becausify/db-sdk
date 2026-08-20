import { describe, expect, it } from "vitest";

import { parseConnectionTemplate } from "./parse-template.js";

describe("parseConnectionTemplate", () => {
  it("parses a pooler template with password placeholder", () => {
    expect(
      parseConnectionTemplate(
        "postgresql://postgres.abcdef:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
      ),
    ).toEqual({
      host: "aws-0-eu-west-1.pooler.supabase.com",
      port: 5432,
      username: "postgres.abcdef",
      database: "postgres",
    });
  });

  it("returns null for invalid input", () => {
    expect(parseConnectionTemplate("not-a-url")).toBeNull();
  });
});
