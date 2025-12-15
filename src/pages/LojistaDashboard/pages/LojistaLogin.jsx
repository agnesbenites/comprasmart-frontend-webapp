// src/pages/LojistaDashboard/pages/LojistaLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const LojistaLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [etapa, setEtapa] = useState("cnpj");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redireciona se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lojista/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Valida CNPJ
  const handleCNPJSubmit = (e) => {
    e.preventDefault();
    if (!cnpj) return;

    setLoading(true);
    setError("");

    setTimeout(() => {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      if (cnpjLimpo.length === 14) {
        localStorage.setItem("lojistaCNPJ", cnpj);
        localStorage.setItem("lojistaNome", `Empresa ${cnpjLimpo.substring(0, 6)}`);
        setEtapa("login");
        setError("");
      } else {
        setError("CNPJ inválido. Deve conter 14 dígitos.");
      }
      setLoading(false);
    }, 800);
  };

  // Login com Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/lojista/dashboard', { replace: true });
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Trocar CNPJ
  const trocarCNPJ = () => {
    localStorage.removeItem('lojistaCNPJ');
    localStorage.removeItem('lojistaNome');
    setCnpj("");
    setEmail("");
    setPassword("");
    setEtapa("cnpj");
    setError("");
  };

  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>⏳ Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏪 Login Lojista</h2>

        {etapa === "cnpj" ? (
          <form onSubmit={handleCNPJSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CNPJ da Empresa:</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                style={styles.input}
                maxLength={18}
                required
                disabled={loading}
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "⏳ Verificando..." : "Continuar →"}
            </button>
          </form>
        ) : (
          <>
            <div style={styles.cnpjInfo}>
              <p>CNPJ: {cnpj}</p>
              <button onClick={trocarCNPJ} style={styles.smallButton}>Trocar CNPJ</button>
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
                  placeholder="XXXXX"
                  style={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "⏳ Entrando..." : "🔐 Entrar"}
              </button>
            </form>
          </>
        )}

        <div style={styles.footer}>
          <a href="/entrar" style={styles.link}>← Voltar</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#f5f5f5" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", maxWidth: "400px", width: "100%" },
  title: { textAlign: "center", color: "#2c5aa0", marginBottom: "30px", fontSize: "1.8rem", fontWeight: "700" },
  loadingText: { textAlign: "center", color: "#666", fontSize: "1.1rem" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "0.9rem" },
  input: { width: "100%", padding: "12px 15px", border: "2px solid #e9ecef", borderRadius: "8px", fontSize: "1rem" },
  error: { backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" },
  button: { width: "100%", padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  cnpjInfo: { backgroundColor: "#d4edda", padding: "15px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" },
  smallButton: { marginTop: "10px", padding: "5px 10px", backgroundColor: "transparent", color: "#28a745", border: "1px solid #28a745", borderRadius: "4px", fontSize: "12px", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "20px" },
  link: { color: "#2c5aa0", textDecoration: "none", fontSize: "14px" }
};

export default LojistaLogin;
