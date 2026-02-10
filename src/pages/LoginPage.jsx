// src/pages/LoginPage.jsx
// Pagina de LOGIN (email/senha) - Minimalista com cores da landing

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pegar tipo de usuario da URL (consultor, lojista, etc)
  const params = new URLSearchParams(location.search);
  const userType = params.get('tipo') || 'consultor';
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Cores da landing page
  const colors = {
    consultor: { primary: "#bb25a6", bg: "#e3f2fd" },
    lojista: { primary: "#bb25a6", bg: "#e8f5e9" },
    vendedor: { primary: "#4a6fa5", bg: "#eaf2ff" },
    admin: { primary: "#dc3545", bg: "#ffebee" },
  };

  const currentColor = colors[userType] || colors.consultor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrar com API real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // --- CORRECAO: Armazenar um token (mock) para o ProtectedRoute ---
      // IMPORTANTE: Isso simula o login, garantindo que o ProtectedRoute nao barre o acesso.
      localStorage.setItem("token", `mock_token_${userType}_${Date.now()}`); 

      // Mapeamento e redirecionamento correto para o dashboard
      const dashboardRoutes = {
        consultor: "/consultor/dashboard",
        lojista: "/lojista/dashboard",
        vendedor: "/vendedor/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(dashboardRoutes[userType] || "/consultor/dashboard", { replace: true });
    } catch (error) {
       // Em caso de erro, remova o token caso ele tenha sido definido
       localStorage.removeItem("token");
      setErro("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getTitleByType = () => {
    const titles = {
      consultor: "Login - Consultor",
      lojista: "Login - Lojista",
      vendedor: "Login - Vendedor",
      admin: "Login - Administrador",
    };
    return titles[userType] || "Login";
  };

  return (
    <div style={styles.container}>
      {/* Card de Login */}
      <div style={{
        ...styles.card,
        borderTop: `4px solid ${currentColor.primary}`
      }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{
            ...styles.title,
            color: currentColor.primary
          }}>
            {getTitleByType()}
          </h1>
          <p style={styles.subtitle}>
            Entre com suas credenciais
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Erro */}
          {erro && (
            <div style={styles.erro}>
               {erro}
            </div>
          )}

          {/* Botao */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: currentColor.primary,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* Links */}
          <div style={styles.links}>
            <button
              type="button"
              onClick={() => navigate("/entrar")}
              style={styles.linkButton}
            >
              &#8592; Voltar para escolha de perfil
            </button>
            
            <button
              type="button"
              onClick={() => alert("Funcionalidade em desenvolvimento")}
              style={styles.linkButton}
            >
              Esqueci minha senha
            </button>
          </div>
        </form>

        {/* Cadastro */}
        {userType === 'consultor' && (
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Nao tem conta?{" "}
              <button
                onClick={() => navigate("/consultor/cadastro")}
                style={{
                  ...styles.linkButton,
                  color: currentColor.primary,
                  fontWeight: "600"
                }}
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        )}

        {userType === 'lojista' && (
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Nao tem conta?{" "}
              <button
                onClick={() => navigate("/lojista/cadastro")}
                style={{
                  ...styles.linkButton,
                  color: currentColor.primary,
                  fontWeight: "600"
                }}
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        )}

        {(userType === 'vendedor' || userType === 'admin') && (
          <div style={styles.footer}>
            <p style={{...styles.footerText, color: "#ff9800", fontWeight: "500"}}>
              „¹ O registro de Administradores e Vendedores e feito diretamente pela rea do Lojista
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  header: {
    padding: "32px 32px 24px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
  },
  form: {
    padding: "0 32px 32px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  erro: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    fontSize: "0.9rem",
    marginBottom: "16px",
    border: "1px solid #ef9a9a",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "opacity 0.2s",
    marginBottom: "16px",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "4px",
    textDecoration: "underline",
  },
  footer: {
    padding: "20px 32px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e0e0e0",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
  },
};

// Hover effects (inline)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    button:hover {
      opacity: 0.9 !important;
    }
    input:focus {
      border-color: #bb25a6 !important;
    }
  `;
  document.head.appendChild(style);
}

export default LoginPage;
