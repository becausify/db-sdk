"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

import { Container } from "@db-sdk/ui/components/container";
import { cn } from "@db-sdk/ui/lib/utils";

import { NavLink } from "./nav-link";
import { SiteSearch } from "./site-search";

const GITHUB = "https://github.com/becausify/db-sdk";

export function SiteChrome() {
  return <SiteHeader />;
}

export function SiteHeader({
  className,
  sidebarToggle,
  ...props
}: ComponentProps<"header"> & { sidebarToggle?: ReactNode }) {
  const pathname = usePathname();
  const docsActive =
    pathname === "/docs" ||
    (pathname.startsWith("/docs/") && !pathname.startsWith("/docs/api"));
  const apiActive =
    pathname === "/docs/api" || pathname.startsWith("/docs/api/");

  return (
    <header
      {...props}
      className={cn("sticky top-0 z-50 border-b bg-background", className)}
    >
      <Container className="flex h-14 items-center gap-6">
        {sidebarToggle}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-medium tracking-tight">db</span>
          <span className="rounded-full border px-2 py-0.5 font-mono text-xs font-semibold tracking-tight">
            SDK
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          <NavLink href="/docs" active={docsActive}>
            Docs
          </NavLink>
          <span className="hidden items-center gap-5 sm:contents">
            <NavLink href="/providers">Providers</NavLink>
            <NavLink href="/security">Security</NavLink>
            <NavLink href="/docs/api" active={apiActive}>
              API
            </NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href={GITHUB} external>
              GitHub
            </NavLink>
          </span>
        </nav>
        <SiteSearch className="ms-auto" />
      </Container>
    </header>
  );
}
