import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@db-sdk/ui/components/card";

import { Section } from "./section";

const layers = [
  {
    title: "SDK",
    body: "Read-oriented API, abort, default time and row limits. Fail closed when unsure. Not a security boundary.",
  },
  {
    title: "Provider",
    body: "Engine-specific checks. SQL policy for Postgres. Read APIs only for Firestore. Not a security boundary.",
  },
  {
    title: "Runtime",
    body: "Timeouts, required or injected limits, bounded result payloads.",
  },
  {
    title: "Database",
    body: "The lock: a dedicated read-only role or IAM principal, restricted schemas, TLS.",
  },
];

export function Safety() {
  return (
    <Section id="security">
      <h2 className="text-2xl font-semibold tracking-tight">
        Treat generated queries as untrusted
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        DB SDK is designed to read, not write. SDK validation is not enough —
        especially for SQL. Prefer a read-only database user.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {layers.map((layer) => (
          <Card key={layer.title} className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">{layer.title}</CardTitle>
              <CardDescription className="text-pretty">
                {layer.body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
