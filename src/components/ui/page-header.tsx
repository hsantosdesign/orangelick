import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="container-page pb-12 pt-36 sm:pt-44">
      <Reveal>
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand" aria-hidden />
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {description ? <p className="mt-6 max-w-2xl text-lg text-mist-400 sm:text-xl">{description}</p> : null}
        {children}
      </Reveal>
    </header>
  );
}
