/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/FormQuickLink.tsx
 * Change it there, then sync it to every site.
 */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";
import ContentLink from "./ContentLink";
import { safeContentUrl } from "@/lib/safe-url";

export type FormQuickLinkKind =
  | "adoption"
  | "adoption-foster"
  | "adoption-agreement"
  | "foster"
  | "volunteer"
  | "missing";

type FormMeta = { title: string; description: string };

// Defaults shown in shared-link previews (og/twitter). A site can override any
// entry via the `overrides` prop. Keep copy plain: no em dashes.
const defaultMeta = (name: string): Record<FormQuickLinkKind, FormMeta> => ({
  adoption: {
    title: `Adoption Application | ${name}`,
    description: `Apply to adopt a dog from ${name}. This link opens our online adoption application. Complete it online from any device.`,
  },
  "adoption-foster": {
    title: `Adoption & Foster Application | ${name}`,
    description: `Apply to adopt or foster a dog with ${name}. This link opens our online application. Complete it online from any device.`,
  },
  "adoption-agreement": {
    title: `Adoption Agreement | ${name}`,
    description: `Complete the adoption agreement for your new dog from ${name}. You can finish it online from any device.`,
  },
  foster: {
    title: `Foster Application | ${name}`,
    description: `Apply to foster a dog with ${name}. This link opens our online foster application. Complete it online from any device.`,
  },
  volunteer: {
    title: `Volunteer Application | ${name}`,
    description: `Apply to volunteer with ${name}. This link opens our online volunteer application. Complete it online from any device.`,
  },
  missing: {
    title: `Missing Dog Help Request | ${name}`,
    description: `Lost your dog? Submit a help request to ${name}. This link opens our missing dog form. Complete it online from any device.`,
  },
});

type FormQuickLinkProps = {
  formUrl: string;
  /** Picks the default preview text. Omit it and pass `overrides` for site-specific forms. */
  kind?: FormQuickLinkKind;
  /** Route path, used for the canonical / og:url (e.g. "/adoption-foster-form"). */
  path: string;
  overrides?: Partial<FormMeta>;
};

const FormQuickLink = ({ formUrl, kind, path, overrides }: FormQuickLinkProps) => {
  const name = siteConfig.siteName;
  const base: FormMeta = kind
    ? defaultMeta(name)[kind]
    : { title: `Online Form | ${name}`, description: `This link opens an online form from ${name}. Complete it online from any device, or contact us if the link does not open.` };
  const meta = { ...base, ...overrides };

  const safeFormUrl = safeContentUrl(formUrl);

  useEffect(() => {
    if (safeFormUrl) window.location.replace(safeFormUrl);
  }, [safeFormUrl]);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`${siteConfig.siteUrl}${path}`} />
        {safeFormUrl ? <meta httpEquiv="refresh" content={`0;url=${safeFormUrl}`} /> : null}
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Redirecting…{" "}
          <ContentLink href={safeFormUrl} external target="_self" className="underline underline-offset-4 hover:text-foreground">
            Click here if you are not redirected automatically.
          </ContentLink>
        </p>
      </div>
    </>
  );
};

export default FormQuickLink;
