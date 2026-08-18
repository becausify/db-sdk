import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@db-sdk/ui/components/badge";
import { Button } from "@db-sdk/ui/components/button";

import { Section } from "./section";

const GITHUB = "https://github.com/becausify/db-sdk";
const DOCS = "https://github.com/becausify/db-sdk/tree/main/docs";

export function Hero() {
  return (
    <Section className="py-24 sm:py-32">
      <Badge variant="secondary">Early — documentation first</Badge>
      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Safely read databases through one interface.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
        A provider-agnostic TypeScript SDK for connecting to databases whose
        schema you don&apos;t control at compile time: customer stores, cross-engine
        tools, or AI-generated queries.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" asChild>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            View on GitHub
            <ArrowRightIcon />
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href={DOCS} target="_blank" rel="noreferrer">
            Read the docs
          </a>
        </Button>
      </div>
    </Section>
  );
}
