# `@db-sdk/postgres`

Postgres **driver** for DB SDK. Query-only: `test`, `introspect`, and parameterized `SELECT`.

Hosted providers (for example `@db-sdk/supabase`) should resolve credentials, then call `postgres({ connectionString, id: "supabase" })`. Do not fork SQL policy.

```ts
import { connect } from "db-sdk";
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

See [ADR 0002](../../docs/decisions/0002-query-only.md) and [ADR 0003](../../docs/decisions/0003-providers-and-drivers.md).
