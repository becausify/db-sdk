"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRightIcon } from "lucide-react";

import { cn } from "@db-sdk/ui/lib/utils";

export function NavLink({
  href,
  children,
  active,
  external,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  external?: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    active ??
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  const className = cn(
    "inline-flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
    isActive && "text-foreground",
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ArrowUpRightIcon className="size-3.5" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
