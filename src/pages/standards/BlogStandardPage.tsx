import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BlogPostDetail from "@/components/patterns/BlogPostDetail";
import BlogSection, { getRelatedBlogPosts } from "@/components/patterns/BlogSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogExampleCategories, blogExamplePosts } from "@/pages/examples/blogExampleData";

const fullPost = blogExamplePosts.find((post) => post.slug === "lunas-journey-home")!;
const relatedPosts = getRelatedBlogPosts(blogExamplePosts, fullPost.slug);

const BlogStandardPage = () => {
  const { t } = useTranslation(["blog", "common"]);

  return (
    <>
      <SEOHead
        title="Blog Pattern"
        canonicalPath="/standards/blog"
        description="Shared blog list and post-detail pattern covering both tech guides and rescue-story content."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("blog:hero.title")}
        description={t("blog:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("blog:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("blog:sections.listing.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("blog:sections.listing.description")}</p>
          <BlogSection
            posts={blogExamplePosts}
            categories={blogExampleCategories}
            showFeatured
            postBasePath="/examples/blog"
            subscribeCta={{
              title: t("blog:sections.listing.subscribeCta.title"),
              description: t("blog:sections.listing.subscribeCta.description"),
              ctaLabel: t("blog:sections.listing.subscribeCta.ctaLabel"),
              href: "mailto:hello@example.org",
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("blog:sections.detail.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("blog:sections.detail.description")}</p>
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <BlogPostDetail
              post={fullPost}
              backHref="/standards/blog"
              categories={blogExampleCategories}
              relatedPosts={relatedPosts}
              postBasePath="/examples/blog"
              cta={{
                title: t("blog:sections.detail.cta.title"),
                description: t("blog:sections.detail.cta.description"),
                ctaLabel: t("blog:sections.detail.cta.ctaLabel"),
                ctaHref: "https://example.org/contact",
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("blog:sections.highlight.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("blog:sections.highlight.part1")} <code>highlightOnHome</code> {t("blog:sections.highlight.part2")}{" "}
            <code>getBlogHighlightItems()</code> {t("blog:sections.highlight.part3")}{" "}
            <code>HomeHighlightSection</code> {t("blog:sections.highlight.part4")}{" "}
            <Link className="underline underline-offset-4" to="/standards/news-highlight">
              {t("blog:sections.highlight.linkLabel")}
            </Link>
            .
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("blog:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("blog:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default BlogStandardPage;
