// src/pages/ConsultorDashboard/pages/Consultant/ConsultorLogin.jsx
import React from "react";
import { useAuth } from "../../../../hooks/useAuth"; // ✅ CAMINHO CORRETO

const ConsultorLogin = () => {
  const { login, isAuthenticated, isLoading } = useAuth('consultor');

  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.successText}>✅ Autenticado com sucesso!</p>
          <p>Redirecionando para o dashboard do consultor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>
          🔍 Login Consultor
        </h2>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Acesse o sistema de consultoria com suas credenciais Auth0
          </p>
        </div>

        <button
          onClick={login}
          disabled={isLoading}
          style={{
            ...styles.loginButton,
            backgroundColor: isLoading ? '#6c757d' : '#17a2b8'
          }}
        >
          {isLoading ? "⏳ Redirecionando..." : "🔐 Entrar com Auth0"}
        </button>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📊</span>
            <span>Relatórios de Desempenho</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>💼</span>
            <span>Gestão de Consultoria</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔒</span>
            <span>Dados Protegidos</span>
          </div>
        </div>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>
            ← Voltar para Home
          </a>
        </div>
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
    padding: "20px",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    color: "#2c5aa0",
    marginBottom: "20px",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  successText: {
    textAlign: "center",
    color: "#28a745",
    fontSize: "1.2rem",
    fontWeight: "bold"
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #bbdefb",
  },
  infoText: {
    margin: 0,
    fontSize: "14px",
    color: "#1565c0",
    textAlign: "center",
  },
  loginButton: {
    width: "100%",
    padding: "15px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginBottom: "20px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    fontSize: "14px",
  },
  featureIcon: {
    fontSize: "16px",
  },
  footer: {
    textAlign: "center",
  },
  backLink: {
    color: "#2c5aa0",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default ConsultorLogin;