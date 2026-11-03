"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TableName } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { isLiveDataEnabled } from "@/lib/env";

/**
 * Re-renders the current server page when the given tables change.
 * Used on pages whose data is fully server-rendered (detail views, landing highlights).
 */
export function RealtimeRefresh({ tables }: { tables: TableName[] }) {
  const router = useRouter();
  const key = tables.join(",");

  useEffect(() => {
    if (!isLiveDataEnabled) return;

    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 250);
    };

    const channel = supabase.channel(`refresh-${key}-${Math.random().toString(36).slice(2)}`);
    for (const table of key.split(",") as TableName[]) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, refresh);
    }
    channel.subscribe();

    return () => {
      clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [key, router]);

  return null;
}
