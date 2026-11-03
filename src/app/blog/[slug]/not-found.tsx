import Link from "next/link";
import { BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ArticleNotFound() {
  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <EmptyState
        icon={<BookOpen />}
        title="We couldn't find that article"
        description="It may have been moved or unpublished. There are plenty of other stories on the snack table."
        action={
          <Link href="/blog" className={buttonVariants({ size: "lg" })}>
            Back to the journal
          </Link>
        }
      />
    </div>
  );
}
