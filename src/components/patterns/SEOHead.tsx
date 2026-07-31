import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

type SEOHeadProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
};

const SEOHead = ({ title, description, canonicalPath, noIndex = false }: SEOHeadProps) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description ?? siteConfig.description;
  const canonicalUrl = canonicalPath ? `${siteConfig.siteUrl.replace(/\/+$/, "")}${canonicalPath}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
    </Helmet>
  );
};

export default SEOHead;
