"use client";

import { CopyButton } from "./copy-button";

export function CommandBar({ command }: { command: string }) {
  return (
    <div className="mt-auto flex items-center gap-1 rounded-lg border bg-background py-1 pr-1 pl-3">
      <span className="min-w-0 flex-1 truncate font-mono text-sm">
        $ {command}
      </span>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}
