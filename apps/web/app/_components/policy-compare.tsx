import { CheckIcon, XIcon } from "lucide-react";

const operations = [
  {
    label: "Credentials",
    allowed: "In memory, supplied by the host",
    denied: "Persist, log, or send to a third party",
  },
  {
    label: "SQL",
    allowed: "SELECT / WITH … SELECT",
    denied: "INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, GRANT",
  },
  {
    label: "Documents",
    allowed: "get / list / find",
    denied: "set / update / delete / writeBatch",
  },
  {
    label: "Results",
    allowed: "A bounded result set",
    denied: "Dump an entire table or collection",
  },
  {
    label: "Sessions",
    allowed: "Time out a slow query",
    denied: "Hold an unbounded session",
  },
] as const;

export function PolicyCompare() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6">
        <p className="flex items-center gap-2 text-base font-semibold tracking-tight text-emerald-800 dark:text-emerald-300">
          <CheckIcon className="size-4" />
          Allowed
        </p>
        <ul className="mt-5 space-y-4">
          {operations.map((row) => (
            <li key={row.label}>
              <p className="text-[11px] font-medium tracking-wide text-emerald-800/70 uppercase dark:text-emerald-300/70">
                {row.label}
              </p>
              <p className="mt-1 flex items-start gap-2 text-sm text-emerald-950 dark:text-emerald-100">
                <CheckIcon className="mt-0.5 size-4 shrink-0" />
                {row.allowed}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-6">
        <p className="flex items-center gap-2 text-base font-semibold tracking-tight text-rose-800 dark:text-rose-300">
          <XIcon className="size-4" />
          Not allowed
        </p>
        <ul className="mt-5 space-y-4">
          {operations.map((row) => (
            <li key={row.label}>
              <p className="text-[11px] font-medium tracking-wide text-rose-800/70 uppercase dark:text-rose-300/70">
                {row.label}
              </p>
              <p className="mt-1 flex items-start gap-2 text-sm text-rose-950 dark:text-rose-100">
                <XIcon className="mt-0.5 size-4 shrink-0" />
                {row.denied}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
