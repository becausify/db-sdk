import type { ReactNode } from "react";

import { Container } from "@db-sdk/ui/components/container";
import { cn } from "@db-sdk/ui/lib/utils";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}
