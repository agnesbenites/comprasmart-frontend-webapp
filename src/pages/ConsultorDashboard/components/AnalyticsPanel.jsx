// web-consultor/src/components/AnalyticsPanel.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const MetricCard = ({ title, value, detail, loading, color }) => (
    <div style={analyticsStyles.card}>
        <h4 style={analyticsStyles.cardTitle}>{title}</h4>
        <p style={{...analyticsStyles.cardValue, color: color || '#364fab'}}>
            {loading ? '...' : value}
        </p>
        {detail && <small style={analyticsStyles.cardDetail}>{detail}</small>}
    </div>
);

const AnalyticsPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [productStock, setProductStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [consultorId, setConsultorId] = useState(null);
    
    const [analytics, setAnalytics] = useState({
        avgTime: '-- min',
        dailyCount: 0,
        commissionValue: 'R$ 0,00',
        closedSales: 0,
        qrCodesSent: 0,
        rating: 0,
        associatedStores: [],
        associatedSegments: []
    });

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    setLoading(false);
                    return;
                }
                
                setConsultorId(user.id);
                await carregarMetricas(user.id);
                
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        
        carregarDados();
    }, []);

    const carregarMetricas = async (userId) => {
        try {
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - 30);
            
            const { data: vendas } = await supabase
                .from('vendas')
                .select('*')
                .eq('consultor_id', userId)
                .gte('created_at', dataInicio.toISOString());
            
            const hoje = new Date().toISOString().split('T')[0];
            const { data: atendimentosHoje } = await supabase
                .from('atendimentos')
                .select('*')
                .eq('consultor_id', userId)
                .gte('created_at', `${hoje}T00:00:00`);
            
            const { data: lojas } = await supabase
                .from('consultor_lojas')
                .select('loja:lojas_corrigida(nome_fantasia)')
                .eq('consultor_id', userId)
                .eq('status', 'aprovado');
            
            const { data: segmentos } = await supabase
                .from('consultor_segmentos')
                .select('segmento:segmentos(nome)')
                .eq('consultor_id', userId);
            
            const { data: avaliacoes } = await supabase
                .from('avaliacoes')
                .select('nota')
                .eq('consultor_id', userId);
            
            const vendasConcluidas = vendas?.filter(v => v.status === 'concluida') || [];
            const totalComissao = vendasConcluidas.reduce((acc, v) => acc + (parseFloat(v.comissao) || 0), 0);
            const mediaAvaliacao = avaliacoes?.length > 0 
                ? (avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length).toFixed(1)
                : 0;
            
            let tempoMedio = '-- min';
            if (atendimentosHoje?.length > 0) {
                const atendimentosComTempo = atendimentosHoje.filter(a => a.duracao_minutos);
                if (atendimentosComTempo.length > 0) {
                    const totalMinutos = atendimentosComTempo.reduce((acc, a) => acc + a.duracao_minutos, 0);
                    tempoMedio = `${Math.round(totalMinutos / atendimentosComTempo.length)} min`;
                }
            }
            
            setAnalytics({
                avgTime: tempoMedio,
                dailyCount: atendimentosHoje?.length || 0,
                commissionValue: `R$ ${totalComissao.toFixed(2).replace('.', ',')}`,
                closedSales: vendasConcluidas.length,
                qrCodesSent: vendas?.length || 0,
                rating: mediaAvaliacao,
                associatedStores: lojas?.map(l => l.loja?.nome_fantasia).filter(Boolean) || [],
                associatedSegments: segmentos?.map(s => s.segmento?.nome).filter(Boolean) || []
            });
            
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setProductStock('Digite um termo para buscar.');
            return;
        }
        
        setProductStock('Buscando...');
        
        try {
            const { data, error } = await supabase
                .from('produtos')
                .select('nome, estoque, loja:lojas_corrigida(nome_fantasia)')
                .or(`sku.ilike.%${searchTerm}%,nome.ilike.%${searchTerm}%`)
                .limit(5);
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                const resultados = data.map(p => 
                    `${p.nome}: ${p.estoque} un.${p.loja ? ` (${p.loja.nome_fantasia})` : ''}`
                ).join('\n');
                setProductStock(resultados);
            } else {
                setProductStock('Produto não encontrado.');
            }
        } catch (error) {
            setProductStock('Erro ao buscar produto.');
        }
    };

    const handleGenerateQR = () => {
        alert('Para gerar um QR Code, vá até a tela de Atendimento e finalize uma venda.');
    };

    return (
        <div style={analyticsStyles.container}>
            
            <h2 style={analyticsStyles.sectionTitle}>📊 Visão Geral e Desempenho</h2>
            <div style={analyticsStyles.metricsGrid}>
                <MetricCard title="Atendimentos Hoje" value={analytics.dailyCount} loading={loading} />
                <MetricCard title="Vendas Fechadas (Mês)" value={analytics.closedSales} loading={loading} />
                <MetricCard title="Comissão (Mês)" value={analytics.commissionValue} loading={loading} color="#28a745" />
                <MetricCard title="Avaliação Média" value={analytics.rating > 0 ? `${analytics.rating} ⭐` : 'N/A'} loading={loading} />
                <MetricCard title="QR Codes Enviados" value={analytics.qrCodesSent} loading={loading} />
            </div>

            <h3 style={analyticsStyles.sectionSubtitle}>🔧 Ferramentas de Atendimento</h3>
            
            <div style={analyticsStyles.toolContainer}>
                <input 
                    type="text" 
                    placeholder="Pesquisar Produto/Estoque (SKU, Nome)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={analyticsStyles.searchInput} 
                />
                <button onClick={handleSearch} style={{...analyticsStyles.toolButton, backgroundColor: '#364fab'}}>
                    🔍 Buscar Estoque
                </button>
            </div>
            {productStock && (
                <pre style={analyticsStyles.stockResult}>{productStock}</pre>
            )}

            <button onClick={handleGenerateQR} style={{...analyticsStyles.toolButtonLarge, backgroundColor: '#28a745'}}>
                📱 Gerar QR Code (Ir para Atendimento)
            </button>

            <h3 style={analyticsStyles.sectionSubtitle}>🏪 Minha Afiliação</h3>

            <div style={analyticsStyles.infoGrid}>
                <div style={analyticsStyles.infoCard}>
                    <h4 style={analyticsStyles.infoTitle}>Lojas Associadas</h4>
                    <p style={analyticsStyles.infoText}>
                        {analytics.associatedStores.length > 0 
                            ? analytics.associatedStores.join(', ')
                            : 'Nenhuma loja associada'}
                    </p>
                </div>
                <div style={analyticsStyles.infoCard}>
                    <h4 style={analyticsStyles.infoTitle}>Segmentos</h4>
                    <p style={analyticsStyles.infoText}>
                        {analytics.associatedSegments.length > 0 
                            ? analytics.associatedSegments.join(', ')
                            : 'Nenhum segmento'}
                    </p>
                </div>
            </div>

            <h3 style={analyticsStyles.sectionSubtitle}>📜 Histórico de Compras Finalizadas</h3>
            <p style={analyticsStyles.linkText}>
                Acesse o menu <strong>Histórico</strong> para ver todas as suas vendas.
            </p>
        </div>
    );
};

const analyticsStyles = {
    container: {
        padding: '30px',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100%',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        color: '#333',
        marginBottom: '20px',
        fontWeight: '600',
    },
    sectionSubtitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginTop: '30px',
        marginBottom: '15px',
        fontWeight: '600',
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: 'transform 0.2s',
    },
    cardTitle: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '0 0 8px 0',
        fontWeight: '500',
    },
    cardValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#364fab',
        margin: 0,
    },
    cardDetail: {
        fontSize: '11px',
        color: '#888',
        marginTop: '4px',
        display: 'block',
    },
    toolContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '10px',
    },
    searchInput: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        flexGrow: 1,
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    stockResult: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffeeba',
        whiteSpace: 'pre-wrap',
        fontSize: '14px',
        fontFamily: 'inherit',
    },
    toolButton: {
        padding: '12px 20px',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    },
    toolButtonLarge: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px',
    },
    infoCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    infoTitle: {
        fontSize: '14px',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '600',
    },
    infoText: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
    linkText: {
        fontSize: '14px',
        color: '#666',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
    },
};

export default AnalyticsPanel;