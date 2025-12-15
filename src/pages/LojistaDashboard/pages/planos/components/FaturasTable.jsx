// src/pages/LojistaDashboard/pages/planos/components/FaturasTable.jsx
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
  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
  statusPago: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  statusPendente: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
    padding: 0,
  },
};

const FaturasTable = ({ faturas = [], onEnviarEmail }) => {
  return (
    <section style={styles.section} data-cy="faturas-section">
      <h2 style={styles.sectionTitle}>📄 Histórico de Faturas</h2>

      {!faturas.length ? (
        <p style={styles.emptyText} data-cy="faturas-vazio">
          Nenhuma fatura encontrada. As faturas aparecerão aqui após seu primeiro pagamento.
        </p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Período</th>
              <th style={styles.th}>Valor</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Vencimento</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {faturas.map((fatura) => (
              <tr key={fatura.id} data-cy="fatura-row">
                <td style={styles.td}>{fatura.periodo}</td>
                <td style={styles.td}>R$ {fatura.valor?.toFixed(2)}</td>
                <td style={styles.td}>
                  <span
                    style={
                      fatura.status === "paid"
                        ? styles.statusPago
                        : styles.statusPendente
                    }
                  >
                    {fatura.status === "paid" ? "Paga" : "Pendente"}
                  </span>
                </td>
                <td style={styles.td}>{fatura.vencimento}</td>
                <td style={styles.td}>
                  <button
                    style={styles.linkButton}
                    onClick={() => onEnviarEmail(fatura.id)}
                    data-cy="fatura-enviar-email"
                  >
                    Enviar por e-mail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default FaturasTable;