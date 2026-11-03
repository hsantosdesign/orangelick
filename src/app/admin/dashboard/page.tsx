import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllPostsForAdmin } from "@/lib/data/posts";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  // The proxy already guards this route; this check protects against direct server rendering without a session.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [products, posts] = await Promise.all([getAllProductsForAdmin(), getAllPostsForAdmin()]);

  const metadataName = session.user.user_metadata?.full_name ?? session.user.user_metadata?.name;
  const displayName = typeof metadataName === "string" && metadataName.trim() ? metadataName.trim().split(" ")[0] : undefined;

  return (
    <AdminDashboard email={session.user.email ?? ""} displayName={displayName} initialProducts={products} initialPosts={posts} />
  );
}
