"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SocialIcon } from "@/components/ui/social-icon";
import { Logo } from "@/components/layout/logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-300 sm:px-6",
          scrolled || open ? "glass shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]" : "border border-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-mist-400 hover:text-white",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/products" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            <ShoppingBag />
            Shop snacks
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-3 max-w-7xl rounded-3xl p-4 md:hidden"
          >
            <ul className="flex flex-col">
              {siteConfig.nav.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 font-display text-xl font-semibold",
                      isActive(pathname, item.href) ? "bg-white/10 text-white" : "text-mist hover:bg-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 px-2 pt-4">
              <div className="flex gap-1">
                {siteConfig.social.slice(0, 4).map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full text-mist hover:bg-white/10 hover:text-brand"
                  >
                    <SocialIcon platform={social.platform} className="size-4" />
                  </a>
                ))}
              </div>
              <Link href="/products" className={buttonVariants({ size: "sm" })}>
                Shop snacks
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
