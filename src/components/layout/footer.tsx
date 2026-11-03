import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { SocialIcon } from "@/components/ui/social-icon";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink-900/60 backdrop-blur">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-mist-400">{siteConfig.description}</p>
            <div className="mt-6 space-y-2 text-sm text-mist-400">
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-brand" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-brand" aria-hidden />
                {siteConfig.location}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-mist-500">Explore</h3>
            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-mist transition-colors hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-mist-500">Snacks</h3>
            <ul className="mt-5 space-y-3">
              {["Traditional", "Baked", "Savory", "Sweet"].map((category) => (
                <li key={category}>
                  <Link href={`/products?category=${encodeURIComponent(category)}`} className="text-mist transition-colors hover:text-brand">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-mist-500">Follow the crunch</h3>
            <p className="mt-5 text-mist-400">New flavors, drops and behind-the-scenes, first on our socials.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siteConfig.social.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Orange Lick on ${social.label}`}
                    className="group inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-mist transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-ink"
                  >
                    <SocialIcon platform={social.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Orange Lick. Made in the USA from family recipes.</p>
          <Link href="/contact" className="inline-flex items-center gap-1 hover:text-white">
            Wholesale &amp; partnerships <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
