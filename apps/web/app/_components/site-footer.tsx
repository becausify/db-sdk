import { Container } from "@db-sdk/ui/components/container";
import { Separator } from "@db-sdk/ui/components/separator";

export function SiteFooter() {
  return (
    <footer>
      <Separator />
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">db-sdk</p>
        <p>MIT License. Read-focused. Not an ORM.</p>
      </Container>
    </footer>
  );
}
