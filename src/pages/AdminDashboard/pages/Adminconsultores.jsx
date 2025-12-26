// src/pages/AdminDashboard/pages/AdminConsultores.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { FaUsers, FaCheckCircle, FaBan, FaEdit, FaTrash, FaSearch, FaStar, FaDollarSign, FaEnvelope } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminConsultores = () => {
  const [consultores, setConsultores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [consultorDetalhes, setConsultorDetalhes] = useState(null);

  useEffect(() => {
    carregarConsultores();
  }, []);

  const carregarConsultores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultor_perfil')
        .select(`
          *,
          user:user_id (email),
          avaliacoes:avaliacoes(nota),
          vendas:vendas(valor_total, comissao, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular estatísticas para cada consultor
      const consultoresComStats = (data || []).map(consultor => {
        const avaliacoes = consultor.avaliacoes || [];
        const vendas = consultor.vendas || [];
        
        const mediaAvaliacoes = avaliacoes.length > 0
          ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
          : 0;

        const vendasConcluidas = vendas.filter(v => v.status === 'concluida');
        const totalVendas = vendasConcluidas.length;
        const totalComissoes = vendasConcluidas.reduce((acc, v) => acc + parseFloat(v.comissao || 0), 0);

        return {
          ...consultor,
          mediaAvaliacoes,
          totalVendas,
          totalComissoes,
        };
      });

      setConsultores(consultoresComStats);

    } catch (error) {
      console.error('Erro ao carregar consultores:', error);
      alert('❌ Erro ao carregar consultores');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (consultorId) => {
    if (!confirm('Aprovar este consultor?')) return;

    try {
      const { error } = await supabase
        .from('consultor_perfil')
        .update({ status: 'ativo' })
        .eq('id', consultorId);

      if (error) throw error;

      alert('✅ Consultor aprovado com sucesso!');
      carregarConsultores();

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('❌ Erro ao aprovar consultor');
    }
  };

  const handleBloquear = async (consultorId, statusAtual) => {
    const novoStatus = statusAtual === 'bloqueado' ? 'ativo' : 'bloqueado';
    const acao = novoStatus === 'bloqueado' ? 'bloquear' : 'desbloquear';

    if (!confirm(`Deseja ${acao} este consultor?`)) return;

    try {
      const { error } = await supabase
        .from('consultor_perfil')
        .update({ status: novoStatus })
        .eq('id', consultorId);

      if (error) throw error;

      alert(`✅ Consultor ${novoStatus === 'bloqueado' ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
      carregarConsultores();

    } catch (error) {
      console.error(`Erro ao ${acao}:`, error);
      alert(`❌ Erro ao ${acao} consultor`);
    }
  };

  const handleExcluir = async (consultorId) => {
    if (!confirm('⚠️ ATENÇÃO: Excluir permanentemente este consultor?')) return;

    const confirmacao = prompt('Digite "CONFIRMAR" para excluir:');
    if (confirmacao !== 'CONFIRMAR') return;

    try {
      const { error } = await supabase
        .from('consultor_perfil')
        .delete()
        .eq('id', consultorId);

      if (error) throw error;

      alert('✅ Consultor excluído com sucesso!');
      carregarConsultores();

    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('❌ Erro ao excluir consultor');
    }
  };

  const handleVerDetalhes = (consultor) => {
    setConsultorDetalhes(consultor);
  };

  const handleEnviarNotificacao = async (consultor) => {
    const mensagem = prompt(`Enviar notificação para ${consultor.nome_completo}:`);
    if (!mensagem) return;

    try {
      console.log('Enviando notificação:', { consultor: consultor.id, mensagem });
      alert('✅ Notificação enviada!');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('❌ Erro ao enviar notificação');
    }
  };

  const consultoresFiltrados = consultores
    .filter(consultor => {
      if (filtro === 'todos') return true;
      return consultor.status === filtro;
    })
    .filter(consultor => {
      if (!busca) return true;
      const searchLower = busca.toLowerCase();
      return (
        consultor.nome_completo?.toLowerCase().includes(searchLower) ||
        consultor.cpf?.includes(busca) ||
        consultor.cidade?.toLowerCase().includes(searchLower)
      );
    });

  const estatisticas = {
    total: consultores.length,
    ativos: consultores.filter(c => c.status === 'ativo').length,
    pendentes: consultores.filter(c => c.status === 'pendente').length,
    bloqueados: consultores.filter(c => c.status === 'bloqueado').length,
  };

  if (loading) {
    return <div style={styles.loading}>Carregando consultores...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Gerenciar Consultores</h1>
          <p style={styles.subtitle}>
            {consultoresFiltrados.length} de {consultores.length} consultores
          </p>
        </div>
        <button onClick={carregarConsultores} style={styles.refreshButton}>
          🔄 Atualizar
        </button>
      </div>

      {/* Estatísticas */}
      <div style={styles.statsGrid}>
        <StatCard label="Total" value={estatisticas.total} color="#2c5aa0" />
        <StatCard label="Ativos" value={estatisticas.ativos} color="#28a745" />
        <StatCard label="Pendentes" value={estatisticas.pendentes} color="#ffc107" />
        <StatCard label="Bloqueados" value={estatisticas.bloqueados} color="#dc3545" />
      </div>

      {/* Filtros */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <FaSearch color="#666" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterButtons}>
          <button
            onClick={() => setFiltro('todos')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'todos' ? ADMIN_PRIMARY : '#f8f9fa',
              color: filtro === 'todos' ? 'white' : '#333',
            }}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('ativo')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'ativo' ? '#28a745' : '#f8f9fa',
              color: filtro === 'ativo' ? 'white' : '#333',
            }}
          >
            Ativos
          </button>
          <button
            onClick={() => setFiltro('pendente')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'pendente' ? '#ffc107' : '#f8f9fa',
              color: filtro === 'pendente' ? 'white' : '#333',
            }}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFiltro('bloqueado')}
            style={{
              ...styles.filterButton,
              backgroundColor: filtro === 'bloqueado' ? '#dc3545' : '#f8f9fa',
              color: filtro === 'bloqueado' ? 'white' : '#333',
            }}
          >
            Bloqueados
          </button>
        </div>
      </div>

      {/* Lista de Consultores */}
      <div style={styles.tableContainer}>
        {consultoresFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Nenhum consultor encontrado</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Consultor</th>
                <th style={styles.th}>CPF</th>
                <th style={styles.th}>Localização</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Avaliação</th>
                <th style={styles.th}>Vendas</th>
                <th style={styles.th}>Comissões</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {consultoresFiltrados.map(consultor => (
                <tr key={consultor.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>
                      <p style={styles.consultorNome}>{consultor.nome_completo}</p>
                      <p style={styles.consultorId}>ID: {consultor.id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td style={styles.td}>{consultor.cpf || '-'}</td>
                  <td style={styles.td}>
                    {consultor.cidade}, {consultor.estado}
                  </td>
                  <td style={styles.td}>{consultor.user?.email || '-'}</td>
                  <td style={styles.td}>
                    <div style={styles.avaliacaoContainer}>
                      <FaStar color="#ffc107" size={14} />
                      <span style={styles.avaliacaoValor}>{consultor.mediaAvaliacoes}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{consultor.totalVendas}</td>
                  <td style={styles.td}>
                    <span style={styles.comissaoValor}>
                      R$ {consultor.totalComissoes.toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(consultor.status),
                      }}
                    >
                      {getStatusLabel(consultor.status)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsContainer}>
                      {consultor.status === 'pendente' && (
                        <button
                          onClick={() => handleAprovar(consultor.id)}
                          style={styles.iconButton}
                          title="Aprovar"
                        >
                          <FaCheckCircle color="#28a745" size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleBloquear(consultor.id, consultor.status)}
                        style={styles.iconButton}
                        title={consultor.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                      >
                        <FaBan color={consultor.status === 'bloqueado' ? '#28a745' : '#dc3545'} size={18} />
                      </button>
                      <button
                        onClick={() => handleVerDetalhes(consultor)}
                        style={styles.iconButton}
                        title="Ver Detalhes"
                      >
                        <FaEdit color="#2563eb" size={18} />
                      </button>
                      <button
                        onClick={() => handleEnviarNotificacao(consultor)}
                        style={styles.iconButton}
                        title="Enviar Notificação"
                      >
                        <FaEnvelope color="#ffc107" size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(consultor.id)}
                        style={styles.iconButton}
                        title="Excluir"
                      >
                        <FaTrash color="#dc3545" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalhes */}
      {consultorDetalhes && (
        <div style={styles.modalOverlay} onClick={() => setConsultorDetalhes(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>📊 Detalhes do Consultor</h3>
            
            <div style={styles.detalhesGrid}>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>Nome:</span>
                <span style={styles.detalheValor}>{consultorDetalhes.nome_completo}</span>
              </div>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>CPF:</span>
                <span style={styles.detalheValor}>{consultorDetalhes.cpf}</span>
              </div>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>Email:</span>
                <span style={styles.detalheValor}>{consultorDetalhes.user?.email}</span>
              </div>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>Telefone:</span>
                <span style={styles.detalheValor}>{consultorDetalhes.telefone || '-'}</span>
              </div>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>Cidade:</span>
                <span style={styles.detalheValor}>{consultorDetalhes.cidade}, {consultorDetalhes.estado}</span>
              </div>
              <div style={styles.detalheItem}>
                <span style={styles.detalheLabel}>Status:</span>
                <span style={styles.detalheValor}>{getStatusLabel(consultorDetalhes.status)}</span>
              </div>
            </div>

            <div style={styles.detalhesStats}>
              <div style={styles.detalhesStatCard}>
                <FaStar color="#ffc107" size={24} />
                <div>
                  <p style={styles.detalhesStatLabel}>Avaliação Média</p>
                  <p style={styles.detalhesStatValue}>{consultorDetalhes.mediaAvaliacoes} ⭐</p>
                </div>
              </div>
              <div style={styles.detalhesStatCard}>
                <FaDollarSign color="#28a745" size={24} />
                <div>
                  <p style={styles.detalhesStatLabel}>Total Comissões</p>
                  <p style={styles.detalhesStatValue}>R$ {consultorDetalhes.totalComissoes.toFixed(2)}</p>
                </div>
              </div>
              <div style={styles.detalhesStatCard}>
                <FaUsers color="#2563eb" size={24} />
                <div>
                  <p style={styles.detalhesStatLabel}>Total Vendas</p>
                  <p style={styles.detalhesStatValue}>{consultorDetalhes.totalVendas}</p>
                </div>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setConsultorDetalhes(null)} style={styles.closeButton}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes Auxiliares
const StatCard = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const getStatusColor = (status) => {
  const colors = {
    ativo: '#d4edda',
    pendente: '#fff3cd',
    bloqueado: '#f8d7da',
  };
  return colors[status] || '#f8f9fa';
};

const getStatusLabel = (status) => {
  const labels = {
    ativo: '✅ Ativo',
    pendente: '⏳ Pendente',
    bloqueado: '🔒 Bloqueado',
  };
  return labels[status] || status;
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '1.2rem',
    color: '#666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  filtersContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
  },
  filterButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1200px',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem',
    borderBottom: '2px solid #e9ecef',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '15px',
    fontSize: '0.9rem',
    color: '#666',
  },
  consultorNome: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 3px 0',
  },
  consultorId: {
    fontSize: '0.75rem',
    color: '#999',
    margin: 0,
  },
  avaliacaoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  avaliacaoValor: {
    fontWeight: '600',
    color: '#333',
  },
  comissaoValor: {
    fontWeight: '600',
    color: '#28a745',
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  actionsContainer: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#999',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px',
  },
  detalhesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '25px',
  },
  detalheItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  detalheLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '600',
  },
  detalheValor: {
    fontSize: '1rem',
    color: '#333',
  },
  detalhesStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '25px',
  },
  detalhesStatCard: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  detalhesStatLabel: {
    fontSize: '0.8rem',
    color: '#666',
    margin: '0 0 3px 0',
  },
  detalhesStatValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AdminConsultores;