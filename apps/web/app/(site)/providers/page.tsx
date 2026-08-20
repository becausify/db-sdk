import type { Metadata } from "next";

import { Providers } from "@/app/_components/providers";

export const metadata: Metadata = {
  title: "Providers",
  description:
    "Drivers and hosted providers for DB SDK — PostgreSQL, Firestore, Supabase, and more.",
};

export default function ProvidersPage() {
  return (
    <main>
      <Providers standalone />
    </main>
  );
}
