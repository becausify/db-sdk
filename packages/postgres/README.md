# `@db-sdk/postgres`

Postgres **driver** for DB SDK. `test`, `introspect`, and parameterized `SELECT`.

Hosted providers (for example `@db-sdk/supabase`) should resolve credentials, then call `postgres({ connectionString, id: "supabase" })`. Do not fork SQL policy.

```ts
import { connect } from "@db-sdk/core";
import { postgres } from "@db-sdk/postgres";

const db = await connect({
  provider: postgres({
    connectionString: process.env.DATABASE_URL,
  }),
});

await db.test();
const catalog = await db.introspect();
const users = await db.query({
  sql: "SELECT id, email FROM users WHERE plan = $1",
  params: ["pro"],
});
```

`db.id` defaults to `"postgres"`. `db.driver` is always `"postgres"`.

[Read the Postgres docs](https://db-sdk.dev/docs/postgres).
