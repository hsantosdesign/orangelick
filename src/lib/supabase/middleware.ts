import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isBackendConfigured } from "@/lib/env";

const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin/dashboard";

/**
 * Refreshes the auth session cookie and guards every /admin route.
 * - Signed-out visitors are sent to the login page (with a return path).
 * - Signed-in admins visiting the login page are sent to the dashboard.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isBackendConfigured) {
    if (isLoginPage) return NextResponse.next({ request });
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the token with the auth server; do not replace with getSession().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectWithCookies = (target: URL) => {
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!user && !isLoginPage) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
    return redirectWithCookies(loginUrl);
  }

  if (user && (isLoginPage || pathname === "/admin")) {
    return redirectWithCookies(new URL(DASHBOARD_PATH, request.url));
  }

  return response;
}
