import Link from "next/link";
import { CookieIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProductNotFound() {
  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <EmptyState
        icon={<CookieIcon />}
        title="This snack crumbled away"
        description="We couldn't find the snack you're looking for. It may have been renamed or retired, but plenty of others are waiting."
        action={
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Browse all snacks
          </Link>
        }
      />
    </div>
  );
}
