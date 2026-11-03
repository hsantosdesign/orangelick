import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container-page pb-12 pt-32 sm:pt-40" role="status" aria-label="Loading snack">
      <Skeleton className="h-4 w-36" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square rounded-[2rem]" />
        <div className="space-y-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-14 w-full rounded-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
