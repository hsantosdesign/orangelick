"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NotebookPen } from "lucide-react";
import type { Post } from "@/types/database";
import { useRealtimeRows } from "@/hooks/use-realtime-rows";
import { cn, isPostPublished } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { PostCard } from "@/components/blog/post-card";

const ALL = "All";
const byPublishDate = (a: Post, b: Post) => b.published_at.localeCompare(a.published_at);

export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const { rows: posts, status } = useRealtimeRows("posts", initialPosts, {
    include: isPostPublished,
    sort: byPublishDate,
  });
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(posts.map((p) => p.category))).sort()], [posts]);
  const activeCategory = categories.includes(category) ? category : ALL;
  const visible = activeCategory === ALL ? posts : posts.filter((p) => p.category === activeCategory);

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<NotebookPen />}
        title="No articles published yet"
        description="Our writers are brewing tea and sharpening pencils. Recipes, stories and kitchen secrets are coming soon."
      />
    );
  }

  const [featured, ...rest] = visible;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 2 ? (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter articles by topic">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={c === activeCategory}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  c === activeCategory ? "border-brand bg-brand text-ink" : "border-white/10 text-mist hover:border-white/30 hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <LiveIndicator status={status} />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {featured ? (
          <motion.div key={featured.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
            <PostCard post={featured} featured />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {rest.map((post) => (
            <motion.li
              key={post.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <PostCard post={post} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
