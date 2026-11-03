import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mb-6 flex size-20 items-center justify-center rounded-3xl bg-brand/10 text-brand ring-1 ring-brand/25 [&_svg]:size-9">
        {icon}
      </div>
      <h3 className="relative text-xl font-bold sm:text-2xl">{title}</h3>
      <p className="relative mt-3 max-w-md text-mist-400">{description}</p>
      {action ? <div className="relative mt-8">{action}</div> : null}
    </div>
  );
}
