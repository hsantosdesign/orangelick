import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, action }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand" aria-hidden />
          {eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? <p className="mt-5 text-lg text-mist-400">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}
