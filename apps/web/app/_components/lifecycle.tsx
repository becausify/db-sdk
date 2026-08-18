import { Badge } from "@db-sdk/ui/components/badge";

import { Section } from "./section";

const steps = [
  {
    name: "connect",
    detail: "Turn credentials into a handle. Does not create a database.",
  },
  {
    name: "test",
    detail: "Prove the credential works before the host saves it.",
  },
  {
    name: "introspect",
    detail: "Return a catalog: namespaces, tables or collections, fields.",
  },
  {
    name: "query",
    detail: "Run a provider-native read and return a shared result envelope.",
  },
  {
    name: "close",
    detail: "Release the client when the work is done.",
  },
];

export function Lifecycle() {
  return (
    <Section>
      <h2 className="text-2xl font-semibold tracking-tight">
        One lifecycle, many providers
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Open more than one connection in the same request. DB SDK does not merge
        stores. It makes each independently testable, introspectable, and
        readable.
      </p>
      <ol className="mt-8 divide-y rounded-xl border">
        {steps.map((step, index) => (
          <li key={step.name} className="flex gap-4 px-5 py-4">
            <Badge variant="outline" className="mt-0.5 font-mono">
              {index + 1}
            </Badge>
            <div>
              <p className="font-mono text-sm font-medium">{step.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
