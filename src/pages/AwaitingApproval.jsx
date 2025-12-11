// src/pages/AwaitingApproval.jsx
import React from "react";
import { Link } from "react-router-dom";

const AwaitingApproval = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {/* cone de Aguardando */}
        <div style={{ fontSize: "80px", marginBottom: "30px" }}>o</div>

        <h1
          style={{
            color: "#2c5aa0",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Cadastro em Analise
        </h1>

        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#856404", margin: "0 0 10px 0" }}>
             E-mail Enviado
          </h3>
          <p style={{ color: "#856404", margin: 0, lineHeight: "1.5" }}>
            Seus dados de acesso (e-mail e senha) foram enviados para o e-mail
            cadastrado.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#d1ecf1",
            border: "1px solid #bee5eb",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#0c5460", margin: "0 0 10px 0" }}>
             Aprovacao Pendente
          </h3>
          <p style={{ color: "#0c5460", margin: 0, lineHeight: "1.5" }}>
            Seu cadastro esta aguardando aprovacao do administrador. Voca
            recebera um e-mail quando sua conta for ativada.
            <br />
            <br />
            <strong>° Tempo estimado: 24 horas</strong>
          </p>
        </div>

        <div style={{ color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
          <p>
            <strong> Duvidas:</strong> entre em contato com o suporte
          </p>
        </div>

        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 30px",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#545b62")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
        >
          Voltar para o Inicio
        </Link>
      </div>
    </div>
  );
};

export default AwaitingApproval;

