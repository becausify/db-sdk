"use client";

import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";

import { cn } from "@db-sdk/ui/lib/utils";

export function SiteSearch({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <FullSearchTrigger
        hideIfDisabled
        className="hidden h-8 w-52 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground md:inline-flex"
      />
      <SearchTrigger
        hideIfDisabled
        className="text-muted-foreground md:hidden"
      />
    </div>
  );
}
