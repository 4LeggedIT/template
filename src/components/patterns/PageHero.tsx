import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
};

const PageHero = ({ eyebrow, title, description, actions, breadcrumbs }: PageHeroProps) => {
  return (
    <section className="border-b border-border bg-gradient-to-b from-card/80 to-background">
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
                            <Link to={item.href}>{item.label}</Link>
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
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-muted-foreground">{description}</p>
          ) : null}
          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
