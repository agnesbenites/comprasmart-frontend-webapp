// app-frontend/src/pages/ConsultorDashboard/components/QueuePanel.jsx

import React, { useState, useEffect } from 'react';

// Cores do Consultor
const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const QueuePanel = ({ consultorId }) => {
  const [status, setStatus] = useState('disponivel'); // disponivel, ocupado, offline
  const [filaAtendimento, setFilaAtendimento] = useState([]);
  const [atendimentoAtual, setAtendimentoAtual] = useState(null);

  // Simular fila de atendimento
  useEffect(() => {
    const mockCalls = [
      {
        id: 1,
        clienteNome: 'Maria Silva',
        loja: 'Loja Eletrônicos Center',
        setor: 'Smartphones',
        tempoEspera: '2 min',
        prioridade: 'normal',
      },
      {
        id: 2,
        clienteNome: 'João Santos',
        loja: 'Tech Store',
        setor: 'Notebooks',
        tempoEspera: '5 min',
        prioridade: 'urgente',
      },
    ];

    if (status === 'disponivel') {
      setFilaAtendimento(mockCalls);
    }
  }, [status]);

  const aceitarChamada = (chamada) => {
    setAtendimentoAtual(chamada);
    setStatus('ocupado');
    setFilaAtendimento(prev => prev.filter(c => c.id !== chamada.id));
    console.log('Aceitando chamada:', chamada);
  };

  const recusarChamada = (chamadaId) => {
    setFilaAtendimento(prev => prev.filter(c => c.id !== chamadaId));
    console.log('Recusando chamada:', chamadaId);
  };

  const finalizarAtendimento = () => {
    setAtendimentoAtual(null);
    setStatus('disponivel');
  };

  const toggleDisponibilidade = () => {
    if (status === 'ocupado') {
      alert('Finalize o atendimento atual antes de mudar o status');
      return;
    }
    setStatus(prev => prev === 'disponivel' ? 'offline' : 'disponivel');
  };

  const getStatusStyle = () => {
    if (status === 'disponivel') return { backgroundColor: '#28a745', color: 'white' };
    if (status === 'ocupado') return { backgroundColor: '#ffc107', color: '#333' };
    return { backgroundColor: '#6c757d', color: 'white' };
  };

  const getStatusText = () => {
    if (status === 'disponivel') return '✅ Disponível';
    if (status === 'ocupado') return '⏳ Em Atendimento';
    return '📴 Offline';
  };

  return (
    <div style={styles.container}>
      {/* Header com Status */}
      <div style={styles.header}>
        <h2 style={styles.title}>📞 Fila de Atendimento</h2>
        
        <div style={styles.headerActions}>
          {/* Botão de Status */}
          <button
            onClick={toggleDisponibilidade}
            style={{ ...styles.statusButton, ...getStatusStyle() }}
            disabled={status === 'ocupado'}
          >
            {getStatusText()}
          </button>

          {/* Contador de pessoas na fila */}
          <div style={styles.counterBadge}>
            👥 {filaAtendimento.length} na fila
          </div>
        </div>
      </div>

      {/* Atendimento Atual */}
      {atendimentoAtual && (
        <div style={styles.atendimentoAtual}>
          <div style={styles.atendimentoInfo}>
            <p style={styles.atendimentoLabel}>🎯 Atendendo agora:</p>
            <p style={styles.atendimentoNome}>{atendimentoAtual.clienteNome}</p>
            <p style={styles.atendimentoDetalhe}>
              📍 {atendimentoAtual.loja} - {atendimentoAtual.setor}
            </p>
          </div>
          <div style={styles.atendimentoActions}>
            <button
              onClick={() => window.location.href = `/consultor/dashboard/chat`}
              style={styles.chatButton}
            >
              💬 Abrir Chat
            </button>
            <button
              onClick={finalizarAtendimento}
              style={styles.finalizarButton}
            >
              ✅ Finalizar
            </button>
          </div>
        </div>
      )}

      {/* Mensagem quando offline */}
      {status === 'offline' && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📴</div>
          <p style={styles.emptyTitle}>Você está offline</p>
          <p style={styles.emptySubtitle}>
            Clique em "Offline" acima para começar a receber chamadas
          </p>
        </div>
      )}

      {/* Mensagem quando ocupado sem atendimento */}
      {status === 'ocupado' && !atendimentoAtual && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>⏳</div>
          <p style={styles.emptyTitle}>Você está em atendimento</p>
        </div>
      )}

      {/* Mensagem quando disponível mas fila vazia */}
      {status === 'disponivel' && filaAtendimento.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📞</div>
          <p style={styles.emptyTitle}>Aguardando chamadas...</p>
          <p style={styles.emptySubtitle}>
            Você receberá uma notificação quando um cliente solicitar atendimento
          </p>
        </div>
      )}

      {/* Lista de Chamadas Pendentes */}
      {status === 'disponivel' && filaAtendimento.length > 0 && (
        <div style={styles.listaContainer}>
          {filaAtendimento.map((chamada) => (
            <div
              key={chamada.id}
              style={{
                ...styles.chamadaCard,
                borderLeftColor: chamada.prioridade === 'urgente' ? '#dc3545' : CONSULTOR_PRIMARY,
                backgroundColor: chamada.prioridade === 'urgente' ? '#fff5f5' : '#f8f9fa'
              }}
            >
              <div style={styles.chamadaContent}>
                {/* Informações da Chamada */}
                <div style={styles.chamadaInfo}>
                  <div style={styles.chamadaHeader}>
                    <span style={styles.chamadaNome}>
                      📞 {chamada.clienteNome}
                    </span>
                    {chamada.prioridade === 'urgente' && (
                      <span style={styles.urgenteBadge}>🔥 URGENTE</span>
                    )}
                  </div>

                  <div style={styles.chamadaDetalhes}>
                    <p style={styles.detalheItem}>📍 {chamada.loja}</p>
                    <p style={styles.detalheItem}>🏷️ Setor: {chamada.setor}</p>
                    <p style={styles.detalheItem}>⏱️ Aguardando há {chamada.tempoEspera}</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div style={styles.chamadaActions}>
                  <button
                    onClick={() => aceitarChamada(chamada)}
                    style={styles.aceitarButton}
                  >
                    ✅ Aceitar
                  </button>
                  <button
                    onClick={() => recusarChamada(chamada.id)}
                    style={styles.recusarButton}
                  >
                    ❌ Recusar
                  </button>
                </div>
              </div>
            </div>
          ))}
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
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  statusButton: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  counterBadge: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    color: CONSULTOR_PRIMARY,
    padding: '10px 15px',
    borderRadius: '25px',
    fontWeight: '600',
    fontSize: '14px',
  },
  atendimentoAtual: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  atendimentoInfo: {
    flex: 1,
  },
  atendimentoLabel: {
    fontSize: '14px',
    color: '#856404',
    margin: '0 0 5px 0',
  },
  atendimentoNome: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  atendimentoDetalhe: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  atendimentoActions: {
    display: 'flex',
    gap: '10px',
  },
  chatButton: {
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  finalizarButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
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
  listaContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  chamadaCard: {
    borderRadius: '12px',
    borderLeft: '5px solid',
    padding: '20px',
    transition: 'all 0.2s',
  },
  chamadaContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '15px',
  },
  chamadaInfo: {
    flex: 1,
    minWidth: '200px',
  },
  chamadaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  chamadaNome: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  urgenteBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  chamadaDetalhes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  detalheItem: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  chamadaActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  aceitarButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  recusarButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
};

export default QueuePanel;