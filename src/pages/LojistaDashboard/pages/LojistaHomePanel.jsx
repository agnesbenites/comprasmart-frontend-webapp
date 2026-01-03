// src/pages/LojistaDashboard/pages/LojistaHomePanel.jsx
// DASHBOARD COM DETECÇÃO DE PLANO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { usePlano } from '../../../contexts/PlanoContext';

const LojistaHomePanel = () => {
  const { plano, loading: planoLoading } = usePlano();
  const [loading, setLoading] = useState(true);
  const [nomeLoja, setNomeLoja] = useState('');
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
    vendasOrganicas: 0,
    vendasEspontaneas: 0,
  });

  const [topConsultores, setTopConsultores] = useState([]);
  const [alertasEstoque, setAlertasEstoque] = useState([]);
  const [filtroEstoque, setFiltroEstoque] = useState('90'); // 30, 60, 90, todos

  useEffect(() => {
    if (!planoLoading) {
      buscarDados();
    }
  }, [planoLoading]);

  const buscarDados = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: loja } = await supabase
        .from('lojas_corrigida')
        .select('id, nome')
        .eq('user_id', user.id)
        .single();

      if (!loja) return;
      setNomeLoja(loja.nome);

      // Buscar vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('*')
        .eq('id_lojista', loja.id);

      const receitaTotal = vendas?.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;
      
      // Vendas por origem
      const vendasOrganicas = vendas?.filter(v => v.origem_venda === 'organica').length || 0;
      const vendasEspontaneas = vendas?.filter(v => v.origem_venda === 'espontanea' || !v.origem_venda).length || 0;
      
      const estoqueRecuperado = vendas
        ?.filter(v => v.venda_incremental && v.origem_venda === 'consultor_on_demand')
        .reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;

      const roi = estoqueRecuperado / 360.00;

      const vendasVideo = vendas?.filter(v => v.metodo_fechamento === 'video').length || 0;
      const vendasAudio = vendas?.filter(v => v.metodo_fechamento === 'audio').length || 0;
      const vendasChat = vendas?.filter(v => v.metodo_fechamento === 'chat').length || 0;

      const scores = vendas?.filter(v => v.score_atendimento).map(v => v.score_atendimento) || [];
      const scoreMedio = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // Top consultores COM ID
      const { data: consultores } = await supabase
        .from('metricas_performance')
        .select('id_entidade, especialidade_tag, total_estoque_recuperado, score_medio_atendimento, vendas_video, vendas_audio, vendas_chat')
        .eq('id_lojista', loja.id)
        .eq('tipo_entidade', 'consultor')
        .order('total_estoque_recuperado', { ascending: false })
        .limit(5);

      // Produtos críticos com filtro
      let queryEstoque = supabase
        .from('estoque_analytics')
        .select(`*, produtos!inner(nome, categoria)`)
        .eq('id_loja', loja.id)
        .in('status_liquidez', ['critico', 'estagnado'])
        .order('dias_sem_giro', { ascending: false });

      if (filtroEstoque !== 'todos') {
        const diasMin = parseInt(filtroEstoque);
        queryEstoque = queryEstoque.gte('dias_sem_giro', diasMin);
      }

      const { data: estoques } = await queryEstoque.limit(10);

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
        vendasOrganicas,
        vendasEspontaneas,
      });

      setTopConsultores(consultores || []);
      setAlertasEstoque(estoques || []);

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || planoLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // ENTERPRISE
  if (plano === 'enterprise') {
    return <DashboardEnterprise 
      nomeLoja={nomeLoja}
      metrics={metrics}
      topConsultores={topConsultores}
      alertasEstoque={alertasEstoque}
      filtroEstoque={filtroEstoque}
      setFiltroEstoque={setFiltroEstoque}
      onRefresh={buscarDados}
    />;
  }

  // PRO
  if (plano === 'pro') {
    return <DashboardPro 
      nomeLoja={nomeLoja}
      metrics={metrics}
      onRefresh={buscarDados}
    />;
  }

  // BASIC
  return <DashboardBasic 
    nomeLoja={nomeLoja}
    metrics={metrics}
    onRefresh={buscarDados}
  />;
};

