"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ExternalLink, NotebookPen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Post } from "@/types/database";
import { deletePost, setPostPublished } from "@/app/admin/actions";
import { cn, formatDate, isPostPublished } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SnackImage } from "@/components/ui/snack-image";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PostForm } from "@/components/admin/post-form";

type Filter = "all" | "published" | "drafts";

interface PostsManagerProps {
  posts: Post[];
  defaultAuthor?: string;
  onUpsert: (post: Post) => void;
  onRemove: (id: string) => void;
}

export function PostsManager({ posts, defaultAuthor, onUpsert, onRemove }: PostsManagerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Post | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Post | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter === "published" && !isPostPublished(p)) return false;
      if (filter === "drafts" && isPostPublished(p)) return false;
      if (!term) return true;
      return [p.title, p.category, p.author_name ?? "", p.slug].some((v) => v.toLowerCase().includes(term));
    });
  }, [posts, query, filter]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const togglePublished = (post: Post) => {
    setBusyId(post.id);
    startTransition(async () => {
      const result = await setPostPublished(post.id, !isPostPublished(post));
      setBusyId(null);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onUpsert(result.data);
      toast.success(result.message);
    });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      const result = await deletePost(target.id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onRemove(target.id);
      setDeleting(null);
      toast.success(`"${target.title}" was deleted.`);
    });
  };

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: posts.length },
    { id: "published", label: "Published", count: posts.filter(isPostPublished).length },
    { id: "drafts", label: "Drafts", count: posts.filter((p) => !isPostPublished(p)).length },
  ];

  return (
    <section aria-labelledby="posts-heading">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="posts-heading" className="text-2xl font-bold">
            Journal articles
          </h2>
          <p className="mt-1 text-sm text-mist-400">Write recipes, stories and news for the blog.</p>
        </div>
        <Button onClick={openNew}>
          <Plus /> New article
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={<NotebookPen />}
          title="No articles published yet"
          description="Write your first story. Recipes, kitchen notes and snack history all make great reads."
          action={
            <Button onClick={openNew} size="lg">
              <Plus /> Write your first article
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Filter articles">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    filter === f.id ? "border-brand bg-brand text-ink" : "border-white/10 text-mist hover:border-white/30",
                  )}
                >
                  {f.label} <span className="ml-1 opacity-70">{f.count}</span>
                </button>
              ))}
            </div>
            <label className="relative block">
              <span className="sr-only">Search articles</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles"
                className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-mist-500 focus:border-brand focus:outline-none sm:w-60"
              />
            </label>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-mist-400">No articles match these filters.</p>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              {visible.map((post) => {
                const published = isPostPublished(post);
                return (
                  <li
                    key={post.id}
                    className={cn("flex flex-col gap-4 p-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:p-5", busyId === post.id && "opacity-60")}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-2xl bg-ink-800 sm:w-28">
                        <SnackImage src={post.cover_image} alt="" fill sizes="112px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-semibold text-white">{post.title}</p>
                        <p className="mt-0.5 text-sm text-mist-400">
                          {post.category} · {formatDate(post.published_at)}
                          {post.author_name ? ` · ${post.author_name}` : ""}
                        </p>
                        <div className="mt-2">
                          <Badge variant={published ? "success" : "muted"}>{published ? "Published" : "Draft"}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Button size="sm" variant="secondary" onClick={() => togglePublished(post)} disabled={pending}>
                        {published ? "Move to drafts" : "Publish"}
                      </Button>
                      {published ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex size-10 items-center justify-center rounded-full text-mist hover:bg-white/5 hover:text-white"
                          aria-label={`View "${post.title}" on the website`}
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      ) : null}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(post);
                          setFormOpen(true);
                        }}
                        aria-label={`Edit "${post.title}"`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => setDeleting(post)}
                        aria-label={`Delete "${post.title}"`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <PostForm
        open={formOpen}
        post={editing}
        categories={categories}
        defaultAuthor={defaultAuthor}
        onClose={() => setFormOpen(false)}
        onSaved={onUpsert}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this article?"
        description={deleting ? `"${deleting.title}" will be permanently removed from the journal. This can't be undone.` : ""}
        confirmLabel="Delete article"
        pending={pending && Boolean(deleting)}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </section>
  );
}
