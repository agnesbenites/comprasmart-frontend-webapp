// src/pages/VendedorDashboard/components/StatusVendasVendedor.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

const VENDOR_PRIMARY = "#4a6fa5";

const StatusVendasVendedor = () => {
  const [vendedorId, setVendedorId] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, aguardando, em_separacao, pronto, entregue

  useEffect(() => {
    inicializar();
  }, []);

  useEffect(() => {
    if (vendedorId) {
      carregarPedidos();
      // Atualizar a cada 30 segundos
      const interval = setInterval(carregarPedidos, 30000);
      return () => clearInterval(interval);
    }
  }, [vendedorId, filtro]);

  const inicializar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: vendedor } = await supabase
        .from('vendedores')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (vendedor) {
        setVendedorId(vendedor.id);
      }
    } catch (error) {
      console.error('[StatusVendas] Erro ao inicializar:', error);
    }
  };

  const carregarPedidos = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('pedidos')
        .select(`
          *,
          clientes:cliente_id (nome, telefone)
        `)
        .eq('vendedor_id', vendedorId)
        .order('data_pedido', { ascending: false })
        .limit(50);

      // Aplicar filtro
      if (filtro !== 'todos') {
        if (filtro === 'aguardando') {
          query = query.eq('status_pagamento', 'aguardando');
        } else if (filtro === 'em_separacao') {
          query = query.eq('status_separacao', 'em_separacao');
        } else if (filtro === 'pronto') {
          query = query.eq('status_separacao', 'pronto_retirada');
        } else if (filtro === 'entregue') {
          query = query.eq('status_separacao', 'entregue');
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setPedidos(data || []);
      console.log('[StatusVendas] Pedidos carregados:', data?.length);

    } catch (error) {
      console.error('[StatusVendas] Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusPagamentoInfo = (status) => {
    const statusMap = {
      'aguardando': { emoji: '⏳', texto: 'Aguardando Pagamento', cor: '#ffc107' },
      'pago': { emoji: '✅', texto: 'Pago', cor: '#bb25a6' },
      'cancelado': { emoji: '❌', texto: 'Cancelado', cor: '#dc3545' },
      'estornado': { emoji: '↩️', texto: 'Estornado', cor: '#6c757d' },
    };
    return statusMap[status] || { emoji: '❓', texto: status, cor: '#999' };
  };

  const getStatusSeparacaoInfo = (status) => {
    const statusMap = {
      'aguardando': { emoji: '📦', texto: 'Aguardando Separação', cor: '#ffc107' },
      'em_separacao': { emoji: '🔄', texto: 'Em Separação', cor: '#17a2b8' },
      'pronto_retirada': { emoji: '✅', texto: 'Pronto para Retirada', cor: '#bb25a6' },
      'entregue': { emoji: '🎉', texto: 'Entregue', cor: '#6c757d' },
    };
    return statusMap[status] || { emoji: '❓', texto: status, cor: '#999' };
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        ⏳ Carregando pedidos...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Status das Vendas</h2>
        <button onClick={carregarPedidos} style={styles.btnAtualizar}>
          🔄 Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div style={styles.filtros}>
        <button
          onClick={() => setFiltro('todos')}
          style={{
            ...styles.btnFiltro,
            ...(filtro === 'todos' && styles.btnFiltroAtivo)
          }}
        >
          📋 Todos
        </button>
        <button
          onClick={() => setFiltro('aguardando')}
          style={{
            ...styles.btnFiltro,
            ...(filtro === 'aguardando' && styles.btnFiltroAtivo)
          }}
        >
          ⏳ Aguardando Pgto
        </button>
        <button
          onClick={() => setFiltro('em_separacao')}
          style={{
            ...styles.btnFiltro,
            ...(filtro === 'em_separacao' && styles.btnFiltroAtivo)
          }}
        >
          🔄 Em Separação
        </button>
        <button
          onClick={() => setFiltro('pronto')}
          style={{
            ...styles.btnFiltro,
            ...(filtro === 'pronto' && styles.btnFiltroAtivo)
          }}
        >
          ✅ Pronto
        </button>
        <button
          onClick={() => setFiltro('entregue')}
          style={{
            ...styles.btnFiltro,
            ...(filtro === 'entregue' && styles.btnFiltroAtivo)
          }}
        >
          🎉 Entregue
        </button>
      </div>

      {/* Lista de Pedidos */}
      {pedidos.length === 0 ? (
        <div style={styles.empty}>
          <p>😴 Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div style={styles.pedidosGrid}>
          {pedidos.map(pedido => {
            const statusPgto = getStatusPagamentoInfo(pedido.status_pagamento);
            const statusSep = getStatusSeparacaoInfo(pedido.status_separacao);

            return (
              <div key={pedido.id} style={styles.pedidoCard}>
                {/* Header do Card */}
                <div style={styles.pedidoHeader}>
                  <span style={styles.pedidoId}>#{pedido.id.slice(0, 8)}</span>
                  <span style={styles.pedidoData}>
                    {formatarData(pedido.data_pedido)}
                  </span>
                </div>

                {/* Cliente */}
                <div style={styles.pedidoCliente}>
                  <strong>👤 {pedido.clientes?.nome || 'Cliente'}</strong>
                  {pedido.clientes?.telefone && (
                    <span style={styles.pedidoTelefone}>
                      📞 {pedido.clientes.telefone}
                    </span>
                  )}
                </div>

                {/* Valor */}
                <div style={styles.pedidoValor}>
                  <span style={styles.valorLabel}>Valor Total:</span>
                  <span style={styles.valorMontante}>
                    {formatarMoeda(pedido.valor_total)}
                  </span>
                </div>

                {/* Status de Pagamento */}
                <div style={styles.statusRow}>
                  <span style={styles.statusLabel}>Pagamento:</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusPgto.cor
                    }}
                  >
                    {statusPgto.emoji} {statusPgto.texto}
                  </span>
                </div>

                {/* Status de Separação */}
                <div style={styles.statusRow}>
                  <span style={styles.statusLabel}>Pedido:</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusSep.cor
                    }}
                  >
                    {statusSep.emoji} {statusSep.texto}
                  </span>
                </div>

                {/* Timeline Visual */}
                <div style={styles.timeline}>
                  <div style={{
                    ...styles.timelineStep,
                    ...(pedido.status_pagamento === 'pago' && styles.timelineStepCompleto)
                  }}>
                    💳
                  </div>
                  <div style={styles.timelineLine}></div>
                  <div style={{
                    ...styles.timelineStep,
                    ...(pedido.status_separacao === 'em_separacao' && styles.timelineStepAtivo),
                    ...(pedido.status_separacao === 'pronto_retirada' && styles.timelineStepCompleto),
                    ...(pedido.status_separacao === 'entregue' && styles.timelineStepCompleto)
                  }}>
                    📦
                  </div>
                  <div style={styles.timelineLine}></div>
                  <div style={{
                    ...styles.timelineStep,
                    ...(pedido.status_separacao === 'pronto_retirada' && styles.timelineStepAtivo),
                    ...(pedido.status_separacao === 'entregue' && styles.timelineStepCompleto)
                  }}>
                    ✅
                  </div>
                  <div style={styles.timelineLine}></div>
                  <div style={{
                    ...styles.timelineStep,
                    ...(pedido.status_separacao === 'entregue' && styles.timelineStepCompleto)
                  }}>
                    🎉
                  </div>
                </div>

                {/* Itens do Pedido */}
                {pedido.itens && pedido.itens.length > 0 && (
                  <details style={styles.itensDetails}>
                    <summary style={styles.itensSummary}>
                      📦 Ver Itens ({pedido.itens.length})
                    </summary>
                    <div style={styles.itensLista}>
                      {pedido.itens.map((item, index) => (
                        <div key={index} style={styles.item}>
                          <span>{item.quantidade}x {item.nome}</span>
                          <span>{formatarMoeda(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {/* Link de Pagamento (se existir) */}
                {pedido.stripe_payment_link && pedido.status_pagamento === 'aguardando' && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pedido.stripe_payment_link);
                      alert('Link de pagamento copiado!');
                    }}
                    style={styles.btnCopiarLink}
                  >
                    📋 Copiar Link de Pagamento
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '1.1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: VENDOR_PRIMARY,
    margin: 0,
    fontSize: '1.5rem',
  },
  btnAtualizar: {
    backgroundColor: VENDOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  filtros: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  btnFiltro: {
    backgroundColor: '#f8f9fa',
    border: '2px solid #dee2e6',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  btnFiltroAtivo: {
    backgroundColor: VENDOR_PRIMARY,
    color: 'white',
    borderColor: VENDOR_PRIMARY,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    color: '#666',
    fontSize: '1.1rem',
  },
  pedidosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  pedidoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    border: '1px solid #e9ecef',
  },
  pedidoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0',
  },
  pedidoId: {
    fontWeight: '700',
    color: VENDOR_PRIMARY,
    fontSize: '1.1rem',
  },
  pedidoData: {
    fontSize: '0.85rem',
    color: '#666',
  },
  pedidoCliente: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  pedidoTelefone: {
    fontSize: '0.9rem',
    color: '#666',
  },
  pedidoValor: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  valorLabel: {
    fontSize: '0.9rem',
    color: '#666',
  },
  valorMontante: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: VENDOR_PRIMARY,
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statusLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px 0',
    padding: '15px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
  },
  timelineStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    border: '2px solid #dee2e6',
  },
  timelineStepAtivo: {
    backgroundColor: '#ffc107',
    border: '2px solid #ffc107',
    animation: 'pulse 2s infinite',
  },
  timelineStepCompleto: {
    backgroundColor: '#bb25a6',
    border: '2px solid #bb25a6',
  },
  timelineLine: {
    flex: 1,
    height: '2px',
    backgroundColor: '#dee2e6',
    margin: '0 5px',
  },
  itensDetails: {
    marginTop: '15px',
  },
  itensSummary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: VENDOR_PRIMARY,
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    userSelect: 'none',
  },
  itensLista: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #dee2e6',
    fontSize: '0.9rem',
  },
  btnCopiarLink: {
    width: '100%',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '15px',
  },
};

export default StatusVendasVendedor;
