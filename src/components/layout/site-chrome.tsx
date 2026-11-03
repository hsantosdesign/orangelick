"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Shows public navigation/footer everywhere except the admin portal, which has its own shell. */
export function SiteChrome({ navbar, footer, children }: { navbar: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      {navbar}
      <main id="main" className="relative">
        {children}
      </main>
      {footer}
    </>
  );
}
