// src/pages/ConsultorDashboard/components/HistoryPanel.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = "#2f0d51";
const CONSULTOR_LIGHT_BG = "#f3e8ff";

const HistoryPanel = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState('todos'); // todos, hoje, semana, mes
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null);
  
  const consultorId = localStorage.getItem('userId');

  useEffect(() => {
    carregarHistorico();
  }, [filtroData]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('pedidos')
        .select(`
          id,
          created_at,
          status,
          valor_total,
          valor_comissao,
          items,
          cliente:clientes (
            id,
            nome,
            email,
            nome_visivel
          ),
          loja:lojas (
            id,
            nome_fantasia,
            cidade,
            estado
          )
        `)
        .eq('consultor_id', consultorId)
        .order('created_at', { ascending: false });

      // Aplicar filtro de data
      if (filtroData !== 'todos') {
        const dataLimite = new Date();
        
        if (filtroData === 'hoje') {
          dataLimite.setHours(0, 0, 0, 0);
        } else if (filtroData === 'semana') {
          dataLimite.setDate(dataLimite.getDate() - 7);
        } else if (filtroData === 'mes') {
          dataLimite.setMonth(dataLimite.getMonth() - 1);
        }

        query = query.gte('created_at', dataLimite.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setAtendimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarStatus = (status) => {
    const statusMap = {
      'QR Code Gerado!': { emoji: '🔲', cor: '#fbbf24', texto: 'Aguardando Pagamento' },
      'Aguardando Separação': { emoji: '', cor: '#bb25a6', texto: 'Em Separação' },
      'Pronto para pagamento': { emoji: '', cor: '#34d399', texto: 'Pronto' },
      'Pago/Cancelado': { emoji: '', cor: '#cccc0c', texto: 'Pago' },
      'Retirado pelo Cliente': { emoji: '', cor: '#cccc0c', texto: 'Concluído' }
    };

    const config = statusMap[status] || { emoji: '❓', cor: '#6b7280', texto: status };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: config.cor + '20',
        color: config.cor,
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {config.emoji} {config.texto}
      </span>
    );
  };

  const calcularEstatisticas = () => {
    const totalAtendimentos = atendimentos.length;
    const concluidos = atendimentos.filter(a => a.status === 'Retirado pelo Cliente').length;
    const totalFaturado = atendimentos
      .filter(a => a.status === 'Retirado pelo Cliente')
      .reduce((acc, a) => acc + a.valor_total, 0);
    const totalComissao = atendimentos
      .filter(a => a.status === 'Retirado pelo Cliente')
      .reduce((acc, a) => acc + (a.valor_comissao || 0), 0);

    return { totalAtendimentos, concluidos, totalFaturado, totalComissao };
  };

  const { totalAtendimentos, concluidos, totalFaturado, totalComissao } = calcularEstatisticas();

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY, marginBottom: '0.5rem' }}>
            📖 Histórico de Atendimentos
          </h1>
          <p style={{ color: '#64748b' }}>
            Todos os seus atendimentos e vendas realizadas
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid ' + CONSULTOR_PRIMARY
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Total de Atendimentos
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY }}>
              {totalAtendimentos}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Concluídos
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#cccc0c' }}>
              {concluidos}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Total Faturado
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              R$ {totalFaturado.toFixed(2)}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Comissão Total
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              R$ {totalComissao.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filtros de Data */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {['todos', 'hoje', 'semana', 'mes'].map(filtro => (
            <button
              key={filtro}
              onClick={() => setFiltroData(filtro)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: filtroData === filtro ? `2px solid ${CONSULTOR_PRIMARY}` : '2px solid #e2e8f0',
                backgroundColor: filtroData === filtro ? CONSULTOR_LIGHT_BG : 'white',
                color: filtroData === filtro ? CONSULTOR_PRIMARY : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filtro === 'todos' ? 'Todos' : 
               filtro === 'hoje' ? 'Hoje' :
               filtro === 'semana' ? 'Última Semana' : 'Último Mês'}
            </button>
          ))}
        </div>

        {/* Lista de Atendimentos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {atendimentos.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                📭 Nenhum atendimento encontrado
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {filtroData === 'todos' 
                  ? 'Você ainda não realizou nenhum atendimento'
                  : 'Tente selecionar outro período'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {atendimentos.map((atendimento, index) => (
                <div
                  key={atendimento.id}
                  style={{
                    padding: '1.5rem',
                    borderBottom: index < atendimentos.length - 1 ? '1px solid #e2e8f0' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={() => setAtendimentoSelecionado(
                    atendimentoSelecionado?.id === atendimento.id ? null : atendimento
                  )}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        #{String(atendimento.id).padStart(4, '0')} • {formatarData(atendimento.created_at)}
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {atendimento.cliente?.nome_visivel 
                          ? atendimento.cliente.nome 
                          : 'Cliente Anônimo'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                         {atendimento.loja?.nome_fantasia} - {atendimento.loja?.cidade}/{atendimento.loja?.estado}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {formatarStatus(atendimento.status)}
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#cccc0c', marginTop: '0.5rem' }}>
                        R$ {atendimento.valor_total.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Comissão: R$ {(atendimento.valor_comissao || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {atendimentoSelecionado?.id === atendimento.id && atendimento.items && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>
                        Produtos:
                      </h4>
                      {atendimento.items.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0',
                            borderBottom: idx < atendimento.items.length - 1 ? '1px solid #e2e8f0' : 'none'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                              {item.nome} ({item.quantidade}x)
                            </div>
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
                            R$ {item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HistoryPanel;