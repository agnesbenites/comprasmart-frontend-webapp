// src/pages/LojistaDashboard/pages/LojistaLogin.jsx
// Login DEFINITIVO - Usa AuthContext corretamente

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../supabaseClient";

const LojistaLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    cnpj: "",
    senha: "",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const formatarCNPJ = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      let email = formData.email;

      // Se login por CNPJ, buscar email
      if (loginType === "cnpj") {
        if (!formData.cnpj || formData.cnpj.replace(/\D/g, "").length !== 14) {
          setErro("CNPJ inválido");
          setLoading(false);
          return;
        }

        const cnpjLimpo = formData.cnpj.replace(/\D/g, "");

        const { data: loja, error: lojaError } = await supabase
          .from("lojas_corrigida")
          .select("email")
          .eq("cnpj", cnpjLimpo)
          .single();

        if (lojaError || !loja) {
          setErro("CNPJ não encontrado");
          setLoading(false);
          return;
        }

        email = loja.email;
      }

      if (!formData.senha) {
        setErro("Digite sua senha");
        setLoading(false);
        return;
      }

      // ✅ USA O AuthContext
      const { user } = await signIn(email, formData.senha);

      // Buscar dados da loja
      const { data: loja, error: lojaError } = await supabase
        .from("lojas_corrigida")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (lojaError || !loja) {
        setErro("Loja não encontrada");
        setLoading(false);
        return;
      }

      // Verificar status
      if (loja.status !== "ativa") {
        setErro("Conta inativa. Entre em contato com o suporte.");
        setLoading(false);
        return;
      }

      // Atualizar metadata
      await supabase.auth.updateUser({
        data: {
          role: "lojista",
          loja_id: loja.id,
          plano: loja.plano,
        },
      });

      console.log("✅ Login completo, redirecionando...");
      
      // Redirecionar
      navigate("/lojista/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      
      if (error.message?.includes("Invalid")) {
        setErro("Email ou senha incorretos");
      } else {
        setErro(error.message || "Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏪 Login Lojista</h1>
          <p style={styles.subtitle}>Acesse seu painel administrativo</p>
        </div>

        <div style={styles.toggleGroup}>
          <button
            type="button"
            onClick={() => setLoginType("email")}
            style={{
              ...styles.toggleButton,
              backgroundColor: loginType === "email" ? "#28a745" : "#f8f9fa",
              color: loginType === "email" ? "white" : "#666",
            }}
          >
            📧 Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType("cnpj")}
            style={{
              ...styles.toggleButton,
              backgroundColor: loginType === "cnpj" ? "#28a745" : "#f8f9fa",
              color: loginType === "cnpj" ? "white" : "#666",
            }}
          >
            🏢 CNPJ
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {loginType === "email" ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                style={styles.input}
                required
              />
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>CNPJ</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: formatarCNPJ(e.target.value) })}
                placeholder="00.000.000/0000-00"
                style={styles.input}
                maxLength={18}
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          {erro && <div style={styles.erro}>❌ {erro}</div>}

          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? "⏳ Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={() => navigate("/lojista/recuperar-senha")}
            style={styles.linkButton}
          >
            Esqueceu a senha?
          </button>
          <button
            type="button"
            onClick={() => navigate("/cadastro/lojista")}
            style={styles.linkButton}
          >
            Criar conta
          </button>
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
  },
  card: {
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "32px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#28a745",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
  },
  toggleGroup: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  toggleButton: {
    flex: 1,
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 16px",
    fontSize: "1rem",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  erro: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    fontSize: "0.9rem",
    border: "1px solid #ef9a9a",
  },
  button: {
    padding: "14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  footer: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "20px",
    borderTop: "1px solid #e0e0e0",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#28a745",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LojistaLogin;