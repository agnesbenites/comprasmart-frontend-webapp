// app-frontend/src/pages/ConsultorDashboard/components/StoresPanel.jsx

import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    buscarLojas();
    buscarMinhasCandidaturas();
    buscarLojasAprovadas();
  }, []);

  const buscarLojas = async () => {
    const mockLojas = [
      {
        id: 1,
        nome: 'Eletrônicos Center',
        cidade: 'São Paulo',
        estado: 'SP',
        setores: ['Smartphones', 'Notebooks', 'TVs'],
        comissaoMedia: 8,
        comissaoMin: 5,
        comissaoMax: 12,
        avaliacaoLoja: 4.5,
        totalConsultores: 15,
        vagasDisponiveis: 3,
      },
      {
        id: 2,
        nome: 'Tech Store',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        setores: ['Informática', 'Games', 'Áudio'],
        comissaoMedia: 10,
        comissaoMin: 8,
        comissaoMax: 15,
        avaliacaoLoja: 4.8,
        totalConsultores: 8,
        vagasDisponiveis: 5,
      },
      {
        id: 3,
        nome: 'Casa & Decoração',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        setores: ['Móveis', 'Decoração', 'Iluminação'],
        comissaoMedia: 12,
        comissaoMin: 10,
        comissaoMax: 18,
        avaliacaoLoja: 4.2,
        totalConsultores: 5,
        vagasDisponiveis: 2,
      },
    ];
    setLojas(mockLojas);
  };

  const buscarMinhasCandidaturas = async () => {
    const mockCandidaturas = [
      { lojaId: 2, status: 'pendente', dataCandidatura: '2024-01-15' },
    ];
    setMinhasCandidaturas(mockCandidaturas);
  };

  const buscarLojasAprovadas = async () => {
    const mockAprovadas = [1];
    setLojasAprovadas(mockAprovadas);
  };

  const candidatarSe = async (lojaId) => {
    try {
      console.log('Candidatando-se para loja:', lojaId);
      setMinhasCandidaturas([
        ...minhasCandidaturas,
        { lojaId, status: 'pendente', dataCandidatura: new Date().toISOString() },
      ]);
      alert('✅ Candidatura enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao candidatar:', error);
      alert('❌ Erro ao enviar candidatura');
    }
  };

  const getStatusCandidatura = (lojaId) => {
    if (lojasAprovadas.includes(lojaId)) {
      return { status: 'aprovado', label: '✅ Aprovado', cor: '#28a745' };
    }
    const candidatura = minhasCandidaturas.find(c => c.lojaId === lojaId);
    if (candidatura) {
      return { status: 'pendente', label: '⏳ Aguardando', cor: '#ffc107' };
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
            <p style={{ ...styles.statValue, color: '#28a745' }}>{lojasAprovadas.length}</p>
          </div>
        </div>
      </div>

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
              backgroundColor: filtro === 'aprovadas' ? '#28a745' : '#e9ecef',
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
          const statusCandidatura = getStatusCandidatura(loja.id);
          
          return (
            <div key={loja.id} style={styles.lojaCard}>
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

              {/* Info adicional */}
              <div style={styles.infoAdicional}>
                <span>👥 {loja.totalConsultores} consultores ativos</span>
                <span style={styles.vagasText}>🟢 {loja.vagasDisponiveis} vagas</span>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => statusCandidatura.status === 'nao_candidatado' && candidatarSe(loja.id)}
                disabled={statusCandidatura.status !== 'nao_candidatado'}
                style={{
                  ...styles.actionButton,
                  backgroundColor: statusCandidatura.status === 'nao_candidatado' 
                    ? CONSULTOR_PRIMARY 
                    : statusCandidatura.status === 'aprovado'
                    ? '#e8f5e9'
                    : '#fff3cd',
                  color: statusCandidatura.status === 'nao_candidatado' 
                    ? 'white' 
                    : statusCandidatura.status === 'aprovado'
                    ? '#28a745'
                    : '#856404',
                  cursor: statusCandidatura.status === 'nao_candidatado' ? 'pointer' : 'default',
                }}
              >
                {statusCandidatura.label}
              </button>
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
    border: '1px solid #e9ecef',
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
    color: '#28a745',
  },
  comissaoFaixa: {
    fontSize: '12px',
    color: '#666',
  },
  infoAdicional: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#666',
    marginBottom: '15px',
  },
  vagasText: {
    color: '#28a745',
    fontWeight: '600',
  },
  actionButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
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

export default StoresPanel;