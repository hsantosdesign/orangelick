"use client";

import { useMemo, useState, useTransition } from "react";
import { Cookie, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/database";
import { deleteProduct, setProductFlag } from "@/app/admin/actions";
import { cn, formatPrice, isProductAvailable } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SnackImage } from "@/components/ui/snack-image";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ProductForm } from "@/components/admin/product-form";

interface ProductsManagerProps {
  products: Product[];
  onUpsert: (product: Product) => void;
  onRemove: (id: string) => void;
}

export function ProductsManager({ products, onUpsert, onRemove }: ProductsManagerProps) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => [p.name, p.category, p.slug].some((v) => v.toLowerCase().includes(term)));
  }, [products, query]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const toggle = (product: Product, field: "is_available" | "is_highlight") => {
    const current = field === "is_available" ? isProductAvailable(product) : Boolean(product.is_highlight);
    setBusyId(product.id);
    startTransition(async () => {
      const result = await setProductFlag(product.id, field, !current);
      setBusyId(null);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onUpsert(result.data);
      toast.success(result.message);
    });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      const result = await deleteProduct(target.id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onRemove(target.id);
      setDeleting(null);
      toast.success(`"${target.name}" was deleted.`);
    });
  };

  return (
    <section aria-labelledby="products-heading">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="products-heading" className="text-2xl font-bold">
            Products
          </h2>
          <p className="mt-1 text-sm text-mist-400">Add, edit and feature the snacks shown on the website.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {products.length > 0 ? (
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-mist-500 focus:border-brand focus:outline-none sm:w-60"
              />
            </label>
          ) : null}
          <Button onClick={openNew}>
            <Plus /> Add product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Cookie />}
          title="No snacks available yet"
          description="Add your first product and it will appear on the website right away."
          action={
            <Button onClick={openNew} size="lg">
              <Plus /> Add your first product
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-mist-400">No products match &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          {visible.map((product) => {
            const available = isProductAvailable(product);
            const rowBusy = busyId === product.id;
            return (
              <li key={product.id} className={cn("flex flex-col gap-4 p-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:p-5", rowBusy && "opacity-60")}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-ink-800 sm:size-20">
                    <SnackImage src={product.image_url} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{product.name}</p>
                    <p className="mt-0.5 text-sm text-mist-400">
                      {product.category} · <span className="font-semibold text-brand">{formatPrice(product.price)}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant={available ? "success" : "muted"}>{available ? "In stock" : "Sold out"}</Badge>
                      {product.is_highlight ? (
                        <Badge variant="brand">
                          <Sparkles aria-hidden /> Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button size="sm" variant="secondary" onClick={() => toggle(product, "is_available")} disabled={pending}>
                    {available ? "Mark sold out" : "Mark in stock"}
                  </Button>
                  <Button
                    size="sm"
                    variant={product.is_highlight ? "outline" : "secondary"}
                    onClick={() => toggle(product, "is_highlight")}
                    disabled={pending}
                    aria-pressed={Boolean(product.is_highlight)}
                  >
                    <Sparkles /> {product.is_highlight ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`}>
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => setDeleting(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ProductForm open={formOpen} product={editing} categories={categories} onClose={() => setFormOpen(false)} onSaved={onUpsert} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this product?"
        description={deleting ? `"${deleting.name}" will be removed from the website. This can't be undone.` : ""}
        confirmLabel="Delete product"
        pending={pending && Boolean(deleting)}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </section>
  );
}
