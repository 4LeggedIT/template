import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
            link.external || !link.href.startsWith("/") ? (
              <Button key={link.id} asChild variant="outline" size="sm">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button key={link.id} asChild variant="outline" size="sm">
                <Link to={link.href}>{link.label}</Link>
              </Button>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialFollowCta;
