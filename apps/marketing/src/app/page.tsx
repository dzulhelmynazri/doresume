import { Button } from "@doresume/ui/components/button";
import Link from "next/link";

const features = [
  {
    description:
      "Keep one source of truth and generate targeted versions for every role.",
    title: "Tailor for each job",
  },
  {
    description:
      "Ship a clean, ATS-friendly resume without fighting a document editor.",
    title: "Export with confidence",
  },
  {
    description:
      "Use the same account across web, mobile, and the browser extension.",
    title: "Works everywhere",
  },
] as const;

const Home = () => (
  <main className="mx-auto flex max-w-5xl flex-col gap-24 px-4 py-20">
    <section className="flex flex-col items-start gap-6">
      <p className="text-muted-foreground text-sm tracking-widest uppercase">
        Marketing
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        A resume that actually gets you interviews.
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg">
        doresume helps you write, tailor, and ship a resume that matches the job
        — without the guesswork.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Get started</Button>
        <Button render={<Link href="#features" />} variant="outline">
          See features
        </Button>
      </div>
    </section>

    <section className="grid gap-6 sm:grid-cols-3" id="features">
      {features.map((feature) => (
        <article
          className="flex flex-col gap-2 rounded-lg border p-4"
          key={feature.title}
        >
          <h2 className="font-medium">{feature.title}</h2>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </article>
      ))}
    </section>
  </main>
);

export default Home;
