import { Skeleton, GridSkeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-6 w-full max-w-xl" />
      <div className="mt-16 flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-10">
        <GridSkeleton />
      </div>
    </div>
  );
}
