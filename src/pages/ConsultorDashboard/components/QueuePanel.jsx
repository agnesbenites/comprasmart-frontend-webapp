// src/pages/ConsultorDashboard/components/QueuePanel.jsx
// ✅ VERSÃO APRIMORADA COM FILA INTELIGENTE

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const QueuePanel = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('disponivel');
    const [filaAtendimento, setFilaAtendimento] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [atendimentoAtual, setAtendimentoAtual] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            carregarDados();
            
            // Realtime: Escutar novas entradas na fila
            const subscription = supabase
                .channel('fila_realtime')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'fila_atendimento',
                    filter: `consultor_id=eq.${user.id}`
                }, (payload) => {
                    console.log('Mudança na fila:', payload);
                    carregarDados();
                })
                .subscribe();

            // Polling a cada 30 segundos
            const interval = setInterval(carregarDados, 30000);

            return () => {
                subscription.unsubscribe();
                clearInterval(interval);
            };
        }
    }, [user, status]);

    const carregarDados = async () => {
        if (!user?.id) return;

        try {
            // 1. Buscar fila de atendimentos imediatos
            const { data: fila } = await supabase
                .from('fila_atendimento')
                .select(`
                    *,
                    clientes:cliente_id (
                        id,
                        nome,
                        nome_visivel
                    ),
                    lojas:loja_id (
                        nome
                    )
                `)
                .or(`consultor_id.eq.${user.id},consultor_id.is.null`)
                .in('status', ['aguardando', 'atribuido'])
                .order('created_at', { ascending: true });

            setFilaAtendimento(fila || []);

            // 2. Buscar agendamentos do dia
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);

            const { data: agends } = await supabase
                .from('agendamentos')
                .select(`
                    *,
                    clientes:cliente_id (
                        nome,
                        nome_visivel
                    ),
                    lojas:loja_id (
                        nome
                    )
                `)
                .eq('consultor_id', user.id)
                .gte('data_agendamento', hoje.toISOString())
                .lt('data_agendamento', amanha.toISOString())
                .in('status', ['pendente', 'confirmado'])
                .order('data_agendamento', { ascending: true });

            setAgendamentos(agends || []);

            // 3. Verificar se há atendimento ativo
            const { data: ativo } = await supabase
                .from('fila_atendimento')
                .select(`
                    *,
                    clientes:cliente_id (nome, nome_visivel),
                    lojas:loja_id (nome)
                `)
                .eq('consultor_id', user.id)
                .eq('status', 'em_atendimento')
                .single();

            if (ativo) {
                setAtendimentoAtual(ativo);
                setStatus('ocupado');
            }

        } catch (error) {
            console.error('[Fila] Erro ao carregar:', error);
        } finally {
            setLoading(false);
        }
    };

    const getClienteDisplay = (item) => {
        if (item.clientes?.nome_visivel) {
            return item.clientes.nome;
        }
        return `Cliente #${String(item.clientes?.id).slice(-4).padStart(4, '0')}`;
    };

    const getTempoEspera = (createdAt) => {
        const agora = new Date();
        const criado = new Date(createdAt);
        const diff = Math.floor((agora - criado) / 60000); // minutos
        
        if (diff < 1) return 'Agora mesmo';
        if (diff === 1) return '1 min';
        return `${diff} min`;
    };

    const aceitarChamada = async (item) => {
        try {
            // Atualizar status da fila
            const { error } = await supabase
                .from('fila_atendimento')
                .update({
                    status: 'em_atendimento',
                    consultor_id: user.id,
                    atribuido_em: new Date().toISOString()
                })
                .eq('id', item.id);

            if (error) throw error;

            // Criar notificação para o cliente
            await supabase.rpc('criar_notificacao', {
                p_usuario_id: item.clientes.user_id, // Precisa adicionar user_id na query
                p_tipo: 'atendimento_iniciado',
                p_titulo: '✅ Consultor encontrado!',
                p_mensagem: 'Seu consultor está pronto para atendê-lo. Abra o app para iniciar o chat.',
                p_dados: JSON.stringify({ fila_id: item.id })
            });

            setAtendimentoAtual(item);
            setStatus('ocupado');
            carregarDados();

        } catch (error) {
            console.error('Erro ao aceitar chamada:', error);
            alert('Erro ao aceitar chamada. Tente novamente.');
        }
    };

    const recusarChamada = async (itemId) => {
        try {
            // Remove o consultor da atribuição
            await supabase
                .from('fila_atendimento')
                .update({
                    consultor_id: null,
                    status: 'aguardando',
                    atribuido_em: null
                })
                .eq('id', itemId);

            carregarDados();
        } catch (error) {
            console.error('Erro ao recusar:', error);
        }
    };

    const finalizarAtendimento = async () => {
        if (!atendimentoAtual) return;

        try {
            await supabase
                .from('fila_atendimento')
                .update({ status: 'concluido' })
                .eq('id', atendimentoAtual.id);

            setAtendimentoAtual(null);
            setStatus('disponivel');
            carregarDados();

        } catch (error) {
            console.error('Erro ao finalizar:', error);
        }
    };

    const confirmarAgendamento = async (agendamentoId) => {
        try {
            await supabase
                .from('agendamentos')
                .update({
                    status: 'confirmado',
                    aceito_em: new Date().toISOString()
                })
                .eq('id', agendamentoId);

            carregarDados();
            alert('✅ Agendamento confirmado!');
        } catch (error) {
            console.error('Erro ao confirmar:', error);
        }
    };

    const toggleDisponibilidade = () => {
        if (status === 'ocupado') {
            alert('Finalize o atendimento atual antes de mudar o status');
            return;
        }
        setStatus(prev => prev === 'disponivel' ? 'offline' : 'disponivel');
    };

    const getStatusStyle = () => {
        if (status === 'disponivel') return { backgroundColor: '#bb25a6', color: 'white' };
        if (status === 'ocupado') return { backgroundColor: '#ffc107', color: '#333' };
        return { backgroundColor: '#6c757d', color: 'white' };
    };

    const getStatusText = () => {
        if (status === 'disponivel') return '✓ Disponível';
        if (status === 'ocupado') return '⏸ Em Atendimento';
        return '⏹ Offline';
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Carregando fila...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
                <h2 style={styles.title}>📋 Fila de Atendimento</h2>
                <div style={styles.headerActions}>
                    <button
                        onClick={toggleDisponibilidade}
                        style={{ ...styles.statusButton, ...getStatusStyle() }}
                        disabled={status === 'ocupado'}
                    >
                        {getStatusText()}
                    </button>
                    <div style={styles.counterBadge}>
                        👥 {filaAtendimento.length} na fila
                    </div>
                </div>
            </div>

            {/* ATENDIMENTO ATUAL */}
            {atendimentoAtual && (
                <div style={styles.atendimentoAtual}>
                    <div style={styles.atendimentoInfo}>
                        <p style={styles.atendimentoLabel}>🔴 Atendendo agora:</p>
                        <p style={styles.atendimentoNome}>{getClienteDisplay(atendimentoAtual)}</p>
                        <p style={styles.atendimentoDetalhe}>
                            🏪 {atendimentoAtual.lojas?.nome} - {atendimentoAtual.segmento}
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
                            ✓ Finalizar
                        </button>
                    </div>
                </div>
            )}

            {/* AGENDAMENTOS DO DIA */}
            {agendamentos.length > 0 && (
                <div style={styles.secao}>
                    <h3 style={styles.secaoTitulo}>📅 Agendamentos de Hoje</h3>
                    {agendamentos.map(ag => (
                        <div key={ag.id} style={styles.agendamentoCard}>
                            <div style={styles.agendamentoHora}>
                                {new Date(ag.data_agendamento).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div style={styles.agendamentoInfo}>
                                <p style={styles.agendamentoNome}>{getClienteDisplay(ag)}</p>
                                <p style={styles.agendamentoDetalhe}>
                                    {ag.lojas?.nome} - {ag.segmento}
                                </p>
                            </div>
                            {ag.status === 'pendente' && (
                                <button
                                    onClick={() => confirmarAgendamento(ag.id)}
                                    style={styles.confirmarBtn}
                                >
                                    ✓ Confirmar
                                </button>
                            )}
                            {ag.status === 'confirmado' && (
                                <span style={styles.confirmadoBadge}>✓ Confirmado</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* MENSAGENS DE ESTADO VAZIO */}
            {status === 'offline' && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>⏹</div>
                    <p style={styles.emptyTitle}>Você está offline</p>
                    <p style={styles.emptySubtitle}>
                        Clique em "Offline" acima para começar a receber chamadas
                    </p>
                </div>
            )}

            {status === 'disponivel' && filaAtendimento.length === 0 && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>✓</div>
                    <p style={styles.emptyTitle}>Aguardando chamadas...</p>
                    <p style={styles.emptySubtitle}>
                        Você receberá uma notificação quando um cliente solicitar atendimento
                    </p>
                </div>
            )}

            {/* LISTA DE CHAMADAS PENDENTES */}
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
                                <div style={styles.chamadaInfo}>
                                    <div style={styles.chamadaHeader}>
                                        <span style={styles.chamadaNome}>
                                            👤 {getClienteDisplay(chamada)}
                                        </span>
                                        {chamada.prioridade === 'urgente' && (
                                            <span style={styles.urgenteBadge}>⚡ URGENTE</span>
                                        )}
                                    </div>

                                    <div style={styles.chamadaDetalhes}>
                                        <p style={styles.detalheItem}>🏪 {chamada.lojas?.nome || 'Loja'}</p>
                                        <p style={styles.detalheItem}>📦 Setor: {chamada.segmento}</p>
                                        <p style={styles.detalheItem}>⏱ Aguardando há {getTempoEspera(chamada.created_at)}</p>
                                    </div>
                                </div>

                                <div style={styles.chamadaActions}>
                                    <button
                                        onClick={() => aceitarChamada(chamada)}
                                        style={styles.aceitarButton}
                                    >
                                        ✓ Aceitar
                                    </button>
                                    <button
                                        onClick={() => recusarChamada(chamada.id)}
                                        style={styles.recusarButton}
                                    >
                                        ✗ Recusar
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
    container: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '25px' },
    loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '20px' },
    spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #bb25a6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: CONSULTOR_PRIMARY, margin: 0 },
    headerActions: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
    statusButton: { padding: '10px 20px', borderRadius: '25px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' },
    counterBadge: { backgroundColor: CONSULTOR_LIGHT_BG, color: CONSULTOR_PRIMARY, padding: '10px 15px', borderRadius: '25px', fontWeight: '600', fontSize: '14px' },
    atendimentoAtual: { backgroundColor: '#fff3cd', border: '2px solid #ffc107', borderRadius: '12px', padding: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    atendimentoInfo: { flex: 1 },
    atendimentoLabel: { fontSize: '14px', color: '#856404', margin: '0 0 5px 0' },
    atendimentoNome: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' },
    atendimentoDetalhe: { fontSize: '14px', color: '#666', margin: 0 },
    atendimentoActions: { display: 'flex', gap: '10px' },
    chatButton: { backgroundColor: CONSULTOR_PRIMARY, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    finalizarButton: { backgroundColor: '#bb25a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    secao: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px' },
    secaoTitulo: { fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '15px' },
    agendamentoCard: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid #bb25a6' },
    agendamentoHora: { fontSize: '1.2rem', fontWeight: 'bold', color: '#bb25a6', minWidth: '70px' },
    agendamentoInfo: { flex: 1 },
    agendamentoNome: { fontSize: '1rem', fontWeight: '600', color: '#333', margin: '0 0 5px 0' },
    agendamentoDetalhe: { fontSize: '14px', color: '#666', margin: 0 },
    confirmarBtn: { backgroundColor: '#bb25a6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    confirmadoBadge: { backgroundColor: '#d4edda', color: '#155724', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' },
    emptyState: { textAlign: 'center', padding: '60px 20px' },
    emptyIcon: { fontSize: '4rem', marginBottom: '20px' },
    emptyTitle: { fontSize: '1.3rem', fontWeight: '600', color: '#333', margin: '0 0 10px 0' },
    emptySubtitle: { fontSize: '1rem', color: '#666', margin: 0 },
    listaContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    chamadaCard: { borderRadius: '12px', borderLeft: '5px solid', padding: '20px', transition: 'all 0.2s' },
    chamadaContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' },
    chamadaInfo: { flex: 1, minWidth: '200px' },
    chamadaHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' },
    chamadaNome: { fontSize: '1.1rem', fontWeight: 'bold', color: '#333' },
    urgenteBadge: { backgroundColor: '#dc3545', color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
    chamadaDetalhes: { display: 'flex', flexDirection: 'column', gap: '5px' },
    detalheItem: { fontSize: '14px', color: '#666', margin: 0 },
    chamadaActions: { display: 'flex', flexDirection: 'column', gap: '8px' },
    aceitarButton: { backgroundColor: '#bb25a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    recusarButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
};

export default QueuePanel;