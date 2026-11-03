"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { TableName, Tables } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { isLiveDataEnabled } from "@/lib/env";

export type LiveStatus = "connecting" | "live" | "offline";

interface Options<T> {
  /** Rows that fail this check are removed (e.g. unpublished posts on the public blog). */
  include?: (row: T) => boolean;
  sort?: (a: T, b: T) => number;
}

/**
 * Keeps a list of rows in sync with database changes without a page refresh.
 * Seeded from server-rendered rows; re-seeded whenever the server sends a fresh list.
 */
export function useRealtimeRows<N extends TableName>(table: N, initialRows: Tables<N>[], options: Options<Tables<N>> = {}) {
  type Row = Tables<N>;
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [status, setStatus] = useState<LiveStatus>(isLiveDataEnabled ? "connecting" : "offline");
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  useEffect(() => {
    if (!isLiveDataEnabled) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`live-${table}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload: RealtimePostgresChangesPayload<Row>) => {
          const { include, sort } = optionsRef.current;

          setRows((current) => {
            if (payload.eventType === "DELETE") {
              const removedId = (payload.old as Partial<Row>).id;
              return current.filter((row) => row.id !== removedId);
            }

            const incoming = payload.new as Row;
            const without = current.filter((row) => row.id !== incoming.id);
            if (include && !include(incoming)) return without;

            const next = [incoming, ...without];
            return sort ? next.sort(sort) : next;
          });
        },
      )
      .subscribe((state) => {
        if (state === "SUBSCRIBED") setStatus("live");
        else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT" || state === "CLOSED") setStatus("offline");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table]);

  /** Lets callers apply a known change immediately (e.g. right after saving). */
  const upsertLocal = (row: Row) =>
    setRows((current) => {
      const next = [row, ...current.filter((r) => r.id !== row.id)];
      const { sort } = optionsRef.current;
      return sort ? next.sort(sort) : next;
    });

  const removeLocal = (id: string) => setRows((current) => current.filter((r) => r.id !== id));

  return { rows, status, upsertLocal, removeLocal };
}
