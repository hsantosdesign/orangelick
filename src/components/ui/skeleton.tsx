import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded-xl bg-white/[0.06]", className)} {...props} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03]">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03]">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, variant = "product" }: { count?: number; variant?: "product" | "post" }) {
  const Item = variant === "product" ? ProductCardSkeleton : PostCardSkeleton;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
