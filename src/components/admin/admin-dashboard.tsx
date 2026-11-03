"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cookie, ExternalLink, FileText, LogOut, NotebookPen, PackageCheck, Sparkles } from "lucide-react";
import type { Post, Product } from "@/types/database";
import { signOut } from "@/app/admin/actions";
import { useRealtimeRows } from "@/hooks/use-realtime-rows";
import { cn, isPostPublished, isProductAvailable } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { LogoMark } from "@/components/layout/logo";
import { PostsManager } from "@/components/admin/posts-manager";
import { ProductsManager } from "@/components/admin/products-manager";

type Tab = "products" | "posts";

const byCreated = (a: Product, b: Product) => b.created_at.localeCompare(a.created_at);
const byPublished = (a: Post, b: Post) => b.published_at.localeCompare(a.published_at);

interface AdminDashboardProps {
  email: string;
  displayName?: string;
  initialProducts: Product[];
  initialPosts: Post[];
}

export function AdminDashboard({ email, displayName, initialProducts, initialPosts }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("products");
  const products = useRealtimeRows("products", initialProducts, { sort: byCreated });
  const posts = useRealtimeRows("posts", initialPosts, { sort: byPublished });

  const stats = [
    { label: "Products", value: products.rows.length, icon: Cookie },
    { label: "In stock", value: products.rows.filter(isProductAvailable).length, icon: PackageCheck },
    { label: "Featured", value: products.rows.filter((p) => p.is_highlight).length, icon: Sparkles },
    { label: "Published articles", value: posts.rows.filter(isPostPublished).length, icon: FileText },
  ];

  const tabs: { id: Tab; label: string; icon: typeof Cookie; count: number }[] = [
    { id: "products", label: "Products", icon: Cookie, count: products.rows.length },
    { id: "posts", label: "Journal", icon: NotebookPen, count: posts.rows.length },
  ];

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <LogoMark className="size-8" />
            <span className="hidden font-display text-sm font-bold text-white sm:block">
              Orange Lick <span className="font-sans font-medium text-mist-400">Admin Portal</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LiveIndicator status={products.status} className="hidden md:inline-flex" />
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-mist hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              View website <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                <LogOut /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <div>
          <p className="text-sm text-mist-400">Signed in as {email}</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
            Hi{displayName ? `, ${displayName}` : ""}! <span className="text-gradient">What&apos;s cooking?</span>
          </h1>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <dt className="flex items-center gap-2 text-sm text-mist-400">
                <Icon className="size-4 text-brand" aria-hidden /> {label}
              </dt>
              <dd className="mt-3 font-display text-3xl font-bold text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label="Manage content" className="mt-10 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                tab === id ? "text-ink" : "text-mist hover:text-white",
              )}
            >
              {tab === id ? (
                <motion.span layoutId="admin-tab" className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              ) : null}
              <Icon className="size-4" aria-hidden />
              {label}
              <span className={cn("rounded-full px-2 py-0.5 text-xs", tab === id ? "bg-ink/15" : "bg-white/10")}>{count}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div role="tabpanel" id="panel-products" aria-labelledby="tab-products" hidden={tab !== "products"}>
            <ProductsManager products={products.rows} onUpsert={products.upsertLocal} onRemove={products.removeLocal} />
          </div>
          <div role="tabpanel" id="panel-posts" aria-labelledby="tab-posts" hidden={tab !== "posts"}>
            <PostsManager posts={posts.rows} defaultAuthor={displayName} onUpsert={posts.upsertLocal} onRemove={posts.removeLocal} />
          </div>
        </div>
      </main>
    </div>
  );
}
