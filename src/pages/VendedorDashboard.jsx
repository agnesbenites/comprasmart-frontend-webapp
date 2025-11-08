// src/pages/VendedorDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const VendedorDashboard = () => {
  const navigate = useNavigate();

  // Dados fictícios do vendedor
  const vendasHoje = 8;
  const metaMensal = 50;
  const vendasRealizadas = 32;
  const clientesAtivos = 15;

  const atalhos = [
    {
      titulo: "📞 Atendimento",
      descricao: "Iniciar chamada com cliente",
      cor: "#28a745",
      rota: "/atendimento"
    },
    {
      titulo: "💬 Chat",
      descricao: "Conversar com consultores",
      cor: "#17a2b8", 
      rota: "/chat"
    },
    {
      titulo: "📦 Produtos",
      descricao: "Ver catálogo e estoque",
      cor: "#ffc107",
      rota: "/produtos"
    },
    {
      titulo: "👥 Clientes",
      descricao: "Gerenciar clientes",
      cor: "#6f42c1",
      rota: "/clientes"
    }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Cabeçalho */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2c5aa0", marginBottom: "10px" }}>
          🛍️ Área do Vendedor
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Bem-vindo(a) à sua área de vendas
        </p>
      </div>

      {/* Métricas Rápidas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        <div style={{
          backgroundColor: "#e8f5e8",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          borderLeft: "4px solid #28a745"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#155724" }}>🤑 Vendas Hoje</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#155724", margin: 0 }}>
            {vendasHoje}
          </p>
        </div>

        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          borderLeft: "4px solid #2196f3"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#0d47a1" }}>🎯 Meta Mensal</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0d47a1", margin: 0 }}>
            {vendasRealizadas}/{metaMensal}
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff3cd",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          borderLeft: "4px solid #ffc107"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#856404" }}>👥 Clientes Ativos</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#856404", margin: 0 }}>
            {clientesAtivos}
          </p>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2c5aa0", marginBottom: "20px" }}>🚀 Atalhos Rápidos</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          {atalhos.map((atalho, index) => (
            <div
              key={index}
              onClick={() => navigate(atalho.rota)}
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderLeft: `4px solid ${atalho.cor}`,
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
              }}
            >
              <h3 style={{ 
                color: atalho.cor, 
                margin: "0 0 10px 0",
                fontSize: "20px"
              }}>
                {atalho.titulo}
              </h3>
              <p style={{ 
                color: "#666", 
                margin: 0,
                fontSize: "14px"
              }}>
                {atalho.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ color: "#2c5aa0", marginBottom: "15px" }}>⚡ Ações Imediatas</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            📋 Novo Orçamento
          </button>
          <button style={{
            padding: "10px 20px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            👥 Adicionar Cliente
          </button>
          <button style={{
            padding: "10px 20px", 
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            📊 Relatório de Vendas
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;