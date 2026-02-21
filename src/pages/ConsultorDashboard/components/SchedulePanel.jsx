// src/pages/ConsultorDashboard/components/SchedulePanel.jsx
// Componente de Agenda - Funciona para CONSULTOR e VENDEDOR

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const SchedulePanel = ({ tipoUsuario = 'consultor' }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, hoje, semana, mes
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    cliente_nome: '',
    cliente_telefone: '',
    data: '',
    hora: '',
    tipo: 'presencial',
    observacoes: ''
  });

  const cores = {
    consultor: { primary: '#2f0d51', light: '#f3e8ff' },
    vendedor: { primary: '#bb25a6', light: '#f3e8ff' }
  };

  const cor = cores[tipoUsuario] || cores.consultor;

  useEffect(() => {
    inicializar();
  }, []);

  useEffect(() => {
    if (userId) {
      carregarAgendamentos();
      // Atualizar a cada minuto
      const interval = setInterval(carregarAgendamentos, 60000);
      return () => clearInterval(interval);
    }
  }, [userId, filtro]);

  const inicializar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar ID do consultor ou vendedor
      const tabela = tipoUsuario === 'vendedor' ? 'vendedores' : 'consultores';
      const { data, error } = await supabase
        .from(tabela)
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setUserId(data.id);

    } catch (error) {
      console.error('[Schedule] Erro ao inicializar:', error);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);

      if (!userId) return;

      const campo = tipoUsuario === 'vendedor' ? 'vendedor_id' : 'consultor_id';
      
      // Calcular data de filtro
      let dataFiltro = new Date();
      if (filtro === 'hoje') {
        dataFiltro.setHours(0, 0, 0, 0);
      } else if (filtro === 'semana') {
        dataFiltro.setDate(dataFiltro.getDate() - 7);
      } else if (filtro === 'mes') {
        dataFiltro.setMonth(dataFiltro.getMonth() - 1);
      } else {
        // "todos" - últimos 3 meses
        dataFiltro.setMonth(dataFiltro.getMonth() - 3);
      }

      let query = supabase
        .from('agendamentos')
        .select(`
          id,
          cliente_id,
          cliente_nome,
          cliente_telefone,
          data_agendamento,
          duracao_minutos,
          status,
          tipo_atendimento,
          observacoes,
          produtos_interesse,
          created_at,
          clientes (
            nome,
            nome_visivel
          ),
          lojas (
            nome_fantasia
          )
        `)
        .eq(campo, userId)
        .gte('data_agendamento', dataFiltro.toISOString())
        .order('data_agendamento', { ascending: true })
        .limit(50);

      const { data, error } = await query;

      if (error) throw error;

      console.log('[Schedule] Agendamentos carregados:', data?.length || 0);
      setAgendamentos(data || []);

    } catch (error) {
      console.error('[Schedule] Erro ao carregar:', error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const criarAgendamento = async (e) => {
    e.preventDefault();

    if (!novoAgendamento.cliente_nome || !novoAgendamento.data || !novoAgendamento.hora) {
      alert(' Preencha os campos obrigatórios!');
      return;
    }

    try {
      const dataAgendamento = `${novoAgendamento.data}T${novoAgendamento.hora}:00`;
      
      const campo = tipoUsuario === 'vendedor' ? 'vendedor_id' : 'consultor_id';

      const { error } = await supabase
        .from('agendamentos')
        .insert({
          [campo]: userId,
          cliente_nome: novoAgendamento.cliente_nome,
          cliente_telefone: novoAgendamento.cliente_telefone,
          data_agendamento: dataAgendamento,
          duracao_minutos: 30,
          tipo_atendimento: novoAgendamento.tipo,
          observacoes: novoAgendamento.observacoes,
          status: 'confirmado', // Criado pelo consultor = já confirmado
        });

      if (error) throw error;

      alert(' Agendamento criado com sucesso!');
      setMostrarModal(false);
      setNovoAgendamento({
        cliente_nome: '',
        cliente_telefone: '',
        data: '',
        hora: '',
        tipo: 'presencial',
        observacoes: ''
      });
      
      await carregarAgendamentos();

    } catch (error) {
      console.error('[Schedule] Erro ao criar:', error);
      alert(' Erro ao criar agendamento: ' + error.message);
    }
  };

  const confirmarAgendamento = async (id) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: 'confirmado' })
        .eq('id', id);

      if (error) throw error;

      alert(' Agendamento confirmado!');
      await carregarAgendamentos();

    } catch (error) {
      console.error('[Schedule] Erro ao confirmar:', error);
      alert(' Erro ao confirmar agendamento');
    }
  };

  const recusarAgendamento = async (id) => {
    const motivo = prompt('Por que deseja recusar este agendamento?');
    if (!motivo) return;

    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ 
          status: 'cancelado',
          motivo_cancelamento: motivo
        })
        .eq('id', id);

      if (error) throw error;

      alert(' Agendamento recusado!');
      await carregarAgendamentos();

    } catch (error) {
      console.error('[Schedule] Erro ao recusar:', error);
      alert(' Erro ao recusar agendamento');
    }
  };

  const iniciarAtendimento = (agendamento) => {
    // Redirecionar para o ChatPanel com os dados do agendamento
    navigate('/consultor/dashboard/chat', {
      state: {
        clienteId: agendamento.cliente_id,
        clienteNome: agendamento.clientes?.nome || agendamento.cliente_nome,
        clienteNomeVisivel: agendamento.clientes?.nome_visivel || false,
        agendamentoId: agendamento.id,
        produtosInteresse: agendamento.produtos_interesse
      }
    });
  };

  const formatarDataHora = (dataAgendamento) => {
    const data = new Date(dataAgendamento);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const dataStr = data.toLocaleDateString('pt-BR');
    const horaStr = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Verificar se é hoje, amanhã ou outra data
    if (data.toDateString() === hoje.toDateString()) {
      return `🔴 Hoje às ${horaStr}`;
    } else if (data.toDateString() === amanha.toDateString()) {
      return `🟡 Amanhã às ${horaStr}`;
    } else {
      return `📅 ${dataStr} às ${horaStr}`;
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pendente': { emoji: '🟡', texto: 'Pendente Aprovação', cor: '#ffc107' },
      'confirmado': { emoji: '', texto: 'Confirmado', cor: '#bb25a6' },
      'cancelado': { emoji: '', texto: 'Cancelado', cor: '#dc3545' },
      'concluido': { emoji: '', texto: 'Concluído', cor: '#6c757d' },
    };
    return statusMap[status] || { emoji: '❓', texto: status, cor: '#999' };
  };

  const getTipoInfo = (tipo) => {
    const tipoMap = {
      'presencial': { emoji: '', texto: 'Presencial' },
      'remoto': { emoji: '💻', texto: 'Remoto' },
      'telefone': { emoji: '', texto: 'Telefone' },
    };
    return tipoMap[tipo] || { emoji: '❓', texto: tipo };
  };

  const contarPorStatus = () => {
    return {
      total: agendamentos.length,
      pendentes: agendamentos.filter(a => a.status === 'pendente').length,
      confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
      hoje: agendamentos.filter(a => {
        const data = new Date(a.data_agendamento);
        const hoje = new Date();
        return data.toDateString() === hoje.toDateString();
      }).length
    };
  };

  const stats = contarPorStatus();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingSpinner}></div>
        <p>Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header com Estatísticas */}
      <div style={styles.header}>
        <div>
          <h2 style={{ ...styles.title, color: cor.primary }}>
            📅 Calendário de Atendimentos
          </h2>
          <div style={styles.statsRow}>
            <div style={styles.statBadge}>
               Total: <strong>{stats.total}</strong>
            </div>
            <div style={{ ...styles.statBadge, backgroundColor: '#fff3cd' }}>
              🟡 Pendentes: <strong>{stats.pendentes}</strong>
            </div>
            <div style={{ ...styles.statBadge, backgroundColor: '#f3e8ff' }}>
               Confirmados: <strong>{stats.confirmados}</strong>
            </div>
            <div style={{ ...styles.statBadge, backgroundColor: '#f8d7da' }}>
              🔴 Hoje: <strong>{stats.hoje}</strong>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          style={{ ...styles.btnNovo, backgroundColor: cor.primary }}
        >
          ➕ Novo Agendamento
        </button>
      </div>

      {/* Filtros */}
      <div style={styles.filtrosContainer}>
        <button
          onClick={() => setFiltro('todos')}
          style={{
            ...styles.filtroBtn,
            backgroundColor: filtro === 'todos' ? cor.primary : '#e9ecef',
            color: filtro === 'todos' ? 'white' : '#333'
          }}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('hoje')}
          style={{
            ...styles.filtroBtn,
            backgroundColor: filtro === 'hoje' ? cor.primary : '#e9ecef',
            color: filtro === 'hoje' ? 'white' : '#333'
          }}
        >
          Hoje
        </button>
        <button
          onClick={() => setFiltro('semana')}
          style={{
            ...styles.filtroBtn,
            backgroundColor: filtro === 'semana' ? cor.primary : '#e9ecef',
            color: filtro === 'semana' ? 'white' : '#333'
          }}
        >
          Esta Semana
        </button>
        <button
          onClick={() => setFiltro('mes')}
          style={{
            ...styles.filtroBtn,
            backgroundColor: filtro === 'mes' ? cor.primary : '#e9ecef',
            color: filtro === 'mes' ? 'white' : '#333'
          }}
        >
          Este Mês
        </button>
      </div>

      {/* Lista de Agendamentos */}
      {agendamentos.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📅</div>
          <p style={styles.emptyTitle}>Nenhum agendamento encontrado</p>
          <p style={styles.emptySubtitle}>
            {filtro === 'todos' 
              ? 'Clique em "Novo Agendamento" para criar um ou aguarde agendamentos dos clientes via app'
              : `Nenhum agendamento para o filtro "${filtro}"`
            }
          </p>
        </div>
      ) : (
        <div style={styles.agendamentosGrid}>
          {agendamentos.map(agendamento => {
            const statusInfo = getStatusInfo(agendamento.status);
            const tipoInfo = getTipoInfo(agendamento.tipo_atendimento);
            const nomeCliente = agendamento.clientes?.nome_visivel 
              ? agendamento.clientes.nome 
              : agendamento.cliente_nome || `Cliente #${agendamento.cliente_id?.substring(0, 6)}`;

            return (
              <div key={agendamento.id} style={styles.agendamentoCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.clienteNome}>
                       {nomeCliente}
                    </h3>
                    {agendamento.cliente_telefone && (
                      <p style={styles.clienteTelefone}>
                         {agendamento.cliente_telefone}
                      </p>
                    )}
                    {agendamento.lojas && (
                      <p style={styles.lojaInfo}>
                         {agendamento.lojas.nome_fantasia}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusInfo.cor
                    }}
                  >
                    {statusInfo.emoji} {statusInfo.texto}
                  </span>
                </div>

                <div style={styles.cardInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>📅 Quando:</span>
                    <span style={styles.infoValue}>
                      {formatarDataHora(agendamento.data_agendamento)}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>⏱️ Duração:</span>
                    <span style={styles.infoValue}>
                      {agendamento.duracao_minutos || 30} minutos
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Tipo:</span>
                    <span style={styles.infoValue}>
                      {tipoInfo.emoji} {tipoInfo.texto}
                    </span>
                  </div>

                  {agendamento.produtos_interesse && (
                    <div style={styles.produtosBox}>
                      <strong> Produtos de Interesse:</strong>
                      <ul style={styles.produtosList}>
                        {agendamento.produtos_interesse.map((prod, idx) => (
                          <li key={idx}>{prod}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {agendamento.observacoes && (
                    <div style={styles.observacoes}>
                      <strong>📝 Observações:</strong>
                      <p>{agendamento.observacoes}</p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div style={styles.cardActions}>
                  {agendamento.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => confirmarAgendamento(agendamento.id)}
                        style={styles.btnConfirmar}
                      >
                         Confirmar
                      </button>
                      <button
                        onClick={() => recusarAgendamento(agendamento.id)}
                        style={styles.btnRecusar}
                      >
                         Recusar
                      </button>
                    </>
                  )}
                  
                  {agendamento.status === 'confirmado' && (
                    <button
                      onClick={() => iniciarAtendimento(agendamento)}
                      style={styles.btnIniciar}
                    >
                      🚀 Iniciar Atendimento
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Novo Agendamento */}
      {mostrarModal && (
        <div style={styles.modalOverlay} onClick={() => setMostrarModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ ...styles.modalTitle, color: cor.primary }}>
              ➕ Novo Agendamento Manual
            </h3>
            
            <form onSubmit={criarAgendamento} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}> Nome do Cliente *</label>
                <input
                  type="text"
                  value={novoAgendamento.cliente_nome}
                  onChange={(e) => setNovoAgendamento({
                    ...novoAgendamento,
                    cliente_nome: e.target.value
                  })}
                  required
                  style={styles.input}
                  placeholder="Digite o nome do cliente"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}> Telefone</label>
                <input
                  type="tel"
                  value={novoAgendamento.cliente_telefone}
                  onChange={(e) => setNovoAgendamento({
                    ...novoAgendamento,
                    cliente_telefone: e.target.value
                  })}
                  style={styles.input}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📅 Data *</label>
                  <input
                    type="date"
                    value={novoAgendamento.data}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      data: e.target.value
                    })}
                    required
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>⏰ Hora *</label>
                  <input
                    type="time"
                    value={novoAgendamento.hora}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      hora: e.target.value
                    })}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Atendimento</label>
                <select
                  value={novoAgendamento.tipo}
                  onChange={(e) => setNovoAgendamento({
                    ...novoAgendamento,
                    tipo: e.target.value
                  })}
                  style={styles.select}
                >
                  <option value="presencial"> Presencial</option>
                  <option value="remoto">💻 Remoto</option>
                  <option value="telefone"> Telefone</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📝 Observações</label>
                <textarea
                  value={novoAgendamento.observacoes}
                  onChange={(e) => setNovoAgendamento({
                    ...novoAgendamento,
                    observacoes: e.target.value
                  })}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Anotações sobre o atendimento..."
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="submit"
                  style={{ ...styles.btnSalvar, backgroundColor: cor.primary }}
                >
                   Criar Agendamento
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  style={styles.btnCancelarModal}
                >
                   Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '15px',
  },
  loadingSpinner: {
    fontSize: '3rem',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statBadge: {
    backgroundColor: '#e9ecef',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: '#333',
  },
  btnNovo: {
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  },
  filtrosContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  filtroBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
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
  agendamentosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '20px',
  },
  agendamentoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  clienteNome: {
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
    color: '#333',
    fontWeight: '600',
  },
  clienteTelefone: {
    margin: '0 0 3px 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  lojaInfo: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    whiteSpace: 'nowrap',
  },
  cardInfo: {
    marginBottom: '15px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#333',
    fontWeight: '500',
  },
  produtosBox: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    fontSize: '0.9rem',
    border: '1px solid #f3e8ff',
  },
  produtosList: {
    margin: '8px 0 0 0',
    paddingLeft: '20px',
  },
  observacoes: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  btnConfirmar: {
    flex: 1,
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  btnRecusar: {
    flex: 1,
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  btnIniciar: {
    flex: 1,
    backgroundColor: '#2f0d51',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    margin: '0 0 25px 0',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '12px 15px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    padding: '12px 15px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  btnSalvar: {
    flex: 1,
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  btnCancelarModal: {
    flex: 1,
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
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

export default SchedulePanel;