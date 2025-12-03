// src/pages/VendedorLogin.jsx
import React from "react";
import { useAuth } from "../../../hooks/useAuth"; // ✅ CAMINHO CORRETO

const VendedorLogin = () => {
  const { login, isAuthenticated, isLoading } = useAuth('vendedor');

  // Se já está autenticado, não mostra o login
  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.successText}>✅ Você já está autenticado!</p>
          <p>Redirecionando para o dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>
          💼 Login Vendedor
        </h2>

        <div style={styles.credenciaisBox}>
          <p style={styles.credenciaisText}>
            <strong>Autenticação via Auth0</strong><br />
            Seu acesso foi criado pelo administrador da empresa.
          </p>
        </div>

        <button
          onClick={login}
          disabled={isLoading}
          style={{
            ...styles.loginButton,
            backgroundColor: isLoading ? '#6c757d' : '#fd7e14'
          }}
        >
          {isLoading ? "⏳ Redirecionando..." : "🔐 Entrar com Auth0"}
        </button>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Entre com suas credenciais do Auth0
          </p>
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
  credenciaisBox: {
    backgroundColor: "#d1ecf1",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #bee5eb",
  },
  credenciaisText: {
    margin: 0,
    fontSize: "14px",
    color: "#0c5460",
    textAlign: "center",
    lineHeight: "1.5",
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
    marginBottom: "15px",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  infoText: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
  },
  backLink: {
    color: "#2c5aa0",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default VendedorLogin;