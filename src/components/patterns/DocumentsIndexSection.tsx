import { Link } from "react-router-dom";
import "@/styles/documents.css";

export type DocumentsIndexGroup = {
  title: string;
  items: { label: string; to: string }[];
};

type DocumentsIndexSectionProps = {
  orgName: string;
  logoSrc: string;
  groups: DocumentsIndexGroup[];
};

const DocumentsIndexSection = ({ orgName, logoSrc, groups }: DocumentsIndexSectionProps) => (
  <div className="doc-body">
    <style>{"@page { size: letter portrait; margin: 0.38in 0.42in; }"}</style>
    <div className="doc-page">
      <header className="doc-header">
        <img src={logoSrc} alt={orgName} className="doc-logo-lg" />
        <div>
          <div className="doc-org-name">{orgName}</div>
        </div>
        <div className="doc-title-block">
          <div className="doc-title">Documents</div>
        </div>
      </header>

      {groups.map((g) => (
        <div key={g.title} className="doc-index-group">
          <div className="doc-index-group-title">{g.title}</div>
          <ul className="doc-index-list">
            {g.items.map((item) => (
              <li key={item.to} className="doc-index-item">
                <Link to={item.to} className="doc-index-link">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentsIndexSection;
