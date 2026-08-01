import { useParams } from "react-router-dom";
import BlogPostDetail from "@/components/patterns/BlogPostDetail";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { blogExampleCategories, blogExamplePosts } from "@/pages/examples/blogExampleData";
import { getRelatedBlogPosts } from "@/components/patterns/BlogSection";

const BlogExamplePostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogExamplePosts.find((candidate) => candidate.slug === slug);
  const canonicalPath = `/examples/blog/${slug ?? ""}`;

  if (!post) {
    return (
      <>
        <SEOHead
          title="Post Not Found"
          canonicalPath={canonicalPath}
          description="Requested blog post example route was not found."
        />
        <PageHero
          eyebrow="Examples"
          title="Post not found"
          description="This blog post route does not match a configured example entry."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Standards", href: "/standards" },
            { label: "Blog", href: "/standards/blog" },
            { label: "Post" },
          ]}
        />
      </>
    );
  }

  const relatedPosts = getRelatedBlogPosts(blogExamplePosts, post.slug);

  return (
    <>
      <SEOHead
        title={`${post.title} | Blog Example`}
        canonicalPath={canonicalPath}
        description={post.excerpt}
      />
      <section className="container px-4 py-10">
        <BlogPostDetail
          post={post}
          backHref="/standards/blog"
          categories={blogExampleCategories}
          relatedPosts={relatedPosts}
          postBasePath="/examples/blog"
          labels={{ backLabel: "Back to Blog pattern" }}
        />
      </section>
    </>
  );
};

export default BlogExamplePostPage;
