// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Lógica de login aqui
    console.log("Login attempt:", { email, password }); // navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
           {" "}
      <div style={styles.content}>
                {/* Sidebar Esquerda - Branding */}       {" "}
        <div style={styles.sidebar}>
                   {" "}
          <div style={styles.logo}>
                        <div style={styles.logoIcon}>🛍️</div>           {" "}
            <h1 style={styles.logoText}>Compra Smart</h1>           {" "}
            <p style={styles.logoSubtitle}>Sistema de Consultoria</p>         {" "}
          </div>
                   {" "}
          <div style={styles.sidebarContent}>
                        <h3 style={styles.sidebarTitle}>Bem-vindo de volta!</h3>
                       {" "}
            <p style={styles.sidebarText}>
                            Acesse sua conta para continuar oferecendo a melhor
              consultoria de               compras.            {" "}
            </p>
                       {" "}
            <div style={styles.features}>
                           {" "}
              <div style={styles.feature}>
                                <span style={styles.featureIcon}>💼</span>     
                          <span>Gestão de Consultoria</span>             {" "}
              </div>
                           {" "}
              <div style={styles.feature}>
                                <span style={styles.featureIcon}>📊</span>     
                          <span>Relatórios de Desempenho</span>             {" "}
              </div>
                           {" "}
              <div style={styles.feature}>
                                <span style={styles.featureIcon}>🔒</span>     
                          <span>Dados Protegidos</span>             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Área Direita - Formulário */}       {" "}
        <div style={styles.formSection}>
                   {" "}
          <div style={styles.formContainer}>
                       {" "}
            <div style={styles.formHeader}>
                            <h2 style={styles.formTitle}>Acessar Conta</h2>     
                     {" "}
              <p style={styles.formSubtitle}>Entre com suas credenciais</p>     
                   {" "}
            </div>
                       {" "}
            <form onSubmit={handleLogin} style={styles.form}>
                           {" "}
              <div style={styles.inputGroup}>
                                <label style={styles.label}>E-mail</label>
                               {" "}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={styles.input}
                  required
                />
                             {" "}
              </div>
                           {" "}
              <div style={styles.inputGroup}>
                                <label style={styles.label}>Senha</label>
                               {" "}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  style={styles.input}
                  required
                />
                             {" "}
              </div>
                           {" "}
              <button type="submit" style={styles.loginButton}>
                                Entrar na Plataforma              {" "}
              </button>
                         {" "}
            </form>
                       {" "}
            <div style={styles.links}>
                           {" "}
              <p style={styles.registerText}>
                                Não tem uma conta?                {" "}
                <Link to="/register" style={styles.registerLink}>
                                    Cadastre-se como Consultor                {" "}
                </Link>
                             {" "}
              </p>
                           {" "}
              <Link to="/" style={styles.backLink}>
                                ← Voltar para a página inicial              {" "}
              </Link>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
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
    fontFamily: "Arial, sans-serif",
    padding: "40px 20px", // Adiciona padding para telas menores
    boxSizing: "border-box", // Importante para o padding funcionar
  },
  content: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px", // Reduzido para centralizar melhor // height: "700px", // ❌ Removido para ter altura automática
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
    minHeight: "600px", // Altura mínima para desktop
  },
  sidebar: {
    // flex: 1, // ❌ Removido
    width: "400px", // ✅ Largura fixa para a sidebar (ideal para desktop)
    backgroundColor: "#1b3670",
    color: "white",
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  logo: {
    textAlign: "center",
  },
  logoIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },
  logoText: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    color: "white",
  },
  logoSubtitle: {
    fontSize: "16px",
    opacity: 0.8,
    margin: 0,
  },
  sidebarContent: {
    marginTop: "60px",
  },
  sidebarTitle: {
    fontSize: "24px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  sidebarText: {
    fontSize: "16px",
    opacity: 0.9,
    lineHeight: 1.5,
    marginBottom: "30px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    opacity: 0.9,
  },
  featureIcon: {
    fontSize: "18px",
  },
  formSection: {
    flex: 1, // ✅ O formulário ocupa o espaço restante
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
  },
  formContainer: {
    width: "100%",
    maxWidth: "350px", // Formulário um pouco mais compacto para desktop
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  formTitle: {
    fontSize: "28px",
    color: "#333",
    margin: "0 0 10px 0",
    fontWeight: "bold",
  },
  formSubtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "15px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1b3670",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  links: {
    marginTop: "30px",
    textAlign: "center",
  },
  registerText: {
    color: "#666",
    marginBottom: "15px",
  },
  registerLink: {
    color: "#1b3670",
    fontWeight: "bold",
    textDecoration: "none",
  },
  backLink: {
    color: "#666",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default LoginPage;
