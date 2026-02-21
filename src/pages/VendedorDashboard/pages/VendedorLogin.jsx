// src/pages/VendedorDashboard/pages/VendedorLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const VendedorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Verificar se já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/vendedor/dashboard', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      // Login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) throw error;

      console.log('[Login] Sucesso:', data.user.email);

      // Redirecionar para dashboard
      navigate('/vendedor/dashboard', { replace: true });

    } catch (error) {
      console.error('[Login] Erro:', error);
      setErro(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}> Login Vendedor</h2>
        
        <div style={styles.credenciaisBox}>
          <p style={styles.credenciaisText}>
            <strong>Autenticação via Supabase</strong><br />
            Seu acesso foi criado pelo administrador da empresa.
          </p>
        </div>

        {/* FORMULÁRIO DE LOGIN */}
        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendedor@test.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}> Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div style={styles.errorBox}>
               {erro}
            </div>
          )}

          {/* Botão de login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? ' Entrando...' : '🔐 Entrar'}
          </button>
        </form>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <strong>Credenciais de teste:</strong><br />
            Email: vendedor@test.com<br />
            Senha: Senha123!
          </p>
        </div>

        <div style={styles.footer}>
          <a href="/entrar" style={styles.backLink}>
            &#8592; Voltar para Escolha de Perfil
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 15px",
    border: "2px solid #dee2e6",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "border-color 0.2s",
    outline: "none",
  },
  errorBox: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: "1px solid #f5c6cb",
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
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  infoBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  infoText: {
    margin: 0,
    color: "#856404",
    fontSize: "13px",
    textAlign: "center",
    lineHeight: "1.6",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
  },
  backLink: {
    color: "#2f0d51",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default VendedorLogin;