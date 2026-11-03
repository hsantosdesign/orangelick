/**
 * Centralised access to public environment configuration.
 * NEXT_PUBLIC_* values are inlined at build time, so they are safe to read on both server and client.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "images";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * When true, public pages render the bundled sample catalog instead of live data.
 * Keep this off in production; it exists purely for local UI work.
 */
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Live data is used only when the backend is configured and mock mode is off. */
export const isLiveDataEnabled = isBackendConfigured && !USE_MOCK_DATA;
