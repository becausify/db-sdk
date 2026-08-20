"use client";

import type { ComponentProps } from "react";
import { SidebarIcon } from "lucide-react";

import { SidebarTrigger } from "fumadocs-ui/layouts/notebook/slots/sidebar";

import { cn } from "@db-sdk/ui/lib/utils";

import { SiteHeader } from "./site-header";

export function DocsHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <SiteHeader
      {...props}
      id="nd-subnav"
      className={cn(
        "[grid-area:header] top-(--fd-docs-row-1) layout:[--fd-header-height:--spacing(14)]",
        className,
      )}
      sidebarToggle={
        <SidebarTrigger
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground md:hidden",
            "hover:bg-accent hover:text-accent-foreground",
          )}
          aria-label="Open sidebar"
        >
          <SidebarIcon className="size-4" />
        </SidebarTrigger>
      }
    />
  );
}
