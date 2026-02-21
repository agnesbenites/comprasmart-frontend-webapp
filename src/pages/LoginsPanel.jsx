// src/pages/LoginsPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Storefront } from "@phosphor-icons/react";

const LoginsPanel = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        {/* Logo */}
        <div style={styles.logoArea}>
          <img
            src="/img/Logo Clara.png"
            alt="Kaslee"
            style={styles.logo}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span style={{ display: 'none', fontSize: 36, fontWeight: 800, color: '#2f0d51', fontFamily: 'Poppins,sans-serif' }}>Kaslee</span>
        </div>

        <p style={styles.subtitle}>Sistema Inteligente de Consultoria</p>

        <div style={styles.grid}>
          {/* CONSULTOR */}
          <div style={{ ...styles.card, borderColor: '#bb25a6' }}>
            <div style={styles.iconWrap}>
              <UserCircle size={48} weight="duotone" color="#bb25a6" />
            </div>
            <h2 style={{ ...styles.cardTitle, color: '#2f0d51' }}>Consultor</h2>
            <p style={styles.cardDescription}>
              Acesso ao painel de consultoria com relatórios de desempenho e gestão de clientes.
            </p>
            <button
              onClick={() => navigate("/consultor/login")}
              style={{ ...styles.button, background: 'linear-gradient(135deg, #2f0d51, #bb25a6)' }}
            >
              Acessar como Consultor
            </button>
          </div>

          {/* LOJISTA/VENDEDOR */}
          <div style={{ ...styles.card, borderColor: '#2f0d51' }}>
            <div style={{ ...styles.iconWrap, background: '#ede9fe' }}>
              <Storefront size={48} weight="duotone" color="#2f0d51" />
            </div>
            <h2 style={{ ...styles.cardTitle, color: '#2f0d51' }}>Lojista / Vendedor</h2>
            <p style={styles.cardDescription}>
              Gestão completa da sua loja, produtos, vendas e equipe comercial.
            </p>
            <button
              onClick={() => navigate("/lojista/escolha")}
              style={{ ...styles.button, background: 'linear-gradient(135deg, #bb25a6, #2f0d51)' }}
            >
              Acessar como Lojista/Vendedor
            </button>
          </div>
        </div>

        <button onClick={() => navigate("/")} style={styles.backButton}>
          ← Voltar para Home
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
  logoArea: {
    marginBottom: "12px",
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    height: 80,
    width: "auto",
    objectFit: "contain",
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "48px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "28px",
    marginBottom: "36px",
  },
  card: {
    backgroundColor: "white",
    padding: "36px 28px",
    borderRadius: "16px",
    border: "2px solid",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#f3e8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "12px",
    fontFamily: "Poppins, sans-serif",
  },
  cardDescription: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "opacity 0.2s",
    fontFamily: "Poppins, sans-serif",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "8px 16px",
    textDecoration: "underline",
  },
};

export default LoginsPanel;