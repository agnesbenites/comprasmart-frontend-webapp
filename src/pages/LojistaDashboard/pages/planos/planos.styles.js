const planosStyles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
  },

  section: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#1f2937",
  },

  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background: "#e5f0ff",
    color: "#2563eb",
    width: "fit-content",
  },

  buttonPrimary: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "500",
    cursor: "pointer",
  },

  buttonSecondary: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
  },

  buttonDanger: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "500",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    fontSize: "14px",
    color: "#6b7280",
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "10px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },

  modal: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
  },

  loading: {
    padding: "32px",
    textAlign: "center",
    fontSize: "16px",
    color: "#6b7280",
  },
};

export default planosStyles;
