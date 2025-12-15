// src/pages/LojistaDashboard/pages/planos/components/PlanoAtual.jsx
import React from "react";

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "16px",
  },
  planoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px",
  },
  planoNome: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2563eb",
  },
  planoValor: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    marginLeft: "8px",
  },
  lista: {
    listStyle: "none",
    padding: 0,
    margin: "16px 0",
  },
  listaItem: {
    padding: "8px 0",
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkIcon: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
  },
};

const PlanoAtual = ({
  plano,
  onUpgradeClick,
  onAbrirPortalStripe,
}) => {
  if (!plano) {
    return (
      <section style={styles.card} data-cy="plano-atual">
        <h2 style={styles.cardTitle}>Seu plano atual</h2>
        <p style={{ color: "#6b7280" }}>Nenhum plano ativo encontrado.</p>
      </section>
    );
  }

  return (
    <section style={styles.card} data-cy="plano-atual">
      <h2 style={styles.cardTitle}>Seu plano atual</h2>

      <div style={styles.planoHeader}>
        <div>
          <span style={styles.planoNome}>{plano.nome}</span>
          {plano.status === "ativo" && (
            <span style={styles.badge}>Ativo</span>
          )}
        </div>
        <span style={styles.planoValor}>
          R$ {plano.valor?.toFixed(2)}/mês
        </span>
      </div>

      {plano.recursos && plano.recursos.length > 0 && (
        <ul style={styles.lista}>
          {plano.recursos.map((recurso, index) => (
            <li key={index} style={styles.listaItem}>
              <span style={styles.checkIcon}>✓</span>
              {recurso}
            </li>
          ))}
        </ul>
      )}

      <div style={styles.buttonContainer}>
        {plano.upgradeUrl && (
          <button
            style={styles.primaryButton}
            onClick={onUpgradeClick}
            data-cy="btn-upgrade"
          >
            🚀 Fazer Upgrade
          </button>
        )}
        
        <button
          style={styles.secondaryButton}
          onClick={onAbrirPortalStripe}
          data-cy="btn-portal"
        >
          ⚙️ Gerenciar Assinatura
        </button>
      </div>
    </section>
  );
};

export default PlanoAtual;