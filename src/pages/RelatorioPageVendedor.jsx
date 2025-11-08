import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const RelatorioPageVendedor = () => {
  const navigate = useNavigate();

  // Dados fictícios para os relatórios do VENDEDOR
  const dadosVendas = {
    vendedor: "Ana Vendedora",
    setores: ["Móveis", "Brinquedos", "Eletrodomésticos"],
    loja: "Loja Central - Shopping Ibirapuera",
    totalVendas: 32,
    metaMensal: 50,
    valorTotal: 45890.50,
    clientesNovos: 18,
    clientesFregueses: 14,
    performance: 85,
    setoresDetalhados: [
      { nome: "Móveis", vendas: 12, valor: 28750.00, meta: 15 },
      { nome: "Brinquedos", vendas: 15, valor: 8920.50, meta: 12 },
      { nome: "Eletrodomésticos", vendas: 5, valor: 8220.00, meta: 8 }
    ],
    vendasPorDia: [
      { dia: "01/11", vendas: 2 },
      { dia: "02/11", vendas: 3 },
      { dia: "03/11", vendas: 1 },
      { dia: "04/11", vendas: 4 },
      { dia: "05/11", vendas: 2 },
      { dia: "06/11", vendas: 5 },
      { dia: "07/11", vendas: 3 },
      { dia: "08/11", vendas: 4 }
    ],
    ticketMedio: 1434.08
  };

  // Componente de gráfico de barras simples
  const BarChart = ({ data, title, color = "#2c5aa0" }) => {
    const maxValue = Math.max(...data.map(item => item.vendas));
    
    return (
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "200px" }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  height: `${(item.vendas / maxValue) * 150}px`,
                  backgroundColor: color,
                  width: "30px",
                  borderRadius: "5px 5px 0 0",
                  transition: "height 0.3s ease"
                }}
              />
              <span style={{ marginTop: "8px", fontSize: "12px", color: "#666", textAlign: "center" }}>
                {item.dia}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2c5aa0" }}>
                {item.vendas}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente de gráfico de setores
  const SetoresChart = ({ data, title }) => {
    const colors = ["#2c5aa0", "#28a745", "#fd7e14"];
    
    return (
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {data.map((setor, index) => {
            const percentual = (setor.vendas / setor.meta) * 100;
            return (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "500" }}>
                    <div
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        backgroundColor: colors[index],
                        borderRadius: "50%",
                        marginRight: "8px"
                      }}
                    />
                    {setor.nome}
                  </span>
                  <span style={{ fontWeight: "bold", color: "#2c5aa0" }}>
                    {setor.vendas}/{setor.meta} ({percentual.toFixed(0)}%)
                  </span>
                </div>
                <div style={{ 
                  height: "8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div 
                    style={{
                      height: "100%",
                      backgroundColor: percentual >= 100 ? "#28a745" : colors[index],
                      width: `${Math.min(percentual, 100)}%`,
                      borderRadius: "4px",
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    R$ {setor.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ 
                    fontSize: "12px", 
                    color: percentual >= 100 ? "#28a745" : "#dc3545",
                    fontWeight: "bold"
                  }}>
                    {percentual >= 100 ? "✅ Meta batida!" : `Faltam ${setor.meta - setor.vendas}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout title="Relatório do Vendedor" showHeader={true}>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Cabeçalho do Relatório do VENDEDOR */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{ color: "#2c5aa0", margin: "0 0 10px 0" }}>
              📊 Relatório do Vendedor
            </h1>
            <p style={{ color: "#666", margin: "0 0 5px 0", fontSize: "18px", fontWeight: "500" }}>
              {dadosVendas.vendedor}
            </p>
            <p style={{ color: "#666", margin: "0 0 5px 0" }}>
              {dadosVendas.loja}
            </p>
            <p style={{ color: "#666", margin: 0 }}>
              Setores: <strong>{dadosVendas.setores.join(", ")}</strong>
            </p>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#666", margin: "0 0 5px 0" }}>
              Período: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
            <button
              onClick={() => window.print()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2c5aa0",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "10px"
              }}
            >
              🖨️ Imprimir Relatório
            </button>
          </div>
        </div>

        {/* Métricas Principais do VENDEDOR */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #2c5aa0"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#2c5aa0", fontSize: "16px" }}>💰 Vendas do Mês</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#2c5aa0", margin: "0 0 5px 0" }}>
              {dadosVendas.totalVendas}/{dadosVendas.metaMensal}
            </p>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
              R$ {dadosVendas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div style={{ 
              marginTop: "10px",
              height: "6px",
              backgroundColor: "#e9ecef",
              borderRadius: "3px",
              overflow: "hidden"
            }}>
              <div 
                style={{
                  height: "100%",
                  backgroundColor: "#2c5aa0",
                  width: `${(dadosVendas.totalVendas / dadosVendas.metaMensal) * 100}%`,
                  borderRadius: "3px"
                }}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #28a745"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#28a745", fontSize: "16px" }}>👥 Perfil de Clientes</h3>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "15px 0" }}>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", margin: "0" }}>
                  {dadosVendas.clientesNovos}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>🆕 Novos</p>
              </div>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#fd7e14", margin: "0" }}>
                  {dadosVendas.clientesFregueses}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>🔁 Fregueses</p>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#666", margin: "10px 0 0 0" }}>
              Total: {dadosVendas.clientesNovos + dadosVendas.clientesFregueses} clientes
            </p>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #fd7e14"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#fd7e14", fontSize: "16px" }}>📈 Performance</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#fd7e14", margin: "0 0 5px 0" }}>
              {dadosVendas.performance}%
            </p>
            <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>
              Ticket Médio
            </p>
            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#2c5aa0", margin: "0" }}>
              R$ {dadosVendas.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Gráficos do VENDEDOR */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {/* Gráfico de Vendas por Dia */}
          <BarChart 
            data={dadosVendas.vendasPorDia} 
            title="📈 Vendas por Dia" 
            color="#2c5aa0"
          />

          {/* Gráfico de Performance por Setor */}
          <SetoresChart 
            data={dadosVendas.setoresDetalhados} 
            title="🎯 Performance por Setor"
          />
        </div>

        {/* Resumo Executivo */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h3 style={{ color: "#2c5aa0", marginBottom: "15px" }}>📋 Resumo Executivo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <strong>🎯 Situação da Meta:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.totalVendas >= dadosVendas.metaMensal ? 
                  "✅ Meta batida com sucesso!" : 
                  `⚠️ Faltam ${dadosVendas.metaMensal - dadosVendas.totalVendas} vendas para a meta`
                }
              </p>
            </div>
            <div>
              <strong>📊 Melhor Setor:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.setoresDetalhados.reduce((prev, current) => 
                  (prev.vendas > current.vendas) ? prev : current
                ).nome}
              </p>
            </div>
            <div>
              <strong>👥 Foco de Clientes:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.clientesNovos > dadosVendas.clientesFregueses ? 
                  "🆕 Captação de novos clientes" : 
                  "🔁 Fidelização de clientes"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/vendedor/dashboard")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            ← Voltar para Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RelatorioPageVendedor;