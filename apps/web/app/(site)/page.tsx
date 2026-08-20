import { Features } from "@/app/_components/features";
import { Hero } from "@/app/_components/hero";
import { ProviderStrip } from "@/app/_components/providers";
import { Recipes } from "@/app/_components/recipes";
import { Stats } from "@/app/_components/stats";
import { Toolkit } from "@/app/_components/toolkit";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Toolkit />
      <ProviderStrip />
      <Features />
      <Recipes />
    </main>
  );
}
