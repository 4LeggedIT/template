import { useTranslation } from "react-i18next";

type StandardSnippetProps = {
  /** Copy-ready code: the import, the component with its required props and one sample data entry. */
  code: string;
  /** Overrides the generic one-line description under the heading. */
  description?: string;
};

/** The "Snippet" section on a `/standards/*` page: one copy-ready code block. Template-only (not a shared pattern). */
const StandardSnippet = ({ code, description }: StandardSnippetProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t("snippet.title")}</h2>
      <p className="text-sm text-muted-foreground">{description ?? t("snippet.description")}</p>
      <pre className="overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default StandardSnippet;
