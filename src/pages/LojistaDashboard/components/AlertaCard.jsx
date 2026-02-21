import React from "react";

const AlertaCard = ({ icone, mensagem, tipo = "info", acao }) => {
  const cores = {
    info: { cor: "#bb25a6", bg: "#d1ecf1", border: "#bee5eb" },
    success: { cor: "#bb25a6", bg: "#d4edda", border: "#c3e6cb" },
    warning: { cor: "#ffc107", bg: "#fff3cd", border: "#ffeaa7" },
    danger: { cor: "#dc3545", bg: "#f8d7da", border: "#f5c6cb" },
    estoque: { cor: "#fd7e14", bg: "#ffe5d0", border: "#ffd1a8" },
    vendas: { cor: "#6f42c1", bg: "#e2d9f3", border: "#d4c5ec" },
    comissao: { cor: "#20c997", bg: "#d1f2eb", border: "#b8ebdf" },
  };

  const config = cores[tipo] || cores.info;

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${config.cor}`,
        backgroundColor: config.bg,
        borderColor: config.border,
        cursor: acao ? "pointer" : "default",
      }}
      onClick={acao}
    >
      <div style={{...styles.icone, color: config.cor}}>{icone}</div>
      <div style={styles.conteudo}>
        <p style={styles.mensagem}>{mensagem}</p>
      </div>
      {acao && <div style={styles.seta}>&#8592;’</div>}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #e9ecef",
    transition: "all 0.3s ease",
  },
  icone: {
    fontSize: "1.5rem",
  },
  conteudo: {
    flex: 1,
  },
  mensagem: {
    margin: 0,
    fontSize: "1rem",
    color: "#333",
    fontWeight: "500",
  },
  seta: {
    color: "#666",
    fontSize: "1.2rem",
  },
};

export default AlertaCard;
