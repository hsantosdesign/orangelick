import "server-only";

import type { Product } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { USE_MOCK_DATA, isBackendConfigured } from "@/lib/env";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

/** All products for the public catalog, newest first. */
export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK_DATA) return MOCK_PRODUCTS;

  if (!isBackendConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[products] list failed:", error.message);
    return [];
  }
  return data ?? [];
}

/** Featured products (is_highlight = true) for the landing page. */
export async function getHighlightedProducts(limit = 6): Promise<Product[]> {
  if (USE_MOCK_DATA) return MOCK_PRODUCTS.filter((p) => p.is_highlight).slice(0, limit);

  if (!isBackendConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_highlight", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[products] highlights failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK_DATA) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;

  if (!isBackendConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[products] detail failed:", error.message);
    return null;
  }
  return data;
}

/** A few other products from the same category, for the "You might also like" row. */
export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
  }

  if (!isBackendConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(limit);

  if (error) {
    console.error("[products] related failed:", error.message);
    return [];
  }
  return data ?? [];
}

/** Admin view: identical to the public list, but always live. */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[products] admin list failed:", error.message);
    return [];
  }
  return data ?? [];
}
