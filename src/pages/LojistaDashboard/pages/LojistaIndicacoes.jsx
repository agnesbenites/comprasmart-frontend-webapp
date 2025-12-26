// src/pages/LojistaDashboard/pages/LojistaIndicacoes.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const LOJISTA_PRIMARY = '#2563eb';
const MAX_INDICACOES_MES = 5;
const CREDITOS_POR_INDICACAO = 30;
const INDICACOES_PARA_UPGRADE = 2;
const DIAS_UPGRADE = 30;
const MAX_UPGRADES_ANO = 3;

const LojistaIndicacoes = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [indicacoes, setIndicacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalIndicacoes: 0,
    indicacoesAprovadas: 0,
    indicacoesPendentes: 0,
    creditosAcumulados: 0,
    upgradesDisponiveis: 0,
    upgradesUsados: 0,
    indicacoesMesAtual: 0,
  });
  const [lojistaId, setLojistaId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      setLojistaId(user.id);
      
      // Buscar indicações do lojista
      const { data: indicacoesData, error: indicacoesError } = await supabase
        .from('indicacoes_lojistas')
        .select('*')
        .eq('indicador_id', user.id)
        .order('created_at', { ascending: false });
      
      if (indicacoesError) throw indicacoesError;
      
      setIndicacoes(indicacoesData || []);
      
      // Calcular estatísticas
      const agora = new Date();
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();
      
      const indicacoesMes = (indicacoesData || []).filter(ind => {
        const dataInd = new Date(ind.created_at);
        return dataInd.getMonth() === mesAtual && dataInd.getFullYear() === anoAtual;
      });
      
      const aprovadas = (indicacoesData || []).filter(ind => ind.status === 'aprovado');
      const pendentes = (indicacoesData || []).filter(ind => ind.status === 'pendente');
      
      const creditosTotal = aprovadas.length * CREDITOS_POR_INDICACAO;
      const upgradesGanhos = Math.floor(aprovadas.length / INDICACOES_PARA_UPGRADE);
      
      // Buscar upgrades já usados (do banco ou localStorage)
      const upgradesUsados = parseInt(localStorage.getItem(`upgrades_usados_${user.id}`) || '0');
      
      setEstatisticas({
        totalIndicacoes: indicacoesData?.length || 0,
        indicacoesAprovadas: aprovadas.length,
        indicacoesPendentes: pendentes.length,
        creditosAcumulados: creditosTotal,
        upgradesDisponiveis: Math.max(0, upgradesGanhos - upgradesUsados),
        upgradesUsados,
        indicacoesMesAtual: indicacoesMes.length,
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleIndicar = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      alert('❌ Preencha todos os campos!');
      return;
    }
    
    if (estatisticas.indicacoesMesAtual >= MAX_INDICACOES_MES) {
      alert(`❌ Você atingiu o limite de ${MAX_INDICACOES_MES} indicações por mês!`);
      return;
    }
    
    if (!email.includes('@')) {
      alert('❌ Email inválido!');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('indicacoes_lojistas')
        .insert({
          indicador_id: lojistaId,
          nome_indicado: nome,
          email_indicado: email,
          telefone_indicado: telefone,
          status: 'pendente',
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      alert('✅ Indicação enviada com sucesso! Entraremos em contato com a loja indicada.');
      
      setNome('');
      setEmail('');
      setTelefone('');
      
      // Recarregar dados
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao enviar indicação:', error);
      alert('❌ Erro ao enviar indicação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAtivarUpgrade = () => {
    if (estatisticas.upgradesDisponiveis <= 0) {
      alert('❌ Você não tem upgrades disponíveis!');
      return;
    }
    
    if (estatisticas.upgradesUsados >= MAX_UPGRADES_ANO) {
      alert(`❌ Você já usou o máximo de ${MAX_UPGRADES_ANO} upgrades este ano!`);
      return;
    }
    
    if (window.confirm(`Deseja ativar ${DIAS_UPGRADE} dias de upgrade no plano superior?`)) {
      // Salvar no localStorage (em produção, salvar no banco)
      const novosUpgradesUsados = estatisticas.upgradesUsados + 1;
      localStorage.setItem(`upgrades_usados_${lojistaId}`, novosUpgradesUsados.toString());
      
      alert(`✅ Upgrade de ${DIAS_UPGRADE} dias ativado! Aproveite todos os recursos do plano superior.`);
      
      // Recarregar estatísticas
      carregarDados();
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: { color: '#ffc107', bg: '#fff3cd', text: '⏳ Pendente' },
      aprovado: { color: '#28a745', bg: '#d4edda', text: '✅ Aprovado' },
      recusado: { color: '#dc3545', bg: '#f8d7da', text: '❌ Recusado' },
    };
    return badges[status] || badges.pendente;
  };

  const indicacoesRestantes = MAX_INDICACOES_MES - estatisticas.indicacoesMesAtual;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Programa de Indicações</h1>
          <p style={styles.subtitle}>Indique novas lojas e ganhe benefícios!</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, borderLeft: `4px solid ${LOJISTA_PRIMARY}`}}>
          <div style={styles.statIcon}>🎁</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Créditos Acumulados</p>
            <p style={styles.statValue}>R$ {estatisticas.creditosAcumulados}</p>
            <p style={styles.statDetail}>Usar em add-ons</p>
          </div>
        </div>

        <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
          <div style={styles.statIcon}>⬆️</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Upgrades Disponíveis</p>
            <p style={styles.statValue}>{estatisticas.upgradesDisponiveis}</p>
            <p style={styles.statDetail}>{DIAS_UPGRADE} dias cada</p>
          </div>
        </div>

        <div style={{...styles.statCard, borderLeft: '4px solid #ffc107'}}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Indicações Aprovadas</p>
            <p style={styles.statValue}>{estatisticas.indicacoesAprovadas}</p>
            <p style={styles.statDetail}>De {estatisticas.totalIndicacoes} totais</p>
          </div>
        </div>

        <div style={{...styles.statCard, borderLeft: '4px solid #6c757d'}}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Indicações este Mês</p>
            <p style={styles.statValue}>{estatisticas.indicacoesMesAtual}/{MAX_INDICACOES_MES}</p>
            <p style={styles.statDetail}>{indicacoesRestantes} restantes</p>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>🎯 Como Funciona</h3>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>🎁</div>
            <div>
              <h4 style={styles.benefitTitle}>Para Você</h4>
              <p style={styles.benefitText}>
                • R$ {CREDITOS_POR_INDICACAO} em créditos por indicação aprovada<br/>
                • Upgrade {DIAS_UPGRADE} dias a cada {INDICACOES_PARA_UPGRADE} indicações<br/>
                • Use créditos em add-ons (usuários, produtos, etc)
              </p>
            </div>
          </div>

          <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>🏪</div>
            <div>
              <h4 style={styles.benefitTitle}>Para a Loja Indicada</h4>
              <p style={styles.benefitText}>
                • Trial de 15 dias (ao invés de 7)<br/>
                • R$ 20 em créditos para add-ons<br/>
                • Suporte prioritário na configuração
              </p>
            </div>
          </div>
        </div>

        <div style={styles.rulesBox}>
          <p style={styles.rulesTitle}>📋 Regras:</p>
          <ul style={styles.rulesList}>
            <li>Máximo {MAX_INDICACOES_MES} indicações por mês</li>
            <li>A loja indicada deve completar o cadastro e assinar um plano</li>
            <li>Créditos são liberados após aprovação (geralmente 2-3 dias)</li>
            <li>Upgrades temporários: máximo {MAX_UPGRADES_ANO} por ano</li>
          </ul>
        </div>
      </div>

      {/* Botão Ativar Upgrade */}
      {estatisticas.upgradesDisponiveis > 0 && (
        <div style={styles.upgradeAlert}>
          <div style={styles.upgradeContent}>
            <span style={styles.upgradeIcon}>🎉</span>
            <div>
              <p style={styles.upgradeTitle}>
                Você tem {estatisticas.upgradesDisponiveis} upgrade(s) disponível(is)!
              </p>
              <p style={styles.upgradeText}>
                Ative agora e teste o plano superior por {DIAS_UPGRADE} dias gratuitamente.
              </p>
            </div>
          </div>
          <button onClick={handleAtivarUpgrade} style={styles.upgradeButton}>
            ⬆️ Ativar Upgrade
          </button>
        </div>
      )}

      {/* Formulário de Indicação */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>➕ Nova Indicação</h3>
        
        {indicacoesRestantes <= 0 ? (
          <div style={styles.limitAlert}>
            ⚠️ Você atingiu o limite de {MAX_INDICACOES_MES} indicações este mês. Volte em {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('pt-BR')}.
          </div>
        ) : (
          <>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome da Loja *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Magazine Exemplo"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@loja.com.br"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefone *</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={handleIndicar}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? '📤 Enviando...' : '📤 Enviar Indicação'}
            </button>
          </>
        )}
      </div>

      {/* Lista de Indicações */}
      <div style={styles.listCard}>
        <h3 style={styles.listTitle}>📋 Minhas Indicações ({estatisticas.totalIndicacoes})</h3>
        
        {indicacoes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyText}>Você ainda não fez nenhuma indicação.</p>
            <p style={styles.emptySubtext}>Comece agora e ganhe benefícios!</p>
          </div>
        ) : (
          <div style={styles.indicacoesList}>
            {indicacoes.map((indicacao) => {
              const badge = getStatusBadge(indicacao.status);
              
              return (
                <div key={indicacao.id} style={styles.indicacaoItem}>
                  <div style={styles.indicacaoHeader}>
                    <div>
                      <h4 style={styles.indicacaoNome}>{indicacao.nome_indicado}</h4>
                      <p style={styles.indicacaoEmail}>{indicacao.email_indicado}</p>
                      <p style={styles.indicacaoTelefone}>📞 {indicacao.telefone_indicado}</p>
                    </div>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: badge.bg,
                      color: badge.color,
                    }}>
                      {badge.text}
                    </div>
                  </div>
                  <div style={styles.indicacaoFooter}>
                    <span style={styles.indicacaoData}>
                      📅 {new Date(indicacao.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {indicacao.status === 'aprovado' && (
                      <span style={styles.creditosGanhos}>
                        💰 +R$ {CREDITOS_POR_INDICACAO} em créditos
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 5px 0',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 3px 0',
  },
  statDetail: {
    fontSize: '0.8rem',
    color: '#999',
    margin: 0,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  infoTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '25px',
  },
  benefitItem: {
    display: 'flex',
    gap: '15px',
  },
  benefitIcon: {
    fontSize: '2rem',
  },
  benefitTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  benefitText: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },
  rulesBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  rulesTitle: {
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  rulesList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.8',
  },
  upgradeAlert: {
    backgroundColor: '#d4edda',
    border: '2px solid #28a745',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  upgradeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  upgradeIcon: {
    fontSize: '2rem',
  },
  upgradeTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#155724',
    margin: '0 0 5px 0',
  },
  upgradeText: {
    fontSize: '0.9rem',
    color: '#155724',
    margin: 0,
  },
  upgradeButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  formTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  limitAlert: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    color: '#856404',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  listCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  listTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  indicacoesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  indicacaoItem: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  indicacaoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  indicacaoNome: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  indicacaoEmail: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 3px 0',
  },
  indicacaoTelefone: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  indicacaoFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #dee2e6',
    flexWrap: 'wrap',
    gap: '10px',
  },
  indicacaoData: {
    fontSize: '0.85rem',
    color: '#666',
  },
  creditosGanhos: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#28a745',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptySubtext: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
};

export default LojistaIndicacoes;