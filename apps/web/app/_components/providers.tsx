"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, ArrowUpRightIcon, SearchIcon } from "lucide-react";

import { Badge } from "@db-sdk/ui/components/badge";
import { Button } from "@db-sdk/ui/components/button";
import { Input } from "@db-sdk/ui/components/input";
import { cn } from "@db-sdk/ui/lib/utils";

import { Section } from "./section";

const ARCHITECTURE =
  "https://github.com/becausify/db-sdk/blob/main/docs/architecture.md";

type Status = "First" | "Planned";
type Kind = "driver" | "hosted";

type Provider = {
  id: string;
  name: string;
  kind: Kind;
  status: Status;
  description: string;
  logo: string;
  color: string;
  pkg: string;
  driver?: string;
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "driver", label: "Drivers" },
  { id: "hosted", label: "Hosted" },
  { id: "planned", label: "Planned" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

const providers: Provider[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    kind: "driver",
    status: "First",
    description:
      "Shared Postgres driver: connection, introspection, and parameterized SELECT. Hosted products reuse this.",
    logo: "/logos/postgresql.svg",
    color: "#4169E1",
    pkg: "@db-sdk/postgres",
  },
  {
    id: "firestore",
    name: "Firestore",
    kind: "driver",
    status: "First",
    description:
      "Document driver. Catalog from collections and samples. Native filters, not SQL.",
    logo: "/logos/firebase.svg",
    color: "#FFCA28",
    pkg: "@db-sdk/firestore",
  },
  {
    id: "mysql",
    name: "MySQL",
    kind: "driver",
    status: "Planned",
    description:
      "SQL driver on the same contract as Postgres. Query language stays MySQL.",
    logo: "/logos/mysql.svg",
    color: "#4479A1",
    pkg: "@db-sdk/mysql",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    kind: "driver",
    status: "Planned",
    description:
      "Relational driver for MSSQL reads. Native T-SQL, not a Postgres dialect.",
    logo: "/logos/sqlserver.svg",
    color: "#CC2927",
    pkg: "@db-sdk/sqlserver",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    kind: "driver",
    status: "Planned",
    description:
      "Document driver with Mongo's read API. Not Firestore filters rewritten as BSON.",
    logo: "/logos/mongodb.svg",
    color: "#47A248",
    pkg: "@db-sdk/mongodb",
  },
  {
    id: "supabase",
    name: "Supabase",
    kind: "hosted",
    status: "First",
    driver: "PostgreSQL",
    description:
      "Hosted provider: OAuth, project list, pooler resolve, then the Postgres driver for reads.",
    logo: "/logos/supabase.svg",
    color: "#3ECF8E",
    pkg: "@db-sdk/supabase",
  },
  {
    id: "neon",
    name: "Neon",
    kind: "hosted",
    status: "Planned",
    driver: "PostgreSQL",
    description:
      "Hosted Postgres provider on the same driver. Until it ships, a Neon URI works with @db-sdk/postgres.",
    logo: "/logos/neon.svg",
    color: "#00E599",
    pkg: "@db-sdk/neon",
  },
  {
    id: "rds",
    name: "Amazon RDS",
    kind: "hosted",
    status: "First",
    driver: "PostgreSQL",
    description:
      "Postgres on RDS or Aurora. Use the Postgres driver with the instance URI (no separate package).",
    logo: "/logos/rds.svg",
    color: "#FF9900",
    pkg: "via @db-sdk/postgres",
  },
  {
    id: "firebase",
    name: "Firebase",
    kind: "hosted",
    status: "First",
    driver: "Firestore",
    description:
      "Firebase project credentials into the Firestore driver. Realtime Database is a separate planned driver.",
    logo: "/logos/firebase.svg",
    color: "#FFCA28",
    pkg: "via @db-sdk/firestore",
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    kind: "hosted",
    status: "Planned",
    driver: "MySQL",
    description:
      "MySQL-compatible Vitess. Will use the MySQL driver when that package ships.",
    logo: "/logos/planetscale.svg",
    color: "var(--foreground)",
    pkg: "via @db-sdk/mysql",
  },
  {
    id: "atlas",
    name: "MongoDB Atlas",
    kind: "hosted",
    status: "Planned",
    driver: "MongoDB",
    description:
      "Managed MongoDB. Will use the MongoDB driver when that package ships.",
    logo: "/logos/mongodb.svg",
    color: "#47A248",
    pkg: "via @db-sdk/mongodb",
  },
];

