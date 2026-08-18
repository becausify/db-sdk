import { CodeExample } from "./_components/code-example";
import { Distinction } from "./_components/distinction";
import { Hero } from "./_components/hero";
import { Lifecycle } from "./_components/lifecycle";
import { Safety } from "./_components/safety";
import { Why } from "./_components/why";

export default function Home() {
  return (
    <main>
      <Hero />
      <CodeExample />
      <Why />
      <Distinction />
      <Lifecycle />
      <Safety />
    </main>
  );
}
