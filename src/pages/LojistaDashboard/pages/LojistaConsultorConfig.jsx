// src/pages/LojistaDashboard/pages/LojistaConsultorConfig.jsx
// DASHBOARD DE PERFORMANCE DOS CONSULTORES - DADOS ANONIMIZADOS

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const LojistaConsultorConfig = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes'); // hoje, semana, mes, ano
  const [expandedConsultor, setExpandedConsultor] = useState(null); // Para dropdown
  const [metrics, setMetrics] = useState({
    totalConsultores: 0,
    consultoresAtivos: 0,
    faturamentoTotal: 0,
    comissoesTotais: 0,
    ticketMedio: 0,
    totalVendas: 0,
    scoreMedio: 0,
  });
  const [consultores, setConsultores] = useState([]);

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

      // Buscar consultores vinculados
      const { data: vinculos } = await supabase
        .from('loja_consultor')
        .select('*')
        .eq('id_loja', loja.id)
        .eq('status', 'aprovado');

      // Calcular período
      const dataInicio = calcularDataInicio(periodo);

      // Buscar métricas de performance para cada consultor
      const consultoresComMetricas = await Promise.all(
        (vinculos || []).map(async (vinculo) => {
          // Buscar dados de metricas_performance
          const { data: metricas } = await supabase
            .from('metricas_performance')
            .select('*')
            .eq('id_lojista', loja.id)
            .eq('id_entidade', vinculo.id_consultor)
            .eq('tipo_entidade', 'consultor')
            .single();

          // Buscar vendas do período
          const { data: vendas } = await supabase
            .from('vendas')
            .select('*')
            .eq('id_lojista', loja.id)
            .eq('id_consultor', vinculo.id_consultor)
            .gte('created_at', dataInicio);

          const totalVendas = vendas?.length || 0;
          const faturamento = vendas?.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;
          const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

          // Calcular comissões (8% sobre vendas incrementais)
          const vendasIncrementais = vendas?.filter(v => v.venda_incremental) || [];
          const faturamentoIncremental = vendasIncrementais.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0);
          const comissoes = faturamentoIncremental * 0.08; // 8%

          // Contar vendas por método
          const vendasVideo = vendas?.filter(v => v.metodo_fechamento === 'video').length || 0;
          const vendasAudio = vendas?.filter(v => v.metodo_fechamento === 'audio').length || 0;
          const vendasChat = vendas?.filter(v => v.metodo_fechamento === 'chat').length || 0;

          // Score médio
          const scoreMedio = metricas?.score_medio_atendimento || 0;

          // Gerar ID anônimo (primeiros 8 caracteres do UUID)
          const idAnonimo = vinculo.id_consultor?.substring(0, 8) || 'N/A';

          return {
            id: vinculo.id_consultor,
            idAnonimo,
            nome: `Consultor #${idAnonimo}`, // Nome anonimizado
            email: `cons***@***`, // Email anonimizado
            especialidade: metricas?.especialidade_tag || 'Generalista',
            totalVendas,
            faturamento,
            ticketMedio,
            comissoes,
            scoreMedio,
            vendasVideo,
            vendasAudio,
            vendasChat,
            estoqueRecuperado: metricas?.total_estoque_recuperado || 0,
            status: 'ativo',
          };
        })
      );

      // Ordenar por faturamento
      consultoresComMetricas.sort((a, b) => b.faturamento - a.faturamento);

      // Calcular métricas gerais
      const totalConsultores = consultoresComMetricas.length;
      const consultoresAtivos = consultoresComMetricas.filter(c => c.status === 'ativo').length;
      const faturamentoTotal = consultoresComMetricas.reduce((sum, c) => sum + c.faturamento, 0);
      const comissoesTotais = consultoresComMetricas.reduce((sum, c) => sum + c.comissoes, 0);
      const totalVendasGeral = consultoresComMetricas.reduce((sum, c) => sum + c.totalVendas, 0);
      const ticketMedioGeral = totalVendasGeral > 0 ? faturamentoTotal / totalVendasGeral : 0;
      const scoreMedioGeral = consultoresComMetricas.length > 0 
        ? consultoresComMetricas.reduce((sum, c) => sum + c.scoreMedio, 0) / consultoresComMetricas.length 
        : 0;

      setMetrics({
        totalConsultores,
        consultoresAtivos,
        faturamentoTotal,
        comissoesTotais,
        ticketMedio: ticketMedioGeral,
        totalVendas: totalVendasGeral,
        scoreMedio: scoreMedioGeral,
      });

      setConsultores(consultoresComMetricas);

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
        <p>Carregando dados dos consultores...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🤝 Performance de Consultores</h1>
          <p style={styles.subtitle}>Análise de vendas assistidas - {getPeriodoLabel()}</p>
          <p style={styles.privacyNote}>🔒 Dados anonimizados para proteção de privacidade</p>
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
          <div style={{...styles.cardIcon, backgroundColor: '#10b981'}}>🤝</div>
          <div>
            <div style={styles.cardLabel}>Consultores Ativos</div>
            <div style={styles.cardValue}>{metrics.consultoresAtivos}</div>
            <div style={styles.cardSubtext}>de {metrics.totalConsultores} total</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#bb25a6'}}>💰</div>
          <div>
            <div style={styles.cardLabel}>Faturamento Total</div>
            <div style={styles.cardValue}>
              R$ {metrics.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>{metrics.totalVendas} vendas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#f59e0b'}}>💵</div>
          <div>
            <div style={styles.cardLabel}>Comissões Pagas</div>
            <div style={styles.cardValue}>
              R$ {metrics.comissoesTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.cardSubtext}>8% sobre vendas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{...styles.cardIcon, backgroundColor: '#8b5cf6'}}>⭐</div>
          <div>
            <div style={styles.cardLabel}>Score Médio</div>
            <div style={styles.cardValue}>{metrics.scoreMedio.toFixed(1)}</div>
            <div style={styles.cardSubtext}>satisfação</div>
          </div>
        </div>
      </div>

      {/* TOP 5 CONSULTORES - DESTAQUE */}
      {consultores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🏆 Top 5 Consultores do Período</h2>
          <div style={styles.top5Grid}>
            {consultores.slice(0, 5).map((consultor, i) => (
              <div key={consultor.id} style={styles.top5Card}>
                <div style={styles.top5Rank}>#{i + 1}</div>
                <div style={styles.top5Avatar}>C</div>
                <div style={styles.top5Name}>{consultor.nome}</div>
                <div style={styles.top5Id}>ID: {consultor.idAnonimo}</div>
                <div style={styles.top5Value}>
                  R$ {consultor.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={styles.top5Sales}>{consultor.totalVendas} vendas</div>
                <div style={styles.top5Comissao}>
                  💵 R$ {consultor.comissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={styles.top5Score}>⭐ {consultor.scoreMedio.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABELA COMPLETA DE CONSULTORES */}
      {consultores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Todos os Consultores</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCellRank}>#</div>
              <div style={styles.tableCellName}>Consultor (ID)</div>
              <div style={styles.tableCell}>Especialidade</div>
              <div style={styles.tableCell}>Vendas</div>
              <div style={styles.tableCell}>Faturamento</div>
              <div style={styles.tableCell}>Comissões</div>
              <div style={styles.tableCell}>Método</div>
              <div style={styles.tableCell}>Ações</div>
            </div>
            {consultores.map((consultor, i) => (
              <React.Fragment key={consultor.id}>
                <div style={styles.tableRow}>
                  <div style={styles.tableCellRank}>
                    <span style={styles.rankBadge}>#{i + 1}</span>
                  </div>
                  <div style={styles.tableCellName}>
                    <div style={styles.consultorInfo}>
                      <div style={styles.miniAvatar}>C</div>
                      <div>
                        <div style={styles.consultorNome}>{consultor.nome}</div>
                        <div style={styles.consultorId}>ID: {consultor.idAnonimo}</div>
                      </div>
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.especialidadeBadge}>{consultor.especialidade}</span>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.vendasBadge}>{consultor.totalVendas}</span>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.faturamentoBadge}>
                      R$ {consultor.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={styles.tableCell}>
                    <span style={styles.comissaoBadge}>
                      R$ {consultor.comissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={styles.metodos}>
                      {consultor.vendasVideo > 0 && (
                        <span style={styles.metodoBadge} title="Vídeo">📹 {consultor.vendasVideo}</span>
                      )}
                      {consultor.vendasAudio > 0 && (
                        <span style={styles.metodoBadge} title="Áudio">🎧 {consultor.vendasAudio}</span>
                      )}
                      {consultor.vendasChat > 0 && (
                        <span style={styles.metodoBadge} title="Chat">💬 {consultor.vendasChat}</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <button 
                      style={styles.btnExpand}
                      onClick={() => setExpandedConsultor(expandedConsultor === consultor.id ? null : consultor.id)}
                    >
                      {expandedConsultor === consultor.id ? '▼' : '▶'} Detalhes
                    </button>
                  </div>
                </div>
                
                {/* DROPDOWN DE DETALHES */}
                {expandedConsultor === consultor.id && (
                  <div style={styles.detailsRow}>
                    <div style={styles.detailsGrid}>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>📦 Produto Mais Vendido</div>
                        <div style={styles.detailValue}>Produto Premium</div>
                        <div style={styles.detailSubtext}>15 unidades</div>
                      </div>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>💵 Comissão Média</div>
                        <div style={styles.detailValue}>
                          R$ {(consultor.comissoes / consultor.totalVendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.detailSubtext}>por venda</div>
                      </div>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>💰 Total em Comissões</div>
                        <div style={styles.detailValue}>
                          R$ {consultor.comissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.detailSubtext}>no período</div>
                      </div>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>⭐ Avaliações</div>
                        <div style={styles.detailValue}>{consultor.scoreMedio.toFixed(1)}</div>
                        <div style={styles.detailSubtext}>{consultor.totalVendas} avaliações</div>
                      </div>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>📈 Ticket Médio</div>
                        <div style={styles.detailValue}>
                          R$ {consultor.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.detailSubtext}>por venda</div>
                      </div>
                      <div style={styles.detailCard}>
                        <div style={styles.detailLabel}>🎯 Taxa de Conversão</div>
                        <div style={styles.detailValue}>75%</div>
                        <div style={styles.detailSubtext}>média</div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ANÁLISE POR MÉTODO */}
      {consultores.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎬 Análise por Método de Atendimento</h2>
          <div style={styles.metodosGrid}>
            <div style={styles.metodoCard}>
              <div style={styles.metodoIcon}>📹</div>
              <div style={styles.metodoLabel}>Vídeo</div>
              <div style={styles.metodoValue}>
                {consultores.reduce((sum, c) => sum + c.vendasVideo, 0)}
              </div>
              <div style={styles.metodoSubtext}>vendas</div>
            </div>
            <div style={styles.metodoCard}>
              <div style={styles.metodoIcon}>🎧</div>
              <div style={styles.metodoLabel}>Áudio</div>
              <div style={styles.metodoValue}>
                {consultores.reduce((sum, c) => sum + c.vendasAudio, 0)}
              </div>
              <div style={styles.metodoSubtext}>vendas</div>
            </div>
            <div style={styles.metodoCard}>
              <div style={styles.metodoIcon}>💬</div>
              <div style={styles.metodoLabel}>Chat</div>
              <div style={styles.metodoValue}>
                {consultores.reduce((sum, c) => sum + c.vendasChat, 0)}
              </div>
              <div style={styles.metodoSubtext}>vendas</div>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {consultores.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🤝</p>
          <p style={styles.emptyText}>Nenhum consultor vinculado</p>
          <button style={styles.emptyButton}>Ver Solicitações Pendentes</button>
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
    borderTop: '4px solid #10b981',
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
    margin: '0 0 5px 0',
  },
  privacyNote: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontStyle: 'italic',
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
    backgroundColor: '#10b981',
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
    backgroundColor: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    position: 'relative',
  },
  top5Rank: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#10b981',
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
    backgroundColor: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 auto 10px',
  },
  top5Name: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '3px',
  },
  top5Id: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: '10px',
  },
  top5Value: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '5px',
  },
  top5Sales: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '8px',
  },
  top5Comissao: {
    fontSize: '1rem',
    color: '#f59e0b',
    fontWeight: '600',
    marginBottom: '8px',
  },
  top5Score: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    overflowX: 'auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '60px 2fr 1.5fr 100px 140px 120px 150px 120px',
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
    gridTemplateColumns: '60px 2fr 1.5fr 100px 140px 120px 150px 120px',
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
    backgroundColor: '#10b981',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  consultorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  miniAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  consultorNome: {
    fontWeight: '600',
    color: '#1e293b',
  },
  consultorId: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  especialidadeBadge: {
    backgroundColor: '#dbeafe',
    color: '#2f0d51',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
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
  comissaoBadge: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  metodos: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
  },
  metodoBadge: {
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
  },
  scoreBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
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
  metodoSubtext: {
    fontSize: '0.85rem',
    color: '#94a3b8',
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
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnExpand: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  detailsRow: {
    gridColumn: '1 / -1',
    backgroundColor: '#f8fafc',
    padding: '25px',
    borderRadius: '8px',
    marginTop: '-10px',
    marginBottom: '10px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
  },
  detailCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
  },
  detailLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '8px',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px',
  },
  detailSubtext: {
    fontSize: '0.8rem',
    color: '#94a3b8',
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
if (!document.head.querySelector('[data-consultores-spinner]')) {
  styleSheet.setAttribute('data-consultores-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaConsultorConfig;