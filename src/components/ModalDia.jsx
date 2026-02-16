import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ModalDia = ({ data, onClose, colors, isDark, user }) => {
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [loading, setLoading] = useState(true);
  
  // Estados para cada aba
  const [nota, setNota] = useState('');
  const [eventos, setEventos] = useState([]);
  const [contas, setContas] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  
  // Estados para formulários
  const [showFormEvento, setShowFormEvento] = useState(false);
  const [showFormConta, setShowFormConta] = useState(false);
  const [showFormTarefa, setShowFormTarefa] = useState(false);

  useEffect(() => {
    if (user && data) {
      carregarDadosDia();
    }
  }, [data, user]);

  const carregarDadosDia = async () => {
    setLoading(true);
    await Promise.all([
      carregarNota(),
      carregarEventos(),
      carregarContas(),
      carregarTarefas()
    ]);
    setLoading(false);
  };

  const carregarNota = async () => {
    try {
      const { data: notaData, error } = await supabase
        .from('kasbook_notas_dia')
        .select('*')
        .eq('user_id', user.id)
        .eq('data', data)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar nota:', error);
      }
      
      if (notaData) setNota(notaData.conteudo || '');
    } catch (error) {
      console.error('Erro ao carregar nota:', error);
    }
  };

  const carregarEventos = async () => {
    const { data: eventosData } = await supabase
      .from('kasbook_eventos')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', data)
      .order('created_at', { ascending: true });
    
    if (eventosData) setEventos(eventosData);
  };

  const carregarContas = async () => {
    const { data: contasData } = await supabase
      .from('kasbook_lembretes_contas')
      .select('*')
      .eq('user_id', user.id)
      .eq('data_vencimento', data)
      .order('pago', { ascending: true });
    
    if (contasData) setContas(contasData);
  };

  const carregarTarefas = async () => {
    const { data: tarefasData } = await supabase
      .from('kasbook_tarefas')
      .select('*')
      .eq('user_id', user.id)
      .eq('deadline', data)
      .order('prioridade', { ascending: false });
    
    if (tarefasData) setTarefas(tarefasData);
  };

  // Salvar nota (auto-save)
  const salvarNota = async () => {
    const { data: existente } = await supabase
      .from('kasbook_notas_dia')
      .select('id')
      .eq('user_id', user.id)
      .eq('data', data)
      .single();

    if (existente) {
      await supabase
        .from('kasbook_notas_dia')
        .update({ conteudo: nota })
        .eq('id', existente.id);
    } else {
      await supabase
        .from('kasbook_notas_dia')
        .insert([{ user_id: user.id, data, conteudo: nota }]);
    }
  };

  // Auto-save da nota a cada 3 segundos
  useEffect(() => {
    if (nota && abaAtiva === 'notas') {
      const timer = setTimeout(() => {
        salvarNota();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [nota]);

  const marcarContaPaga = async (contaId, pago) => {
    await supabase
      .from('kasbook_lembretes_contas')
      .update({ 
        pago, 
        data_pagamento: pago ? new Date().toISOString().split('T')[0] : null 
      })
      .eq('id', contaId);
    
    carregarContas();
  };

  const atualizarStatusTarefa = async (tarefaId, novoStatus) => {
    await supabase
      .from('kasbook_tarefas')
      .update({ status: novoStatus })
      .eq('id', tarefaId);
    
    carregarTarefas();
  };

  const excluirEvento = async (eventoId) => {
    await supabase
      .from('kasbook_eventos')
      .delete()
      .eq('id', eventoId);
    
    carregarEventos();
  };

  const excluirConta = async (contaId) => {
    await supabase
      .from('kasbook_lembretes_contas')
      .delete()
      .eq('id', contaId);
    
    carregarContas();
  };

  const excluirTarefa = async (tarefaId) => {
    await supabase
      .from('kasbook_tarefas')
      .delete()
      .eq('id', tarefaId);
    
    carregarTarefas();
  };

  const formatarData = (dataStr) => {
    const d = new Date(dataStr + 'T00:00:00');
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return {
      dia: d.getDate(),
      mes: meses[d.getMonth()],
      ano: d.getFullYear(),
      diaSemana: diasSemana[d.getDay()]
    };
  };

  const dataFormatada = formatarData(data);

  const getPrioridadeColor = (prioridade) => {
    const cores = { 'alta': colors.red, 'media': '#f39c12', 'baixa': '#2ecc71' };
    return cores[prioridade] || cores.baixa;
  };

  const getCategoriaColor = (categoria) => {
    const cores = {
      'promocao': colors.pink,
      'reuniao': colors.purple,
      'entrega': '#2ecc71',
      'pagamento': colors.red,
      'evento': '#3498db',
      'outro': '#95a5a6'
    };
    return cores[categoria] || cores.outro;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1A1E29' : '#FFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.pink} 100%)`,
          padding: '25px 30px',
          color: '#FFF'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ← Voltar
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <h2 style={{ margin: 0, fontSize: '28px' }}>
            {dataFormatada.dia} de {dataFormatada.mes}, {dataFormatada.ano}
          </h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
            {dataFormatada.diaSemana}
          </p>
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex',
          borderBottom: `2px solid ${isDark ? '#333' : '#eee'}`,
          backgroundColor: isDark ? '#2B2F38' : '#f9f9f9'
        }}>
          {[
            { id: 'notas', label: '📝 Notas', count: nota ? 1 : 0 },
            { id: 'eventos', label: '📅 Eventos', count: eventos.length },
            { id: 'contas', label: '💰 Contas', count: contas.filter(c => !c.pago).length },
            { id: 'tarefas', label: '✅ Tarefas', count: tarefas.filter(t => t.status !== 'concluido').length }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                flex: 1,
                padding: '15px 20px',
                border: 'none',
                backgroundColor: abaAtiva === aba.id ? (isDark ? '#1A1E29' : '#FFF') : 'transparent',
                color: abaAtiva === aba.id ? colors.pink : (isDark ? '#999' : '#666'),
                fontWeight: abaAtiva === aba.id ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: abaAtiva === aba.id ? `3px solid ${colors.pink}` : 'none',
                transition: 'all 0.2s',
                fontSize: '15px'
              }}
            >
              {aba.label}
              {aba.count > 0 && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: abaAtiva === aba.id ? colors.pink : '#ccc',
                  color: '#FFF',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {aba.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '30px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Carregando...
            </div>
          ) : (
            <>
              {/* ABA NOTAS */}
              {abaAtiva === 'notas' && (
                <div>
                  <h3 style={{ color: colors.purple, marginBottom: '15px' }}>
                    Notas e Ideias do Dia
                  </h3>
                  <textarea
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Escreva suas ideias, lembretes, observações do dia...

• Cliente João ligou interessado
• Lembrar de pedir mais estoque de camisetas P
• Ideia: fazer promoção de carnaval"
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      padding: '15px',
                      borderRadius: '10px',
                      border: `2px solid ${isDark ? '#444' : '#ddd'}`,
                      backgroundColor: isDark ? '#2B2F38' : '#FFF',
                      color: isDark ? '#EEE' : '#333',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                    💾 Salvamento automático ativado
                  </div>
                </div>
              )}

              {/* ABA EVENTOS */}
              {abaAtiva === 'eventos' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: colors.purple, margin: 0 }}>Eventos do Dia</h3>
                    <button
                      onClick={() => setShowFormEvento(true)}
                      style={{
                        backgroundColor: colors.pink,
                        color: '#FFF',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      + Novo Evento
                    </button>
                  </div>

                  {eventos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
                      <p>Nenhum evento agendado para este dia</p>
                    </div>
                  ) : (
                    eventos.map(evento => (
                      <div
                        key={evento.id}
                        style={{
                          backgroundColor: isDark ? '#2B2F38' : '#f9f9f9',
                          padding: '20px',
                          borderRadius: '10px',
                          marginBottom: '15px',
                          borderLeft: `5px solid ${getCategoriaColor(evento.categoria)}`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: colors.purple }}>
                              {evento.titulo}
                            </div>
                            {evento.descricao && (
                              <div style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                                {evento.descricao}
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#999' }}>
                              <span style={{
                                backgroundColor: getCategoriaColor(evento.categoria),
                                color: '#FFF',
                                padding: '3px 10px',
                                borderRadius: '5px'
                              }}>
                                {evento.categoria}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => excluirEvento(evento.id)}
                            style={{
                              backgroundColor: colors.red,
                              color: '#FFF',
                              border: 'none',
                              padding: '8px 15px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ABA CONTAS */}
              {abaAtiva === 'contas' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: colors.purple, margin: 0 }}>Contas e Lembretes</h3>
                    <button
                      onClick={() => setShowFormConta(true)}
                      style={{
                        backgroundColor: colors.pink,
                        color: '#FFF',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      + Nova Conta
                    </button>
                  </div>

                  {contas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
                      <p>Nenhuma conta com vencimento neste dia</p>
                    </div>
                  ) : (
                    <>
                      {contas.map(conta => (
                        <div
                          key={conta.id}
                          style={{
                            backgroundColor: isDark ? '#2B2F38' : '#f9f9f9',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '15px',
                            borderLeft: `5px solid ${conta.pago ? '#2ecc71' : colors.red}`,
                            opacity: conta.pago ? 0.7 : 1
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontWeight: 'bold', 
                                fontSize: '16px', 
                                marginBottom: '5px',
                                textDecoration: conta.pago ? 'line-through' : 'none'
                              }}>
                                {conta.titulo}
                              </div>
                              {conta.valor && (
                                <div style={{ fontSize: '18px', color: conta.pago ? '#2ecc71' : colors.red, fontWeight: 'bold' }}>
                                  R$ {parseFloat(conta.valor).toFixed(2)}
                                </div>
                              )}
                              {conta.observacoes && (
                                <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                                  {conta.observacoes}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                onClick={() => marcarContaPaga(conta.id, !conta.pago)}
                                style={{
                                  backgroundColor: conta.pago ? '#95a5a6' : '#2ecc71',
                                  color: '#FFF',
                                  border: 'none',
                                  padding: '8px 15px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {conta.pago ? '↩️ Desfazer' : '✓ Pago'}
                              </button>
                              <button
                                onClick={() => excluirConta(conta.id)}
                                style={{
                                  backgroundColor: colors.red,
                                  color: '#FFF',
                                  border: 'none',
                                  padding: '8px 15px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <strong>Total a Pagar:</strong>{' '}
                          <span style={{ color: colors.red, fontWeight: 'bold' }}>
                            R$ {contas.filter(c => !c.pago).reduce((acc, c) => acc + parseFloat(c.valor || 0), 0).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <strong>Total Pago:</strong>{' '}
                          <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                            R$ {contas.filter(c => c.pago).reduce((acc, c) => acc + parseFloat(c.valor || 0), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ABA TAREFAS */}
              {abaAtiva === 'tarefas' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: colors.purple, margin: 0 }}>Tarefas do Dia</h3>
                    <button
                      onClick={() => setShowFormTarefa(true)}
                      style={{
                        backgroundColor: colors.pink,
                        color: '#FFF',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      + Nova Tarefa
                    </button>
                  </div>

                  {tarefas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                      <p>Nenhuma tarefa para este dia</p>
                    </div>
                  ) : (
                    ['alta', 'media', 'baixa'].map(prioridade => {
                      const tarefasPrioridade = tarefas.filter(t => t.prioridade === prioridade);
                      if (tarefasPrioridade.length === 0) return null;

                      return (
                        <div key={prioridade} style={{ marginBottom: '25px' }}>
                          <h4 style={{ 
                            color: getPrioridadeColor(prioridade),
                            marginBottom: '15px',
                            textTransform: 'uppercase',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {prioridade === 'alta' ? '🔴 URGENTE' : prioridade === 'media' ? '🟡 HOJE' : '🟢 PODE ESPERAR'}
                          </h4>
                          {tarefasPrioridade.map(tarefa => (
                            <div
                              key={tarefa.id}
                              style={{
                                backgroundColor: isDark ? '#2B2F38' : '#f9f9f9',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                borderLeft: `5px solid ${getPrioridadeColor(tarefa.prioridade)}`,
                                opacity: tarefa.status === 'concluido' ? 0.6 : 1
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <input
                                    type="checkbox"
                                    checked={tarefa.status === 'concluido'}
                                    onChange={() => atualizarStatusTarefa(
                                      tarefa.id,
                                      tarefa.status === 'concluido' ? 'pendente' : 'concluido'
                                    )}
                                    style={{ 
                                      width: '20px', 
                                      height: '20px', 
                                      cursor: 'pointer',
                                      accentColor: colors.pink
                                    }}
                                  />
                                  <div>
                                    <div style={{ 
                                      fontWeight: 'bold',
                                      textDecoration: tarefa.status === 'concluido' ? 'line-through' : 'none'
                                    }}>
                                      {tarefa.titulo}
                                    </div>
                                    {tarefa.descricao && (
                                      <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>
                                        {tarefa.descricao}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => excluirTarefa(tarefa.id)}
                                  style={{
                                    backgroundColor: colors.red,
                                    color: '#FFF',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Formulários serão adicionados em modais separados */}
        {showFormEvento && (
          <FormEvento
            data={data}
            user={user}
            onClose={() => setShowFormEvento(false)}
            onSave={() => {
              setShowFormEvento(false);
              carregarEventos();
            }}
            colors={colors}
            isDark={isDark}
          />
        )}

        {showFormConta && (
          <FormConta
            data={data}
            user={user}
            onClose={() => setShowFormConta(false)}
            onSave={() => {
              setShowFormConta(false);
              carregarContas();
            }}
            colors={colors}
            isDark={isDark}
          />
        )}

        {showFormTarefa && (
          <FormTarefa
            data={data}
            user={user}
            onClose={() => setShowFormTarefa(false)}
            onSave={() => {
              setShowFormTarefa(false);
              carregarTarefas();
            }}
            colors={colors}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};

// Componente Form Evento
const FormEvento = ({ data, user, onClose, onSave, colors, isDark }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'outro'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await supabase.from('kasbook_eventos').insert([{
      user_id: user.id,
      data,
      ...formData
    }]);

    onSave();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000
    }}>
      <div style={{
        backgroundColor: isDark ? '#2B2F38' : '#FFF',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: colors.purple, marginBottom: '20px' }}>Novo Evento</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            >
              <option value="promocao">Promoção</option>
              <option value="reuniao">Reunião</option>
              <option value="entrega">Entrega</option>
              <option value="pagamento">Pagamento</option>
              <option value="evento">Evento</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Form Conta
const FormConta = ({ data, user, onClose, onSave, colors, isDark }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    categoria: 'outros',
    observacoes: '',
    recorrente: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dia = new Date(data).getDate();
    
    await supabase.from('kasbook_lembretes_contas').insert([{
      user_id: user.id,
      data_vencimento: data,
      dia_recorrencia: formData.recorrente ? dia : null,
      ...formData
    }]);

    onSave();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000
    }}>
      <div style={{
        backgroundColor: isDark ? '#2B2F38' : '#FFF',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: colors.purple, marginBottom: '20px' }}>Nova Conta</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              placeholder="Ex: Luz, Aluguel, Fornecedor"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Valor</label>
            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            >
              <option value="luz">Luz</option>
              <option value="agua">Água</option>
              <option value="aluguel">Aluguel</option>
              <option value="internet">Internet</option>
              <option value="fornecedor">Fornecedor</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows="2"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.recorrente}
                onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: colors.pink }}
              />
              <span>Conta recorrente (todo mês no mesmo dia)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Form Tarefa
const FormTarefa = ({ data, user, onClose, onSave, colors, isDark }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await supabase.from('kasbook_tarefas').insert([{
      user_id: user.id,
      deadline: data,
      status: 'pendente',
      ...formData
    }]);

    onSave();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000
    }}>
      <div style={{
        backgroundColor: isDark ? '#2B2F38' : '#FFF',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '500px'
      }}><h3 style={{ color: colors.purple, marginBottom: '20px' }}>Nova Tarefa</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              placeholder="Ex: Responder cliente, Postar no Instagram"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows="3"
              placeholder="Detalhes da tarefa..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prioridade</label>
            <select
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isDark ? '#1A1E29' : '#FFF',
                color: isDark ? '#FFF' : '#333'
              }}
            >
              <option value="alta">🔴 Alta - Urgente</option>
              <option value="media">🟡 Média - Hoje</option>
              <option value="baixa">🟢 Baixa - Pode Esperar</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.pink,
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#999',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDia;