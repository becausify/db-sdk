import { describe, expect, it } from "vitest";

import { assertReadOnlySql } from "./sql-policy.js";

describe("assertReadOnlySql", () => {
  it("allows SELECT", () => {
    expect(assertReadOnlySql("SELECT id FROM users").ok).toBe(true);
  });

  it("allows WITH … SELECT", () => {
    expect(
      assertReadOnlySql(
        "WITH active AS (SELECT id FROM users) SELECT * FROM active",
      ).ok,
    ).toBe(true);
  });

  it("allows trailing semicolon", () => {
    expect(assertReadOnlySql("SELECT 1;").ok).toBe(true);
  });

  it("rejects empty SQL", () => {
    expect(assertReadOnlySql("   ").ok).toBe(false);
  });

  it("rejects INSERT", () => {
    expect(
      assertReadOnlySql("INSERT INTO users (id) VALUES (1)").ok,
    ).toBe(false);
  });

  it("rejects DELETE", () => {
    expect(assertReadOnlySql("DELETE FROM users").ok).toBe(false);
  });

  it("rejects DROP", () => {
    expect(assertReadOnlySql("DROP TABLE users").ok).toBe(false);
  });

  it("rejects multi-statement batches", () => {
    expect(assertReadOnlySql("SELECT 1; SELECT 2").ok).toBe(false);
  });

  it("ignores keywords inside string literals", () => {
    expect(
      assertReadOnlySql(
        "SELECT id FROM users WHERE note = 'please DELETE nothing'",
      ).ok,
    ).toBe(true);
  });

  it("ignores keywords inside comments", () => {
    expect(
      assertReadOnlySql("SELECT id FROM users -- DELETE FROM users").ok,
    ).toBe(true);
  });
});
