import Link from "next/link";
import { ArrowRight, Cookie } from "lucide-react";
import { getHighlightedProducts } from "@/lib/data/products";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { RealtimeRefresh } from "@/components/realtime-refresh";

export async function ProductHighlights() {
  const products = await getHighlightedProducts(6);

  return (
    <section id="favorites" className="container-page py-24 sm:py-32">
      <RealtimeRefresh tables={["products"]} />
      <SectionHeading
        eyebrow="Fan favorites"
        title={
          <>
            The snacks everyone <span className="text-gradient">keeps coming back for</span>
          </>
        }
        description="Hand-picked by our crew and loved by our community. Start here if it's your first bite."
        action={
          <Link href="/products" className={buttonVariants({ variant: "secondary" })}>
            See all snacks <ArrowRight />
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={<Cookie />}
          title="Our favorites are still in the oven"
          description="We're picking the snacks to feature here. In the meantime, browse the full lineup."
          action={
            <Link href="/products" className={buttonVariants()}>
              Browse all snacks
            </Link>
          }
        />
      ) : (
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <RevealItem key={product.id} className="h-full">
              <ProductCard product={product} priority={index < 3} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
