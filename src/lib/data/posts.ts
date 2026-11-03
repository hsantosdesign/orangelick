import "server-only";

import type { Post } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { USE_MOCK_DATA, isBackendConfigured } from "@/lib/env";
import { MOCK_POSTS } from "@/lib/mock-data";
import { isPostPublished } from "@/lib/utils";

/** Published articles only, newest first. Unset `published` counts as published (column default). */
export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  if (USE_MOCK_DATA) {
    const posts = MOCK_POSTS.filter(isPostPublished).sort((a, b) => b.published_at.localeCompare(a.published_at));
    return limit ? posts.slice(0, limit) : posts;
  }

  if (!isBackendConfigured) return [];
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .or("published.is.null,published.eq.true")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[posts] list failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  if (USE_MOCK_DATA) {
    return MOCK_POSTS.find((p) => p.slug === slug && isPostPublished(p)) ?? null;
  }

  if (!isBackendConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .or("published.is.null,published.eq.true")
    .maybeSingle();

  if (error) {
    console.error("[posts] detail failed:", error.message);
    return null;
  }
  return data;
}

/** Admin view includes drafts. */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[posts] admin list failed:", error.message);
    return [];
  }
  return data ?? [];
}
