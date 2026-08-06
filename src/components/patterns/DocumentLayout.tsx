import { Helmet } from "react-helmet-async";
import "@/styles/documents.css";

export type DocumentLayoutProps = {
  title: string;
  logoSize?: "normal" | "large";
  /**
   * "print" (default) is the standard hand-fill layout, capped to a small page count.
   * "digital" removes that cap and reserves blank, unlined space for e-signature-platform
   * widgets (e.g. JotForm) to be placed over during PDF import — see the Documents standard
   * page and `.doc-page--digital` in `documents.css` for the full field-sizing contract.
   */
  mode?: "print" | "digital";
  orgName: string;
  logoSrc: string;
  children: React.ReactNode;
};

const DocumentLayout = ({ title, logoSize = "normal", mode = "print", orgName, logoSrc, children }: DocumentLayoutProps) => (
  <div className="doc-body">
    <Helmet>
      <title>{`${title} | ${orgName}`}</title>
    </Helmet>
    <style>{"@page { size: letter portrait; margin: 0.38in 0.42in; }"}</style>
    <div className={mode === "digital" ? "doc-page doc-page--digital" : "doc-page"}>
      <header className="doc-header">
        <img
          src={logoSrc}
          alt={orgName}
          className={logoSize === "large" ? "doc-logo-lg" : "doc-logo"}
        />
        <div>
          <div className="doc-org-name">{orgName}</div>
        </div>
        <div className="doc-title-block">
          <div className="doc-title">{title}</div>
        </div>
      </header>
      {children}
    </div>
  </div>
);

export default DocumentLayout;
