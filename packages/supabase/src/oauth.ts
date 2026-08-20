import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { SupabaseError } from "./errors.js";
import {
  SUPABASE_OAUTH_AUTHORIZE_URL,
  SUPABASE_OAUTH_TOKEN_URL,
  type SupabaseConnectorConfig,
  type SupabaseOAuthTokens,
} from "./types.js";

type TokenResponseBody = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type SignedStateBody = {
  codeVerifier: string;
  issuedAt: number;
  data?: unknown;
};

export function generatePkcePair(): {
  codeVerifier: string;
  codeChallenge: string;
} {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

export function signOAuthState(input: {
  stateSecret: string;
  codeVerifier: string;
  data?: unknown;
}): string {
  const payload = Buffer.from(
    JSON.stringify({
      codeVerifier: input.codeVerifier,
      issuedAt: Date.now(),
      data: input.data,
    } satisfies SignedStateBody),
  ).toString("base64url");

  const signature = createHmac("sha256", input.stateSecret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyOAuthState(input: {
  state: string;
  stateSecret: string;
  stateMaxAgeMs?: number;
}): { codeVerifier: string; data?: unknown } {
  const [payload, signature] = input.state.split(".");

  if (!payload || !signature) {
    throw new SupabaseError("invalid_state", "Invalid Supabase OAuth state");
  }

  const expectedSignature = createHmac("sha256", input.stateSecret)
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new SupabaseError(
      "invalid_state",
      "Invalid Supabase OAuth state signature",
    );
  }

  let parsed: SignedStateBody;
  try {
    parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SignedStateBody;
  } catch {
    throw new SupabaseError("invalid_state", "Invalid Supabase OAuth state payload");
  }

  if (
    typeof parsed.codeVerifier !== "string" ||
    typeof parsed.issuedAt !== "number"
  ) {
    throw new SupabaseError("invalid_state", "Invalid Supabase OAuth state payload");
  }

  const maxAgeMs = input.stateMaxAgeMs ?? 60 * 60 * 1000;
  if (Date.now() - parsed.issuedAt > maxAgeMs) {
    throw new SupabaseError("expired_state", "Supabase OAuth state expired");
  }

  return {
    codeVerifier: parsed.codeVerifier,
    data: parsed.data,
  };
}

export function buildAuthorizeUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    response_type: "code",
    state: input.state,
    code_challenge: input.codeChallenge,
    code_challenge_method: "S256",
  });

  return `${SUPABASE_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

async function parseTokenResponse(
  response: Response,
): Promise<SupabaseOAuthTokens> {
  const body = (await response.json()) as TokenResponseBody;

  if (!response.ok) {
    throw new SupabaseError(
      "oauth_token",
      body.error_description ??
        body.error ??
        `Supabase OAuth token exchange failed (${response.status})`,
    );
  }

  if (
    !body.access_token ||
    !body.refresh_token ||
    typeof body.expires_in !== "number"
  ) {
    throw new SupabaseError(
      "oauth_token",
      "Supabase OAuth token response was incomplete",
    );
  }

  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    expiresIn: body.expires_in,
  };
}

function basicAuth(config: Pick<SupabaseConnectorConfig, "clientId" | "clientSecret">): string {
  return Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
    "base64",
  );
}

export async function exchangeAuthorizationCode(input: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<SupabaseOAuthTokens> {
  const response = await fetch(SUPABASE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${basicAuth(input)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: input.code,
      redirect_uri: input.redirectUri,
      code_verifier: input.codeVerifier,
    }),
  });

  return parseTokenResponse(response);
}

export async function refreshAccessToken(input: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<SupabaseOAuthTokens> {
  const response = await fetch(SUPABASE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${basicAuth(input)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: input.refreshToken,
    }),
  });

  return parseTokenResponse(response);
}
