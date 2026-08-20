import { describe, expect, it } from "vitest";

import {
  buildAuthorizeUrl,
  generatePkcePair,
  signOAuthState,
  verifyOAuthState,
} from "./oauth.js";

describe("oauth helpers", () => {
  it("generates PKCE verifier and challenge", () => {
    const pair = generatePkcePair();
    expect(pair.codeVerifier.length).toBeGreaterThan(20);
    expect(pair.codeChallenge.length).toBeGreaterThan(20);
    expect(pair.codeVerifier).not.toBe(pair.codeChallenge);
  });

  it("round-trips signed state with host data", () => {
    const { codeVerifier } = generatePkcePair();
    const state = signOAuthState({
      stateSecret: "test-secret",
      codeVerifier,
      data: { organizationId: "org_1" },
    });

    const verified = verifyOAuthState({
      state,
      stateSecret: "test-secret",
    });

    expect(verified.codeVerifier).toBe(codeVerifier);
    expect(verified.data).toEqual({ organizationId: "org_1" });
  });

  it("rejects tampered state", () => {
    const { codeVerifier } = generatePkcePair();
    const state = signOAuthState({
      stateSecret: "test-secret",
      codeVerifier,
    });

    expect(() =>
      verifyOAuthState({
        state: `${state}x`,
        stateSecret: "test-secret",
      }),
    ).toThrow();
  });

  it("builds authorize URL with PKCE", () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: "client",
        redirectUri: "https://app.example.com/callback",
        state: "state",
        codeChallenge: "challenge",
      }),
    );

    expect(url.origin).toBe("https://api.supabase.com");
    expect(url.searchParams.get("client_id")).toBe("client");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("response_type")).toBe("code");
  });
});
