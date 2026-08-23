import { CodeWindow } from "@/app/_components/code-window";
import { Callout, Comparison } from "../_components/article";

export function PostgresContent() {
  return (
    <>
      <p>
        PostgreSQL is the first SQL driver. It should prove the core stays
        driver-agnostic: connection, introspection, parameterized SELECT,
        limits, and timeouts — not a SQL-shaped core that Firestore has to fake.
      </p>
      <CodeWindow
        filename="postgres.ts"
        code={`import { connect } from "@db-sdk/core";
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
});`}
      />
      <h2>Intended query controls</h2>
      <ul>
        <li>Reject statements that are not SELECT or WITH … SELECT</li>
        <li>Reject mutation, DDL, and multi-statement batches</li>
        <li>Use parameterized queries — values are never concatenated</li>
        <li>Enforce a row cap even if the query omits LIMIT</li>
        <li>Enforce a statement timeout</li>
      </ul>
      <Callout>
        Prefer a user with CONNECT and SELECT only. SDK SQL policy is extra,
        not the lock.
      </Callout>
    </>
  );
}

export function FirestoreContent() {
  return (
    <>
      <p>
        Firestore is the other first driver. It exists so the core cannot
        quietly become “SQL with adapters.” Catalog from collections and
        samples, read APIs only, required limits.
      </p>
      <CodeWindow
        filename="firestore.ts"
        code={`import { connect } from "@db-sdk/core";
import { firebase } from "@db-sdk/firebase";

const db = await connect({
  provider: await firebase({
    accessToken,
    projectId,
  }),
});

const sessions = await db.query({
  collection: "sessions",
  filters: [{ field: "plan", op: "==", value: "pro" }],
  limit: 20,
});`}
      />
      <h2>Intended query controls</h2>
      <ul>
        <li>Call read APIs only — never set, update, delete, or writeBatch</li>
        <li>Require a collection from the catalog or an explicit allow list</li>
        <li>Require a limit on every query</li>
        <li>Infer schema by sampling, not by downloading the collection</li>
      </ul>
      <p>
        Do not add Firestore by extending a SQL sanitizer. Add
        @db-sdk/firestore with its own read-only checks. Prefer a read-only IAM
        principal, not Editor.
      </p>
    </>
  );
}

export function ReadOnlyRoleContent() {
  return (
    <>
      <p>
        If the stored user can DELETE, a missed validation case is a write.
        Prefer credentials that cannot write even if the SDK is wrong.
      </p>
      <Comparison
        columns={["Typical credential", "Prefer"]}
        rows={[
          {
            label: "Postgres",
            left: "URI or host / user / password",
            right: "CONNECT + SELECT only",
          },
          {
            label: "Firestore",
            left: "Service account JSON",
            right: "Read-only IAM, not Editor",
          },
          {
            label: "Later drivers",
            left: "URI or provider config",
            right: "Equivalent read-only role",
          },
        ]}
      />
      <h2>Customer checklist</h2>
      <ul>
        <li>Create a read-only role (SELECT only, or IAM that can only read).</li>
        <li>Restrict schemas and collections. Do not expose payroll if the product does not need it.</li>
        <li>Use TLS. Do not disable SSL in production.</li>
        <li>Network-restrict if you can (allowlist, VPC, tunnel, private link).</li>
        <li>Rotate credentials when people leave, and revoke access when you disconnect.</li>
      </ul>
      <Callout>
        Stolen credentials should still be read-only. That is why the database
        role is the lock, and why SDK checks are extra layers.
      </Callout>
    </>
  );
}

export function ReleasingContent() {
  return (
    <>
      <p>
        This repo uses Changesets for versions, changelogs, and npm publishes.
        You do not bump versions by hand. You describe the change; CI versions
        and publishes.
      </p>
      <h2>How a release works</h2>
      <ul>
        <li>In a PR, run pnpm changeset and commit the generated file.</li>
        <li>Merge the PR to main.</li>
        <li>
          GitHub Actions opens a Version packages PR that bumps package.json,
          updates CHANGELOG, and removes consumed changeset files.
        </li>
        <li>Merge the Version PR. CI publishes to npm and creates a GitHub Release.</li>
      </ul>
      <CodeWindow
        filename="terminal"
        code={`# After you change a publishable package
pnpm changeset

# Preview version + changelog locally (optional)
pnpm version-packages

# Do not publish from your laptop. CI does that.`}
      />
      <p>
        Until 1.0.0, a minor bump is still the usual way to add features. Use
        major only when you intend to break callers.
      </p>
    </>
  );
}
