// src/pages/LojistaDashboard/pages/LojistaLogin.jsx

import React, { useState, useEffect } from "react";
// 🛑 IMPORTAR useAuth0 DIRETAMENTE DA BIBLIOTECA, não de um hook customizado
import { useAuth0 } from "@auth0/auth0-react"; 
import { useNavigate } from "react-router-dom"; // Adicionado para navegação

const LojistaLogin = () => {
  // 🛑 O Auth0 fornece a lógica de autenticação e estado
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0(); 
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState("cnpj");
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);

  const cnpjValido = "12345678000195";

  useEffect(() => {
    // 1. Se já autenticado pelo Auth0, vai direto para a página de Pagamentos
    if (isAuthenticated) {
        navigate('/lojista/dashboard/pagamentos');
        return;
    }
    
    // 2. Lógica de checagem de CNPJ
    const cnpjSalvo = localStorage.getItem('lojistaCNPJ');
    if (cnpjSalvo) {
      setCnpj(cnpjSalvo);
      setEtapa("login");
    }
  }, [isAuthenticated, navigate]);

  const handleCNPJSubmit = (e) => {
    e.preventDefault();
    if (!cnpj) return;

    setLoading(true);
    
    // Simula verificação do CNPJ
    setTimeout(() => {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      if (cnpjLimpo === cnpjValido) {
        localStorage.setItem("lojistaCNPJ", cnpj);
        localStorage.setItem("lojistaNome", "Empresa Teste - Compra Smart");
        localStorage.setItem("lojistaTipo", "matriz");
        setEtapa("login");
      } else {
        alert("CNPJ não encontrado. Use: 12.345.678/0001-95");
      }
      setLoading(false);
    }, 1000);
  };

  const trocarCNPJ = () => {
    localStorage.removeItem('lojistaCNPJ');
    localStorage.removeItem('lojistaNome');
    localStorage.removeItem('lojistaTipo');
    setCnpj("");
    setEtapa("cnpj");
  };
  
  // 🛑 NOVO: Função que chama o Auth0
  const handleAuth0Login = () => {
      loginWithRedirect({
          appState: { 
              targetUrl: '/lojista/dashboard/pagamentos' // Onde voltar após logar
          }
      });
  };

  // Se já está autenticado, mas o useEffect ainda não redirecionou
  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.successText}>✅ Você já está autenticado!</p>
          <p>Redirecionando para o painel de pagamentos...</p>
        </div>
      </div>
    );
  }
    
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h2 style={styles.title}>
          🏪 Login Lojista (via Auth0)
        </h2>

        {/* ETAPA 1: CNPJ */}
        {etapa === "cnpj" && (
          <form onSubmit={handleCNPJSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                CNPJ da Empresa:
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                style={styles.input}
                maxLength={18}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                backgroundColor: loading ? '#6c757d' : '#007bff'
              }}
              disabled={loading || !cnpj}
            >
              {loading ? "⏳ Verificando..." : "Continuar para Login →"}
            </button>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>CNPJ de teste:</strong><br />
                12.345.678/0001-95
              </p>
            </div>
          </form>
        )}

        {/* ETAPA 2: LOGIN VIA AUTH0 */}
        {etapa === "login" && (
          <>
            <div style={styles.cnpjInfo}>
              <p style={styles.cnpjInfoText}>
                <strong>Empresa:</strong> {localStorage.getItem('lojistaNome')}<br />
                <strong>CNPJ:</strong> {localStorage.getItem('lojistaCNPJ')}
              </p>
              <button 
                onClick={trocarCNPJ}
                style={styles.trocarButton}
              >
                Trocar empresa
              </button>
            </div>

            <button
              onClick={handleAuth0Login}
              disabled={isLoading}
              style={{
                ...styles.loginButton,
                backgroundColor: isLoading ? '#6c757d' : '#007bff'
              }}
            >
              {isLoading ? "⏳ Redirecionando..." : "🔐 Entrar com Auth0"}
            </button>
            
            <div style={styles.credenciaisBox}>
              <p style={styles.credenciaisText}>
                Autenticação segura gerenciada pelo Auth0
              </p>
            </div>
          </>
        )}

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>
            ← Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
    // ... (restante dos estilos)
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
    marginBottom: "30px",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  successText: {
    textAlign: "center",
    color: "#28a745",
    fontSize: "1.2rem",
    fontWeight: "bold"
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
  },
  primaryButton: {
    width: "100%",
    padding: "15px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginBottom: "15px",
  },
  loginButton: {
    width: "100%",
    padding: "15px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: '#007bff',
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginBottom: "15px",
  },
  infoBox: {
    backgroundColor: "#fff3cd",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    border: "1px solid #ffeaa7",
  },
  infoText: {
    margin: 0,
    fontSize: "14px",
    color: "#856404",
    textAlign: "center",
    lineHeight: "1.5",
  },
  credenciaisBox: {
    backgroundColor: "#d1ecf1",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    border: "1px solid #bee5eb",
  },
  credenciaisText: {
    margin: 0,
    fontSize: "14px",
    color: "#0c5460",
    textAlign: "center",
    lineHeight: "1.5",
  },
  cnpjInfo: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #bbdefb'
  },
  cnpjInfoText: {
    margin: 0,
    fontSize: '14px',
    color: '#1565c0',
    lineHeight: '1.5',
  },
  trocarButton: {
    background: 'none',
    border: 'none',
    color: '#1565c0',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '8px',
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
// ... (Efeitos hover)

export default LojistaLogin;