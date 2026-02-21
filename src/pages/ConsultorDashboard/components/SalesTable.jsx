// src/pages/ConsultorDashboard/components/SalesTable.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = "#2f0d51";
const CONSULTOR_LIGHT_BG = "#f3e8ff";

const SalesTable = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todas'); // todas, finalizadas, pendentes
  const consultorId = localStorage.getItem('userId');

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          created_at,
          status,
          valor_total,
          valor_comissao,
          loja:lojas (
            nome_fantasia,
            cidade,
            estado
          )
        `)
        .eq('consultor_id', consultorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVendas(data || []);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const vendasFiltradas = vendas.filter(venda => {
    if (filtroStatus === 'todas') return true;
    if (filtroStatus === 'finalizadas') return venda.status === 'Retirado pelo Cliente';
    if (filtroStatus === 'pendentes') return venda.status !== 'Retirado pelo Cliente' && venda.status !== 'Pago/Cancelado';
    return true;
  });

  const calcularEstatisticas = () => {
    const totalVendas = vendasFiltradas.length;
    const totalComissao = vendasFiltradas.reduce((acc, v) => acc + (v.valor_comissao || 0), 0);
    const ticketMedio = totalVendas > 0 ? vendasFiltradas.reduce((acc, v) => acc + v.valor_total, 0) / totalVendas : 0;

    return { totalVendas, totalComissao, ticketMedio };
  };

  const { totalVendas, totalComissao, ticketMedio } = calcularEstatisticas();

  const formatarStatus = (status) => {
    const statusMap = {
      'QR Code Gerado!': { emoji: '🔲', cor: '#fbbf24' },
      'Aguardando Separação': { emoji: '', cor: '#bb25a6' },
      'Pronto para pagamento': { emoji: '', cor: '#34d399' },
      'Pago/Cancelado': { emoji: '', cor: '#cccc0c' },
      'Retirado pelo Cliente': { emoji: '', cor: '#cccc0c' }
    };

    const config = statusMap[status] || { emoji: '❓', cor: '#6b7280' };
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
        {config.emoji} {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Carregando vendas...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY, marginBottom: '0.5rem' }}>
             Minhas Vendas
          </h1>
          <p style={{ color: '#64748b' }}>
            Histórico completo de todas as suas vendas realizadas
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
              Total de Vendas
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY }}>
              {totalVendas}
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
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#cccc0c' }}>
              R$ {totalComissao.toFixed(2)}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Ticket Médio
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              R$ {ticketMedio.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {['todas', 'finalizadas', 'pendentes'].map(filtro => (
            <button
              key={filtro}
              onClick={() => setFiltroStatus(filtro)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: filtroStatus === filtro ? `2px solid ${CONSULTOR_PRIMARY}` : '2px solid #e2e8f0',
                backgroundColor: filtroStatus === filtro ? CONSULTOR_LIGHT_BG : 'white',
                color: filtroStatus === filtro ? CONSULTOR_PRIMARY : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabela */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: CONSULTOR_LIGHT_BG, borderBottom: `2px solid ${CONSULTOR_PRIMARY}` }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: CONSULTOR_PRIMARY }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: CONSULTOR_PRIMARY }}>Data</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: CONSULTOR_PRIMARY }}>Loja</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: CONSULTOR_PRIMARY }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: CONSULTOR_PRIMARY }}>Valor</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: CONSULTOR_PRIMARY }}>Comissão</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      Nenhuma venda encontrada para este filtro
                    </td>
                  </tr>
                ) : (
                  vendasFiltradas.map((venda) => (
                    <tr 
                      key={venda.id}
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '1rem', color: '#475569', fontWeight: '500' }}>
                        #{String(venda.id).padStart(4, '0')}
                      </td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        {new Date(venda.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#1e293b' }}>
                          {venda.loja?.nome_fantasia || 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {venda.loja?.cidade}/{venda.loja?.estado}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {formatarStatus(venda.status)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                        R$ {venda.valor_total.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#cccc0c' }}>
                        R$ {(venda.valor_comissao || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesTable;