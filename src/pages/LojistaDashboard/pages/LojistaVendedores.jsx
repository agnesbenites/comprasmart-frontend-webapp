// src/pages/LojistaDashboard/pages/LojistaVendedores.jsx
// DASHBOARD DE PERFORMANCE DOS VENDEDORES

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const LojistaVendedores = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes'); // hoje, semana, mes, ano
  const [metrics, setMetrics] = useState({
    totalVendedores: 0,
    vendedoresAtivos: 0,
    faturamentoTotal: 0,
    ticketMedio: 0,
    totalVendas: 0,
  });
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: loja } = await supabase
        .from('lojas_corrigida')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!loja) return;

      // Buscar vendedores
      const { data: vendedoresData } = await supabase
        .from('vendedores')
        .select('*')
        .eq('id_loja', loja.id);

      // Calcular período
      const dataInicio = calcularDataInicio(periodo);

      // Buscar vendas do período para cada vendedor
      const vendedoresComMetricas = await Promise.all(
        (vendedoresData || []).map(async (vendedor) => {
          const { data: vendas } = await supabase
            .from('vendas')
            .select('*')
            .eq('id_lojista', loja.id)
            .eq('id_vendedor', vendedor.id)
            .gte('created_at', dataInicio);

          const totalVendas = vendas?.length || 0;
          const faturamento = vendas?.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;
          const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

          // Calcular meta (exemplo: R$ 5000/mês)
          const meta = 5000;
          const percMeta = (faturamento / meta) * 100;

          return {
            ...vendedor,
            totalVendas,
            faturamento,
            ticketMedio,
            meta,
            percMeta,
          };
        })
      );

      // Ordenar por faturamento
      vendedoresComMetricas.sort((a, b) => b.faturamento - a.faturamento);

      // Calcular métricas gerais
      const totalVendedores = vendedoresComMetricas.length;
      const vendedoresAtivos = vendedoresComMetricas.filter(v => v.ativo).length;
      const faturamentoTotal = vendedoresComMetricas.reduce((sum, v) => sum + v.faturamento, 0);
      const totalVendasGeral = vendedoresComMetricas.reduce((sum, v) => sum + v.totalVendas, 0);
      const ticketMedioGeral = totalVendasGeral > 0 ? faturamentoTotal / totalVendasGeral : 0;

      setMetrics({
        totalVendedores,
        vendedoresAtivos,
        faturamentoTotal,
        ticketMedio: ticketMedioGeral,
        totalVendas: totalVendasGeral,
      });

      setVendedores(vendedoresComMetricas);

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularDataInicio = (periodo) => {
    const hoje = new Date();
    switch (periodo) {
      case 'hoje':
        hoje.setHours(0, 0, 0, 0);
        return hoje.toISOString();
      case 'semana':
        hoje.setDate(hoje.getDate() - 7);
        return hoje.toISOString();
      case 'mes':
        hoje.setMonth(hoje.getMonth() - 1);
        return hoje.toISOString();
      case 'ano':
        hoje.setFullYear(hoje.getFullYear() - 1);
        return hoje.toISOString();
      default:
        return hoje.toISOString();
    }
  };

  const getPeriodoLabel = () => {
    switch (periodo) {
      case 'hoje': return 'Hoje';
      case 'semana': return 'Últimos 7 dias';
      case 'mes': return 'Último mês';
      case 'ano': return 'Último ano';
      default: return 'Período';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dados dos vendedores...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Performance de Vendedores</h1>
          <p style={styles.subtitle}>Análise de vendas da equipe - {getPeriodoLabel()}</p>
        </div>
        <div style={styles.headerRight}>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={styles.select}>
            <option value="hoje">Hoje</option>
            <option value="semana">Últimos 7 dias</option>
            <option value="mes">Último mês</option>
            <option value="ano">Último ano</option>
          </select>
          <button onClick={carregarDados} style={styles.button}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS GERAIS */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#3b82f6'}}>👥</div>
          <div>
            <div style={styles.cardLabel}>Vendedores Ativos</div>
            <div style={styles.cardValue}>{metrics.vendedoresAtivos}</div>
            <div style={styles.cardSubtext}>de {metrics.totalVendedores} total</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#10b981'}}>💰</div>
          <div>
            <div style={styles.cardLabel}>Faturamento Total</div>
            <div style={styles.cardValue}>
              R$ {metrics.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>{metrics.totalVendas} vendas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#f59e0b'}}>📈</div>
          <div>
            <div style={styles.cardLabel}>Ticket Médio</div>
            <div style={styles.cardValue}>
              R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>por venda</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#8b5cf6'}}>🎯</div>
          <div>
            <div style={styles.cardLabel}>Média de Vendas</div>
            <div style={styles.cardValue}>
              {metrics.vendedoresAtivos > 0 ? (metrics.totalVendas / metrics.vendedoresAtivos).toFixed(1) : 0}
            </div>
            <div style={styles.cardSubtext}>por vendedor</div>
          </div>
        </div>
      </div>

      {/* TOP 5 VENDEDORES - DESTAQUE */}
      {vendedores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🏆 Top 5 Vendedores do Período</h2>
          <div style={styles.top5Grid}>
            {vendedores.slice(0, 5).map((vendedor, i) => (
              <div key={vendedor.id} style={styles.top5Card}>
                <div style={styles.top5Rank}>#{i + 1}</div>
                <div style={styles.top5Avatar}>{vendedor.nome?.[0]}</div>
                <div style={styles.top5Name}>{vendedor.nome}</div>
                <div style={styles.top5Value}>
                  R$ {vendedor.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={styles.top5Sales}>{vendedor.totalVendas} vendas</div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill, 
                      width: `${Math.min(vendedor.percMeta, 100)}%`,
                      backgroundColor: vendedor.percMeta >= 100 ? '#10b981' : vendedor.percMeta >= 70 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <div style={styles.top5Meta}>
                  {vendedor.percMeta.toFixed(0)}% da meta
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABELA COMPLETA DE VENDEDORES */}
      {vendedores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Todos os Vendedores</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCellRank}>#</div>
              <div style={styles.tableCellName}>Vendedor</div>
              <div style={styles.tableCell}>Vendas</div>
              <div style={styles.tableCell}>Faturamento</div>
              <div style={styles.tableCell}>Ticket Médio</div>
              <div style={styles.tableCell}>Meta</div>
              <div style={styles.tableCell}>Status</div>
            </div>
            {vendedores.map((vendedor, i) => (
              <div key={vendedor.id} style={styles.tableRow}>
                <div style={styles.tableCellRank}>
                  <span style={styles.rankBadge}>#{i + 1}</span>
                </div>
                <div style={styles.tableCellName}>
                  <div style={styles.vendedorInfo}>
                    <div style={styles.miniAvatar}>{vendedor.nome?.[0]}</div>
                    <div>
                      <div style={styles.vendedorNome}>{vendedor.nome}</div>
                      <div style={styles.vendedorEmail}>{vendedor.email}</div>
                    </div>
                  </div>
                </div>
                <div style={styles.tableCell}>
                  <span style={styles.vendasBadge}>{vendedor.totalVendas}</span>
                </div>
                <div style={styles.tableCell}>
                  <span style={styles.faturamentoBadge}>
                    R$ {vendedor.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  R$ {vendedor.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={styles.tableCell}>
                  <div style={styles.metaBar}>
                    <div 
                      style={{
                        ...styles.metaFill,
                        width: `${Math.min(vendedor.percMeta, 100)}%`,
                        backgroundColor: vendedor.percMeta >= 100 ? '#10b981' : vendedor.percMeta >= 70 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div style={styles.metaText}>{vendedor.percMeta.toFixed(0)}%</div>
                </div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: vendedor.ativo ? '#dcfce7' : '#fee2e2',
                    color: vendedor.ativo ? '#15803d' : '#dc2626'
                  }}>
                    {vendedor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {vendedores.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📊</p>
          <p style={styles.emptyText}>Nenhum vendedor cadastrado</p>
          <button style={styles.emptyButton}>+ Cadastrar Primeiro Vendedor</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
  },
  select: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  cardLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '5px',
  },
  cardValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px',
  },
  cardSubtext: {
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '25px',
  },
  top5Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  top5Card: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    position: 'relative',
  },
  top5Rank: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#3b82f6',
    color: 'white',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  top5Avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 auto 15px',
  },
  top5Name: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  top5Value: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '5px',
  },
  top5Sales: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '15px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  top5Meta: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '60px 2fr 100px 150px 130px 120px 100px',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px 8px 0 0',
    fontWeight: '600',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '60px 2fr 100px 150px 130px 120px 100px',
    gap: '10px',
    padding: '15px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    alignItems: 'center',
  },
  tableCellRank: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellName: {
    display: 'flex',
    alignItems: 'center',
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  vendedorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  miniAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  vendedorNome: {
    fontWeight: '600',
    color: '#1e293b',
  },
  vendedorEmail: {
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  vendasBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '6px 14px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1rem',
  },
  faturamentoBadge: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: '1rem',
  },
  metaBar: {
    width: '80px',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  metaFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  metaText: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '5rem',
    margin: '0 0 20px 0',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#64748b',
    marginBottom: '30px',
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

// Animação
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('[data-vendedores-spinner]')) {
  styleSheet.setAttribute('data-vendedores-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaVendedores;