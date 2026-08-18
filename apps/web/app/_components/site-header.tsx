import Link from "next/link";

import { Button } from "@db-sdk/ui/components/button";
import { Container } from "@db-sdk/ui/components/container";

const GITHUB = "https://github.com/becausify/db-sdk";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          db-sdk
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="#why">Why</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="#example">Example</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="#security">Security</Link>
          </Button>
          <Button size="sm" asChild>
            <a href={GITHUB} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
