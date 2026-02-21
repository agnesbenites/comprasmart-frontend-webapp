import React from "react";

const CardMetrica = ({ icone: IconComponent, valor, label, cor = "#bb25a6", onClick }) => {
  return (
    <div
      style={styles.card}
      onClick={onClick}
      className={onClick ? "clickable" : ""}
    >
      <div style={{ ...styles.icone, color: cor }}>
        {typeof IconComponent === 'string'
          ? IconComponent
          : IconComponent && <IconComponent size={32} weight="duotone" color={cor} />
        }
      </div>
      <div style={styles.conteudo}>
        <div style={styles.valor}>{valor}</div>
        <div style={styles.label}>{label}</div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minWidth: "180px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  icone: {
    fontSize: "2rem",
  },
  conteudo: {
    flex: 1,
  },
  valor: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  },
  label: {
    fontSize: "0.9rem",
    color: "#666",
    fontWeight: "500",
  },
};

export default CardMetrica;