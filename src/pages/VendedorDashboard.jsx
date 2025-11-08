// src/pages/VendedorDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const VendedorDashboard = () => {
  const navigate = useNavigate();

  // Dados do vendedor (fictícios)
  const vendedorInfo = {
    nome: "Ana Vendedora",
    setores: ["Móveis", "Brinquedos", "Eletrodomésticos"],
    loja: "Loja Central - Shopping Ibirapuera",
    metaMensal: 50,
    vendasRealizadas: 32,
    clientesAtendidos: 15,
    performance: 85 // percentual
  };

  const atalhos = [
    {
      titulo: "📞 Atendimento",
      descricao: "Iniciar chamada com cliente",
      cor: "#28a745",
      rota: "/atendimento"
    },
    {
      titulo: "📦 Produtos",
      descricao: "Ver catálogo dos meus setores",
      cor: "#17a2b8", 
      rota: "/produtos"
    },
    {
      titulo: "👥 Clientes",
      descricao: "Meus clientes atendidos",
      cor: "#6f42c1",
      rota: "/clientes"
    },
    {
      titulo: "📊 Relatório",
      descricao: "Relatório de vendas",
      cor: "#fd7e14",
      rota: "/relatorios"
    }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Cabeçalho Pessoal */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "25px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "25px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ color: "#2c5aa0", margin: "0 0 5px 0" }}>
              🛍️ Olá, {vendedorInfo.nome}!
            </h1>
            <p style={{ color: "#666", margin: "0 0 15px 0" }}>
              {vendedorInfo.loja}
            </p>
            
            {/* Setores Alocados */}
            <div style={{ marginBottom: "15px" }}>
              <h3 style={{ color: "#2c5aa0", margin: "0 0 10px 0", fontSize: "16px" }}>
                🎯 Setores Sob Minha Responsabilidade:
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {vendedorInfo.setores.map((setor, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#e3f2fd",
                      color: "#1565c0",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "1px solid #bbdefb"
                    }}
                  >
                    {setor}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Performance */}
          <div style={{ 
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            minWidth: "120px"
          }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              Performance
            </div>
            <div style={{ 
              fontSize: "24px", 
              fontWeight: "bold", 
              color: vendedorInfo.performance >= 80 ? "#28a745" : "#ffc107"
            }}>
              {vendedorInfo.performance}%
            </div>
          </div>
        </div>
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
          <h3 style={{ margin: "0 0 10px 0", color: "#155724", fontSize: "14px" }}>🤑 Vendas do Mês</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#155724", margin: 0 }}>
            {vendedorInfo.vendasRealizadas}/{vendedorInfo.metaMensal}
          </p>
          <div style={{ 
            marginTop: "8px",
            height: "6px",
            backgroundColor: "#c8e6c9",
            borderRadius: "3px",
            overflow: "hidden"
          }}>
            <div 
              style={{
                height: "100%",
                backgroundColor: "#28a745",
                width: `${(vendedorInfo.vendasRealizadas / vendedorInfo.metaMensal) * 100}%`,
                borderRadius: "3px"
              }}
            />
          </div>
        </div>

        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          borderLeft: "4px solid #2196f3"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#0d47a1", fontSize: "14px" }}>👥 Clientes Atendidos</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0d47a1", margin: 0 }}>
            {vendedorInfo.clientesAtendidos}
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff3cd",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          borderLeft: "4px solid #ffc107"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#856404", fontSize: "14px" }}>📊 Faltam para Meta</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#856404", margin: 0 }}>
            {vendedorInfo.metaMensal - vendedorInfo.vendasRealizadas}
          </p>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2c5aa0", marginBottom: "20px" }}>🚀 Acesso Rápido</h2>
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

      {/* Ação Principal - Relatório */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #dee2e6",
        textAlign: "center"
      }}>
        <h3 style={{ color: "#2c5aa0", marginBottom: "15px" }}>📊 Relatório de Vendas</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Acesse o relatório completo de suas vendas e desempenho
        </p>
        <button 
          onClick={() => navigate("/relatorios")}
          style={{
            padding: "12px 30px",
            backgroundColor: "#fd7e14",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          📈 Ver Relatório Completo
        </button>
      </div>
    </div>
  );
};

export default VendedorDashboard;