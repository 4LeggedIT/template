type PrintPageHeaderProps = {
  buttonLabel: string;
  instructions: string;
  onPrint?: () => void;
  disabled?: boolean;
};

const PrintPageHeader = ({
  buttonLabel,
  instructions,
  onPrint = () => window.print(),
  disabled = false,
}: PrintPageHeaderProps) => (
  <div className="no-print" style={{
    alignItems: "center",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px 20px",
    justifyContent: "space-between",
    margin: "0 auto",
    maxWidth: "8.5in",
    padding: "12px 16px",
  }}>
    <span style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.4 }}>
      {instructions}
    </span>
    <button
      type="button"
      onClick={onPrint}
      disabled={disabled}
      style={{
        background: disabled ? "#d1d5db" : "var(--doc-primary, hsl(10,42%,58%))",
        border: "none",
        borderRadius: "5px",
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        fontSize: "13px",
        fontWeight: 700,
        padding: "8px 20px",
        whiteSpace: "nowrap",
      }}
    >
      {buttonLabel}
    </button>
  </div>
);

export default PrintPageHeader;
