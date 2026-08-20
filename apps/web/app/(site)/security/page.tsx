import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@db-sdk/ui/components/button";
import { cn } from "@db-sdk/ui/lib/utils";

import { CodeWindow } from "@/app/_components/code-window";
import { PolicyCompare } from "@/app/_components/policy-compare";
import { Section } from "@/app/_components/section";
import { securityLayers } from "@/app/_components/security-model";

const GITHUB = "https://github.com/becausify/db-sdk";
const SECURITY_DOC = `${GITHUB}/blob/main/docs/security.md`;
const SECURITY_POLICY = `${GITHUB}/blob/main/SECURITY.md`;

export const metadata: Metadata = {
  title: "Security",
  description:
    "The DB SDK security model: read-only by design, untrusted queries, and a dedicated database role as the real lock.",
};

const toc = [
  { href: "#model", label: "Model" },
  { href: "#allowed", label: "Allowed" },
  { href: "#duties", label: "Who does what" },
  { href: "#controls", label: "Query controls" },
  { href: "#report", label: "Report" },
];

const hostDuties = [
  {
    title: "Encrypt credentials at rest",
    body: "Decrypt only on the server, for the duration of a test or query.",
  },
  {
    title: "Never send secrets to the browser",
    body: "Clients may see connection names and catalogs, not URLs or keys.",
  },
  {
    title: "Scope by tenant",
    body: "An agent or user may only use connections that tenant attached.",
  },
  {
    title: "Prefer a dedicated role",
    body: "Ask customers for a read-only user, not a superuser URL.",
  },
  {
    title: "Do not treat the SDK as a warehouse",
    body: "Avoid archiving full result dumps.",
  },
];

const customerDuties = [
  {
    title: "Create a read-only role",
    body: "SELECT only, or Firestore / IAM that can only read.",
  },
  {
    title: "Restrict schemas and collections",
    body: "Do not expose payroll or secrets tables if the product does not need them.",
  },
  {
    title: "Use TLS",
    body: "Do not disable SSL in production.",
  },
  {
    title: "Network-restrict if you can",
    body: "Allowlist, VPC, tunnel, or private link.",
  },
  {
    title: "Rotate and revoke",
    body: "Rotate credentials when people leave, and revoke access in the product when you disconnect.",
  },
];

const relationalControls = [
  "Reject statements that are not SELECT or WITH … SELECT",
  "Reject mutation, DDL, and multi-statement batches",
  "Parameterized queries — values are never concatenated",
  "Row cap even if the query omits LIMIT / TOP",
  "Statement timeout",
  "Dialect details stay in the driver",
];

const documentControls = [
  "Call read APIs only",
  "Collection from the catalog or an allow list",
  "Limit required on every query",
  "No write aggregations, $out / $merge, or write transactions",
  "Sample for schema — do not download the collection",
];

const credentials = [
  {
    provider: "Postgres",
    typical: "URI or host / user / password",
    prefer: "CONNECT + SELECT only",
  },
  {
    provider: "Firestore",
    typical: "Service account JSON",
    prefer: "Read-only IAM, not Editor",
  },
  {
    provider: "Later drivers",
    typical: "URI or provider config",
    prefer: "Equivalent read-only role",
  },
];

const flow = [
  { title: "Client", body: "Never sees the connection secret." },
  {
    title: "Host",
    body: "Decrypts credentials, checks tenant access. A model may draft a query from the catalog.",
  },
  { title: "DB SDK", body: "Validate, then a bounded read-only query." },
  { title: "Database", body: "Returns a bounded result. Nothing in this path should write." },
  { title: "Client", body: "An answer and/or a small result table." },
];

const outOfScope = [
  "Train models on customer data",
  "Sell or share rows",
  "Bypass RLS, grants, or Firestore rules",
  "Require a public IP",
];

const READONLY_ROLE = `CREATE ROLE db_sdk_reader LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE app TO db_sdk_reader;
GRANT USAGE ON SCHEMA public TO db_sdk_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_sdk_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO db_sdk_reader;`;

