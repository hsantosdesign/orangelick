import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/data/products";
import { GridSkeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { ProductCatalog } from "@/components/products/product-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Snacks",
  description: "Browse the full Orange Lick lineup of authentic Russian snacks: traditional, baked, savory and sweet.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        eyebrow="The lineup"
        title={
          <>
            Every snack, <span className="text-gradient">fresh from our kitchen</span>
          </>
        }
        description="Crunchy, cozy and made from family recipes. Filter by mood and find your new favorite."
      />
      <section className="container-page pb-12">
        <Suspense fallback={<GridSkeleton />}>
          <ProductCatalog initialProducts={products} />
        </Suspense>
      </section>
    </>
  );
}
