# `@db-sdk/supabase`

Supabase **hosted provider** for DB SDK. Owns OAuth + Management API + pooler resolve, then opens the Postgres **driver**.

```ts
import { connect } from "db-sdk";
import { createSupabaseConnector } from "@db-sdk/supabase";

const connector = createSupabaseConnector({
  clientId: process.env.SUPABASE_OAUTH_CLIENT_ID!,
  clientSecret: process.env.SUPABASE_OAUTH_CLIENT_SECRET!,
  redirectUri: "https://app.example.com/api/integrations/supabase/callback",
  stateSecret: process.env.OAUTH_STATE_SECRET!,
});

const { authorizeUrl } = connector.oauth.begin({
  data: { organizationId: "org_1" },
});
// redirect the browser…

// on callback:
const { tokens, data } = await connector.oauth.exchange({ code, state });
// host encrypts tokens

const projects = await connector.listProjects(tokens.accessToken);

const db = await connect({
  provider: await connector.open({
    accessToken: tokens.accessToken,
    projectRef: projects[0]!.ref,
    region: projects[0]!.region,
    password: dbPassword,
  }),
});

// db.id === "supabase", db.driver === "postgres"
await db.query({ sql: "SELECT 1", params: [] });
```

The host still owns HTTP routes, encrypted storage, and UI. See [ADR 0003](../../docs/decisions/0003-providers-and-drivers.md).
