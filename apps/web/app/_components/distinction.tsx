import { Badge } from "@db-sdk/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@db-sdk/ui/components/card";

import { Section } from "./section";

const rows = [
  {
    label: "Whose database?",
    orm: "Yours",
    sdk: "Often the customer’s",
  },
  {
    label: "When is the schema known?",
    orm: "Compile time, in a file you wrote",
    sdk: "Runtime, after introspect()",
  },
  {
    label: "Do engines change?",
    orm: "Rarely; you picked one",
    sdk: "Per connection, at runtime",
  },
  {
    label: "Query style",
    orm: "Typed API from your schema",
    sdk: "Provider-native, then validated",
  },
  {
    label: "Writes and migrations",
    orm: "Yes",
    sdk: "Out of scope",
  },
];

export function Distinction() {
  return (
    <Section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Not an ORM. Not an AI framework.
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        If Postgres is your application database, use an ORM. If the product
        must attach to someone else’s database — or several in one workflow —
        use DB SDK. Query generation stays in the application. The SDK does not
        take an AI API key.
      </p>
      <Card className="mt-8 shadow-none">
        <CardHeader className="border-b">
          <div className="grid gap-4 sm:grid-cols-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contrast
            </CardTitle>
            <Badge variant="secondary" className="w-fit">
              ORM
            </Badge>
            <Badge className="w-fit">DB SDK</Badge>
          </div>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4"
            >
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-sm text-muted-foreground">{row.orm}</p>
              <p className="text-sm">{row.sdk}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}
