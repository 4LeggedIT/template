/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/PageHero.tsx
 * Change it there, then sync it to every site.
 */
import { Fragment, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import ContentLink from "./ContentLink";

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbEntry[];
  /** Optional class overrides for a site that needs to diverge from the default left-aligned
   * layout (e.g. a centered hero) without forking the whole component. */
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
};

const PageHero = ({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
}: PageHeroProps) => {
  return (
    <section className={cn("border-b border-border bg-linear-to-b from-card/80 to-background", className)}>
      <div className="container px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          {breadcrumbs?.length ? (
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <Fragment key={`crumb-${item.label}-${index}`}>
                      <BreadcrumbItem key={`item-${item.label}-${index}`}>
                        {item.href && !isLast ? (
                          <BreadcrumbLink asChild>
                            <ContentLink href={item.href} external={false}>{item.label}</ContentLink>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {!isLast ? <BreadcrumbSeparator key={`sep-${item.label}-${index}`} /> : null}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}
          {eyebrow ? (
            <p className={cn("mb-3 text-sm font-medium uppercase tracking-wide text-primary", eyebrowClassName)}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className={cn("text-3xl font-semibold tracking-tight sm:text-4xl", titleClassName)}>{title}</h1>
          {description ? (
            <p className={cn("mt-4 max-w-3xl text-muted-foreground", descriptionClassName)}>{description}</p>
          ) : null}
          {actions ? (
            <div className={cn("mt-6 flex flex-wrap gap-3", actionsClassName)}>{actions}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
