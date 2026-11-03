"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page pb-12 pt-36 sm:pt-44">
      <EmptyState
        icon={<TriangleAlert />}
        title="Something went wrong"
        description="We couldn't load this page right now. Please try again in a moment."
        action={
          <Button size="lg" onClick={reset}>
            <RefreshCw /> Try again
          </Button>
        }
      />
    </div>
  );
}
