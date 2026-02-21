// src/pages/ConsultorDashboard/pages/Consultant/ConsultorLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { ChartBar, Briefcase, Lock } from "@phosphor-icons/react";

const ConsultorLogin = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/consultor/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn(email, password);
      const user = result?.user || result?.data?.user;
      
      if (user) {
        navigate('/consultor/dashboard', { replace: true });
      } else {
        setError("Usuário não encontrado na resposta");
      }
    } catch (error) {
      if (error.message?.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos");
      } else if (error.message?.includes("Email not confirmed")) {
        setError("E-mail não confirmado. Verifique sua caixa de entrada");
      } else {
        setError(error.message || "Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login Consultor</h2>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Acesse o sistema de consultoria com suas credenciais
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              backgroundColor: loading ? '#6c757d' : '#bb25a6',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.links}>
          <a href="/consultor/cadastro" style={styles.link}>
            Não tem conta? Cadastre-se
          </a>
          <a href="/recuperar-senha" style={styles.link}>
            Esqueceu a senha?
          </a>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <ChartBar size={20} weight="duotone" color="#bb25a6" />
            <span>Relatórios de Desempenho</span>
          </div>
          <div style={styles.feature}>
            <Briefcase size={20} weight="duotone" color="#2f0d51" />
            <span>Gestão de Consultoria</span>
          </div>
          <div style={styles.feature}>
            <Lock size={20} weight="duotone" color="#2f0d51" />
            <span>Dados Protegidos</span>
          </div>
        </div>

        <div style={styles.footer}>
          <a href="/entrar" style={styles.backLink}>
            Voltar para Escolha de Perfil
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
    color: "#2f0d51",
    marginBottom: "20px",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.1rem",
  },
  infoBox: {
    backgroundColor: "#f3e8ff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #e9d5ff",
  },
  infoText: {
    margin: 0,
    fontSize: "14px",
    color: "#2f0d51",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  errorBox: {
    backgroundColor: "#f8d7da",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
  errorText: {
    margin: 0,
    fontSize: "14px",
    color: "#721c24",
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
    transition: "background-color 0.3s ease",
    marginBottom: "20px",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  link: {
    color: "#bb25a6",
    textDecoration: "none",
    fontSize: "14px",
    textAlign: "center",
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
    color: "#333",
  },
  footer: {
    textAlign: "center",
  },
  backLink: {
    color: "#2f0d51",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default ConsultorLogin;