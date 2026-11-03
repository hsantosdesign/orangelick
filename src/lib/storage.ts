import { STORAGE_BUCKET, SUPABASE_URL } from "@/lib/env";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"] as const;

const publicPrefix = () => `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/`;

/** Returns the object path inside our bucket for an uploaded image, or null for external/local images. */
export function storagePathFromPublicUrl(url: string): string | null {
  if (!SUPABASE_URL) return null;
  const prefix = publicPrefix();
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length).split("?")[0] ?? "");
}

/** Images we host can be resized by the image optimizer; anything else is served as-is. */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return !src.endsWith(".svg");
  if (/^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src)) return true;
  return Boolean(SUPABASE_URL) && src.startsWith(`${SUPABASE_URL}/storage/v1/object/public/`);
}

export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Please choose a JPG, PNG, WebP, AVIF or GIF image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "That image is larger than 5 MB. Please choose a smaller one.";
  }
  return null;
}

export function buildImagePath(folder: "products" | "posts", file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const unique = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `${folder}/${unique}.${extension}`;
}
