import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <EmptyState
        icon={<Compass />}
        title="This page wandered off"
        description="The page you're looking for doesn't exist or has moved. Let's get you back to the snacks."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonVariants({ size: "lg" })}>
              Go home
            </Link>
            <Link href="/products" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              Browse snacks
            </Link>
          </div>
        }
      />
    </div>
  );
}
