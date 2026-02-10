// src/pages/LojistaDashboard/pages/planos/components/UpgradePlans.jsx
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
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  planCard: {
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s",
  },
  planCardHover: {
    borderColor: "#bb25a6",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
  },
  planName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  planPrice: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#bb25a6",
    marginBottom: "16px",
  },
  planFeatures: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 20px 0",
    flexGrow: 1,
  },
  featureItem: {
    padding: "6px 0",
    color: "#4b5563",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkIcon: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  selectButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#bb25a6",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    transition: "background-color 0.2s",
  },
};

const UpgradePlans = ({ planos = [], onSelectPlan }) => {
  if (!planos.length) return null;

  return (
    <section style={styles.section} data-cy="upgrade-plans">
      <h2 style={styles.sectionTitle}>📈 Fazer Upgrade de Plano</h2>

      <div style={styles.plansGrid}>
        {planos.map((plano) => (
          <div 
            key={plano.id} 
            style={styles.planCard} 
            data-cy="plano-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#bb25a6";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h3 style={styles.planName}>{plano.nome}</h3>

            <p style={styles.planPrice}>
              R$ {plano.valor?.toFixed(2)}
              <span style={{ fontSize: "14px", fontWeight: "400", color: "#6b7280" }}>/mês</span>
            </p>

            <ul style={styles.planFeatures}>
              {plano.recursos?.map((recurso, index) => (
                <li key={index} style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span>
                  {recurso}
                </li>
              ))}
            </ul>

            <button
              style={styles.selectButton}
              onClick={() => onSelectPlan(plano)}
              data-cy="btn-select-plan"
            >
              Escolher {plano.nome}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpgradePlans;