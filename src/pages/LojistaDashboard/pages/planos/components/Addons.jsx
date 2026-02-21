// src/pages/LojistaDashboard/pages/planos/components/Addons.jsx
import React from "react";

const styles = {
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "20px",
  },
  addonsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  addonCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "all 0.2s",
  },
  addonHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  addonNome: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  addonPreco: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#bb25a6",
  },
  addonDescricao: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.4",
  },
  comprarButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  emBreveButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
    fontWeight: "500",
    cursor: "not-allowed",
    fontSize: "14px",
  },
};

const Addons = ({ addons = [], onComprarAddon }) => {
  if (!addons.length) return null;

  return (
    <section style={styles.section} data-cy="addons-section">
      <h2 style={styles.sectionTitle}> Recursos Adicionais</h2>

      <div style={styles.addonsGrid}>
        {addons.map((addon) => (
          <div 
            key={addon.id} 
            style={styles.addonCard} 
            data-cy="addon-item"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10b981";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.addonHeader}>
              <span style={styles.addonNome}>{addon.nome}</span>
              <span style={styles.addonPreco}>
                R$ {addon.preco?.toFixed(2)}
              </span>
            </div>

            <p style={styles.addonDescricao}>{addon.descricao}</p>

            {addon.emBreve ? (
              <button style={styles.emBreveButton} disabled>
                Em breve
              </button>
            ) : (
              <button
                style={styles.comprarButton}
                onClick={() => onComprarAddon(addon)}
                data-cy="btn-comprar-addon"
              >
                Comprar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Addons;