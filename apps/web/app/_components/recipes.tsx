"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { CodeWindow } from "./code-window";
import { CopyButton } from "./copy-button";
import { Section } from "./section";

const INSTALL = "npm install @db-sdk/core";

const recipes = [
  {
    title: "Customer databases",
    href: "/resources/customer-databases",
    body: "Attach to each customer's Postgres, Firestore, or other store at runtime. Discover the schema after they connect.",
    filename: "customer.ts",
    code: `const db = await connect({
  provider: registry.resolve(
    customer.provider,
    customer.credentials,
  ),
});

await db.test();
return db.introspect();`,
  },
  {
    title: "Cross-driver tools",
    href: "/resources/cross-engine",
    body: "Investigation consoles work across drivers. Adding Postgres or Firestore should mean adding a provider, not rewriting the host.",
    filename: "tools.ts",
    code: `const postgresDb = await connect({ provider: postgres(a) });
const firestoreDb = await connect({ provider: firestore(b) });

const [sqlCatalog, docsCatalog] = await Promise.all([
  postgresDb.introspect(),
  firestoreDb.introspect(),
]);`,
  },
  {
    title: "AI-generated queries",
    href: "/resources/ai-generated-queries",
    body: "The app owns the model and the API key. DB SDK takes the catalog out, treats the query as untrusted input, and runs a bounded read.",
    filename: "agent.ts",
    code: `const catalog = await db.introspect();
const sql = await model.generateQuery(catalog, prompt);

const result = await db.query({ sql, params });
// generated SQL is untrusted input`,
  },
];

export function Recipes() {
  return (
    <Section id="recipes">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Build with DB SDK today
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Get started from the intended API. Packages are documentation-first
            until the first release.{" "}
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
            >
              Browse all resources
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-1 rounded-full border bg-card py-1.5 pr-1.5 pl-4">
          <span className="font-mono text-sm">$ {INSTALL}</span>
          <CopyButton value={INSTALL} label="Copy command" />
        </div>
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <article
            key={recipe.title}
            className="flex flex-col overflow-hidden rounded-xl border bg-card"
          >
            <div className="p-6">
              <h3 className="font-semibold tracking-tight">
                <Link href={recipe.href} className="hover:underline">
                  {recipe.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                {recipe.body}
              </p>
            </div>
            <CodeWindow
              filename={recipe.filename}
              code={recipe.code}
              className="rounded-none border-x-0 border-b-0"
            />
          </article>
        ))}
      </div>
    </Section>
  );
}
