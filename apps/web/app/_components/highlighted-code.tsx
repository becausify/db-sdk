import type { ReactNode } from "react";

import { cn } from "@db-sdk/ui/lib/utils";

const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:import|from|const|let|var|await|async|export|function|return|new|type|interface|if|else|true|false|null|undefined)\b|\b\d+\b)/g;

const KEYWORDS = new Set([
  "import",
  "from",
  "const",
  "let",
  "var",
  "await",
  "async",
  "export",
  "function",
  "return",
  "new",
  "type",
  "interface",
  "if",
  "else",
]);

function tokenClass(value: string): string | undefined {
  if (value.startsWith("//") || value.startsWith("/*")) {
    return "text-zinc-400 dark:text-zinc-500";
  }
  if (value.startsWith('"') || value.startsWith("`")) {
    return "text-emerald-700 dark:text-emerald-400";
  }
  if (KEYWORDS.has(value)) {
    return "text-fuchsia-600 dark:text-fuchsia-400";
  }
  if (value === "true" || value === "false" || value === "null" || value === "undefined") {
    return "text-orange-600 dark:text-orange-300";
  }
  if (/^\d+$/.test(value)) {
    return "text-orange-600 dark:text-orange-300";
  }
  return undefined;
}

function highlight(code: string): ReactNode[] {
  TOKEN.lastIndex = 0;
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push(code.slice(last, index));
    }
    const value = match[0];
    const className = tokenClass(value);
    parts.push(
      className ? (
        <span key={key} className={className}>
          {value}
        </span>
      ) : (
        value
      )
    );
    key += 1;
    last = index + value.length;
  }

  if (last < code.length) {
    parts.push(code.slice(last));
  }

  return parts;
}

export function HighlightedCode({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const lineCount = code.split("\n").length;

  return (
    <pre
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)] overflow-x-auto py-4 font-mono text-[13px] leading-relaxed whitespace-pre text-zinc-800 dark:text-zinc-200",
        className
      )}
    >
      <span className="select-none px-4 text-right text-zinc-400 dark:text-zinc-600" aria-hidden>
        {Array.from({ length: lineCount }, (_, index) => (
          <span key={index} className="block">
            {index + 1}
          </span>
        ))}
      </span>
      <code className="pr-4">{highlight(code)}</code>
    </pre>
  );
}
