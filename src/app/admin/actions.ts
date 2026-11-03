"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Post, Product, ProductUpdate } from "@/types/database";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isBackendConfigured, STORAGE_BUCKET } from "@/lib/env";
import { storagePathFromPublicUrl } from "@/lib/storage";
import { postSchema, productSchema, toFieldErrors } from "@/lib/validation";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<string, string>> };

const SESSION_EXPIRED: ActionResult<never> = {
  ok: false,
  message: "Your session has expired. Please sign in again.",
};

/** Turns database errors into messages an admin can act on. Details stay in the server log. */
function friendlyError(error: PostgrestError, entity: "product" | "article", verb: string): ActionResult<never> {
  console.error(`[admin] ${verb} ${entity} failed:`, error.code, error.message);

  if (error.code === "23505") {
    return {
      ok: false,
      message: `That web address is already used by another ${entity}. Please choose a different one.`,
      fieldErrors: { slug: `This web address is already taken by another ${entity}.` },
    };
  }
  if (error.code === "42501" || error.code === "PGRST301") {
    return { ok: false, message: "You don't have permission to make this change. Please contact the site owner." };
  }
  return { ok: false, message: `Failed to ${verb} ${entity}. Please try again.` };
}

function refreshPublicPages(kind: "products" | "blog", slug?: string) {
  revalidatePath("/");
  revalidatePath(`/${kind}`);
  if (slug) revalidatePath(`/${kind}/${slug}`);
  revalidatePath("/admin/dashboard");
}

/** Best-effort cleanup of an uploaded image once nothing points at it. */
async function removeStoredImage(supabase: SupabaseClient<Database>, url: string | null | undefined) {
  if (!url) return;
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.warn("[admin] image cleanup skipped:", error.message);
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export type LoginState = { error?: string; email?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!isBackendConfigured) {
    return { email, error: "Sign-in is temporarily unavailable. Please try again later." };
  }
  if (!email || !password) {
    return { email, error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.warn("[admin] sign-in failed:", error.message);
    const tooMany = error.status === 429;
    return {
      email,
      error: tooMany ? "Too many attempts. Please wait a minute and try again." : "Incorrect email or password. Please try again.",
    };
  }

  // Only follow internal admin paths to avoid open redirects.
  const destination = next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/dashboard";
  redirect(destination);
}

export async function signOut() {
  if (isBackendConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export async function saveProduct(id: string | null, input: unknown): Promise<ActionResult<Product>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const now = new Date().toISOString();
  const { supabase } = session;

  if (id) {
    const { data, error } = await supabase
      .from("products")
      .update({ ...parsed.data, updated_at: now })
      .eq("id", id)
      .select()
      .single();
    if (error) return friendlyError(error, "product", "save");
    refreshPublicPages("products", data.slug);
    return { ok: true, data, message: "Product saved." };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ ...parsed.data, created_at: now, updated_at: now })
    .select()
    .single();
  if (error) return friendlyError(error, "product", "create");
  refreshPublicPages("products", data.slug);
  return { ok: true, data, message: "Product added to the catalog." };
}

export async function setProductFlag(
  id: string,
  field: "is_available" | "is_highlight",
  value: boolean,
): Promise<ActionResult<Product>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const patch: ProductUpdate = field === "is_available" ? { is_available: value } : { is_highlight: value };
  const { data, error } = await session.supabase
    .from("products")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return friendlyError(error, "product", "update");

  refreshPublicPages("products", data.slug);
  const message =
    field === "is_available"
      ? value
        ? "Marked as in stock."
        : "Marked as sold out."
      : value
        ? "Added to fan favorites."
        : "Removed from fan favorites.";
  return { ok: true, data, message };
}

export async function deleteProduct(id: string): Promise<ActionResult<{ id: string }>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const { data, error } = await session.supabase.from("products").delete().eq("id", id).select("slug, image_url").maybeSingle();
  if (error) return friendlyError(error, "product", "delete");
  if (!data) return { ok: false, message: "This product was already removed or you don't have permission to delete it." };

  await removeStoredImage(session.supabase, data.image_url);
  refreshPublicPages("products", data.slug);
  return { ok: true, data: { id }, message: "Product deleted." };
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                          */
/* ------------------------------------------------------------------ */

export async function savePost(id: string | null, input: unknown): Promise<ActionResult<Post>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const now = new Date().toISOString();
  const { supabase } = session;

  if (id) {
    const { data, error } = await supabase
      .from("posts")
      .update({ ...parsed.data, updated_at: now })
      .eq("id", id)
      .select()
      .single();
    if (error) return friendlyError(error, "article", "save");
    refreshPublicPages("blog", data.slug);
    return { ok: true, data, message: data.published === false ? "Draft saved." : "Article saved." };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...parsed.data, created_at: now, updated_at: now })
    .select()
    .single();
  if (error) return friendlyError(error, "article", "create");
  refreshPublicPages("blog", data.slug);
  return { ok: true, data, message: data.published === false ? "Draft created." : "Article published." };
}

export async function setPostPublished(id: string, published: boolean): Promise<ActionResult<Post>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const { data, error } = await session.supabase
    .from("posts")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return friendlyError(error, "article", "update");

  refreshPublicPages("blog", data.slug);
  return { ok: true, data, message: published ? "Article is now live." : "Article moved to drafts." };
}

export async function deletePost(id: string): Promise<ActionResult<{ id: string }>> {
  const session = await getAdminSession();
  if (!session) return SESSION_EXPIRED;

  const { data, error } = await session.supabase.from("posts").delete().eq("id", id).select("slug, cover_image").maybeSingle();
  if (error) return friendlyError(error, "article", "delete");
  if (!data) return { ok: false, message: "This article was already removed or you don't have permission to delete it." };

  await removeStoredImage(session.supabase, data.cover_image);
  refreshPublicPages("blog", data.slug);
  return { ok: true, data: { id }, message: "Article deleted." };
}
