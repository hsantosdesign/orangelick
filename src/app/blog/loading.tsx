import { GridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-6 w-full max-w-lg" />
      <Skeleton className="mt-16 aspect-[16/10] w-full rounded-[var(--radius-card)] lg:aspect-[21/9]" />
      <div className="mt-8">
        <GridSkeleton count={3} variant="post" />
      </div>
    </div>
  );
}
