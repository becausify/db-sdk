import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { DocsHeader } from "@/app/_components/docs-header";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

const pageCol =
  "calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-col) - var(--fd-toc-width))";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={source.getPageTree()}
      nav={{
        ...base.nav,
        mode: "top",
      }}
      slots={{
        header: DocsHeader,
      }}
      sidebar={{
        className: "border-e bg-background",
      }}
      containerProps={{
        style: {
          gridTemplate: `"header header header header header"
"sidebar sidebar toc-popover toc-popover ."
"sidebar sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, ${pageCol}) var(--fd-toc-width) minmax(min-content, 1fr)`,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