// ============================================
// DASHBOARD ENTERPRISE
// ============================================
const DashboardEnterprise = ({ nomeLoja, metrics, topConsultores, alertasEstoque, filtroEstoque, setFiltroEstoque, onRefresh }) => {
  return (
    <div style={styles.container}>
      {/* HEADER SEM BADGE */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{nomeLoja}</h1>
          <p style={styles.subtitle}>Dashboard Enterprise</p>
        </div>
        <button onClick={onRefresh} style={styles.button}>
          🔄 Atualizar
        </button>
      </div>

      {/* ROI CARD */}
      <div style={styles.roiCard}>
        <div style={styles.roiSection}>
          <div style={styles.roiLabel}>ROI - Retorno sobre Investimento</div>
          <div style={styles.roiValueRow}>
            <div style={styles.roiValue}>{metrics.roi.toFixed(1)}x</div>
            <div style={styles.roiBadge}>
              {metrics.roi >= 5 && '⭐ Excelente'}
              {metrics.roi >= 3 && metrics.roi < 5 && '✨ Ótimo'}
              {metrics.roi >= 1 && metrics.roi < 3 && '👍 Bom'}
              {metrics.roi < 1 && '📊 Crescendo'}
            </div>
          </div>
        </div>
        
        <div style={styles.roiDivider}></div>
        
        <div style={styles.roiDetails}>
          <div style={styles.roiDetailItem}>
            <span style={styles.roiDetailLabel}>Investimento Mensal</span>
            <span style={styles.roiDetailValue}>R$ 360,00</span>
          </div>
          <div style={styles.roiDetailItem}>
            <span style={styles.roiDetailLabel}>Estoque Recuperado</span>
            <span style={styles.roiDetailValueGreen}>
              R$ {metrics.estoqueRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#3b82f6'}}>💰</div>
          <div>
            <div style={styles.cardLabel}>Receita Total</div>
            <div style={styles.cardValue}>
              R$ {metrics.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>{metrics.totalVendas} vendas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#10b981'}}>📦</div>
          <div>
            <div style={styles.cardLabel}>Vendas Consultores</div>
            <div style={styles.cardValue}>
              {metrics.vendasVideo + metrics.vendasAudio + metrics.vendasChat}
            </div>
            <div style={styles.cardSubtext}>Vendas assistidas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#f59e0b'}}>⚠️</div>
          <div>
            <div style={styles.cardLabel}>Produtos Críticos</div>
            <div style={styles.cardValue}>{metrics.produtosCriticos}</div>
            <div style={styles.cardSubtext}>Requerem atenção</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#8b5cf6'}}>⭐</div>
          <div>
            <div style={styles.cardLabel}>Score Médio</div>
            <div style={styles.cardValue}>{metrics.scoreMedio.toFixed(1)}</div>
            <div style={styles.cardSubtext}>Satisfação</div>
          </div>
        </div>
      </div>

      {/* VENDAS POR ORIGEM */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Vendas por Origem</h2>
        <div style={styles.metodosGrid}>
          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>🤝</div>
            <div style={styles.metodoLabel}>Consultores</div>
            <div style={styles.metodoValue}>{metrics.vendasVideo + metrics.vendasAudio + metrics.vendasChat}</div>
          </div>

          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>🌐</div>
            <div style={styles.metodoLabel}>Orgânicas</div>
            <div style={styles.metodoValue}>{metrics.vendasOrganicas}</div>
          </div>

          <div style={styles.metodoCard}>
            <div style={styles.metodoIcon}>💫</div>
            <div style={styles.metodoLabel}>Espontâneas</div>
            <div style={styles.metodoValue}>{metrics.vendasEspontaneas}</div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE POR MÉTODO */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎬 Performance por Método</h2>
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

      {/* TOP CONSULTORES COM ID */}
      {topConsultores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🏆 Top 5 Consultores</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>ID</div>
              <div style={styles.tableCellWide}>Especialidade</div>
              <div style={styles.tableCell}>Recuperado</div>
              <div style={styles.tableCell}>Score</div>
            </div>
            {topConsultores.map((consultor, i) => (
              <div key={i} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  <span style={styles.rankBadge}>#{i + 1}</span>
                </div>
                <div style={styles.tableCellWide}>
                  <div>{consultor.especialidade_tag || 'Generalista'}</div>
                  <div style={styles.consultorId}>ID: {consultor.id_entidade?.substring(0, 8)}...</div>
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
        </div>
      )}

      {/* PRODUTOS CRÍTICOS COM FILTRO */}
      {alertasEstoque.length > 0 && (
        <div style={styles.section}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={styles.sectionTitle}>⚠️ Estoque Crítico por Período</h2>
            <select 
              value={filtroEstoque} 
              onChange={(e) => setFiltroEstoque(e.target.value)}
              style={styles.filtro}
            >
              <option value="30">30+ dias</option>
              <option value="60">60+ dias</option>
              <option value="90">90+ dias</option>
              <option value="todos">Todos</option>
            </select>
          </div>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCellWide}>Produto</div>
              <div style={styles.tableCell}>Categoria</div>
              <div style={styles.tableCell}>Dias Parado</div>
              <div style={styles.tableCell}>Valor</div>
            </div>
            {alertasEstoque.map((item, i) => (
              <div key={i} style={styles.tableRow}>
                <div style={styles.tableCellWide}>{item.produtos.nome}</div>
                <div style={styles.tableCell}>{item.produtos.categoria}</div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.daysBadge,
                    backgroundColor: item.dias_sem_giro >= 90 ? '#dc2626' : item.dias_sem_giro >= 60 ? '#ea580c' : '#f59e0b'
                  }}>
                    {item.dias_sem_giro}d
                  </span>
                </div>
                <div style={styles.tableCell}>
                  R$ {(item.quantidade_parada * item.custo_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// DASHBOARD PRO
// ============================================
const DashboardPro = ({ nomeLoja, metrics, onRefresh }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{nomeLoja}</h1>
          <p style={styles.subtitle}>Dashboard Pro</p>
        </div>
        <button onClick={onRefresh} style={styles.button}>
          🔄 Atualizar
        </button>
      </div>

      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#3b82f6'}}>💰</div>
          <div>
            <div style={styles.cardLabel}>Faturamento</div>
            <div style={styles.cardValue}>
              R$ {metrics.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>{metrics.totalVendas} vendas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#10b981'}}>🛒</div>
          <div>
            <div style={styles.cardLabel}>Vendas</div>
            <div style={styles.cardValue}>{metrics.totalVendas}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#f59e0b'}}>📈</div>
          <div>
            <div style={styles.cardLabel}>Ticket Médio</div>
            <div style={styles.cardValue}>
              R$ {(metrics.receitaTotal / metrics.totalVendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#8b5cf6'}}>⭐</div>
          <div>
            <div style={styles.cardLabel}>Score Médio</div>
            <div style={styles.cardValue}>{metrics.scoreMedio.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          📊 Dashboard Pro com relatórios avançados disponíveis
        </p>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD BASIC
// ============================================
const DashboardBasic = ({ nomeLoja, metrics, onRefresh }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{nomeLoja}</h1>
          <p style={styles.subtitle}>Dashboard Básico</p>
        </div>
        <button onClick={onRefresh} style={styles.button}>
          🔄 Atualizar
        </button>
      </div>

      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#3b82f6'}}>💰</div>
          <div>
            <div style={styles.cardLabel}>Faturamento</div>
            <div style={styles.cardValue}>
              R$ {metrics.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#10b981'}}>🛒</div>
          <div>
            <div style={styles.cardLabel}>Vendas</div>
            <div style={styles.cardValue}>{metrics.totalVendas}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#f59e0b'}}>📈</div>
          <div>
            <div style={styles.cardLabel}>Ticket Médio</div>
            <div style={styles.cardValue}>
              R$ {(metrics.receitaTotal / metrics.totalVendas || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          📊 Seus dados aparecerão aqui conforme você realizar vendas
        </p>
      </div>
    </div>
  );
};

const styles = {
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
  container: {
    padding: '0',
    backgroundColor: 'transparent',
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  roiSection: {
    flex: 1,
    minWidth: '200px',
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
  },
  roiValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  roiBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  roiDivider: {
    width: '1px',
    height: '60px',
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
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  roiDetailValueGreen: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#059669',
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
    margin: 0,
  },
  filtro: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  metodosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
  },
  metodoCard: {
    textAlign: 'center',
    padding: '25px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
  },
  metodoIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  metodoLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '10px',
    fontWeight: '500',
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
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '80px 2fr 1fr 1fr',
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
    gridTemplateColumns: '80px 2fr 1fr 1fr',
    gap: '10px',
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
    flexDirection: 'column',
    gap: '5px',
  },
  consultorId: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  rankBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  valueGreen: {
    color: '#059669',
    fontWeight: '600',
  },
  daysBadge: {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '2px solid #3b82f6',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
  },
  infoText: {
    color: '#1e40af',
    fontSize: '1rem',
    margin: 0,
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
if (!document.head.querySelector('[data-homepanel-spinner]')) {
  styleSheet.setAttribute('data-homepanel-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaHomePanel;