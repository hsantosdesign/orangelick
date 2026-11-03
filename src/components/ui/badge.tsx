import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        brand: "bg-brand/15 text-brand ring-1 ring-brand/30",
        neutral: "bg-white/8 text-mist ring-1 ring-white/10",
        success: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/25",
        muted: "bg-white/5 text-mist-500 ring-1 ring-white/10",
        solid: "bg-brand text-ink",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