export default function SecurityPage() {
  return (
    <main>
      <section className="px-6 pt-20 pb-16 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            The lock is a read-only role
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
            DB SDK is designed to read, not write. It should not store
            credentials. Treat every query — especially a model-generated one —
            as untrusted.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href="mailto:security@becausify.com">Report a vulnerability</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={SECURITY_DOC} target="_blank" rel="noreferrer">
                Source of truth
                <ArrowUpRightIcon />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-3">
          {[
            ["Read, not write", "query() is a bounded read. Writes are never part of DB SDK."],
            ["In-memory credentials", "Secrets are input, never persisted."],
            ["Untrusted queries", "Prompts and SDK SQL checks are not a security boundary."],
          ].map(([title, body], index) => (
            <div
              key={title}
              className={
                index < 2
                  ? "border-b px-6 py-10 sm:border-r sm:border-b-0 sm:py-12"
                  : "px-6 py-10 sm:py-12"
              }
            >
              <p className="font-semibold tracking-tight">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="model" className="py-16 sm:py-20">
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="On this page">
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Heading
          title="Assume the query is hostile"
          body="The dangerous case is a host that runs SQL it did not write: customer input, admin consoles, or a model. No single layer is enough."
        />
        <ol className="mt-8 divide-y rounded-xl border bg-card">
          {[
            "Queries are untrusted",
            "Credentials are powerful unless the customer restricts them",
            "A sanitizer or SQL classifier can miss an edge case",
            "A compromised host can use whatever role it stored",
          ].map((item, index) => (
            <li key={item} className="flex gap-4 px-5 py-3.5">
              <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm">{item}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-16 text-xl font-semibold tracking-tight">
          Four layers. One lock.
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          SDK and provider checks are extra. If the stored user can DELETE, a
          missed validation case is a write.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {securityLayers.map((layer) => (
            <div
              key={layer.title}
              className={cn(
                "flex flex-col rounded-xl border p-5",
                layer.boundary && "border-foreground/20 bg-card"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold tracking-tight">{layer.title}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[11px]",
                    layer.boundary
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {layer.boundary ? "the lock" : "extra"}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground text-pretty">
                {layer.body}
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {layer.command}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="allowed" className="py-16 sm:py-20">
        <Heading
          title="Allowed vs not allowed"
          body="If a statement cannot be shown to be a read, it should not run. That fail-closed rule is extra — not a substitute for a read-only role."
        />
        <div className="mt-10">
          <PolicyCompare />
        </div>
      </Section>

      <Section id="duties" className="py-16 sm:py-20">
        <Heading
          title="Who does what"
          body="If a host skips these, that is a host bug — not “DB SDK has write access.” Treat a DB SDK host like any BI or support tool."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <DutyCard title="Host must" items={hostDuties} />
          <DutyCard title="Customer should" items={customerDuties} />
        </div>
        <div className="mt-12">
          <p className="font-medium">Typical Postgres read-only role</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-pretty">
            Prefer credentials that cannot write even if the SDK is wrong.
          </p>
          <div className="mt-5">
            <CodeWindow filename="readonly.sql" code={READONLY_ROLE} />
          </div>
        </div>
      </Section>

      <Section id="controls" className="py-16 sm:py-20">
        <Heading
          title="How a query is checked"
          body="Default numeric caps will be chosen in implementation. Hosts should be able to tighten them."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <ControlCard
            title="Relational"
            command="Postgres first, then other SQL drivers"
            items={relationalControls}
          />
          <ControlCard
            title="Document"
            command="Firestore first"
            items={documentControls}
          />
        </div>

        <h3 className="mt-16 text-xl font-semibold tracking-tight">
          AI-generated queries
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          DB SDK does not call a model and does not take an AI API key. Model
          output is untrusted input.
        </p>
        <ol className="mt-6 divide-y rounded-xl border bg-card">
          {[
            "Use introspect() as context — do not give the model raw credentials.",
            "Pass the model output into query() as untrusted input.",
            "Never skip provider checks because “the model was instructed to only SELECT”.",
            "Keep the AI API key in the host; the SDK does not need it.",
          ].map((item, index) => (
            <li key={item} className="flex gap-4 px-5 py-3.5">
              <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-pretty">{item}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-16 text-xl font-semibold tracking-tight">
          Credentials stay in memory
        </h3>
        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Typical</th>
                <th className="px-4 py-3 font-medium">Prefer</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((row) => (
                <tr key={row.provider} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{row.provider}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.typical}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.prefer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-16 text-xl font-semibold tracking-tight">Data flow</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          Nothing in this path should write to the customer database.
        </p>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-5">
          {flow.map((step, index) => (
            <li key={`${step.title}-${index}`} className="bg-card p-4">
              <p className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="report" className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
          <div>
            <Heading
              title="If a host is compromised"
              body="An attacker may read whatever the stored role can read. They should not be able to change data through DB SDK. Stolen credentials should still be read-only."
            />
            <p className="mt-6 text-sm font-medium">This project does not</p>
            <ul className="mt-3 space-y-2">
              {outOfScope.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <XIcon className="mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl text-sm text-muted-foreground text-pretty">
              A write that runs through{" "}
              <code className="font-mono text-foreground">query()</code> is a
              vulnerability. The SDK authenticates as the principal you
              provided — it does not bypass RLS, grants, or Firestore rules.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-lg font-semibold tracking-tight">
              Report privately
            </p>
            <p className="mt-3 text-sm text-muted-foreground text-pretty">
              If you believe DB SDK can write, bypass read-only policy, or leak
              credentials, do not open a public GitHub issue with an exploit.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild>
                <a href="mailto:security@becausify.com">
                  security@becausify.com
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={SECURITY_POLICY} target="_blank" rel="noreferrer">
                  Security policy
                  <ArrowUpRightIcon />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/#security">Back to the homepage section</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

function Heading({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground text-pretty">{body}</p>
    </div>
  );
}

function DutyCard({
  title,
  items,
}: {
  title: string;
  items: { title: string; body: string }[];
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="font-semibold tracking-tight">{title}</p>
      <ol className="mt-5 space-y-4">
        {items.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ControlCard({
  title,
  command,
  items,
}: {
  title: string;
  command: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="font-semibold tracking-tight">{title}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{command}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-pretty">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
