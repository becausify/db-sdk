"use client";

import type { ReactNode } from "react";

import { cn } from "@db-sdk/ui/lib/utils";

import { CopyButton } from "./copy-button";
import { HighlightedCode } from "./highlighted-code";

export function CodeWindow({
  filename,
  code,
  toolbar,
  className,
  footer,
}: {
  filename?: string;
  code: string;
  toolbar?: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        {filename ? (
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          <CopyButton value={code} label="Copy code" />
        </div>
      </div>
      <HighlightedCode code={code} />
      {footer}
    </div>
  );
}

export function ResultWindow({
  title = "Result",
  code,
  className,
}: {
  title?: string;
  code: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      <div className="border-b px-4 py-2.5">
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <HighlightedCode code={code} />
    </div>
  );
}
