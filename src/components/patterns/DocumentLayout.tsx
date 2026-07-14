import "@/styles/documents.css";

export type DocumentLayoutProps = {
  title: string;
  logoSize?: "normal" | "large";
  orgName: string;
  logoSrc: string;
  children: React.ReactNode;
};

const DocumentLayout = ({ title, logoSize = "normal", orgName, logoSrc, children }: DocumentLayoutProps) => (
  <div className="doc-body">
    <style>{"@page { size: letter portrait; margin: 0.38in 0.42in; }"}</style>
    <div className="doc-page">
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
