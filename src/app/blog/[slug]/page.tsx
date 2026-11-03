import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/data/posts";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SnackImage } from "@/components/ui/snack-image";
import { SocialIcon } from "@/components/ui/social-icon";
import { ArticleContent } from "@/components/blog/article-content";
import { PostCard } from "@/components/blog/post-card";
import { RealtimeRefresh } from "@/components/realtime-refresh";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
      publishedTime: post.published_at,
      authors: post.author_name ? [post.author_name] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const more = (await getPublishedPosts(4)).filter((p) => p.id !== post.id).slice(0, 3);
  const initials = post.author_name
    ?.split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <RealtimeRefresh tables={["posts"]} />

      <article className="pb-12 pt-32 sm:pt-40">
        <header className="container-page max-w-4xl">
          <Reveal>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-mist-400 transition-colors hover:text-brand">
              <ArrowLeft className="size-4" aria-hidden /> All articles
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist-400">
              <Badge variant="brand">{post.category}</Badge>
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
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">{post.title}</h1>
            <p className="mt-6 text-xl leading-relaxed text-mist-400">{post.excerpt}</p>
            {post.author_name ? (
              <div className="mt-8 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-ink" aria-hidden>
                  {initials}
                </span>
                <div>
                  <p className="text-sm text-mist-500">Written by</p>
                  <p className="font-semibold text-white">{post.author_name}</p>
                </div>
              </div>
            ) : null}
          </Reveal>
        </header>

        <Reveal delay={0.1} className="container-page mt-12 max-w-6xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 bg-ink-800">
            <SnackImage src={post.cover_image} alt={post.title} fill priority sizes="(min-width: 1280px) 1152px, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <div className="container-page mt-14 max-w-3xl">
          <Reveal>
            <ArticleContent content={post.content} />
          </Reveal>

          <Reveal className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <p className="font-display text-2xl font-bold text-white">Hungry yet?</p>
            <p className="mt-3 text-mist-400">Find the snacks from this story, or follow along for more.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/products" className={buttonVariants()}>
                Shop the snacks
              </Link>
              <div className="flex justify-center gap-2">
                {siteConfig.social.slice(0, 3).map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Orange Lick on ${social.label}`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-mist transition-colors hover:border-brand hover:text-brand"
                  >
                    <SocialIcon platform={social.platform} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="container-page py-16">
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Keep reading</h2>
          </Reveal>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <RevealItem key={item.id} className="h-full">
                <PostCard post={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}
    </>
  );
}
