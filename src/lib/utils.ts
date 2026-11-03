import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number | string): string {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  return currency.format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rough reading estimate, used as a suggestion in the post editor. */
export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

/** Products default to available when the flag is unset. */
export function isProductAvailable(product: { is_available: boolean | null }): boolean {
  return product.is_available !== false;
}

/** Posts default to published when the flag is unset. */
export function isPostPublished(post: { published: boolean | null }): boolean {
  return post.published !== false;
}
