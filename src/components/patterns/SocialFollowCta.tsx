/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/SocialFollowCta.tsx
 * Change it there, then sync it to every site.
 */
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentLink from "./ContentLink";
import { isInternalPath } from "@/lib/safe-url";

export type SocialFollowCtaLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type SocialFollowCtaProps = {
  title: string;
  description?: string;
  links: SocialFollowCtaLink[];
};

const SocialFollowCta = ({ title, description, links }: SocialFollowCtaProps) => {
  if (!links.length) return null;

  return (
    <Card className="mt-6 border-border/80">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        <div className="flex flex-wrap gap-2">
          {links.map((link) =>
            <Button key={link.id} asChild variant="outline" size="sm">
              <ContentLink href={link.href} external={link.external ? true : undefined}>
                {link.label}
                {link.external || !isInternalPath(link.href) ? <ExternalLink className="ml-2 h-4 w-4" /> : null}
              </ContentLink>
            </Button>,
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialFollowCta;
