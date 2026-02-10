import React from "react";
import { useNavigate } from "react-router-dom";

const ModuleCard = ({ 
  titulo, 
  descricao, 
  features = [], 
  estatistica, 
  rota, 
  cor = "#bb25a6",
  icone = ""
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (rota) {
      navigate(rota);
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${cor}`,
        background: `linear-gradient(135deg, ${cor}10, ${cor}05)`,
        cursor: rota ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <div style={styles.header}>
        <h3 style={{ ...styles.titulo, color: cor }}>
          {icone} {titulo}
        </h3>
        {estatistica && (
          <div style={styles.estatistica}>{estatistica}</div>
        )}
      </div>

      <p style={styles.descricao}>{descricao}</p>

      {features.length > 0 && (
        <ul style={styles.featuresList}>
          {features.map((feature, index) => (
            <li key={index} style={styles.feature}>
              * {feature}
            </li>
          ))}
        </ul>
      )}

      {rota && (
        <button
          style={{
            ...styles.botao,
            backgroundColor: cor,
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
          }}
        >
          Acessar Modulo &#8592;’
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  titulo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: 0,
  },
  estatistica: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#666",
  },
  descricao: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "25px",
  },
  feature: {
    padding: "6px 0",
    color: "#555",
    fontSize: "0.9rem",
  },
  botao: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
};

export default ModuleCard;
