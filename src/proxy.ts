import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Authentication guard for the admin area (Next.js 16 "proxy", formerly middleware). */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
