export const resourceKinds = ["guide", "pattern", "reference"] as const;
export type ResourceKind = (typeof resourceKinds)[number];

export const resourceTopics = [
  "postgres",
  "firestore",
  "security",
  "ai",
  "architecture",
  "runtime",
] as const;
export type ResourceTopic = (typeof resourceTopics)[number];

export const resourceIcons = [
  "book",
  "layers",
  "shield",
  "database",
  "documents",
  "sparkles",
  "combine",
  "boxes",
  "key",
  "package",
  "product",
] as const;
export type ResourceIcon = (typeof resourceIcons)[number];

export type Resource = {
  slug: string;
  kind: ResourceKind;
  title: string;
  description: string;
  topics: ResourceTopic[];
  icon: ResourceIcon;
  featured?: boolean;
  preview?: string;
  href?: string;
  source?: { label: string; href: string };
  related: string[];
};

const DOCS = "https://github.com/becausify/db-sdk/tree/main/docs";

export const resources: Resource[] = [
  {
    slug: "core-idea",
    kind: "guide",
    title: "Core idea",
    description:
      "Connect, describe, and read a database whose schema you don't control at compile time — without turning every driver into SQL.",
    topics: ["architecture"],
    icon: "book",
    featured: true,
    source: { label: "docs/core-idea.md", href: `${DOCS}/core-idea.md` },
    related: ["product", "architecture", "customer-databases"],
  },
  {
    slug: "architecture",
    kind: "guide",
    title: "Architecture",
    description:
      "One core, drivers for database types, hosted providers that reuse a driver. Shared lifecycle, native queries, one catalog shape.",
    topics: ["architecture", "runtime"],
    icon: "layers",
    source: { label: "docs/architecture.md", href: `${DOCS}/architecture.md` },
    related: ["core-idea", "runtime-registry", "postgres"],
  },
  {
    slug: "security",
    kind: "guide",
    title: "Security model",
    description:
      "Treat generated queries as untrusted. SDK checks are extra — the lock is a read-only database role.",
    topics: ["security", "ai"],
    icon: "shield",
    href: "/security",
    source: { label: "docs/security.md", href: `${DOCS}/security.md` },
    related: ["read-only-role", "ai-generated-queries", "product"],
  },
  {
    slug: "product",
    kind: "guide",
    title: "Who it's for",
    description:
      "Runtime access to customer databases, cross-driver tools, and AI hosts that need a catalog and a bounded read — not an ORM.",
    topics: ["architecture"],
    icon: "product",
    source: { label: "docs/product.md", href: `${DOCS}/product.md` },
    related: ["core-idea", "architecture", "security"],
  },
  {
    slug: "customer-databases",
    kind: "pattern",
    title: "Attach a customer database",
    description:
      "Resolve the provider from stored config, prove the credential works, then introspect the schema after they connect.",
    topics: ["runtime", "postgres", "firestore"],
    icon: "database",
    featured: true,
    preview: `const db = await connect({
  provider: registry.resolve(
    customer.provider,
    customer.credentials,
  ),
});`,
    related: ["runtime-registry", "core-idea", "read-only-role"],
  },
  {
    slug: "cross-engine",
    kind: "pattern",
    title: "Query two drivers in one workflow",
    description:
      "Open two stores in the same workflow. Same verbs, each driver's native query shape. The SDK does not translate one language into the other.",
    topics: ["postgres", "firestore", "architecture"],
    icon: "combine",
    preview: `const [left, right] = await Promise.all([
  dbA.introspect(),
  dbB.introspect(),
]);`,
    related: ["postgres", "firestore", "architecture"],
  },
  {
    slug: "ai-generated-queries",
    kind: "pattern",
    title: "Run a model-written query",
    description:
      "The app owns the model and the API key. DB SDK takes the catalog out, treats the query as untrusted input, and runs a bounded read.",
    topics: ["ai", "security", "postgres"],
    icon: "sparkles",
    preview: `const catalog = await db.introspect();
const sql = await model.generateQuery(catalog, prompt);
const result = await db.query({ sql, params });`,
    related: ["security", "read-only-role", "core-idea"],
  },
  {
    slug: "runtime-registry",
    kind: "pattern",
    title: "Resolve a provider at runtime",
    description:
      "Customer connections are a stored provider id plus credentials. A registry should open the handle without a compile-time switch.",
    topics: ["runtime", "architecture"],
    icon: "boxes",
    preview: `const registry = createRegistry({ postgres, firestore });
const db = await connect({
  provider: registry.resolve(id, credentials),
});`,
    related: ["customer-databases", "architecture", "postgres"],
  },
  {
    slug: "postgres",
    kind: "reference",
    title: "Postgres",
    description:
      "First SQL driver: connection, introspection from information_schema, parameterized SELECT, limits and timeouts.",
    topics: ["postgres", "architecture"],
    icon: "database",
    related: ["firestore", "architecture", "read-only-role"],
  },
  {
    slug: "firestore",
    kind: "reference",
    title: "Firestore driver",
    description:
      "First document driver: catalog from collections and samples, read APIs only, required limits — never SQL-over-Firestore.",
    topics: ["firestore", "architecture"],
    icon: "documents",
    related: ["postgres", "architecture", "cross-engine"],
  },
  {
    slug: "providers",
    kind: "reference",
    title: "Provider catalog",
    description:
      "Drivers and hosted providers — PostgreSQL and Firestore first, Supabase as a hosted Postgres provider, then more.",
    topics: ["postgres", "firestore", "architecture"],
    icon: "boxes",
    href: "/providers",
    related: ["postgres", "firestore", "architecture"],
  },
  {
    slug: "read-only-role",
    kind: "reference",
    title: "Read-only role checklist",
    description:
      "What the host, the customer, and the SDK each own. Prefer a dedicated SELECT-only user or read-only IAM principal.",
    topics: ["security"],
    icon: "key",
    source: { label: "docs/security.md", href: `${DOCS}/security.md` },
    related: ["security", "ai-generated-queries", "postgres"],
  },
  {
    slug: "releasing",
    kind: "reference",
    title: "Releasing packages",
    description:
      "Changesets for versions and changelogs. Describe the change in a PR; CI versions and publishes.",
    topics: ["runtime"],
    icon: "package",
    source: {
      label: "docs/releasing.md",
      href: `${DOCS}/releasing.md`,
    },
    related: ["product", "architecture"],
  },
];

export const kindLabels: Record<ResourceKind, string> = {
  guide: "Guide",
  pattern: "Pattern",
  reference: "Reference",
};

export const topicLabels: Record<ResourceTopic, string> = {
  postgres: "PostgreSQL",
  firestore: "Firestore",
  security: "Security",
  ai: "AI",
  architecture: "Architecture",
  runtime: "Runtime",
};

export function resourceHref(resource: Resource) {
  return resource.href ?? `/resources/${resource.slug}`;
}

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}

export function relatedResources(resource: Resource) {
  return resource.related
    .map((slug) => getResource(slug))
    .filter((item): item is Resource => item != null);
}
