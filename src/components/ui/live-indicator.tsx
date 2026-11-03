import type { LiveStatus } from "@/hooks/use-realtime-rows";
import { cn } from "@/lib/utils";

/** Small, friendly hint that the list updates on its own. Hidden when live updates are off. */
export function LiveIndicator({ status, className }: { status: LiveStatus; className?: string }) {
  if (status !== "live") return null;

  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-medium text-mist-500", className)}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      Updates automatically
    </span>
  );
}
