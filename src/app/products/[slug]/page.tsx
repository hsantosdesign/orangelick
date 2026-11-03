import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, Leaf, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { siteConfig } from "@/lib/site";
import { cn, formatPrice, isProductAvailable } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SnackImage } from "@/components/ui/snack-image";
import { SocialIcon } from "@/components/ui/social-icon";
import { ProductCard } from "@/components/products/product-card";
import { RealtimeRefresh } from "@/components/realtime-refresh";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Snack not found" };

  return {
    title: product.name,
    description: product.short_description,
    openGraph: { title: product.name, description: product.short_description, images: [product.image_url] },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const available = isProductAvailable(product);
  const ingredients = product.ingredients?.filter((i) => i.trim().length > 0) ?? [];
  const description = product.full_description?.trim() || product.short_description;

  return (
    <>
      <RealtimeRefresh tables={["products"]} />

      <article className="container-page pb-12 pt-32 sm:pt-40">
        <Reveal>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-mist-400 transition-colors hover:text-brand">
            <ArrowLeft className="size-4" aria-hidden /> Back to all snacks
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-800">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent" />
              <div className="relative aspect-square">
                <SnackImage
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={cn("object-cover", !available && "grayscale-[60%]")}
                />
              </div>
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {product.is_highlight ? (
                  <Badge variant="solid">
                    <Sparkles aria-hidden /> Fan favorite
                  </Badge>
                ) : null}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal delay={0.05}>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="brand">{product.category}</Badge>
                {available ? (
                  <Badge variant="success">
                    <Check aria-hidden /> In stock
                  </Badge>
                ) : (
                  <Badge variant="muted">
                    <Clock aria-hidden /> Temporarily sold out
                  </Badge>
                )}
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{product.name}</h1>
              <p className="mt-5 font-display text-3xl font-bold text-brand">{formatPrice(product.price)}</p>
              <p className="mt-6 text-xl leading-relaxed text-mist">{product.short_description}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-col gap-3 sm:flex-row">
              {available ? (
                <a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
                  <ShoppingBag /> Order via Social / Delivery
                </a>
              ) : (
                <a
                  href={siteConfig.social[0]?.href ?? siteConfig.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "flex-1")}
                >
                  Get notified when it&apos;s back
                </a>
              )}
              <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "flex-1")}>
                Ask a question
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                <li className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                  <Truck className="size-5 text-brand" aria-hidden /> Local delivery &amp; shipping
                </li>
                <li className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                  <Leaf className="size-5 text-brand" aria-hidden /> Made in small batches
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-12 border-t border-white/10 pt-10">
              <h2 className="text-xl font-bold">The story</h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-mist-400">
                {description.split(/\n{2,}/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-10 border-t border-white/10 pt-10">
              <h2 className="text-xl font-bold">Ingredients</h2>
              {ingredients.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={`${index}-${ingredient}`}className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-mist-400">
                  Full ingredient list coming soon. Have an allergy question?{" "}
                  <Link href="/contact" className="text-brand underline underline-offset-4">
                    Reach out
                  </Link>{" "}
                  and we&apos;ll get back to you.
                </p>
              )}
            </Reveal>

            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-10">
              <span className="text-sm text-mist-400">Share the crunch:</span>
              {siteConfig.social.slice(0, 4).map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Orange Lick on ${social.label}`}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-mist transition-colors hover:border-brand hover:text-brand"
                >
                  <SocialIcon platform={social.platform} className="size-4" />
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="container-page py-16">
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">You might also like</h2>
          </Reveal>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <RevealItem key={item.id} className="h-full">
                <ProductCard product={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}
    </>
  );
}
