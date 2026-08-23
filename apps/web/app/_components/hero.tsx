"use client";

import { useState } from "react";

import { cn } from "@db-sdk/ui/lib/utils";

import { CodeWindow, ResultWindow } from "./code-window";
import { CopyButton } from "./copy-button";

const INSTALL = "npm install @db-sdk/core";
const AGENT_INSTALL = "npx skills add becausify/db-sdk";

const PROVIDERS = ["PostgreSQL", "Firestore"] as const;
const TABS = ["Connect", "Introspect", "Query"] as const;

type Provider = (typeof PROVIDERS)[number];
type Tab = (typeof TABS)[number];

const examples: Record<
  Tab,
  Record<
    Provider,
    { filename: string; code: string; result: string; resultTitle?: string }
  >
> = {
  Connect: {
    PostgreSQL: {
      filename: "db.ts",
      code: `import { connect } from "@db-sdk/core";
import { postgres } from "@db-sdk/postgres";

const db = await connect({
  provider: postgres({
    connectionString: process.env.DATABASE_URL,
  }),
});

await db.test();
console.log({
  id: db.id,
  driver: db.driver,
  capability: db.capability,
});`,
      resultTitle: "console",
      result: `{
  "id": "postgres",
  "driver": "postgres",
  "capability": "relational"
}`,
    },
    Firestore: {
      filename: "db.ts",
      code: `import { connect } from "@db-sdk/core";
import { firebase } from "@db-sdk/firebase";

const db = await connect({
  provider: await firebase({
    accessToken,
    projectId,
  }),
});

await db.test();
console.log({
  id: db.id,
  driver: db.driver,
  capability: db.capability,
});`,
      resultTitle: "console",
      result: `{
  "id": "firebase",
  "driver": "firestore",
  "capability": "document"
}`,
    },
  },
  Introspect: {
    PostgreSQL: {
      filename: "catalog.ts",
      code: `const catalog = await db.introspect();
console.log(catalog);`,
      resultTitle: "console",
      result: `{
  "namespaces": [
    {
      "name": "public",
      "tables": [
        {
          "name": "users",
          "fields": [
            { "name": "id", "type": "uuid" },
            { "name": "email", "type": "text" },
            { "name": "plan", "type": "text" }
          ]
        }
      ]
    }
  ]
}`,
    },
    Firestore: {
      filename: "catalog.ts",
      code: `const catalog = await db.introspect();
console.log(catalog);`,
      resultTitle: "console",
      result: `{
  "namespaces": [
    {
      "name": "default",
      "collections": [
        {
          "name": "sessions",
          "fields": [
            { "name": "plan", "type": "string" },
            { "name": "startedAt", "type": "timestamp" }
          ]
        }
      ]
    }
  ]
}`,
    },
  },
  Query: {
    PostgreSQL: {
      filename: "query.ts",
      code: `const sql = generated; // model output
const users = await db.query({
  sql,
  params: ["pro"],
});
console.log(users);`,
      resultTitle: "console",
      result: `{
  "rows": [
    { "id": "a1", "email": "ada@example.com" }
  ],
  "truncated": false
}`,
    },
    Firestore: {
      filename: "query.ts",
      code: `const input = generated; // model output
const sessions = await db.query(input);
console.log(sessions);`,
      resultTitle: "console",
      result: `{
  "rows": [
    { "id": "s1", "plan": "pro" }
  ],
  "truncated": false
}`,
    },
  },
};

export function Hero() {
  return (
    <section id="playground" className="relative scroll-mt-28 overflow-hidden px-6 pt-20 pb-16 sm:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Universal database layer for stores you don&apos;t own
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
          TypeScript SDK for databases whose schema you don&apos;t control.
          Providers for the product, drivers for the database type — query-only,
          safe for generated reads.
        </p>
        <InstallToggle />
      </div>
      <Playground />
    </section>
  );
}

function InstallToggle() {
  const [audience, setAudience] = useState<"humans" | "agents">("humans");
  const value = audience === "humans" ? INSTALL : AGENT_INSTALL;

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <div className="inline-flex rounded-full border bg-card p-1 text-sm">
        {(
          [
            ["humans", "For humans"],
            ["agents", "For agents"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setAudience(id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              audience === id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="inline-flex items-center gap-1 rounded-full border bg-card py-1.5 pr-1.5 pl-4">
        <span className="font-mono text-sm">{`$ ${value}`}</span>
        <CopyButton value={value} label="Copy command" />
      </div>
    </div>
  );
}

function Playground() {
  const [tab, setTab] = useState<Tab>("Connect");
  const [provider, setProvider] = useState<Provider>("PostgreSQL");
  const example = examples[tab][provider];

  return (
    <div className="mx-auto mt-16 w-full max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              tab === item
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <CodeWindow
          filename={example.filename}
          code={example.code}
          toolbar={
            <div className="hidden items-center rounded-full border p-0.5 text-xs sm:flex">
              {PROVIDERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setProvider(item)}
                  className={cn(
                    "rounded-full px-2.5 py-1 transition-colors",
                    provider === item
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        />
        <ResultWindow
          title={example.resultTitle ?? "Result"}
          code={example.result}
          className="hidden lg:block"
        />
      </div>
      <div className="mt-3 flex gap-2 lg:hidden">
        {PROVIDERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setProvider(item)}
            className={cn(
              "rounded-full px-3 py-1 text-xs transition-colors",
              provider === item
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Query" ? (
        <p className="mt-4 text-sm text-muted-foreground text-pretty">
          The SQL or filters can come from a model.{" "}
          <code className="text-foreground">query()</code> rejects writes, so
          only a read runs.
        </p>
      ) : null}
    </div>
  );
}
