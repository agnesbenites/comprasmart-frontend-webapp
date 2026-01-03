// LojistaRelatorios_PRO.jsx
// PLANO PRO - Saúde da Operação (R$ 150/mês)
// BASIC + Dinheiro Salvo + Taxa de Cobertura + Vendas Assistidas + Aumento de Ticket Médio

import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import LojistaRelatoriosBasic from "./LojistaRelatoriosBasic";

const LojistaRelatoriosPro = () => {
    const [loading, setLoading] = useState(false);
    const [lojaId, setLojaId] = useState(null);
    
    const [metricasSaude, setMetricasSaude] = useState({
        dinheiroSalvo: 0,
        taxaCobertura: 0,
        vendasAssistidas: 0,
        aumentoTicketMedio: 0,
        ticketMedioSemConsultor: 0,
        ticketMedioComConsultor: 0,
        leadsTotal: 0,
        leadsSalvos: 0,
    });

    useEffect(() => {
        carregarLojaId();
    }, []);

    useEffect(() => {
        if (lojaId) {
            fetchMetricasSaude();
        }
    }, [lojaId]);

    const carregarLojaId = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: loja } = await supabase
                .from('lojas_corrigida')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (loja) {
                setLojaId(loja.id);
            }
        } catch (error) {
            console.error('Erro ao carregar loja:', error);
        }
    };

    const fetchMetricasSaude = async () => {
        if (!lojaId) return;

        setLoading(true);

        try {
            // 1. DINHEIRO SALVO - Vendas incrementais (vendas que só aconteceram por causa da plataforma)
            const { data: vendasIncrementais } = await supabase
                .from('vendas')
                .select('valor_total')
                .eq('id_lojista', lojaId)
                .eq('venda_incremental', true);

            const dinheiroSalvo = vendasIncrementais?.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) || 0;

            // 2. TAXA DE COBERTURA - % de leads salvos que seriam perdidos
            const { data: leadsData } = await supabase
                .from('vendas')
                .select('origem_venda')
                .eq('id_lojista', lojaId);

            const leadsTotal = leadsData?.length || 0;
            const leadsSalvos = leadsData?.filter(v => v.origem_venda === 'consultores').length || 0;
            const taxaCobertura = leadsTotal > 0 ? (leadsSalvos / leadsTotal) * 100 : 0;

            // 3. VENDAS ASSISTIDAS - Vendas iniciadas por vendedor e finalizadas por consultor
            const { data: vendasAssistidasData } = await supabase
                .from('vendas')
                .select('*')
                .eq('id_lojista', lojaId)
                .not('id_vendedor', 'is', null)
                .not('id_consultor', 'is', null);

            const vendasAssistidas = vendasAssistidasData?.length || 0;

            // 4. AUMENTO DE TICKET MÉDIO - Comparação com e sem consultor
            const { data: vendasSemConsultor } = await supabase
                .from('vendas')
                .select('valor_total')
                .eq('id_lojista', lojaId)
                .is('id_consultor', null);

            const { data: vendasComConsultor } = await supabase
                .from('vendas')
                .select('valor_total')
                .eq('id_lojista', lojaId)
                .not('id_consultor', 'is', null);

            const ticketMedioSemConsultor = vendasSemConsultor?.length > 0
                ? vendasSemConsultor.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) / vendasSemConsultor.length
                : 0;

            const ticketMedioComConsultor = vendasComConsultor?.length > 0
                ? vendasComConsultor.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0) / vendasComConsultor.length
                : 0;

            const aumentoTicketMedio = ticketMedioSemConsultor > 0
                ? ((ticketMedioComConsultor - ticketMedioSemConsultor) / ticketMedioSemConsultor) * 100
                : 0;

            setMetricasSaude({
                dinheiroSalvo,
                taxaCobertura,
                vendasAssistidas,
                aumentoTicketMedio,
                ticketMedioSemConsultor,
                ticketMedioComConsultor,
                leadsTotal,
                leadsSalvos,
            });

        } catch (error) {
            console.error("Erro ao buscar métricas de saúde:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderMetricasSaudeOperacao = () => {
        return (
            <div style={styles.saudeSection}>
                <div style={styles.saudeTitleBox}>
                    <h2 style={styles.saudeTitle}>💪 Saúde da Operação</h2>
                    <p style={styles.saudeSubtitle}>
                        Como vendedores e consultores trabalham juntos para maximizar resultados
                    </p>
                </div>

                <div style={styles.metricsGrid}>
                    {/* MÉTRICA 1: DINHEIRO SALVO */}
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>💰</div>
                        <div style={styles.metricContent}>
                            <div style={styles.metricLabel}>Dinheiro Salvo</div>
                            <div style={styles.metricValue}>
                                R$ {metricasSaude.dinheiroSalvo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div style={styles.metricDescription}>
                                Vendas que NÃO teriam acontecido sem a plataforma
                            </div>
                        </div>
                    </div>

                    {/* MÉTRICA 2: TAXA DE COBERTURA */}
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🛡️</div>
                        <div style={styles.metricContent}>
                            <div style={styles.metricLabel}>Taxa de Cobertura</div>
                            <div style={styles.metricValue}>
                                {metricasSaude.taxaCobertura.toFixed(1)}%
                            </div>
                            <div style={styles.metricDescription}>
                                {metricasSaude.leadsSalvos} de {metricasSaude.leadsTotal} leads salvos por demora
                            </div>
                        </div>
                    </div>

                    {/* MÉTRICA 3: VENDAS ASSISTIDAS */}
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🤝</div>
                        <div style={styles.metricContent}>
                            <div style={styles.metricLabel}>Vendas Assistidas</div>
                            <div style={styles.metricValue}>
                                {metricasSaude.vendasAssistidas}
                            </div>
                            <div style={styles.metricDescription}>
                                Vendedor iniciou, consultor finalizou com expertise
                            </div>
                        </div>
                    </div>

                    {/* MÉTRICA 4: AUMENTO DE TICKET MÉDIO */}
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>📈</div>
                        <div style={styles.metricContent}>
                            <div style={styles.metricLabel}>Aumento de Ticket Médio</div>
                            <div style={styles.metricValue}>
                                +{metricasSaude.aumentoTicketMedio.toFixed(1)}%
                            </div>
                            <div style={styles.metricDescription}>
                                Sem consultor: R$ {metricasSaude.ticketMedioSemConsultor.toFixed(2)} → 
                                Com consultor: R$ {metricasSaude.ticketMedioComConsultor.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* INSIGHTS */}
                <div style={styles.insightBox}>
                    <h3 style={styles.insightTitle}>💡 Insights</h3>
                    <ul style={styles.insightList}>
                        <li style={styles.insightItem}>
                            <strong>Sinergia Perfeita:</strong> Seus vendedores captam leads e os consultores 
                            especialistas fecham vendas técnicas, aumentando o ticket médio em {metricasSaude.aumentoTicketMedio.toFixed(0)}%.
                        </li>
                        <li style={styles.insightItem}>
                            <strong>Proteção de Receita:</strong> A plataforma já salvou R$ {metricasSaude.dinheiroSalvo.toLocaleString('pt-BR')} 
                            em vendas que seriam perdidas sem atendimento especializado.
                        </li>
                        <li style={styles.insightItem}>
                            <strong>Cobertura Eficiente:</strong> {metricasSaude.taxaCobertura.toFixed(0)}% dos leads são 
                            atendidos rapidamente, evitando perda por demora.
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📊 Relatórios Avançados</h1>
                <span style={styles.planBadge}>PLANO PRO</span>
            </div>

            {/* MÉTRICAS DE SAÚDE DA OPERAÇÃO - EXCLUSIVO PRO */}
            {loading && (
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Carregando métricas avançadas...</p>
                </div>
            )}

            {!loading && renderMetricasSaudeOperacao()}

            {/* RELATÓRIOS BÁSICOS (herdados do BASIC) */}
            <div style={styles.basicSection}>
                <LojistaRelatoriosBasic />
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
        backgroundColor: '#10b981',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600'
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
        borderTop: '4px solid #10b981',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    saudeSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },
    saudeTitleBox: {
        marginBottom: '30px',
        borderBottom: '2px solid #10b981',
        paddingBottom: '15px'
    },
    saudeTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#10b981',
        margin: '0 0 5px 0'
    },
    saudeSubtitle: {
        fontSize: '1rem',
        color: '#64748b',
        margin: 0
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    metricCard: {
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        gap: '15px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default'
    },
    metricIcon: {
        fontSize: '2.5rem',
        flexShrink: 0
    },
    metricContent: {
        flex: 1
    },
    metricLabel: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    metricValue: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '5px'
    },
    metricDescription: {
        fontSize: '0.85rem',
        color: '#64748b',
        lineHeight: '1.4'
    },
    insightBox: {
        backgroundColor: '#ecfdf5',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '25px',
        marginTop: '30px'
    },
    insightTitle: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#059669',
        marginBottom: '15px'
    },
    insightList: {
        margin: 0,
        paddingLeft: '20px'
    },
    insightItem: {
        fontSize: '0.95rem',
        color: '#064e3b',
        marginBottom: '12px',
        lineHeight: '1.6'
    },
    basicSection: {
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
  
  .metricCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;
if (!document.head.querySelector('[data-relatorios-pro-spinner]')) {
  styleSheet.setAttribute('data-relatorios-pro-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaRelatoriosPro;