import { Container } from "@db-sdk/ui/components/container";

import { ThemeToggle } from "./theme-toggle";

const GITHUB = "https://github.com/becausify/db-sdk";

const columns = [
  {
    title: "Get started",
    links: [
      { href: "/#playground", label: "Playground" },
      { href: "/resources", label: "Resources" },
      { href: "/docs", label: "API docs" },
      { href: GITHUB, label: "GitHub", external: true },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/resources/core-idea", label: "Core idea" },
      { href: "/resources/architecture", label: "Architecture" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/#toolkit", label: "Toolkit" },
      { href: "/providers", label: "Providers" },
      { href: "/resources?kind=pattern", label: "Patterns" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-sm">
            <span className="font-medium tracking-tight">db</span>
            <span className="rounded-full border px-2 py-0.5 font-mono text-xs font-semibold">
              SDK
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            TypeScript SDK for query-only access to customer databases —
            providers for the product, drivers for the database type.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-4 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>MIT License. Query-only. Not an ORM.</p>
        <ThemeToggle />
      </Container>
    </footer>
  );
}
