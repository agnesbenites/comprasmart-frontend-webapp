// src/pages/LojistaDashboard/pages/LojistaRecuperarSenha.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { House, CheckCircle, XCircle, Clock, Tag, HourglassHigh, Lifebuoy, Storefront, ChatCircle } from '@phosphor-icons/react';

const LojistaRecuperarSenha = () => {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState("cnpj"); // cnpj, sucesso
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailEnviado, setEmailEnviado] = useState("");

  const handleRecuperarSenha = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Buscar loja pelo CNPJ
      const cnpjLimpo = cnpj.replace(/\D/g, "");

      const { data: loja, error: lojaError } = await supabase
        .from("lojas_corrigida")
        .select("email, nome_fantasia")
        .eq("cnpj", cnpjLimpo)
        .single();

      if (lojaError || !loja) {
        setError("CNPJ não encontrado. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      // 2. Enviar email de recuperação
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        loja.email,
        {
          redirectTo: `${window.location.origin}/lojista/resetar-senha`,
        }
      );

      if (resetError) {
        console.error("Erro ao enviar email:", resetError);
        setError("Erro ao enviar email de recuperação. Tente novamente.");
        setLoading(false);
        return;
      }

      // 3. Sucesso
      setEmailEnviado(loja.email);
      setEtapa("sucesso");

    } catch (error) {
      console.error("Erro:", error);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {etapa === "cnpj" ? (
          <>
            <h2 style={styles.title}>🔑 Recuperar Senha</h2>
            <p style={styles.description}>
              Digite o CNPJ da sua empresa. Enviaremos um link de recuperação para o email cadastrado.
            </p>

            <form onSubmit={handleRecuperarSenha}>
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

              {error && <div style={styles.error}> {error}</div>}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? " Enviando..." : "📧 Enviar Link de Recuperação"}
              </button>
            </form>

            <div style={styles.footer}>
              <button onClick={() => navigate("/lojista/login")} style={styles.linkButton}>
                ← Voltar para o login
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.successIcon}><CheckCircle size={80} weight="duotone" color="#bb25a6" /></div>
            <h2 style={styles.successTitle}>Email Enviado!</h2>
            <p style={styles.successDescription}>
              Enviamos um link de recuperação para:
            </p>
            <div style={styles.emailBox}>
              📧 {emailEnviado}
            </div>
            <p style={styles.instructionsText}>
              Verifique sua caixa de entrada (e spam) e clique no link para redefinir sua senha.
            </p>
            <p style={styles.warningText}>
              ⚠️ O link expira em 1 hora.
            </p>

            <button 
              onClick={() => navigate("/lojista/login")} 
              style={styles.button}
            >
              Voltar para o Login
            </button>
          </>
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
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: "450px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    color: "#2f0d51",
    marginBottom: "10px",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "0.95rem",
    lineHeight: "1.5",
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
    boxSizing: "border-box",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#bb25a6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "25px",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#2f0d51",
    textDecoration: "underline",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  successIcon: {
    textAlign: "center",
    fontSize: "4rem",
    marginBottom: "20px",
  },
  successTitle: {
    textAlign: "center",
    color: "#bb25a6",
    marginBottom: "15px",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  successDescription: {
    textAlign: "center",
    color: "#666",
    marginBottom: "15px",
    fontSize: "0.95rem",
  },
  emailBox: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  instructionsText: {
    textAlign: "center",
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  warningText: {
    textAlign: "center",
    color: "#ff9800",
    fontSize: "0.85rem",
    marginBottom: "25px",
    fontWeight: "600",
  },
};

export default LojistaRecuperarSenha;