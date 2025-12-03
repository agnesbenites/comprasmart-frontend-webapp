// app-frontend/src/pages/ConsultorDashboard/components/AnalyticsPanel_Updated.jsx

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatarMoeda, formatarData, formatarPorcentagem } from '../../../shared/utils/formatters';
import { API_CONFIG, apiGet } from '../../../shared/utils/api';

const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";

const AnalyticsPanel_Updated = () => {
  const [periodo, setPeriodo] = useState('mes'); // mes, semana, ano
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMetricas();
  }, [periodo]);

  const carregarMetricas = async () => {
    setLoading(true);
    try {
      // TODO: Chamar API real
      // const API_URL = process.env.REACT_APP_API_URL || 'https://sua-api.onrender.com';
      // const response = await fetch(`${API_URL}/api/consultores/metricas/${consultorId}?periodo=${periodo}`);
      
      // Mock de dados
      setTimeout(() => {
        setMetricas(mockMetricas);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      setLoading(false);
    }
  };

  // Dados mockados
  const mockMetricas = {
    resumo: {
      vendasHoje: 12,
      vendasMes: 156,
      comissaoHoje: 480.00,
      comissaoMes: 6240.00,
      ticketMedio: 250.00,
      taxaConversao: 68,
      tempoMedioAtendimento: '14 min',
      avaliacaoMedia: 4.8,
    },
    vendasPorDia: [
      { dia: 'Seg', vendas: 8, comissao: 320 },
      { dia: 'Ter', vendas: 12, comissao: 480 },
      { dia: 'Qua', vendas: 15, comissao: 600 },
      { dia: 'Qui', vendas: 10, comissao: 400 },
      { dia: 'Sex', vendas: 18, comissao: 720 },
      { dia: 'Sáb', vendas: 22, comissao: 880 },
      { dia: 'Dom', vendas: 14, comissao: 560 },
    ],
    vendasPorCategoria: [
      { categoria: 'Eletrônicos', valor: 2400, quantidade: 15 },
      { categoria: 'Eletrodomésticos', valor: 1800, quantidade: 12 },
      { categoria: 'Móveis', valor: 1200, quantidade: 8 },
      { categoria: 'Decoração', valor: 600, quantidade: 5 },
    ],
    top5Produtos: [
      { nome: 'Smart TV 55"', vendas: 8, comissao: 384 },
      { nome: 'Geladeira Inverter', vendas: 6, comissao: 280 },
      { nome: 'Notebook Gamer', vendas: 5, comissao: 492 },
      { nome: 'Sofá 3 Lugares', vendas: 4, comissao: 220 },
      { nome: 'Air Fryer', vendas: 12, comissao: 54 },
    ],
  };

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando métricas...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header com filtros */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Analytics & Performance</h1>
        
        <div style={styles.periodFilter}>
          <button
            onClick={() => setPeriodo('semana')}
            style={{
              ...styles.periodButton,
              ...(periodo === 'semana' ? styles.periodButtonActive : {})
            }}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriodo('mes')}
            style={{
              ...styles.periodButton,
              ...(periodo === 'mes' ? styles.periodButtonActive : {})
            }}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriodo('ano')}
            style={{
              ...styles.periodButton,
              ...(periodo === 'ano' ? styles.periodButtonActive : {})
            }}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div style={styles.cardsGrid}>
        <MetricCard
          title="Vendas Hoje"
          value={metricas.resumo.vendasHoje}
          icon="🛒"
          color="#007bff"
        />
        <MetricCard
          title="Vendas no Mês"
          value={metricas.resumo.vendasMes}
          icon="📈"
          color="#28a745"
        />
        <MetricCard
          title="Comissão Hoje"
          value={`R$ ${metricas.resumo.comissaoHoje.toFixed(2)}`}
          icon="💰"
          color="#ffc107"
        />
        <MetricCard
          title="Comissão no Mês"
          value={`R$ ${metricas.resumo.comissaoMes.toFixed(2)}`}
          icon="💵"
          color="#28a745"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${metricas.resumo.ticketMedio.toFixed(2)}`}
          icon="🎯"
          color="#007bff"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${metricas.resumo.taxaConversao}%`}
          icon="✅"
          color="#28a745"
        />
        <MetricCard
          title="Tempo Médio"
          value={metricas.resumo.tempoMedioAtendimento}
          icon="⏱️"
          color="#6c757d"
        />
        <MetricCard
          title="Avaliação"
          value={metricas.resumo.avaliacaoMedia}
          icon="⭐"
          color="#ffc107"
        />
      </div>

      {/* Gráficos */}
      <div style={styles.chartsGrid}>
        {/* Gráfico de Vendas por Dia */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Vendas e Comissões por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricas.vendasPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="vendas"
                stroke="#007bff"
                strokeWidth={2}
                name="Vendas"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="comissao"
                stroke="#28a745"
                strokeWidth={2}
                name="Comissão (R$)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Vendas por Categoria */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricas.vendasPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#007bff" name="Valor (R$)" />
              <Bar dataKey="quantidade" fill="#28a745" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Produtos */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>🏆 Top 5 Produtos Mais Vendidos</h3>
        <div style={styles.topProductsList}>
          {metricas.top5Produtos.map((produto, index) => (
            <div key={index} style={styles.topProductItem}>
              <div style={styles.topProductRank}>#{index + 1}</div>
              <div style={styles.topProductInfo}>
                <span style={styles.topProductName}>{produto.nome}</span>
                <span style={styles.topProductSales}>{produto.vendas} vendas</span>
              </div>
              <div style={styles.topProductComission}>
                R$ {produto.comissao.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Métrica
const MetricCard = ({ title, value, icon, color }) => (
  <div style={styles.metricCard}>
    <div style={{ ...styles.metricIcon, backgroundColor: color + '20', color: color }}>
      {icon}
    </div>
    <div style={styles.metricContent}>
      <p style={styles.metricTitle}>{title}</p>
      <p style={{ ...styles.metricValue, color: color }}>{value}</p>
    </div>
  </div>
);

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100%',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: SECONDARY_COLOR,
  },
  periodFilter: {
    display: 'flex',
    gap: '10px',
  },
  periodButton: {
    padding: '10px 20px',
    border: '1px solid #dee2e6',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: SECONDARY_COLOR,
    transition: 'all 0.2s',
  },
  periodButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    borderColor: PRIMARY_COLOR,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
  },
  metricIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  metricContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  metricTitle: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#6c757d',
  },
  metricValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
  },
  chartTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.2rem',
    color: SECONDARY_COLOR,
    fontWeight: '600',
  },
  topProductsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topProductItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  topProductRank: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  topProductInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  topProductName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: SECONDARY_COLOR,
  },
  topProductSales: {
    fontSize: '0.85rem',
    color: '#6c757d',
  },
  topProductComission: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
};

export default AnalyticsPanel_Updated;