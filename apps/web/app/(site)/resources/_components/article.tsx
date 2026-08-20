import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";

import { Container } from "@db-sdk/ui/components/container";

import {
  kindLabels,
  relatedResources,
  resourceHref,
  topicLabels,
  type Resource,
} from "@/app/_lib/resources";

export function Article({
  resource,
  children,
}: {
  resource: Resource;
  children: ReactNode;
}) {
  const related = relatedResources(resource);

  return (
    <article className="pb-24">
      <Container className="pt-12 sm:pt-16">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Resources
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {kindLabels[resource.kind]}
          </span>
          {resource.topics.map((topic) => (
            <Link
              key={topic}
              href={`/resources?topic=${topic}`}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {topicLabels[topic]}
            </Link>
          ))}
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {resource.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          {resource.description}
        </p>
        {resource.source ? (
          <a
            href={resource.source.href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {resource.source.label}
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        ) : null}
      </Container>
      <Container className="mt-12">
        <div className="max-w-3xl space-y-6 [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:text-sm [&_li]:text-muted-foreground [&_li_code]:rounded-md [&_li_code]:bg-muted [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:font-mono [&_li_code]:text-[13px] [&_li_code]:text-foreground [&_p]:text-pretty [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_code]:rounded-md [&_p_code]:bg-muted [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:font-mono [&_p_code]:text-[13px] [&_p_code]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
      {related.length > 0 ? (
        <Container className="mt-20">
          <h2 className="text-sm font-medium text-muted-foreground">Keep going</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={resourceHref(item)}
                className="rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20"
              >
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {kindLabels[item.kind]}
                </p>
                <p className="mt-2 font-medium tracking-tight">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-50 px-5 py-4 text-sm text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
      {children}
    </div>
  );
}

export function Comparison({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: Array<{ label: string; left: string; right: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium"> </th>
            <th className="px-4 py-3 font-medium">{columns[0]}</th>
            <th className="px-4 py-3 font-medium">{columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-0">
              <th className="px-4 py-3 font-medium">{row.label}</th>
              <td className="px-4 py-3 text-muted-foreground">{row.left}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
