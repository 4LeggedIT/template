import type { ReactNode } from "react";

type ExampleBlockProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

/** One titled example on a `/standards/*` page. Template-only: keeps every example's heading, intro and spacing identical. */
const ExampleBlock = ({ title, description, children }: ExampleBlockProps) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    {children}
  </div>
);

export default ExampleBlock;
