import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SocialIcon } from "@/components/ui/social-icon";

export function SocialBanner() {
  return (
    <section id="follow" className="container-page py-16 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-ink sm:px-12 sm:py-20 lg:px-16">
          <div aria-hidden className="grain absolute inset-0 opacity-25 mix-blend-overlay" />
          <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full border-[40px] border-ink/10" />
          <div aria-hidden className="absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-300/50 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/70">Join the crew</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] !text-ink sm:text-5xl lg:text-6xl">
                Get the first bite of every new drop.
              </h2>
              <p className="mt-6 max-w-lg text-lg text-ink/80">
                Flavor launches, restock alerts, giveaways and a peek inside the kitchen. Follow along, we post the good stuff.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {siteConfig.social.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-white transition-all hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-2xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-ink">
                        <SocialIcon platform={social.platform} className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{social.label}</span>
                        <span className="block text-sm text-mist-400">{social.handle}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 text-mist-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
