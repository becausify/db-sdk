import { Badge } from "@db-sdk/ui/components/badge";

import { Section } from "./section";

const postgres = `import { connect } from "db-sdk";
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
});`;

const firestore = `import { connect } from "db-sdk";
import { firestore } from "@db-sdk/firestore";

const db = await connect({
  provider: firestore({
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
  }),
});

const sessions = await db.query({
  collection: "sessions",
  filters: [{ field: "plan", op: "==", value: "pro" }],
  limit: 20,
});`;

export function CodeExample() {
  return (
    <Section id="example" className="pt-0">
      <p className="text-sm font-medium text-muted-foreground">
        Shared lifecycle. Native queries.
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Postgres speaks SQL. Firestore does not.
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        <code className="font-mono text-sm">test</code>,{" "}
        <code className="font-mono text-sm">introspect</code>,{" "}
        <code className="font-mono text-sm">query</code>, and{" "}
        <code className="font-mono text-sm">close</code> are the same for every
        provider. The query input is not. DB SDK does not translate one language
        into another.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CodePanel label="PostgreSQL" code={postgres} />
        <CodePanel label="Firestore" code={firestore} />
      </div>
    </Section>
  );
}

function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Badge variant="outline">{label}</Badge>
        <span className="font-mono text-xs text-muted-foreground">
          intended API
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
