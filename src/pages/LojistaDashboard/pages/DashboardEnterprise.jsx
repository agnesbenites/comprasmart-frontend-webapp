// src/pages/LojistaDashboard/pages/DashboardEnterprise.jsx
// DASHBOARD ENTERPRISE - COM NOME DA LOJA E FUNCIONALIDADES COMPLETAS

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Link } from 'react-router-dom';

const VALORES_PLANOS = {
  basic:      99.90,
  pro:       199.90,
  enterprise: 499.90,
};

const DashboardEnterprise = () => {
  const [loading, setLoading] = useState(true);
  const [lojaId, setLojaId] = useState(null);
  const [nomeLoja, setNomeLoja] = useState('');
  const [planoLoja, setPlanoLoja] = useState('');
  
  const [metrics, setMetrics] = useState({
    estoqueRecuperado: 0,
    roi: 0,
    totalVendas: 0,
    receitaTotal: 0,
    produtosCriticos: 0,
    scoreMedio: 0,
    vendasVideo: 0,
    vendasAudio: 0,
    vendasChat: 0,
  });

  const [topConsultores, setTopConsultores] = useState([]);
  const [alertasEstoque, setAlertasEstoque] = useState([]);
  const [recentes, setRecentes] = useState([]);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: loja } = await supabase
        .from('lojas_corrigida')
        .select('id, nome, plano')
        .eq('user_id', user.id)
        .single();

      if (!loja) return;
      setLojaId(loja.id);
      setNomeLoja(loja.nome);
      setPlanoLoja(loja.plano);

      // Buscar vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('*')
        .eq('id_lojista', loja.id);

      const receitaTotal = vendas?.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;
      
      const estoqueRecuperado = vendas
        ?.filter(v => v.venda_incremental && v.origem_venda === 'consultor_on_demand')
        .reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;

      const roi = estoqueRecuperado / VALORES_PLANOS.enterprise;

      // Contadores por método
      const vendasVideo = vendas?.filter(v => v.metodo_fechamento === 'video').length || 0;
      const vendasAudio = vendas?.filter(v => v.metodo_fechamento === 'audio').length || 0;
      const vendasChat = vendas?.filter(v => v.metodo_fechamento === 'chat').length || 0;

      // Score médio
      const scores = vendas?.filter(v => v.score_atendimento).map(v => v.score_atendimento) || [];
      const scoreMedio = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // Top consultores
      const { data: consultores } = await supabase
        .from('metricas_performance')
        .select('*')
        .eq('id_lojista', loja.id)
        .eq('tipo_entidade', 'consultor')
        .order('total_estoque_recuperado', { ascending: false })
        .limit(5);

      // Produtos críticos
      const { data: estoques } = await supabase
        .from('estoque_analytics')
        .select(`*, produtos!inner(nome, categoria)`)
        .eq('id_loja', loja.id)
        .in('status_liquidez', ['critico', 'estagnado'])
        .order('dias_sem_giro', { ascending: false })
        .limit(5);

      // Vendas recentes (últimas 5)
      const { data: vendasRecentes } = await supabase
        .from('vendas')
        .select('*, clientes(nome)')
        .eq('id_lojista', loja.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setMetrics({
        estoqueRecuperado,
        roi,
        totalVendas: vendas?.length || 0,
        receitaTotal,
        produtosCriticos: estoques?.length || 0,
        scoreMedio,
        vendasVideo,
        vendasAudio,
        vendasChat,
      });

      setTopConsultores(consultores || []);
      setAlertasEstoque(estoques || []);
      setRecentes(vendasRecentes || []);

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoiStatus = (roi) => {
    if (roi >= 5) return { label: 'Excelente', color: '#10b981' };
    if (roi >= 3) return { label: 'Ótimo', color: '#059669' };
    if (roi >= 2) return { label: 'Bom', color: '#3b82f6' };
    if (roi >= 1) return { label: 'Recuperado', color: '#f59e0b' };
    return { label: 'Em Crescimento', color: '#64748b' };
  };

  const roiStatus = getRoiStatus(metrics.roi);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER COM NOME DA LOJA */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard - {nomeLoja}</h1>
          <p style={styles.subtitle}>Visão geral do seu negócio</p>
        </div>
        <div style={styles.headerRight}>
          <span style={{
            ...styles.planBadge,
            backgroundColor: planoLoja === 'enterprise' ? '#fbbf24' : 
                           planoLoja === 'business' ? '#8b5cf6' : 
                           planoLoja === 'starter' ? '#3b82f6' : '#64748b'
          }}>
            {planoLoja?.toUpperCase() || 'PLANO'}
          </span>
          <button onClick={buscarDados} style={styles.button}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* ROI CARD - SUTIL E HARMONIOSO */}
      <div style={styles.roiCard}>
        <div style={styles.roiSection}>
          <div style={styles.roiLabel}>Retorno sobre Investimento</div>
          <div style={styles.roiValueRow}>
            <div style={{...styles.roiValue, color: roiStatus.color}}>
              {metrics.roi.toFixed(1)}x
            </div>
            <div style={{...styles.roiBadge, backgroundColor: roiStatus.color + '20', color: roiStatus.color}}>
              {roiStatus.label}
            </div>
          </div>
          <div style={styles.roiDescription}>
            Para cada R$ 1,00 investido, você recuperou <strong>R$ {metrics.roi.toFixed(2)}</strong> em estoque
          </div>
        </div>
        
        <div style={styles.roiDivider}></div>
        
        <div style={styles.roiDetails}>
          <div style={styles.roiDetailItem}>
            <span style={styles.roiDetailLabel}>Investimento Mensal</span>
            <span style={styles.roiDetailValue}>R$ {VALORES_PLANOS.enterprise.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={styles.roiDetailItem}>
            <span style={styles.roiDetailLabel}>Estoque Recuperado</span>
            <span style={styles.roiDetailValueGreen}>
              R$ {metrics.estoqueRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPAIS */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>💰</div>
          <div>
            <div style={styles.cardLabel}>Receita Total</div>
            <div style={styles.cardValue}>
              R$ {metrics.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>{metrics.totalVendas} vendas realizadas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>👥</div>
          <div>
            <div style={styles.cardLabel}>Vendas Assistidas</div>
            <div style={styles.cardValue}>
              {metrics.vendasVideo + metrics.vendasAudio + metrics.vendasChat}
            </div>
            <div style={styles.cardSubtext}>Com suporte de consultores</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>⚠️</div>
          <div>
            <div style={styles.cardLabel}>Atenção Necessária</div>
            <div style={styles.cardValue}>{metrics.produtosCriticos}</div>
            <div style={styles.cardSubtext}>Produtos críticos</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>⭐</div>
          <div>
            <div style={styles.cardLabel}>Satisfação</div>
            <div style={styles.cardValue}>{metrics.scoreMedio.toFixed(1)}</div>
            <div style={styles.cardSubtext}>Score médio dos clientes</div>
          </div>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Ações Rápidas</h2>
        <div style={styles.acoesGrid}>
          <Link to="/lojista/vendas" style={styles.acaoButton}>
            <span style={styles.acaoIcon}>💰</span>
            <span>Nova Venda</span>
          </Link>
          <Link to="/lojista/estoque" style={styles.acaoButton}>
            <span style={styles.acaoIcon}>📦</span>
            <span>Gerenciar Estoque</span>
          </Link>
          <Link to="/lojista/consultores" style={styles.acaoButton}>
            <span style={styles.acaoIcon}>👥</span>
            <span>Consultores Online</span>
          </Link>
          <Link to="/lojista/relatorios" style={styles.acaoButton}>
            <span style={styles.acaoIcon}>📊</span>
            <span>Relatórios</span>
          </Link>
          <Link to="/lojista/configuracoes" style={styles.acaoButton}>
            <span style={styles.acaoIcon}>⚙️</span>
            <span>Configurações</span>
          </Link>
        </div>
      </div>

      {/* DUAS COLUNAS: TOP CONSULTORES E VENDAS RECENTES */}
      <div style={styles.columnsGrid}>
        {/* COLUNA 1: TOP CONSULTORES */}
        <div style={styles.column}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🏆 Top Consultores</h2>
            {topConsultores.length === 0 ? (
              <p style={styles.emptyState}>Nenhum consultor ainda. As vendas aparecerão aqui quando houver atendimentos.</p>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHeader}>
                  <div style={styles.tableCellWide}>Especialidade</div>
                  <div style={styles.tableCell}>Recuperado</div>
                  <div style={styles.tableCell}>Score</div>
                </div>
                {topConsultores.map((consultor, i) => (
                  <div key={i} style={styles.tableRow}>
                    <div style={styles.tableCellWide}>
                      <span style={styles.rankBadge}>#{i + 1}</span>
                      {consultor.especialidade_tag || 'Generalista'}
                    </div>
                    <div style={styles.tableCell}>
                      <span style={styles.valueGreen}>
                        R$ {parseFloat(consultor.total_estoque_recuperado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={styles.tableCell}>
                      ⭐ {parseFloat(consultor.score_medio_atendimento || 0).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA 2: VENDAS RECENTES */}
        <div style={styles.column}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🕒 Vendas Recentes</h2>
            {recentes.length === 0 ? (
              <p style={styles.emptyState}>Nenhuma venda recente.</p>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHeader}>
                  <div style={styles.tableCellWide}>Cliente</div>
                  <div style={styles.tableCell}>Valor</div>
                  <div style={styles.tableCell}>Método</div>
                </div>
                {recentes.map((venda, i) => (
                  <div key={i} style={styles.tableRow}>
                    <div style={styles.tableCellWide}>
                      {venda.clientes?.nome || 'Cliente não identificado'}
                    </div>
                    <div style={styles.tableCell}>
                      R$ {parseFloat(venda.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={styles.tableCell}>
                      {venda.metodo_fechamento === 'video' ? '📹' : 
                       venda.metodo_fechamento === 'audio' ? '🎧' : 
                       venda.metodo_fechamento === 'chat' ? '💬' : '📝'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PERFORMANCE POR MÉTODO */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Métodos de Atendimento</h2>
        <div style={styles.metodosGrid}>
          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>📹</div>
            <div style={styles.metodoLabel}>Vídeo</div>
            <div style={styles.metodoValue}>{metrics.vendasVideo}</div>
            <div style={styles.metodoPercentual}>
              {((metrics.vendasVideo / metrics.totalVendas) * 100 || 0).toFixed(0)}%
            </div>
          </div>

          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>🎧</div>
            <div style={styles.metodoLabel}>Áudio</div>
            <div style={styles.metodoValue}>{metrics.vendasAudio}</div>
            <div style={styles.metodoPercentual}>
              {((metrics.vendasAudio / metrics.totalVendas) * 100 || 0).toFixed(0)}%
            </div>
          </div>

          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>💬</div>
            <div style={styles.metodoLabel}>Chat</div>
            <div style={styles.metodoValue}>{metrics.vendasChat}</div>
            <div style={styles.metodoPercentual}>
              {((metrics.vendasChat / metrics.totalVendas) * 100 || 0).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* PRODUTOS CRÍTICOS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>⚠️ Produtos que Precisam de Atenção</h2>
        {alertasEstoque.length === 0 ? (
          <p style={styles.emptyState}>🎉 Excelente! Nenhum produto crítico no momento.</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCellWide}>Produto</div>
              <div style={styles.tableCell}>Categoria</div>
              <div style={styles.tableCell}>Status</div>
              <div style={styles.tableCell}>Dias Parado</div>
            </div>
            {alertasEstoque.map((item, i) => (
              <div key={i} style={styles.tableRow}>
                <div style={styles.tableCellWide}>{item.produtos.nome}</div>
                <div style={styles.tableCell}>{item.produtos.categoria}</div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: item.status_liquidez === 'critico' ? '#ef4444' : '#f59e0b'
                  }}>
                    {item.status_liquidez === 'critico' ? 'Crítico' : 'Estagnado'}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.daysBadge,
                    backgroundColor: item.dias_sem_giro >= 90 ? '#dc2626' : 
                                   item.dias_sem_giro >= 60 ? '#ea580c' : 
                                   '#f59e0b'
                  }}>
                    {item.dias_sem_giro} dias
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
    alignItems: 'center',
    gap: '15px',
  },
  planBadge: {
    color: 'white',
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    transition: 'all 0.2s',
  },
  // ROI CARD - SUTIL E HARMONIOSO
  roiCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px 30px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  roiSection: {
    flex: 1,
    minWidth: '250px',
  },
  roiLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '10px',
    fontWeight: '500',
  },
  roiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '8px',
  },
  roiValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  roiBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: `1px solid currentColor`,
  },
  roiDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: 1.5,
  },
  roiDivider: {
    width: '1px',
    height: '80px',
    backgroundColor: '#e2e8f0',
  },
  roiDetails: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  roiDetailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  roiDetailLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  roiDetailValue: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  roiDetailValueGreen: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#059669',
  },
  // MÉTRICAS PRINCIPAIS
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
  },
  cardIcon: {
    fontSize: '2.5rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
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
  // AÇÕES RÁPIDAS
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
  },
  acoesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  acaoButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '18px 15px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  acaoIcon: {
    fontSize: '1.8rem',
  },
  // COLUNAS
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  // MÉTODOS DE ATENDIMENTO
  metodosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  metodoCard: {
    textAlign: 'center',
    padding: '25px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    transition: 'transform 0.2s',
  },
  metodoIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  metodoLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '10px',
    fontWeight: '600',
  },
  metodoValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px',
  },
  metodoPercentual: {
    fontSize: '1rem',
    color: '#3b82f6',
    fontWeight: '600',
  },
  // TABELAS
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '15px',
    padding: '12px 15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px 8px 0 0',
    fontWeight: '600',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '15px',
    padding: '12px 15px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.95rem',
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
  },
  tableCellWide: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  rankBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  valueGreen: {
    color: '#059669',
    fontWeight: '600',
  },
  statusBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  daysBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
};

// Animação
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card:hover {
    transform: translateY(-4px);
  }
  
  .metodo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .acao-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;
if (!document.head.querySelector('[data-dashboard-enterprise-spinner]')) {
  styleSheet.setAttribute('data-dashboard-enterprise-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default DashboardEnterprise;