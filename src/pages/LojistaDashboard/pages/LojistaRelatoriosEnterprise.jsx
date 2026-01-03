// LojistaRelatorios_ENTERPRISE.jsx
// PLANO ENTERPRISE - Dashboard ROI + BI Completo (R$ 360/mês)
// PRO + ROI Analytics + Estoque Crítico + Métricas Avançadas

import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import LojistaRelatoriosPro from "./LojistaRelatoriosPro";

const LojistaRelatoriosEnterprise = () => {
    const [loading, setLoading] = useState(false);
    const [lojaId, setLojaId] = useState(null);
    const [periodo, setPeriodo] = useState('mes');
    
    const [dashboardROI, setDashboardROI] = useState({
        investimentoTotal: 0,
        retornoTotal: 0,
        roi: 0,
        custoAssinatura: 0,
        custoComissoes: 0,
        receitaGerada: 0,
        lucroLiquido: 0,
    });

    const [estoqueCritico, setEstoqueCritico] = useState([]);

    const [metricasAvancadas, setMetricasAvancadas] = useState({
        vendasPorOrigem: {
            organicas: 0,
            espontaneas: 0,
            consultores: 0,
        },
        metodosFechamento: {
            video: 0,
            audio: 0,
            chat: 0,
        },
        performancePeriodo: [],
    });

    useEffect(() => {
        carregarLojaId();
    }, []);

    useEffect(() => {
        if (lojaId) {
            fetchDashboardROI();
            fetchEstoqueCritico();
            fetchMetricasAvancadas();
        }
    }, [lojaId, periodo]);

    const carregarLojaId = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: loja } = await supabase
                .from('lojas_corrigida')
                .select('id, plano')
                .eq('user_id', user.id)
                .single();

            if (loja) {
                setLojaId(loja.id);
            }
        } catch (error) {
            console.error('Erro ao carregar loja:', error);
        }
    };

    const calcularDataInicio = (periodo) => {
        const hoje = new Date();
        switch (periodo) {
            case 'hoje':
                hoje.setHours(0, 0, 0, 0);
                break;
            case 'semana':
                hoje.setDate(hoje.getDate() - 7);
                break;
            case 'mes':
                hoje.setMonth(hoje.getMonth() - 1);
                break;
            case 'ano':
                hoje.setFullYear(hoje.getFullYear() - 1);
                break;
        }
        return hoje.toISOString();
    };

    const fetchDashboardROI = async () => {
        if (!lojaId) return;

        setLoading(true);

        try {
            const dataInicio = calcularDataInicio(periodo);

            // Buscar dashboard summary
            const { data: summaryData } = await supabase
                .from('dashboard_enterprise_summary')
                .select('*')
                .eq('id_lojista', lojaId)
                .gte('created_at', dataInicio)
                .single();

            if (summaryData) {
                setDashboardROI({
                    investimentoTotal: parseFloat(summaryData.investimento_total || 0),
                    retornoTotal: parseFloat(summaryData.retorno_total || 0),
                    roi: parseFloat(summaryData.roi || 0),
                    custoAssinatura: parseFloat(summaryData.custo_assinatura || 0),
                    custoComissoes: parseFloat(summaryData.custo_comissoes || 0),
                    receitaGerada: parseFloat(summaryData.receita_gerada || 0),
                    lucroLiquido: parseFloat(summaryData.lucro_liquido || 0),
                });
            }

        } catch (error) {
            console.error("Erro ao buscar dashboard ROI:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEstoqueCritico = async () => {
        if (!lojaId) return;

        try {
            const { data: estoqueData } = await supabase
                .from('estoque_analytics')
                .select('*')
                .eq('id_lojista', lojaId)
                .order('dias_sem_venda', { ascending: false })
                .limit(10);

            setEstoqueCritico(estoqueData || []);

        } catch (error) {
            console.error("Erro ao buscar estoque crítico:", error);
        }
    };

    const fetchMetricasAvancadas = async () => {
        if (!lojaId) return;

        try {
            const dataInicio = calcularDataInicio(periodo);

            // Vendas por origem
            const { data: vendasData } = await supabase
                .from('vendas')
                .select('origem_venda, metodo_fechamento')
                .eq('id_lojista', lojaId)
                .gte('created_at', dataInicio);

            const vendasPorOrigem = {
                organicas: vendasData?.filter(v => v.origem_venda === 'organicas').length || 0,
                espontaneas: vendasData?.filter(v => v.origem_venda === 'espontaneas').length || 0,
                consultores: vendasData?.filter(v => v.origem_venda === 'consultores').length || 0,
            };

            const metodosFechamento = {
                video: vendasData?.filter(v => v.metodo_fechamento === 'video').length || 0,
                audio: vendasData?.filter(v => v.metodo_fechamento === 'audio').length || 0,
                chat: vendasData?.filter(v => v.metodo_fechamento === 'chat').length || 0,
            };

            setMetricasAvancadas({
                vendasPorOrigem,
                metodosFechamento,
                performancePeriodo: [],
            });

        } catch (error) {
            console.error("Erro ao buscar métricas avançadas:", error);
        }
    };

    const renderDashboardROI = () => {
        const roiColor = dashboardROI.roi >= 10 ? '#10b981' : dashboardROI.roi >= 5 ? '#f59e0b' : '#ef4444';
        
        return (
            <div style={styles.roiSection}>
                <div style={styles.roiTitleBox}>
                    <h2 style={styles.roiTitle}>📊 Dashboard ROI</h2>
                    <select 
                        value={periodo} 
                        onChange={(e) => setPeriodo(e.target.value)}
                        style={styles.periodSelector}
                    >
                        <option value="hoje">Hoje</option>
                        <option value="semana">Últimos 7 dias</option>
                        <option value="mes">Último mês</option>
                        <option value="ano">Último ano</option>
                    </select>
                </div>

                <div style={styles.roiMainCard}>
                    <div style={styles.roiMainValue}>
                        <div style={styles.roiLabel}>ROI (Retorno sobre Investimento)</div>
                        <div style={{...styles.roiValueLarge, color: roiColor}}>
                            {dashboardROI.roi.toFixed(2)}x
                        </div>
                        <div style={styles.roiDescription}>
                            Para cada R$ 1,00 investido, você recebe R$ {dashboardROI.roi.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div style={styles.roiGrid}>
                    <div style={styles.roiCard}>
                        <div style={styles.roiCardLabel}>💸 Investimento Total</div>
                        <div style={styles.roiCardValue}>
                            R$ {dashboardROI.investimentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.roiCardBreakdown}>
                            <div>Assinatura: R$ {dashboardROI.custoAssinatura.toFixed(2)}</div>
                            <div>Comissões: R$ {dashboardROI.custoComissoes.toFixed(2)}</div>
                        </div>
                    </div>

                    <div style={styles.roiCard}>
                        <div style={styles.roiCardLabel}>💰 Retorno Total</div>
                        <div style={styles.roiCardValue}>
                            R$ {dashboardROI.retornoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.roiCardBreakdown}>
                            <div>Receita gerada pela plataforma</div>
                        </div>
                    </div>

                    <div style={styles.roiCard}>
                        <div style={styles.roiCardLabel}>✅ Lucro Líquido</div>
                        <div style={{...styles.roiCardValue, color: '#10b981'}}>
                            R$ {dashboardROI.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={styles.roiCardBreakdown}>
                            <div>Retorno - Investimento</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEstoqueCritico = () => {
        return (
            <div style={styles.estoqueSection}>
                <h2 style={styles.sectionTitle}>📦 Estoque Crítico</h2>
                
                {estoqueCritico.length === 0 ? (
                    <div style={styles.noData}>
                        <p>✅ Nenhum produto crítico no momento!</p>
                    </div>
                ) : (
                    <div style={styles.estoqueGrid}>
                        {estoqueCritico.map((produto, i) => {
                            const dias = produto.dias_sem_venda;
                            const statusColor = dias >= 90 ? '#ef4444' : dias >= 60 ? '#f59e0b' : '#10b981';
                            const statusText = dias >= 90 ? 'CRÍTICO' : dias >= 60 ? 'ATENÇÃO' : 'NORMAL';
                            
                            return (
                                <div key={i} style={styles.estoqueCard}>
                                    <div style={styles.estoqueHeader}>
                                        <span style={styles.estoqueNome}>{produto.produto_nome || 'Produto'}</span>
                                        <span style={{...styles.estoqueStatus, backgroundColor: statusColor}}>
                                            {statusText}
                                        </span>
                                    </div>
                                    <div style={styles.estoqueDetails}>
                                        <div style={styles.estoqueMetric}>
                                            <span>⏱️ Dias sem venda:</span>
                                            <strong>{dias}</strong>
                                        </div>
                                        <div style={styles.estoqueMetric}>
                                            <span>💵 Valor parado:</span>
                                            <strong>R$ {parseFloat(produto.valor_total_parado || 0).toFixed(2)}</strong>
                                        </div>
                                        <div style={styles.estoqueMetric}>
                                            <span>📊 Quantidade:</span>
                                            <strong>{produto.quantidade || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderMetricasAvancadas = () => {
        const totalVendas = metricasAvancadas.vendasPorOrigem.organicas + 
                           metricasAvancadas.vendasPorOrigem.espontaneas + 
                           metricasAvancadas.vendasPorOrigem.consultores;

        return (
            <div style={styles.metricasSection}>
                <h2 style={styles.sectionTitle}>📈 Análise Avançada</h2>
                
                <div style={styles.analysisGrid}>
                    {/* ORIGEM DAS VENDAS */}
                    <div style={styles.analysisCard}>
                        <h3 style={styles.analysisCardTitle}>🎯 Origem das Vendas</h3>
                        <div style={styles.barContainer}>
                            <div style={styles.barItem}>
                                <span style={styles.barLabel}>Orgânicas</span>
                                <div style={styles.barBackground}>
                                    <div style={{
                                        ...styles.barFill,
                                        width: `${totalVendas > 0 ? (metricasAvancadas.vendasPorOrigem.organicas / totalVendas) * 100 : 0}%`,
                                        backgroundColor: '#3b82f6'
                                    }}></div>
                                </div>
                                <span style={styles.barValue}>{metricasAvancadas.vendasPorOrigem.organicas}</span>
                            </div>
                            <div style={styles.barItem}>
                                <span style={styles.barLabel}>Espontâneas</span>
                                <div style={styles.barBackground}>
                                    <div style={{
                                        ...styles.barFill,
                                        width: `${totalVendas > 0 ? (metricasAvancadas.vendasPorOrigem.espontaneas / totalVendas) * 100 : 0}%`,
                                        backgroundColor: '#10b981'
                                    }}></div>
                                </div>
                                <span style={styles.barValue}>{metricasAvancadas.vendasPorOrigem.espontaneas}</span>
                            </div>
                            <div style={styles.barItem}>
                                <span style={styles.barLabel}>Consultores</span>
                                <div style={styles.barBackground}>
                                    <div style={{
                                        ...styles.barFill,
                                        width: `${totalVendas > 0 ? (metricasAvancadas.vendasPorOrigem.consultores / totalVendas) * 100 : 0}%`,
                                        backgroundColor: '#f59e0b'
                                    }}></div>
                                </div>
                                <span style={styles.barValue}>{metricasAvancadas.vendasPorOrigem.consultores}</span>
                            </div>
                        </div>
                    </div>

                    {/* MÉTODOS DE FECHAMENTO */}
                    <div style={styles.analysisCard}>
                        <h3 style={styles.analysisCardTitle}>🎬 Métodos de Fechamento</h3>
                        <div style={styles.methodsGrid}>
                            <div style={styles.methodCard}>
                                <div style={styles.methodIcon}>📹</div>
                                <div style={styles.methodLabel}>Vídeo</div>
                                <div style={styles.methodValue}>{metricasAvancadas.metodosFechamento.video}</div>
                            </div>
                            <div style={styles.methodCard}>
                                <div style={styles.methodIcon}>🎧</div>
                                <div style={styles.methodLabel}>Áudio</div>
                                <div style={styles.methodValue}>{metricasAvancadas.metodosFechamento.audio}</div>
                            </div>
                            <div style={styles.methodCard}>
                                <div style={styles.methodIcon}>💬</div>
                                <div style={styles.methodLabel}>Chat</div>
                                <div style={styles.methodValue}>{metricasAvancadas.metodosFechamento.chat}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🏆 Relatórios Enterprise</h1>
                <span style={styles.planBadge}>PLANO ENTERPRISE</span>
            </div>

            {loading && (
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Carregando analytics enterprise...</p>
                </div>
            )}

            {!loading && (
                <>
                    {/* DASHBOARD ROI - EXCLUSIVO ENTERPRISE */}
                    {renderDashboardROI()}

                    {/* ESTOQUE CRÍTICO - EXCLUSIVO ENTERPRISE */}
                    {renderEstoqueCritico()}

                    {/* MÉTRICAS AVANÇADAS - EXCLUSIVO ENTERPRISE */}
                    {renderMetricasAvancadas()}
                </>
            )}

            {/* RELATÓRIOS PRO (que inclui BASIC) */}
            <div style={styles.proSection}>
                <LojistaRelatoriosPro />
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "30px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0
    },
    planBadge: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
    },
    loading: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #f59e0b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    roiSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        border: '2px solid #f59e0b'
    },
    roiTitleBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #f59e0b',
        paddingBottom: '15px'
    },
    roiTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#f59e0b',
        margin: 0
    },
    periodSelector: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer'
    },
    roiMainCard: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '3px solid #f59e0b',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center'
    },
    roiMainValue: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    roiLabel: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#78350f',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    roiValueLarge: {
        fontSize: '4rem',
        fontWeight: '800',
        margin: '10px 0'
    },
    roiDescription: {
        fontSize: '1rem',
        color: '#78350f'
    },
    roiGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    roiCard: {
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '25px',
        transition: 'transform 0.2s'
    },
    roiCardLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '10px',
        textTransform: 'uppercase'
    },
    roiCardValue: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '15px'
    },
    roiCardBreakdown: {
        fontSize: '0.85rem',
        color: '#64748b',
        lineHeight: '1.6'
    },
    estoqueSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '25px'
    },
    noData: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#10b981',
        fontSize: '1.2rem',
        fontWeight: '600'
    },
    estoqueGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    estoqueCard: {
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px'
    },
    estoqueHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e2e8f0'
    },
    estoqueNome: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#1e293b'
    },
    estoqueStatus: {
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '700'
    },
    estoqueDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    estoqueMetric: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        color: '#64748b'
    },
    metricasSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },
    analysisGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px'
    },
    analysisCard: {
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '25px'
    },
    analysisCardTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '20px'
    },
    barContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    barItem: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr 60px',
        gap: '10px',
        alignItems: 'center'
    },
    barLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#64748b'
    },
    barBackground: {
        height: '24px',
        backgroundColor: '#e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden'
    },
    barFill: {
        height: '100%',
        transition: 'width 0.3s ease'
    },
    barValue: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'right'
    },
    methodsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px'
    },
    methodCard: {
        backgroundColor: 'white',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center'
    },
    methodIcon: {
        fontSize: '2rem',
        marginBottom: '10px'
    },
    methodLabel: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '8px'
    },
    methodValue: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e293b'
    },
    proSection: {
        marginTop: '30px'
    }
};

// Animação do spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('[data-relatorios-enterprise-spinner]')) {
  styleSheet.setAttribute('data-relatorios-enterprise-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaRelatoriosEnterprise;