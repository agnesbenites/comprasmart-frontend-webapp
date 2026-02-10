// src/shared/components/GerenciadorPedidos.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ===========================================
// STATUS DOS PEDIDOS
// ===========================================
const STATUS_PEDIDO = [
    { value: 'QR Code Gerado!', label: 'QR Code Gerado!', cor: '#6c757d', icon: '📱' },
    { value: 'Aguardando Separação', label: 'Aguardando Separacao', cor: '#ffc107', icon: '📦' },
    { value: 'Pronto para pagamento', label: 'Pronto para Pagamento', cor: '#17a2b8', icon: '💳' },
    { value: 'Pago/Cancelado', label: 'Pago/Cancelado', cor: '#bb25a6', icon: '✅' },
    { value: 'Retirado pelo Cliente', label: 'Retirado pelo Cliente', cor: '#6f42c1', icon: '🛍️' }
];

// Status que o vendedor pode atualizar (nao pode marcar como Pago/Cancelado)
const STATUS_VENDEDOR_PODE_ATUALIZAR = [
    'QR Code Gerado!',
    'Aguardando Separação',
    'Pronto para pagamento',
    'Retirado pelo Cliente'
];

/**
 * Componente de Gerenciamento de Pedidos
 * @param {string} tipoUsuario - 'lojista' ou 'vendedor'
 */
const GerenciadorPedidos = ({ tipoUsuario = 'vendedor' }) => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [busca, setBusca] = useState('');
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const isLojista = tipoUsuario === 'lojista';

    useEffect(() => {
        carregarPedidos();
        
        // Realtime subscription para atualizacoes
        const subscription = supabase
            .channel('pedidos-realtime')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'pedidos' },
                (payload) => {
                    console.log('Pedido atualizado:', payload);
                    carregarPedidos();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const carregarPedidos = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('pedidos')
                .select(`
                    *,
                    usuario:user_id (
                        email,
                        raw_user_meta_data
                    )
                `)
                .order('data_pedido', { ascending: false });

            if (fetchError) throw fetchError;

            setPedidos(data || []);
        } catch (err) {
            console.error('Erro ao carregar pedidos:', err);
            setError('Erro ao carregar pedidos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const atualizarStatus = async (pedidoId, novoStatus) => {
        try {
            setError(null);

            // Verificar permissao do vendedor
            if (!isLojista && !STATUS_VENDEDOR_PODE_ATUALIZAR.includes(novoStatus)) {
                setError('Voce nao tem permissao para este status. Somente o caixa pode marcar como Pago.');
                return;
            }

            const { error: updateError } = await supabase
                .from('pedidos')
                .update({ status_separacao: novoStatus })
                .eq('id', pedidoId);

            if (updateError) throw updateError;

            setSuccess(`Status atualizado para "${novoStatus}"`);
            setTimeout(() => setSuccess(null), 3000);

            // Atualizar lista local
            setPedidos(prev => prev.map(p => 
                p.id === pedidoId ? { ...p, status_separacao: novoStatus } : p
            ));

            setModalAberto(false);
            setPedidoSelecionado(null);

        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            setError('Erro ao atualizar status. Verifique suas permissoes.');
        }
    };

    const abrirModalStatus = (pedido) => {
        setPedidoSelecionado(pedido);
        setModalAberto(true);
    };

    const getStatusInfo = (status) => {
        return STATUS_PEDIDO.find(s => s.value === status) || STATUS_PEDIDO[0];
    };

    const pedidosFiltrados = pedidos.filter(pedido => {
        const matchStatus = filtroStatus === 'todos' || pedido.status_separacao === filtroStatus;
        const matchBusca = busca === '' || 
            pedido.id.toLowerCase().includes(busca.toLowerCase()) ||
            pedido.usuario?.email?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    });

    const contarPorStatus = (status) => {
        return pedidos.filter(p => p.status_separacao === status).length;
    };

    const pedidosPendentes = pedidos.filter(p => 
        p.status_separacao === 'QR Code Gerado!' || 
        p.status_separacao === 'Aguardando Separação'
    ).length;

    const formatarData = (data) => {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    // Status disponiveis para atualizacao baseado no tipo de usuario
    const statusDisponiveis = isLojista 
        ? STATUS_PEDIDO 
        : STATUS_PEDIDO.filter(s => STATUS_VENDEDOR_PODE_ATUALIZAR.includes(s.value));

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando pedidos...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                {isLojista ? 'Gerenciamento de Pedidos' : 'Meus Pedidos'}
            </h1>
            <p style={styles.subtitle}>
                {isLojista 
                    ? 'Acompanhe e atualize o status dos pedidos da sua loja'
                    : 'Gerencie a separacao e entrega dos pedidos'
                }
            </p>

            {error && <div style={styles.errorMessage}>{error}</div>}
            {success && <div style={styles.successMessage}>{success}</div>}

            {/* Alerta de Pedidos Pendentes */}
            {pedidosPendentes > 0 && (
                <div style={styles.alertaPendentes}>
                    <span style={styles.alertaIcon}>⚠️</span>
                    <span>
                        <strong>{pedidosPendentes} pedido(s)</strong> aguardando separacao!
                    </span>
                </div>
            )}

            {/* Cards de Resumo */}
            <div style={styles.resumoGrid}>
                <div 
                    style={{...styles.resumoCard, borderLeft: '4px solid #2c5aa0'}}
                    onClick={() => setFiltroStatus('todos')}
                >
                    <span style={styles.resumoIcon}>📋</span>
                    <div>
                        <p style={styles.resumoNumero}>{pedidos.length}</p>
                        <p style={styles.resumoLabel}>Total</p>
                    </div>
                </div>
                {STATUS_PEDIDO.map(status => (
                    <div 
                        key={status.value} 
                        style={{
                            ...styles.resumoCard,
                            borderLeft: `4px solid ${status.cor}`,
                            backgroundColor: filtroStatus === status.value ? '#eaf2ff' : 'white'
                        }}
                        onClick={() => setFiltroStatus(status.value)}
                    >
                        <span style={styles.resumoIcon}>{status.icon}</span>
                        <div>
                            <p style={styles.resumoNumero}>{contarPorStatus(status.value)}</p>
                            <p style={styles.resumoLabel}>{status.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div style={styles.filtrosContainer}>
                <input
                    type="text"
                    placeholder="Buscar por ID ou cliente..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={styles.inputBusca}
                />
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    style={styles.selectFiltro}
                >
                    <option value="todos">Todos os Status</option>
                    {STATUS_PEDIDO.map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <button onClick={carregarPedidos} style={styles.btnAtualizar}>
                    🔄 Atualizar
                </button>
            </div>

            {/* Lista de Pedidos - Cards para mobile */}
            <div style={styles.pedidosGrid}>
                {pedidosFiltrados.length === 0 ? (
                    <div style={styles.semPedidos}>
                        <p>Nenhum pedido encontrado</p>
                    </div>
                ) : (
                    pedidosFiltrados.map((pedido) => {
                        const statusInfo = getStatusInfo(pedido.status_separacao);
                        return (
                            <div key={pedido.id} style={styles.pedidoCard}>
                                <div style={styles.pedidoHeader}>
                                    <span style={styles.pedidoId}>#{pedido.id.slice(0, 8)}</span>
                                    <span style={styles.pedidoData}>{formatarData(pedido.data_pedido)}</span>
                                </div>
                                
                                <p style={styles.pedidoCliente}>
                                    👤 {pedido.usuario?.raw_user_meta_data?.nome || pedido.usuario?.email || 'Cliente'}
                                </p>
                                
                                <p style={styles.pedidoValor}>{formatarValor(pedido.valor_total)}</p>
                                
                                <span 
                                    style={{
                                        ...styles.pedidoStatus,
                                        backgroundColor: statusInfo.cor
                                    }}
                                >
                                    {statusInfo.icon} {statusInfo.label}
                                </span>
                                
                                <button
                                    onClick={() => abrirModalStatus(pedido)}
                                    style={styles.btnAtualizarCard}
                                >
                                    🔄 Atualizar Status
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de Atualização de Status */}
            {modalAberto && pedidoSelecionado && (
                <div style={styles.modalBackdrop} onClick={() => setModalAberto(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Atualizar Status do Pedido</h2>
                        <p style={styles.modalSubtitle}>Pedido: #{pedidoSelecionado.id.slice(0, 8)}</p>
                        <p style={styles.modalSubtitle}>
                            Status atual: {getStatusInfo(pedidoSelecionado.status_separacao).label}
                        </p>
                        
                        <div style={styles.statusOptions}>
                            {statusDisponiveis.map((status) => (
                                <button
                                    key={status.value}
                                    style={{
                                        ...styles.statusOption,
                                        backgroundColor: status.value === pedidoSelecionado.status_separacao 
                                            ? status.cor 
                                            : '#f8f9fa',
                                        color: status.value === pedidoSelecionado.status_separacao 
                                            ? 'white' 
                                            : '#333'
                                    }}
                                    onClick={() => atualizarStatus(pedidoSelecionado.id, status.value)}
                                >
                                    {status.icon} {status.label}
                                </button>
                            ))}
                        </div>

                        {!isLojista && (
                            <p style={styles.avisoPermissao}>
                                ℹ️ Apenas o caixa pode marcar como "Pago/Cancelado"
                            </p>
                        )}

                        <button 
                            style={styles.btnFecharModal}
                            onClick={() => {
                                setModalAberto(false);
                                setPedidoSelecionado(null);
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ===========================================
// ESTILOS
// ===========================================
const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    },
    title: {
        color: '#2c5aa0',
        fontSize: '1.8rem',
        marginBottom: '5px'
    },
    subtitle: {
        color: '#666',
        marginBottom: '20px'
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        color: '#666'
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px'
    },
    successMessage: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px'
    },
    alertaPendentes: {
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        color: '#856404',
        padding: '12px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    alertaIcon: {
        fontSize: '1.5rem'
    },
    resumoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
    },
    resumoCard: {
        backgroundColor: 'white',
        padding: '12px 15px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.2s'
    },
    resumoIcon: {
        fontSize: '1.5rem'
    },
    resumoNumero: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2c5aa0',
        margin: 0,
        lineHeight: 1
    },
    resumoLabel: {
        fontSize: '0.75rem',
        color: '#666',
        margin: 0
    },
    filtrosContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    inputBusca: {
        flex: 1,
        minWidth: '180px',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    selectFiltro: {
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        minWidth: '160px'
    },
    btnAtualizar: {
        backgroundColor: '#2c5aa0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    pedidosGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '15px'
    },
    pedidoCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    pedidoHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    },
    pedidoId: {
        fontFamily: 'monospace',
        backgroundColor: '#eaf2ff',
        color: '#2c5aa0',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    pedidoData: {
        color: '#999',
        fontSize: '0.85rem'
    },
    pedidoCliente: {
        fontSize: '1.1rem',
        fontWeight: '500',
        marginBottom: '8px',
        color: '#333'
    },
    pedidoValor: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#2c5aa0',
        marginBottom: '12px'
    },
    pedidoStatus: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.85rem',
        marginBottom: '15px'
    },
    btnAtualizarCard: {
        width: '100%',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    },
    semPedidos: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '50px',
        color: '#666',
        backgroundColor: 'white',
        borderRadius: '12px'
    },
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '15px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center'
    },
    modalTitle: {
        color: '#2c5aa0',
        marginBottom: '10px'
    },
    modalSubtitle: {
        color: '#666',
        marginBottom: '5px'
    },
    statusOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px',
        marginBottom: '15px'
    },
    statusOption: {
        padding: '12px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        border: 'none'
    },
    avisoPermissao: {
        fontSize: '0.8rem',
        color: '#999',
        marginBottom: '15px'
    },
    btnFecharModal: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 30px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    }
};

export default GerenciadorPedidos;
