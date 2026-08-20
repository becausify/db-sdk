import type { ReactNode } from "react";

import { Container } from "@db-sdk/ui/components/container";
import { cn } from "@db-sdk/ui/lib/utils";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-20 sm:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
