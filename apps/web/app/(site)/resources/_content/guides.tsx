import { CodeWindow } from "@/app/_components/code-window";
import { Callout, Comparison } from "../_components/article";

export function CoreIdeaContent() {
  return (
    <>
      <p>
        DB SDK is a runtime database adapter. It gives an application one way
        to connect, describe, and safely read a data store — including a store
        it only learned about at runtime.
      </p>
      <Callout>
        Connect to a database whose schema you don&apos;t control at compile
        time, understand what is in it, and run a bounded read through a shared
        interface, without forcing every driver into one query language.
      </Callout>
      <h2>Not an ORM</h2>
      <p>
        If Postgres is <em>your</em> application database, use an ORM. If the
        product must attach to someone else&apos;s database — or to several
        different ones in one workflow — use DB SDK.
      </p>
      <Comparison
        columns={["ORM", "DB SDK"]}
        rows={[
          { label: "Whose database?", left: "Yours", right: "Often the customer's" },
          {
            label: "When is the schema known?",
            left: "Compile time, in a file you wrote",
            right: "Runtime, after introspect()",
          },
          {
            label: "Do drivers change?",
            left: "Rarely; you picked one",
            right: "Per connection, at runtime",
          },
          {
            label: "Query style",
            left: "Typed API generated from your schema",
            right: "Provider-native, then validated",
          },
          {
            label: "Writes and migrations?",
            left: "Yes",
            right: "Never — query-only",
          },
        ]}
      />
      <h2>Not an AI framework</h2>
      <p>
        DB SDK does not talk to a model and does not take an AI API key. An
        AI-powered host may call <code>introspect()</code>, let its own model
        draft a provider-native query, then send that query to DB SDK. The
        generated query is untrusted input — the same as a query typed by a
        human.
      </p>
      <h2>Shared lifecycle, native queries</h2>
      <p>
        Every provider implements the same verbs. The catalog is shared so UIs
        and models have one picture of what exists. The query language is not.
        PostgreSQL takes SQL. Firestore takes collection queries. Hosted
        providers (Supabase) open a shared driver (Postgres).
      </p>
      <CodeWindow
        filename="lifecycle.ts"
        code={`connect({ provider })  →  test  →  introspect  →  query  →  close`}
      />
    </>
  );
}

export function ArchitectureContent() {
  return (
    <>
      <p>
        Status: intended design. Public types and <code>connect()</code> live in
        core. Driver and hosted provider packages are not implemented yet. The
        shape is one core, drivers for database types, and hosted providers that
        reuse a driver.
      </p>
      <CodeWindow
        filename="shape.txt"
        code={`db-sdk                 core types, connect(), safety helpers
  @db-sdk/postgres     Postgres driver (first)
  @db-sdk/firestore    Firestore driver (first)
  @db-sdk/supabase     hosted provider → Postgres driver
  @db-sdk/<name>       later drivers or hosted providers`}
      />
      <h2>Provider contract</h2>
      <p>
        <code>{`connect({ provider })`}</code> opens a handle to an existing
        database; it does not create one. Each provider has an <code>id</code>{" "}
        (what you stored) and a <code>driver</code> (the query family).
      </p>
      <CodeWindow
        filename="provider.ts"
        code={`interface DatabaseProvider<TQuery = unknown> {
  readonly id: string;
  readonly driver: string;
  readonly capability: "relational" | "document";
  test(signal?: AbortSignal): Promise<void>;
  introspect(signal?: AbortSignal): Promise<Catalog>;
  query(input: TQuery, signal?: AbortSignal): Promise<QueryResult>;
  close(): Promise<void>;
}`}
      />
      <h2>Catalog and results</h2>
      <p>
        Introspection returns one catalog shape so UIs and models share a
        picture of the store. Relational drivers fill it from
        information_schema. Document drivers sample documents and union keys.
        Caching is a host concern.
      </p>
      <p>
        Capabilities group tools for hosts. They do not flatten drivers into one
        AST. A later MongoDB driver should use Mongo&apos;s read API, not
        Firestore&apos;s filter list.
      </p>
      <h2>Adding a driver or hosted provider</h2>
      <ul>
        <li>
          Drivers implement test, introspect, query, and close for a database
          type.
        </li>
        <li>
          Hosted providers own product OAuth/API, then open an existing driver.
        </li>
        <li>Map native types into catalog field strings.</li>
        <li>Enforce that driver&apos;s read-only policy in query.</li>
        <li>
          Export a factory; set id and driver (often the same for raw drivers).
        </li>
      </ul>
    </>
  );
}

export function ProductContent() {
  return (
    <>
      <p>
        DB SDK is an open-source TypeScript library for runtime, query-only
        access to databases through providers and drivers. It is aimed at
        applications that cannot hard-code one schema and one database.
      </p>
      <h2>Who it is for</h2>
      <ul>
        <li>
          Product builders who need to say “connect Postgres or Firestore”
          without forking connect / introspect / query for each driver.
        </li>
        <li>
          AI application authors who already have a model and need a catalog
          plus a read-only execution path. The model key stays in the app.
        </li>
        <li>
          Customers of those products, who need an auditable story: this
          library is designed to read, not write.
        </li>
      </ul>
      <h2>What it is not</h2>
      <ul>
        <li>An ORM or query builder for your application database</li>
        <li>An AI framework, agent runtime, or prompt library</li>
        <li>A universal query language</li>
        <li>A GraphQL layer, migration tool, or sync engine</li>
        <li>A hosted connection proxy or credential vault</li>
      </ul>
      <h2>What exists today</h2>
      <p>
        Documentation of the product, security model, and intended architecture.
        Public types and a thin connect handle live in packages/core. Driver and
        hosted provider packages are not published yet.
      </p>
    </>
  );
}
