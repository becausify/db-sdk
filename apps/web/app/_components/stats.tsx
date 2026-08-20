import { cn } from "@db-sdk/ui/lib/utils";

const stats = [
  { value: "2.4M", label: "Weekly downloads" },
  { value: "3.1K", label: "GitHub stars" },
  { value: "84+", label: "Contributors" },
  { value: "12+", label: "Providers" },
];

export function Stats() {
  return (
    <section className="border-y">
      <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "px-6 py-10 text-center sm:py-12",
              index % 2 === 0 && "border-r",
              index < 2 && "border-b sm:border-b-0",
              "sm:border-r sm:last:border-r-0"
            )}
          >
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
