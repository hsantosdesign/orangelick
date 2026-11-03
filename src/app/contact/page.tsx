import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, Store } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SocialIcon } from "@/components/ui/social-icon";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, wholesale, collaborations or just saying hi. Get in touch with the Orange Lick team.",
};

const details = [
  { icon: Mail, title: "Email us", body: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Clock, title: "Response time", body: "Within 1-2 business days" },
  { icon: Store, title: "Wholesale & stores", body: "Want Orange Lick on your shelves? Tell us about your shop." },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Say privet"
        title={
          <>
            Let&apos;s talk <span className="text-gradient">snacks</span>
          </>
        }
        description="Orders, wholesale, collabs, or a snack memory you want to share. We read every message."
      />

      <section className="container-page grid gap-10 pb-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <Reveal>
          <div className="glass rounded-[2rem] p-6 sm:p-10">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-2 text-mist-400">Fields marked with an asterisk are required.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <RevealGroup className="space-y-4">
            {details.map(({ icon: Icon, title, body, href }) => (
              <RevealItem key={title}>
                <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-white">{title}</h3>
                    {href ? (
                      <a href={href} className="mt-1 block text-mist-400 transition-colors hover:text-brand">
                        {body}
                      </a>
                    ) : (
                      <p className="mt-1 text-mist-400">{body}</p>
                    )}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-brand p-6 text-ink sm:p-8">
              <h2 className="text-2xl font-extrabold !text-ink">Find us online</h2>
              <p className="mt-2 text-ink/75">The fastest way to reach us is a DM. We reply quickly.</p>
              <ul className="mt-6 space-y-2">
                {siteConfig.social.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl bg-ink/90 px-4 py-3 text-white transition-colors hover:bg-ink"
                    >
                      <span className="flex items-center gap-3">
                        <SocialIcon platform={social.platform} className="size-5 text-brand" />
                        <span className="font-semibold">{social.label}</span>
                        <span className="text-sm text-mist-500">{social.handle}</span>
                      </span>
                      <ArrowUpRight className="size-4 text-mist-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
