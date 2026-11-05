import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

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
    description: `Apply to adopt a dog from ${name}. This link opens our online adoption application.`,
  },
  "adoption-foster": {
    title: `Adoption & Foster Application | ${name}`,
    description: `Apply to adopt or foster a dog with ${name}. This link opens our online application.`,
  },
  "adoption-agreement": {
    title: `Adoption Agreement | ${name}`,
    description: `Complete the adoption agreement for your new dog from ${name}.`,
  },
  foster: {
    title: `Foster Application | ${name}`,
    description: `Apply to foster a dog with ${name}. This link opens our online foster application.`,
  },
  volunteer: {
    title: `Volunteer Application | ${name}`,
    description: `Apply to volunteer with ${name}. This link opens our online volunteer application.`,
  },
  missing: {
    title: `Missing Dog Help Request | ${name}`,
    description: `Lost your dog? Submit a help request to ${name}. This link opens our missing dog form.`,
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
    : { title: `Online Form | ${name}`, description: `This link opens an online form from ${name}.` };
  const meta = { ...base, ...overrides };

  useEffect(() => {
    window.location.replace(formUrl);
  }, [formUrl]);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`${siteConfig.siteUrl}${path}`} />
        <meta httpEquiv="refresh" content={`0;url=${formUrl}`} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Redirecting…{" "}
          <a href={formUrl} className="underline underline-offset-4 hover:text-foreground">
            Click here if you are not redirected automatically.
          </a>
        </p>
      </div>
    </>
  );
};

export default FormQuickLink;
