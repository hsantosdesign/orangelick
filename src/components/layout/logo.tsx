import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <circle cx="20" cy="21" r="16" fill="#F17103" />
      <path d="M20 5c1.8-2.6 5.2-3.6 8-2.4-.9 3-3.7 5-6.9 5.1" fill="#E4E5E7" />
      <path d="M20 7.2v4" stroke="#1B2024" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 22.5c2.2 4.6 5.6 6.8 9 6.8s6.8-2.2 9-6.8" fill="none" stroke="#1B2024" strokeWidth="3" strokeLinecap="round" />
      <path d="M17.5 28.6c.6 3 1.6 4.4 2.5 4.4s1.9-1.4 2.5-4.4" fill="#1B2024" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Orange Lick home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[-12deg]" />
      <span className="font-display text-lg font-bold tracking-tight text-white">
        Orange<span className="text-brand">Lick</span>
      </span>
    </Link>
  );
}
