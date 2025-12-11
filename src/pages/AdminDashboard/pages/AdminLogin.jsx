// src/pages/AdminDashboard/pages/AdminLogin.jsx
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const AdminLogin = () => {
  const { login, isAuthenticated, isLoading } = useAuth('admin');

  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.successText}> Acesso administrativo concedido!</p>
          <p>Redirecionando para o painel de administracao...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>
           Login Administrador
        </h2>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <strong>Acesso Restrito</strong><br />
            Esta area e exclusiva para administradores do sistema.
          </p>
        </div>

        <button
          onClick={login}
          disabled={isLoading}
          style={{
            ...styles.loginButton,
            backgroundColor: isLoading ? '#6c757d' : '#dc3545'
          }}
        >
          {isLoading ? "o Redirecionando..." : " Entrar como Admin"}
        </button>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>
            &#8592; Voltar para Home
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
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ffeaa7",
  },
  warningText: {
    margin: 0,
    fontSize: "14px",
    color: "#856404",
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

export default AdminLogin;

