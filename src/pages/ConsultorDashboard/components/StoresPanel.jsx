// app-frontend/src/pages/ConsultorDashboard/components/StoresPanel.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

// Cores do Consultor
const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const StoresPanel = ({ consultorId }) => {
  const [lojas, setLojas] = useState([]);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  const [lojasAprovadas, setLojasAprovadas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('todos');
  const [consultorSegmentos, setConsultorSegmentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    await Promise.all([
      buscarConsultorSegmentos(),
      buscarMinhasCandidaturas(),
      buscarLojasAprovadas(),
    ]);
    setLoading(false);
  };

  // Buscar segmentos do consultor
  const buscarConsultorSegmentos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: consultor, error } = await supabase
        .from('consultores')
        .select('segmentos_atendidos')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const segmentos = consultor?.segmentos_atendidos || [];
      setConsultorSegmentos(segmentos);
      
      // Buscar lojas após ter os segmentos
      await buscarLojas(segmentos);
      
    } catch (error) {
      console.error('Erro ao buscar segmentos do consultor:', error);
      setConsultorSegmentos([]);
      await buscarLojas([]);
    }
  };

  const buscarLojas = async (segmentosConsultor) => {
    try {
      // Buscar todas as lojas ativas
      const { data: lojasData, error } = await supabase
        .from('lojas')
        .select(`
          id,
          nome_fantasia,
          cidade,
          estado,
          segmento,
          avaliacao_media,
          aceita_consultores
        `)
        .eq('ativo', true)
        .order('nome_fantasia');

      if (error) throw error;

      // Buscar comissões médias de cada loja
      const lojasComDetalhes = await Promise.all(
        (lojasData || []).map(async (loja) => {
          // Buscar comissão média da loja
          const { data: produtos } = await supabase
            .from('produtos')
            .select('commission_rate')
            .eq('loja_id', loja.id);

          const comissoes = produtos?.map(p => p.commission_rate || 0) || [];
          const comissaoMedia = comissoes.length > 0
            ? comissoes.reduce((a, b) => a + b, 0) / comissoes.length
            : 5;
          const comissaoMin = comissoes.length > 0 ? Math.min(...comissoes) : 5;
          const comissaoMax = comissoes.length > 0 ? Math.max(...comissoes) : 12;

          // Verificar se a loja pertence aos segmentos do consultor
          const pertenceAoSegmento = segmentosConsultor.includes(loja.segmento);

          return {
            id: loja.id,
            nome: loja.nome_fantasia,
            cidade: loja.cidade,
            estado: loja.estado,
            setores: [loja.segmento], // Array para compatibilidade
            segmento: loja.segmento,
            comissaoMedia: Math.round(comissaoMedia),
            comissaoMin: Math.round(comissaoMin),
            comissaoMax: Math.round(comissaoMax),
            avaliacaoLoja: loja.avaliacao_media || 4.5,
            aceitaCandidaturas: loja.aceita_consultores || true,
            pertenceAoSegmento, // ← NOVO: Flag para destacar
            prioridade: pertenceAoSegmento ? 1 : 2, // ← NOVO: Para ordenação
          };
        })
      );

      // Ordenar: lojas do segmento do consultor primeiro
      const lojasOrdenadas = lojasComDetalhes.sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          return a.prioridade - b.prioridade;
        }
        return a.nome.localeCompare(b.nome);
      });

      setLojas(lojasOrdenadas);
      
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      setLojas([]);
    }
  };

  const buscarMinhasCandidaturas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: consultor } = await supabase
        .from('consultores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!consultor) return;

      const { data: candidaturas, error } = await supabase
        .from('aprovacoes_consultores')
        .select('loja_id, status, created_at')
        .eq('consultor_id', consultor.id)
        .in('status', ['pendente', 'recusado']);

      if (error) throw error;

      const candidaturasFormatadas = (candidaturas || []).map(c => ({
        lojaId: c.loja_id,
        status: c.status,
        dataCandidatura: c.created_at,
      }));

      setMinhasCandidaturas(candidaturasFormatadas);
      
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      setMinhasCandidaturas([]);
    }
  };

  const buscarLojasAprovadas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: consultor } = await supabase
        .from('consultores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!consultor) return;

      const { data: aprovacoes, error } = await supabase
        .from('aprovacoes_consultores')
        .select('loja_id')
        .eq('consultor_id', consultor.id)
        .eq('status', 'aprovado');

      if (error) throw error;

      const lojasIds = (aprovacoes || []).map(a => a.loja_id);
      setLojasAprovadas(lojasIds);
      
    } catch (error) {
      console.error('Erro ao buscar lojas aprovadas:', error);
      setLojasAprovadas([]);
    }
  };

  const candidatarSe = async (lojaId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('❌ Você precisa estar logado para se candidatar.');
        return;
      }

      const { data: consultor } = await supabase
        .from('consultores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!consultor) {
        alert('❌ Erro ao identificar consultor.');
        return;
      }

      // Criar candidatura
      const { error } = await supabase
        .from('aprovacoes_consultores')
        .insert({
          consultor_id: consultor.id,
          loja_id: lojaId,
          status: 'pendente',
        });

      if (error) throw error;

      // Atualizar lista local
      setMinhasCandidaturas([
        ...minhasCandidaturas,
        { lojaId, status: 'pendente', dataCandidatura: new Date().toISOString() },
      ]);

      alert('✅ Candidatura enviada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao candidatar:', error);
      
      if (error.code === '23505') {
        alert('⚠️ Você já possui uma candidatura para esta loja.');
      } else {
        alert('❌ Erro ao enviar candidatura. Tente novamente.');
      }
    }
  };

  const getStatusCandidatura = (lojaId, aceitaCandidaturas) => {
    if (lojasAprovadas.includes(lojaId)) {
      return { status: 'aprovado', label: '✅ Aprovado', cor: '#bb25a6' };
    }
    const candidatura = minhasCandidaturas.find(c => c.lojaId === lojaId);
    if (candidatura) {
      return { status: 'pendente', label: '⏳ Aguardando Aprovação', cor: '#ffc107' };
    }
    if (!aceitaCandidaturas) {
      return { status: 'sem_vagas', label: '📨 Enviar Convite', cor: '#6c757d' };
    }
    return { status: 'nao_candidatado', label: '📝 Candidatar-se', cor: CONSULTOR_PRIMARY };
  };

  const lojasFiltradas = lojas.filter(loja => {
    if (busca && !loja.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    if (setorSelecionado !== 'todos' && !loja.setores.includes(setorSelecionado)) {
      return false;
    }
    if (filtro === 'candidatadas') {
      return minhasCandidaturas.some(c => c.lojaId === loja.id);
    }
    if (filtro === 'aprovadas') {
      return lojasAprovadas.includes(loja.id);
    }
    return true;
  });

  const todosSetores = [...new Set(lojas.flatMap(loja => loja.setores))];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🔄</div>
        <p>Carregando lojas...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>🏪 Lojas Disponíveis</h2>
        
        {/* Estatísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Candidaturas</p>
            <p style={styles.statValue}>{minhasCandidaturas.length}</p>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: '#e8f5e9' }}>
            <p style={styles.statLabel}>Aprovadas</p>
            <p style={{ ...styles.statValue, color: '#bb25a6' }}>{lojasAprovadas.length}</p>
          </div>
        </div>
      </div>

      {/* Badge de Segmentos do Consultor */}
      {consultorSegmentos.length > 0 && (
        <div style={styles.segmentosConsultorBanner}>
          <span style={styles.segmentosBannerIcon}>🎯</span>
          <div style={styles.segmentosBannerContent}>
            <strong>Seus segmentos:</strong>
            <div style={styles.segmentosBannerList}>
              {consultorSegmentos.map(seg => (
                <span key={seg} style={styles.segmentoBadge}>{seg}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={styles.filtrosContainer}>
        {/* Barra de busca */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar lojas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filtros por status */}
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFiltro('todas')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'todas' ? CONSULTOR_PRIMARY : '#e9ecef',
              color: filtro === 'todas' ? 'white' : '#333',
            }}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('candidatadas')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'candidatadas' ? '#ffc107' : '#e9ecef',
              color: filtro === 'candidatadas' ? '#333' : '#333',
            }}
          >
            Candidatadas
          </button>
          <button
            onClick={() => setFiltro('aprovadas')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'aprovadas' ? '#bb25a6' : '#e9ecef',
              color: filtro === 'aprovadas' ? 'white' : '#333',
            }}
          >
            Aprovadas
          </button>
        </div>

        {/* Filtro por setor */}
        <select
          value={setorSelecionado}
          onChange={(e) => setSetorSelecionado(e.target.value)}
          style={styles.selectSetor}
        >
          <option value="todos">Todos os setores</option>
          {todosSetores.map(setor => (
            <option key={setor} value={setor}>{setor}</option>
          ))}
        </select>
      </div>

      {/* Lista de Lojas */}
      <div style={styles.lojasGrid}>
        {lojasFiltradas.map(loja => {
          const statusCandidatura = getStatusCandidatura(loja.id, loja.aceitaCandidaturas);
          
          return (
            <div 
              key={loja.id} 
              style={{
                ...styles.lojaCard,
                // Destacar lojas do segmento do consultor
                border: loja.pertenceAoSegmento 
                  ? `2px solid ${CONSULTOR_PRIMARY}` 
                  : '1px solid #e9ecef',
                boxShadow: loja.pertenceAoSegmento
                  ? '0 4px 12px rgba(44, 90, 160, 0.15)'
                  : 'none',
              }}
            >
              {/* Badge "Seu Segmento" */}
              {loja.pertenceAoSegmento && (
                <div style={styles.seuSegmentoBadge}>
                  🎯 Seu Segmento
                </div>
              )}

              {/* Header da Loja */}
              <div style={styles.lojaHeader}>
                <div style={styles.lojaIconContainer}>
                  <span style={styles.lojaIcon}>🏬</span>
                </div>
                <div style={styles.lojaInfo}>
                  <h3 style={styles.lojaNome}>{loja.nome}</h3>
                  <p style={styles.lojaLocal}>📍 {loja.cidade}, {loja.estado}</p>
                </div>
                <div style={styles.avaliacaoContainer}>
                  <span style={styles.avaliacaoIcon}>⭐</span>
                  <span style={styles.avaliacaoValor}>{loja.avaliacaoLoja}</span>
                </div>
              </div>

              {/* Setores */}
              <div style={styles.setoresContainer}>
                <p style={styles.setoresLabel}>Setores:</p>
                <div style={styles.setoresList}>
                  {loja.setores.map(setor => (
                    <span key={setor} style={styles.setorBadge}>
                      {setor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comissão */}
              <div style={styles.comissaoContainer}>
                <div style={styles.comissaoHeader}>
                  <span>💰 Comissão</span>
                </div>
                <div style={styles.comissaoDetails}>
                  <div style={styles.comissaoRow}>
                    <span style={styles.comissaoLabel}>Média:</span>
                    <span style={styles.comissaoMedia}>{loja.comissaoMedia}%</span>
                  </div>
                  <div style={styles.comissaoRow}>
                    <span style={styles.comissaoFaixa}>
                      Faixa: {loja.comissaoMin}% - {loja.comissaoMax}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => {
                  if (statusCandidatura.status === 'nao_candidatado' || 
                      statusCandidatura.status === 'sem_vagas') {
                    candidatarSe(loja.id);
                  }
                }}
                disabled={statusCandidatura.status === 'pendente' || 
                         statusCandidatura.status === 'aprovado'}
                style={{
                  ...styles.actionButton,
                  backgroundColor: 
                    statusCandidatura.status === 'aprovado' ? '#e8f5e9' :
                    statusCandidatura.status === 'pendente' ? '#fff3cd' :
                    statusCandidatura.status === 'sem_vagas' ? '#f8f9fa' :
                    CONSULTOR_PRIMARY,
                  color: 
                    statusCandidatura.status === 'aprovado' ? '#bb25a6' :
                    statusCandidatura.status === 'pendente' ? '#856404' :
                    statusCandidatura.status === 'sem_vagas' ? '#6c757d' :
                    'white',
                  cursor: 
                    (statusCandidatura.status === 'pendente' || 
                     statusCandidatura.status === 'aprovado') ? 'default' : 'pointer',
                  border: statusCandidatura.status === 'sem_vagas' ? '2px dashed #6c757d' : 'none',
                }}
              >
                {statusCandidatura.label}
              </button>
              
              {!loja.aceitaCandidaturas && statusCandidatura.status !== 'aprovado' && 
               statusCandidatura.status !== 'pendente' && (
                <p style={styles.infoText}>
                  💌 Esta loja receberá seu convite e poderá te aprovar posteriormente
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há lojas */}
      {lojasFiltradas.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏪</div>
          <p style={styles.emptyTitle}>Nenhuma loja encontrada</p>
          <p style={styles.emptySubtitle}>Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '25px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    gap: '15px',
  },
  loadingSpinner: {
    fontSize: '3rem',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
  statsContainer: {
    display: 'flex',
    gap: '15px',
  },
  statCard: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    padding: '10px 20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
  // NOVO: Banner de segmentos do consultor
  segmentosConsultorBanner: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '12px',
    padding: '15px 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  segmentosBannerIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  segmentosBannerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  segmentosBannerList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  segmentoBadge: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  // NOVO: Badge "Seu Segmento" no card
  seuSegmentoBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    zIndex: 1,
  },
  filtrosContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '25px',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    flex: '1 1 300px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
  },
  filterButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  selectSetor: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  lojasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  lojaCard: {
    position: 'relative', // Para o badge "Seu Segmento"
    borderRadius: '12px',
    padding: '20px',
    transition: 'box-shadow 0.2s',
    backgroundColor: '#fff',
  },
  lojaHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '15px',
  },
  lojaIconContainer: {
    width: '50px',
    height: '50px',
    backgroundColor: CONSULTOR_LIGHT_BG,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lojaIcon: {
    fontSize: '24px',
  },
  lojaInfo: {
    flex: 1,
  },
  lojaNome: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  lojaLocal: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  avaliacaoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  avaliacaoIcon: {
    fontSize: '16px',
  },
  avaliacaoValor: {
    fontWeight: 'bold',
    color: '#333',
  },
  setoresContainer: {
    marginBottom: '15px',
  },
  setoresLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  setoresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  setorBadge: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    color: CONSULTOR_PRIMARY,
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: '500',
  },
  comissaoContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '15px',
  },
  comissaoHeader: {
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: '8px',
  },
  comissaoDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  comissaoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comissaoLabel: {
    fontSize: '14px',
    color: '#666',
  },
  comissaoMedia: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#bb25a6',
  },
  comissaoFaixa: {
    fontSize: '12px',
    color: '#666',
  },
  actionButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    marginBottom: '8px',
  },
  infoText: {
    fontSize: '12px',
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  emptySubtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
};

// Adicionar animação de loading
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      styleSheet.insertRule(`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      // Ignora se já existir
    }
  }
}

export default StoresPanel;