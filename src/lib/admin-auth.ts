import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { isBackendConfigured } from "@/lib/env";

/** Returns the signed-in admin and a request-scoped client, or null when signed out. */
export async function getAdminSession(): Promise<{ user: User; supabase: SupabaseClient<Database> } | null> {
  if (!isBackendConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { user, supabase } : null;
}
