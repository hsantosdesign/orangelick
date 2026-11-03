import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const team = [
  {
    name: "Anya Volkova",
    role: "Co-founder & Head Baker",
    bio: "Grew up stealing pryaniki from her grandmother's tin. Now she's the one guarding the recipes.",
    initials: "AV",
    hue: "from-brand-300 to-brand-600",
  },
  {
    name: "Dmitri Sokolov",
    role: "Co-founder & Operations",
    bio: "Turned a dorm-room snack habit into a delivery route. Knows every shipping zip code by heart.",
    initials: "DS",
    hue: "from-amber-200 to-orange-500",
  },
  {
    name: "Lena Park",
    role: "Brand & Community",
    bio: "The voice behind our socials. Believes every snack deserves a good story and a great photo.",
    initials: "LP",
    hue: "from-orange-200 to-rose-400",
  },
  {
    name: "Mikhail Ortiz",
    role: "Product & Flavor Lab",
    bio: "Half Russian, half Mexican, fully obsessed with what happens when spicy meets smoky rye.",
    initials: "MO",
    hue: "from-yellow-200 to-brand",
  },
];

export function Team() {
  return (
    <section id="team" className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="The people behind the crunch"
          title={
            <>
              A small crew with <span className="text-gradient">big appetites</span>
            </>
          }
          description="We're first-generation kids, home bakers and snack nerds who missed the flavors we grew up with, so we started making them ourselves."
        />

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <RevealItem key={member.name}>
              <article className="group relative h-full overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-brand/40">
                <div
                  aria-hidden
                  className="absolute -top-16 left-1/2 size-40 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl transition-opacity group-hover:opacity-100"
                />
                <div
                  className={`relative mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br ${member.hue} font-display text-2xl font-bold text-ink shadow-lg ring-4 ring-ink transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105`}
                  aria-hidden
                >
                  {member.initials}
                </div>
                <h3 className="relative mt-6 text-lg font-bold">{member.name}</h3>
                <p className="relative mt-1 text-sm font-medium text-brand">{member.role}</p>
                <p className="relative mt-4 text-sm leading-relaxed text-mist-400">{member.bio}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
