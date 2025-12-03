// src/pages/LoginPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; // Assumindo que este componente existe

const LoginPage = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType) => {
    switch(userType) {
      case 'consultor':
        navigate("/consultor/login");
        break;
      case 'lojista':
        // Mantém a etapa de Escolha (CNPJ) antes do login Auth0
        navigate("/lojista/escolha"); 
        break;
      case 'vendedor':
        navigate("/vendedor/login");
        break;
      case 'admin':
        navigate("/admin/login");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <Layout title="Bem-vindo de Volta!" showHeader={true}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Cabeçalho de Boas-Vindas */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              color: "#2c5aa0",
              marginBottom: "10px",
              fontSize: "2.5rem",
            }}
          >
            Bem-vindo de Volta!
          </h1>
          <p
            style={{
              color: "#666",
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            Escolha como deseja acessar o sistema
          </p>
        </div>

        {/* Container dos Dois Blocos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginBottom: "40px",
            // Adicionar responsividade para mobile
            '@media (maxWidth: 600px)': {
              gridTemplateColumns: "1fr",
            }
          }}
        >
          {/* Bloco 1: Consultor */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: "2px solid #17a2b8",
            }}
            onClick={() => handleUserTypeSelect('consultor')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
              }}
            >
              🔍
            </div>
            <h3
              style={{
                color: "#17a2b8",
                marginBottom: "15px",
                fontSize: "1.5rem",
              }}
            >
              Consultor
            </h3>
            <p
              style={{
                color: "#666",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              Acesso ao painel de consultoria com relatórios de desempenho e gestão de clientes.
            </p>
            <button
              style={{
                padding: "12px 30px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#138496";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#17a2b8";
              }}
            >
              Acessar como Consultor
            </button>
          </div>

          {/* Bloco 2: Administrador/Vendedor */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: "2px solid #fd7e14",
            }}
            onClick={() => handleUserTypeSelect('vendedor')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
              }}
            >
              💼
            </div>
            <h3
              style={{
                color: "#fd7e14",
                marginBottom: "15px",
                fontSize: "1.5rem",
              }}
            >
              Administrador/Vendedor
            </h3>
            <p
              style={{
                color: "#666",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              Acesso ao sistema de vendas, gestão de clientes e relatórios de performance.
            </p>
            <button
              style={{
                padding: "12px 30px",
                backgroundColor: "#fd7e14",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e56a00";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fd7e14";
              }}
            >
              Acessar como Admin/Vendedor
            </button>
          </div>
        </div>

        {/* Opção Lojista Separada */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "2px solid #28a745",
            maxWidth: "400px",
            margin: "0 auto",
          }}
          onClick={() => handleUserTypeSelect('lojista')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              marginBottom: "15px",
            }}
          >
            🏪
          </div>
          <h4
            style={{
              color: "#28a745",
              marginBottom: "10px",
              fontSize: "1.3rem",
            }}
          >
            Área do Lojista
          </h4>
          <p
            style={{
              color: "#666",
              marginBottom: "15px",
              fontSize: "0.9rem",
            }}
          >
            Gestão completa da sua loja, produtos, vendas e equipe comercial.
          </p>
          <button
            style={{
              padding: "10px 25px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#218838";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#28a745";
            }}
          >
            Acessar como Lojista
          </button>
        </div>

        {/* Rodapé */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #eaeaea",
          }}
        >
          <p
            style={{
              color: "#666",
              marginBottom: "15px",
            }}
          >
            Precisa de ajuda para acessar?
          </p>
          <a
            href="/"
            style={{
              color: "#2c5aa0",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ← Voltar para Home
          </a>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
            /* Media query para tornar responsivo em mobile */
            @media (max-width: 600px) {
                .user-type-container {
                    grid-template-columns: 1fr !important;
                }
            }
        ` }} />
      </div>
    </Layout>
  );
};

export default LoginPage;