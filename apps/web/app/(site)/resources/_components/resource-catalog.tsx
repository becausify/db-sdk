"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpenIcon,
  BoxesIcon,
  CombineIcon,
  DatabaseIcon,
  FileStackIcon,
  KeyRoundIcon,
  LayersIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

import { Badge } from "@db-sdk/ui/components/badge";
import { Input } from "@db-sdk/ui/components/input";
import { cn } from "@db-sdk/ui/lib/utils";

import { Section } from "@/app/_components/section";
import {
  kindLabels,
  resourceHref,
  resourceKinds,
  resources,
  topicLabels,
  type Resource,
  type ResourceIcon,
  type ResourceKind,
  type ResourceTopic,
} from "@/app/_lib/resources";

const icons: Record<ResourceIcon, typeof BookOpenIcon> = {
  book: BookOpenIcon,
  layers: LayersIcon,
  shield: ShieldIcon,
  database: DatabaseIcon,
  documents: FileStackIcon,
  sparkles: SparklesIcon,
  combine: CombineIcon,
  boxes: BoxesIcon,
  key: KeyRoundIcon,
  package: PackageIcon,
  product: TargetIcon,
};

const FILTERS: Array<{ id: "all" | ResourceKind; label: string }> = [
  { id: "all", label: "All" },
  ...resourceKinds.map((id) => ({ id, label: `${kindLabels[id]}s` })),
];

const groups = [
  {
    id: "guide" as const,
    title: "Guides",
    body: "Mental model and intended design — what DB SDK is, and what it is not.",
  },
  {
    id: "pattern" as const,
    title: "Patterns",
    body: "How a host attaches a customer database, runs a query, and resolves a provider at runtime.",
  },
  {
    id: "reference" as const,
    title: "References",
    body: "First providers, the read-only role, and how packages are released.",
  },
];

export function ResourceCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const kindParam = params.get("kind");
  const kind: "all" | ResourceKind =
    kindParam && resourceKinds.includes(kindParam as ResourceKind)
      ? (kindParam as ResourceKind)
      : "all";
  const topicParam = params.get("topic");
  const topic =
    topicParam && topicParam in topicLabels ? (topicParam as ResourceTopic) : null;

  const [query, setQuery] = useState(params.get("q") ?? "");
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function setKind(next: "all" | ResourceKind) {
    const search = new URLSearchParams();
    if (next !== "all") search.set("kind", next);
    if (topic) search.set("topic", topic);
    const suffix = search.toString();
    router.replace(suffix ? `/resources?${suffix}` : "/resources", { scroll: false });
  }

  function clearTopic() {
    const search = new URLSearchParams();
    if (kind !== "all") search.set("kind", kind);
    const suffix = search.toString();
    router.replace(suffix ? `/resources?${suffix}` : "/resources", { scroll: false });
  }

  const visible = resources.filter((resource) => {
    if (kind !== "all" && resource.kind !== kind) return false;
    if (topic && !resource.topics.includes(topic)) return false;
    if (!normalizedQuery) return true;
    return [resource.title, resource.description, kindLabels[resource.kind]]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const filtered = Boolean(normalizedQuery || kind !== "all" || topic);

  return (
    <Section>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Resources
        </h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          Guides, patterns, and references for connecting to databases you
          don&apos;t own.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setKind(item.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                kind === item.id
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
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources"
            aria-label="Search resources"
            className="pl-9"
          />
        </div>
      </div>

      {topic ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {topicLabels[topic]}
          {" · "}
          <button
            type="button"
            className="underline-offset-4 hover:text-foreground hover:underline"
            onClick={clearTopic}
          >
            Clear
          </button>
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          No resources match that search.
        </p>
      ) : filtered ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {groups.map((group) => {
            const items = visible.filter((resource) => resource.kind === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id}>
                <h2 className="text-lg font-semibold tracking-tight">{group.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {group.body}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((resource) => (
                    <ResourceCard key={resource.slug} resource={resource} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = icons[resource.icon];

  return (
    <Link
      href={resourceHref(resource)}
      className="flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground">
            <Icon className="size-4" />
          </span>
          <h3 className="font-semibold tracking-tight">{resource.title}</h3>
        </div>
        <Badge variant="outline">{kindLabels[resource.kind]}</Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        {resource.description}
      </p>
      {resource.source ? (
        <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">
          {resource.source.label}
        </p>
      ) : (
        <div className="mt-auto" />
      )}
    </Link>
  );
}
