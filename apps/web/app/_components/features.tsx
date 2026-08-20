import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@db-sdk/ui/components/button";

import { CommandBar } from "./command-bar";
import { Section } from "./section";
import { securityLayers } from "./security-model";

export function Features() {
  return (
    <Section id="security">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Security
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Treat generated queries as untrusted. SDK validation is extra — the
            real lock is a read-only database user.
          </p>
        </div>
        <Button asChild>
          <Link href="/security">
            Full security model
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {securityLayers.map((layer) => (
          <div key={layer.title} className="flex flex-col rounded-xl border p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold tracking-tight">{layer.title}</h3>
              <span className="font-mono text-[11px] text-muted-foreground">
                {layer.boundary ? "the lock" : "extra"}
              </span>
            </div>
            <p className="mt-2 mb-6 flex-1 text-sm text-muted-foreground text-pretty">
              {layer.body}
            </p>
            <CommandBar command={layer.command} />
          </div>
        ))}
      </div>
    </Section>
  );
}
