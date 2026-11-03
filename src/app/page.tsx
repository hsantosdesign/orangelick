import { Suspense } from "react";
import { GridSkeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/sections/hero";
import { ProductHighlights } from "@/components/sections/product-highlights";
import { SocialBanner } from "@/components/sections/social-banner";
import { Team } from "@/components/sections/team";
import { Values } from "@/components/sections/values";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div className="container-page py-24 sm:py-32">
            <GridSkeleton count={3} />
          </div>
        }
      >
        <ProductHighlights />
      </Suspense>
      <Values />
      <Team />
      <SocialBanner />
    </>
  );
}