const groups = [
  {
    id: "driver" as const,
    title: "Drivers",
    body: "Shared database implementations. One package per query family. Hosted providers reuse these.",
  },
  {
    id: "hosted" as const,
    title: "Hosted providers",
    body: "Product OAuth and resolve on top of a driver. Supabase opens Postgres; many providers can share one driver.",
  },
];

export function ProviderStrip() {
  return (
    <Section id="providers">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Providers
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Drivers for the database type. Hosted providers for the product.
            Supabase and Neon both read through Postgres — same queries, different
            setup.
          </p>
        </div>
        <Button asChild>
          <Link href="/providers">
            Browse providers
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {providers.map((provider) => (
          <Link
            key={provider.id}
            href={`/providers#${provider.id}`}
            className="flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-colors hover:border-foreground/20"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
              <ProviderLogo
                name={provider.name}
                src={provider.logo}
                color={provider.color}
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {provider.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {provider.driver
                  ? `${provider.driver} driver`
                  : provider.status}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function Providers({ standalone = false }: { standalone?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const Heading = standalone ? "h1" : "h2";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers.filter((provider) => {
      if (filter === "driver" && provider.kind !== "driver") return false;
      if (filter === "hosted" && provider.kind !== "hosted") return false;
      if (filter === "planned" && provider.status !== "Planned") return false;
      if (!q) return true;
      return [
        provider.name,
        provider.description,
        provider.pkg,
        provider.driver ?? "",
      ].some((value) => value.toLowerCase().includes(q));
    });
  }, [filter, query]);

  return (
    <Section id={standalone ? undefined : "providers"}>
      <div className="max-w-2xl">
        <Heading className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Providers
        </Heading>
        <p className="mt-4 text-muted-foreground text-pretty">
          Install a <span className="text-foreground">driver</span> for the
          database type, or a{" "}
          <span className="text-foreground">hosted provider</span> when the
          product has its own OAuth and project APIs. Many hosted providers share
          one driver — for example{" "}
          <span className="font-mono text-foreground">@db-sdk/supabase</span>{" "}
          opens{" "}
          <span className="font-mono text-foreground">@db-sdk/postgres</span>.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                filter === item.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search providers"
            aria-label="Search providers"
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          No providers match that search.
        </p>
      ) : query || filter !== "all" ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {filter === "driver" ? <BuildYourOwnCard /> : null}
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {groups.map((group) => {
            const items = visible.filter(
              (provider) => provider.kind === group.id
            );
            return (
              <div key={group.id}>
                <h3 className="text-lg font-semibold tracking-tight">
                  {group.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {group.body}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                  {group.id === "driver" ? <BuildYourOwnCard /> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  const badge = provider.driver
    ? `${provider.driver} driver`
    : provider.status;

  return (
    <article
      id={provider.id}
      className="flex scroll-mt-28 flex-col rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border bg-background">
            <ProviderLogo
              name={provider.name}
              src={provider.logo}
              color={provider.color}
            />
          </span>
          <h3 className="font-semibold tracking-tight">{provider.name}</h3>
        </div>
        <Badge variant="outline">{badge}</Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        {provider.description}
      </p>
      <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">
        {provider.pkg}
      </p>
    </article>
  );
}

function ProviderLogo({
  name,
  src,
  color,
}: {
  name: string;
  src: string;
  color: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${name} logo`}
      className="size-5 shrink-0"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

function BuildYourOwnCard() {
  return (
    <a
      href={ARCHITECTURE}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-xl border border-dashed bg-card p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold tracking-tight">Add a driver</h3>
        <ArrowUpRightIcon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        Implement the provider contract for a new database type. Hosted products
        that speak that type should reuse the driver, not fork it.
      </p>
      <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">
        docs/architecture.md
      </p>
    </a>
  );
}
