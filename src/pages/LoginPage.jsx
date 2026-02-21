// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get('tipo') || 'consultor';

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!email || !senha) { setErro("Preencha todos os campos"); return; }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("token", `mock_token_${userType}_${Date.now()}`);
      const routes = {
        consultor: "/consultor/dashboard",
        lojista: "/lojista/dashboard",
        vendedor: "/vendedor/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(routes[userType] || "/consultor/dashboard", { replace: true });
    } catch {
      localStorage.removeItem("token");
      setErro("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    consultor: "Login Consultor",
    lojista: "Login Lojista",
    vendedor: "Login Vendedor",
    admin: "Login Administrador",
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoArea}>
          <img
            src="/img/Logo Clara.png"
            alt="Kaslee"
            style={styles.logo}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span style={{ display: 'none', fontSize: 28, fontWeight: 800, color: '#2f0d51', fontFamily: 'Poppins,sans-serif' }}>Kaslee</span>
        </div>

        <h1 style={styles.title}>{titles[userType] || "Login"}</h1>
        <p style={styles.subtitle}>Entre com suas credenciais</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" style={styles.input} disabled={loading} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="********" style={styles.input} disabled={loading} />
          </div>

          {erro && <div style={styles.erro}>{erro}</div>}

          <button type="submit" disabled={loading} style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div style={styles.links}>
            <button type="button" onClick={() => navigate("/entrar")} style={styles.linkButton}>
              ← Voltar para escolha de perfil
            </button>
            <button type="button" onClick={() => alert("Funcionalidade em desenvolvimento")} style={styles.linkButton}>
              Esqueci minha senha
            </button>
          </div>
        </form>

        {(userType === 'consultor' || userType === 'lojista') && (
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Não tem conta?{" "}
              <button onClick={() => navigate(`/${userType}/cadastro`)} style={{ ...styles.linkButton, color: '#bb25a6', fontWeight: 600 }}>
                Cadastre-se aqui
              </button>
            </p>
          </div>
        )}

        {(userType === 'vendedor' || userType === 'admin') && (
          <div style={styles.footer}>
            <p style={{ ...styles.footerText, color: "#f59e0b" }}>
              O registro é feito diretamente pela área do Lojista.
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
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(47,13,81,0.12)",
    overflow: "hidden",
    borderTop: "4px solid #bb25a6",
    padding: "36px 32px",
  },
  logoArea: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  logo: {
    height: 56,
    width: "auto",
    objectFit: "contain",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#2f0d51",
    textAlign: "center",
    marginBottom: "6px",
    fontFamily: "Poppins, sans-serif",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#666",
    textAlign: "center",
    marginBottom: "24px",
  },
  form: {},
  inputGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "1rem",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  erro: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    fontSize: "0.9rem",
    marginBottom: "14px",
    border: "1px solid #ef9a9a",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "700",
    color: "white",
    border: "none",
    borderRadius: "50px",
    background: "linear-gradient(135deg, #2f0d51, #bb25a6)",
    marginBottom: "14px",
    fontFamily: "Poppins, sans-serif",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "center",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.88rem",
    cursor: "pointer",
    padding: "4px",
    textDecoration: "underline",
  },
  footer: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e0e0e0",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
  },
};

export default LoginPage;