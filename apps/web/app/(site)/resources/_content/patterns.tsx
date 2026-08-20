import { CodeWindow } from "@/app/_components/code-window";
import { Callout } from "../_components/article";

export function CustomerDatabasesContent() {
  return (
    <>
      <p>
        A SaaS host typically stores a provider id and encrypted credentials
        per customer. When a request arrives, resolve the provider, prove the
        credential works, then discover the schema — not from a file you wrote.
      </p>
      <CodeWindow
        filename="customer.ts"
        code={`const db = await connect({
  provider: registry.resolve(
    customer.provider,
    customer.credentials,
  ),
});

await db.test();
return db.introspect();`}
      />
      <h2>Why test before you save</h2>
      <p>
        <code>test()</code> is the cheap proof that the credential works.
        Introspect after that so the UI — or a model — can see namespaces,
        tables or collections, and field names without shipping a schema file.
      </p>
      <Callout>
        DB SDK never stores credentials. Encrypt them in the host, decrypt only
        on the server, and prefer a read-only database role from the customer.
      </Callout>
    </>
  );
}

export function CrossEngineContent() {
  return (
    <>
      <p>
        Investigation consoles and support tools often need more than one store
        in the same workflow. Open each connection independently. DB SDK does
        not merge those stores or translate SQL into Firestore.
      </p>
      <CodeWindow
        filename="tools.ts"
        code={`const postgresDb = await connect({ provider: postgres(a) });
const firestoreDb = await connect({ provider: firestore(b) });

const [sqlCatalog, docsCatalog] = await Promise.all([
  postgresDb.introspect(),
  firestoreDb.introspect(),
]);`}
      />
      <h2>Same verbs, native queries</h2>
      <p>
        <code>test</code>, <code>introspect</code>, <code>query</code>, and{" "}
        <code>close</code> are the same for every provider. The query input is
        not. Postgres speaks SQL. Firestore does not. Adding a driver should
        mean adding a provider package, not rewriting the host.
      </p>
      <CodeWindow
        filename="query.ts"
        code={`const users = await postgresDb.query({
  sql: "SELECT id, email FROM users WHERE plan = $1",
  params: ["pro"],
});

const sessions = await firestoreDb.query({
  collection: "sessions",
  filters: [{ field: "plan", op: "==", value: "pro" }],
  limit: 20,
});`}
      />
    </>
  );
}

export function AiGeneratedQueriesContent() {
  return (
    <>
      <p>
        The application owns the model and the API key. DB SDK takes the
        catalog out, treats the query as untrusted input, and runs a bounded
        read. Prompt instructions are not a security boundary.
      </p>
      <CodeWindow
        filename="agent.ts"
        code={`const catalog = await db.introspect();
const sql = await model.generateQuery(catalog, prompt);

const result = await db.query({ sql, params });
// generated SQL is untrusted input`}
      />
      <Callout>
        Never skip provider checks because the model was instructed to only
        SELECT. Prefer a read-only database user as the real lock — SDK
        validation is extra.
      </Callout>
      <h2>What stays in the host</h2>
      <ul>
        <li>The model, the prompt, and the AI API key</li>
        <li>Tenant checks and credential decryption</li>
        <li>How much of the catalog you show the model</li>
      </ul>
      <p>
        DB SDK does not call a model. If a host skips tenant scoping or ships a
        writable role, that is a host bug, not “DB SDK has write access.”
      </p>
    </>
  );
}

export function RuntimeRegistryContent() {
  return (
    <>
      <p>
        Customer connections are not known at compile time. The host stores a
        provider id plus encrypted credentials, then resolves a provider when a
        request arrives. A hardcoded switch does not scale.
      </p>
      <CodeWindow
        filename="registry.ts"
        code={`import { connect, createRegistry } from "db-sdk";
import { postgres } from "@db-sdk/postgres";
import { firestore } from "@db-sdk/firestore";

const registry = createRegistry({ postgres, firestore });

const db = await connect({
  provider: registry.resolve(
    connection.provider,
    connection.credentials,
  ),
});`}
      />
      <h2>Intended direction</h2>
      <p>
        Factory functions and a registry. The exact API is not decided. The
        requirement is: a stored provider id plus credentials must be enough to
        open a connection without a compile-time switch.
      </p>
    </>
  );
}
