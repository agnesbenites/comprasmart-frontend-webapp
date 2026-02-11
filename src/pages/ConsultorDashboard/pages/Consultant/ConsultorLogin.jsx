// src/pages/ConsultorDashboard/pages/Consultant/ConsultorLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const ConsultorLogin = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se ja esta autenticado, redireciona para o dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/consultor/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Funcao de login - CORREÇÃO AQUI
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // CORREÇÃO: Seguir o mesmo padrão do LojistaLogin.jsx
      // A função signIn retorna { data, error } do Supabase
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Se houver erro do Supabase
        throw error;
      }
      
      // Se chegou aqui, login foi bem-sucedido
      if (data?.user) {
        navigate('/consultor/dashboard', { replace: true });
      } else {
        setError("Erro ao fazer login - usuário não encontrado");
      }
    } catch (error) {
      // Captura o erro real do Supabase
      console.error("Erro no login:", error);
      
      // Tratamento de erros específicos
      if (error.message?.includes("Invalid")) {
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

  // Estado de loading do contexto
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
              backgroundColor: loading ? '#6c757d' : '#17a2b8',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.links}>
          <a href="/consultor/cadastro" style={styles.link}>
            Nao tem conta? Cadastre-se
          </a>
          <a href="/recuperar-senha" style={styles.link}>
            Esqueceu a senha?
          </a>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>&#128202;</span>
            <span>Relatorios de Desempenho</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>&#128188;</span>
            <span>Gestao de Consultoria</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>&#128274;</span>
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
    color: "#17a2b8",
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
    color: "#17a2b8",
    textDecoration: "none",
    fontSize: "14px",
    textAlign: "center",
    transition: "color 0.3s ease",
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