"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Cookie, Search, SearchX } from "lucide-react";
import type { Product } from "@/types/database";
import { useRealtimeRows } from "@/hooks/use-realtime-rows";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { ProductCard } from "@/components/products/product-card";

const ALL = "All";
const byNewest = (a: Product, b: Product) => b.created_at.localeCompare(a.created_at);

export function ProductCatalog({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { rows: products, status } = useRealtimeRows("products", initialProducts, { sort: byNewest });
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category.trim()).filter(Boolean)));
    return [ALL, ...unique.sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const requested = searchParams.get("category");
  const active = requested && categories.some((c) => c.toLowerCase() === requested.toLowerCase())
    ? categories.find((c) => c.toLowerCase() === requested.toLowerCase())!
    : ALL;

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === ALL) params.delete("category");
    else params.set("category", category);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((p) => {
      if (active !== ALL && p.category.trim() !== active) return false;
      if (!term) return true;
      return [p.name, p.short_description, p.category, ...(p.ingredients ?? [])].some((v) => v.toLowerCase().includes(term));
    });
  }, [products, active, query]);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Cookie />}
        title="No snacks available yet"
        description="Our first batch is almost out of the oven. Follow us on social media to be the first to know when snacks drop."
      />
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup>
          <div role="tablist" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((category) => {
              const selected = category === active;
              const count = category === ALL ? products.length : products.filter((p) => p.category.trim() === category).length;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setCategory(category)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    selected ? "border-brand text-ink" : "border-white/10 text-mist hover:border-white/30 hover:text-white",
                  )}
                >
                  {selected ? (
                    <motion.span layoutId="category-pill" className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  ) : null}
                  {category}
                  <span className={cn("ml-2 text-xs", selected ? "text-ink/70" : "text-mist-500")}>{count}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex items-center gap-4">
          <LiveIndicator status={status} className="hidden xl:inline-flex" />
          <label className="relative block w-full lg:w-72">
            <span className="sr-only">Search snacks</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search snacks or ingredients"
              className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-mist-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No snacks match your search"
          description="Try a different category or search term. New flavors land all the time."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory(ALL);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, index) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <ProductCard product={product} priority={index < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
