"use client";

import { useState } from "react";

import { cn } from "@db-sdk/ui/lib/utils";

import { CodeWindow } from "./code-window";
import { Section } from "./section";

const TABS = ["PostgreSQL", "Firestore", "Registry"] as const;

const snippets: Record<(typeof TABS)[number], { filename: string; code: string }> = {
  PostgreSQL: {
    filename: "postgres.ts",
    code: `import { connect } from "db-sdk";
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
});`,
  },
  Firestore: {
    filename: "firestore.ts",
    code: `import { connect } from "db-sdk";
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
});`,
  },
  Registry: {
    filename: "registry.ts",
    code: `import { connect, createRegistry } from "db-sdk";
import { postgres } from "@db-sdk/postgres";
import { firestore } from "@db-sdk/firestore";

const registry = createRegistry({ postgres, firestore });

const db = await connect({
  provider: registry.resolve(
    connection.provider,
    connection.credentials,
  ),
});`,
  },
};

const points = [
  {
    title: "Runtime schema",
    body: "The catalog is discovered after connect — not generated from a schema file you wrote.",
  },
  {
    title: "Native queries",
    body: "Postgres speaks SQL. Firestore does not. DB SDK does not translate one language into another.",
  },
  {
    title: "Query-only",
    body: "query() is a bounded read. Writes, migrations, and LLM calls stay out of the SDK.",
  },
];

export function Toolkit() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("PostgreSQL");
  const snippet = snippets[tab];

  return (
    <Section id="toolkit">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Providers and drivers, one lifecycle
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Open-source TypeScript toolkit for customer databases and
            AI-generated reads. Hosted providers (Supabase) open a shared driver
            (Postgres). Same verbs everywhere — not one query language for every
            store.
          </p>
          <ul className="mt-8 space-y-5">
            {points.map((point) => (
              <li key={point.title}>
                <p className="font-medium">{point.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 flex flex-wrap gap-1">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  tab === item
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <CodeWindow filename={snippet.filename} code={snippet.code} />
        </div>
      </div>
    </Section>
  );
}
