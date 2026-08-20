import type { Metadata } from "next";
import { Suspense } from "react";

import { ResourceCatalog } from "./_components/resource-catalog";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, patterns, and references for connecting to databases whose schema you don't control at compile time.",
};

export default function ResourcesPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <ResourceCatalog />
      </Suspense>
    </main>
  );
}
