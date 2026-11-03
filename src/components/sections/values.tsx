import { BookHeart, Flame, HandHeart, Wheat } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    icon: BookHeart,
    title: "Recipes with a backstory",
    body: "Every snack starts with a handwritten recipe from a real family kitchen. We test until it tastes exactly like the original, then we stop.",
  },
  {
    icon: Wheat,
    title: "Ingredients you can read",
    body: "Rye, honey, sunflower seeds, real butter. Short labels, no artificial colors, and nothing you need a chemistry degree to pronounce.",
  },
  {
    icon: Flame,
    title: "Small batches, slow ovens",
    body: "We bake low and slow in small runs, the way it was done at home. It takes longer. The crunch is worth it.",
  },
  {
    icon: HandHeart,
    title: "Comfort, shared",
    body: "Russian snacks were made for tea tables crowded with friends. We're bringing that feeling to dorms, offices and late-night hangouts.",
  },
];

export function Values() {
  return (
    <section id="values" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Why it tastes like home"
              title={
                <>
                  Authentic recipes. <span className="text-gradient">Zero shortcuts.</span>
                </>
              }
              description="We didn't invent these snacks. Generations of grandmothers did. Our job is to make them the right way, and get them to you fresh."
              className="mb-8 md:mb-8"
            />
            <Reveal delay={0.1}>
              <figure className="glass rounded-3xl p-6">
                <blockquote className="font-display text-lg leading-snug text-white">
                  &ldquo;If it wouldn&apos;t pass at my grandmother&apos;s table, it doesn&apos;t leave our kitchen.&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-mist-400">The Orange Lick kitchen rule</figcaption>
              </figure>
            </Reveal>
          </div>

          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, body }, index) => (
              <RevealItem
                key={title}
                className={index % 2 === 1 ? "sm:translate-y-12" : undefined}
              >
                <article className="group h-full rounded-[var(--radius-card)] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 transition-colors hover:border-brand/40">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25 transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-ink">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-mist-400">{body}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
