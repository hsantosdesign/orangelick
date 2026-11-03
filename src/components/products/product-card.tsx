import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, isProductAvailable } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SnackImage } from "@/components/ui/snack-image";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const available = isProductAvailable(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:bg-white/[0.05] hover:shadow-[0_30px_60px_-30px_rgba(241,113,3,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <SnackImage
          src={product.image_url}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="bg-ink/70 backdrop-blur">{product.category}</Badge>
          {product.is_highlight ? (
            <Badge variant="solid">
              <Sparkles aria-hidden /> Fan favorite
            </Badge>
          ) : null}
        </div>
        {!available ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/20 bg-ink/80 px-4 py-2 text-sm font-semibold text-white">
              Back soon
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-brand-300">{product.name}</h3>
          <span className="shrink-0 font-display text-lg font-bold text-brand">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-mist-400">{product.short_description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-white">
          View snack
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
