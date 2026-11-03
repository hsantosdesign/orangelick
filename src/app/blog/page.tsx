import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/data/posts";
import { PageHeader } from "@/components/ui/page-header";
import { PostList } from "@/components/blog/post-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Recipes, stories and behind-the-scenes from the Orange Lick kitchen.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHeader
        eyebrow="The Orange Lick journal"
        title={
          <>
            Stories from the <span className="text-gradient">snack table</span>
          </>
        }
        description="Recipes, traditions and kitchen notes. Pour some tea and stay a while."
      />
      <section className="container-page pb-12">
        <PostList initialPosts={posts} />
      </section>
    </>
  );
}
