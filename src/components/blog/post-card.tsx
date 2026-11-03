import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { Post } from "@/types/database";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SnackImage } from "@/components/ui/snack-image";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/[0.05]",
        featured && "lg:grid lg:grid-cols-2",
      )}
    >
      <div className={cn("relative overflow-hidden bg-ink-800", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[420px]" : "aspect-[16/10]")}>
        <SnackImage
          src={post.cover_image}
          alt={post.title}
          fill
          priority={featured}
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <Badge className="absolute left-4 top-4 bg-ink/70 backdrop-blur">{post.category}</Badge>
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:justify-center lg:p-12")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </span>
          {post.read_time ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {post.read_time}
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-4 font-bold leading-snug transition-colors group-hover:text-brand-300",
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl",
          )}
        >
          {post.title}
        </h3>
        <p className={cn("mt-3 text-mist-400", featured ? "text-lg" : "line-clamp-3")}>{post.excerpt}</p>
        {post.author_name ? (
          <p className="mt-auto pt-6 text-sm text-mist">
            By <span className="font-semibold text-white">{post.author_name}</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
