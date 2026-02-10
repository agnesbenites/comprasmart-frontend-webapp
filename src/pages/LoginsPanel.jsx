// src/pages/LoginsPanel.jsx
// Painel de Escolha de Login

import React from "react";
import { useNavigate } from "react-router-dom";

const LoginsPanel = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.mainTitle}>Kaslee</h1>
        <p style={styles.subtitle}>Sistema Inteligente de Consultoria</p>

        <div style={styles.grid}>
          {/* CONSULTOR */}
          <div style={{ ...styles.card, borderColor: "#17a2b8" }}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>&#128269;</span>
            </div>
            <h2 style={{ ...styles.cardTitle, color: "#17a2b8" }}>Consultor</h2>
            <p style={styles.cardDescription}>
              Acesso ao painel de consultoria com relatorios de desempenho e gestao de clientes.     
            </p>
            <button
              onClick={() => navigate("/consultor/login")}
              style={{ ...styles.button, backgroundColor: "#17a2b8" }}
            >
              Acessar como Consultor
            </button>
          </div>

          {/* LOJISTA/VENDEDOR */}
          <div style={{ ...styles.card, borderColor: "#bb25a6" }}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>&#127978;</span>
            </div>
            <h2 style={{ ...styles.cardTitle, color: "#bb25a6" }}>
              Lojista / Vendedor
            </h2>
            <p style={styles.cardDescription}>
              Gestao completa da sua loja, produtos, vendas e equipe comercial.
            </p>
            <button
              onClick={() => navigate("/lojista/escolha")}
              style={{ ...styles.button, backgroundColor: "#bb25a6" }}
            >
              Acessar como Lojista/Vendedor
            </button>
          </div>
        </div>

        {/* Voltar */}
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  content: {
    textAlign: "center",
    maxWidth: "900px",
    width: "100%",
  },
  mainTitle: {
    color: "#2c5aa0",
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "1.1rem",
    marginBottom: "50px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "15px",
    border: "3px solid",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  iconWrapper: {
    marginBottom: "20px",
  },
  icon: {
    fontSize: "60px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "15px",
  },
  cardDescription: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "25px",
    lineHeight: "1.5",
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "1rem",
    cursor: "pointer",
    padding: "10px 20px",
    textDecoration: "underline",
  },
};

export default LoginsPanel;