// src/pages/VendedorDashboard/pages/VendedorLogin.jsx
import React, { useEffect } from "react";
// REMOVIDO: Supabase migrado para Supabase
import { useNavigate } from "react-router-dom";

const VendedorLogin = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const targetDashboard = '/vendedor/dashboard';

  //  Se ja esta autenticado, redireciona para o dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(targetDashboard, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  //  Funcao de login
  const handleLogin = () => {
    login({
      appState: { returnTo: targetDashboard }
    });
  };

  //  Estado de loading
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>o Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}> Login Vendedor</h2>

        <div style={styles.credenciaisBox}>
          <p style={styles.credenciaisText}>
            <strong>Autenticacao via Supabase</strong><br />
            Seu acesso foi criado pelo administrador da empresa.
          </p>
        </div>

        <button
          onClick={handleLogin}
          style={styles.loginButton}
        >
           Entrar com Supabase
        </button>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Entre com suas credenciais do Supabase
          </p>
        </div>

        <div style={styles.footer}>
          <a href="/entrar" style={styles.backLink}>
            &#8592; Voltar para Escolha de Perfil
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
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.1rem",
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
    backgroundColor: "#ff9800",
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


