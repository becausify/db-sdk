import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@db-sdk/ui/components/card";

import { Section } from "./section";

const cases = [
  {
    title: "Customer databases",
    body: "A product attaches to each customer’s Postgres, Firestore, or other store at runtime. The schema is discovered after they connect.",
  },
  {
    title: "Cross-engine tools",
    body: "Investigation consoles and internal tools work across engines. Adding an engine should mean adding a provider, not rewriting the host.",
  },
  {
    title: "AI-generated queries",
    body: "The app owns the model and the API key. DB SDK takes the catalog out, treats the query as untrusted input, and runs a bounded read.",
  },
];

export function Why() {
  return (
    <Section id="why">
      <h2 className="text-2xl font-semibold tracking-tight">
        For databases you did not design
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        ORMs assume you chose one engine and wrote the schema. Many products
        cannot do that.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cases.map((item) => (
          <Card key={item.title} className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="text-pretty">
                {item.body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
