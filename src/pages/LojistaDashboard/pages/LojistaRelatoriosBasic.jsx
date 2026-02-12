// LojistaRelatorios_BASIC.jsx - COM BOTÃO DE EXPORTAR PDF
// PLANO BASIC - Funcionalidades base (R$ 50/mês)

import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import {
    obterResumoMensalIA,
    regenerarResumoIA,
    getMesAtual,
    getMesAnterior,
    exportarRelatorioPDFIA, // ✅ Importado!
    downloadRelatorioPDFIA, // ✅ Função utilitária
    visualizarRelatorioPDFIA, // ✅ Para visualização
    formatarMesParaExibicao // ✅ Utilitário
} from "../../../api/relatorioIA.service";

const STRIPE_PURCHASE_URL = "https://buy.stripe.com/14AeVdgpWemMaBMb0RgQE07";
const STRIPE_COLOR = "#635bff";

const LojistaRelatoriosBasic = () => {
    const [periodo, setPeriodo] = useState("mensal");
    const [tipoExportacao, setTipoExportacao] = useState("TUDO");
    const [formatoExportacao, setFormatoExportacao] = useState("CSV");
    const [loading, setLoading] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [lojaId, setLojaId] = useState(null);

    // IA Report states
    const [resumoIA, setResumoIA] = useState('');
    const [loadingIA, setLoadingIA] = useState(false);
    const [erroIA, setErroIA] = useState('');
    const [fonteIA, setFonteIA] = useState('');
    const [geradoEmIA, setGeradoEmIA] = useState('');
   
    const [boughtCampaign, setBoughtCampaign] = useState({
        isPaid: false,
        remainingDays: 0,
        baseDiscount: 10,
    });
   
    const [dataRelatorios, setDataRelatorios] = useState({
        consultores: [],
        vendedores: [],
        campanhas: [],
        vendas: [],
    });

    const [configCampanha, setConfigCampanha] = useState({
        nome: "",
        dataInicio: "",
        dataFim: "",
        descontoAtivo: true,
        cupomAtivo: false,
        cupomMinimo: 100,
        cupomPercentual: 5,
    });

    useEffect(() => {
        carregarLojaId();
    }, []);

    useEffect(() => {
        if (lojaId) {
            fetchData();
        }
    }, [periodo, lojaId]);

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
   
    const fetchData = async () => {
        if (!lojaId) return;

        setLoading(true);

        try {
            // Saldo de campanha
            const { data: saldoData } = await supabase
                .from('saldos_lojista')
                .select('dias_restantes, desconto_base_percentual')
                .eq('id_lojista', lojaId)
                .single();
           
            if (saldoData) {
                setBoughtCampaign({
                    isPaid: saldoData.dias_restantes > 0,
                    remainingDays: saldoData.dias_restantes,
                    baseDiscount: saldoData.desconto_base_percentual,
                });
            }

            // Métricas de performance
            const { data: metricasData } = await supabase
                .from('metricas_performance')
                .select('*')
                .eq('id_lojista', lojaId);
           
            const consultores = metricasData?.filter(m => m.tipo_entidade === 'consultor').map(m => ({
                id: m.id_entidade,
                nome: m.nome_entidade || 'Consultor',
                clientesAtendidos: m.clientes_atendidos || 0,
                vendasGeradas: parseFloat(m.vendas_geradas || 0),
                comissao: parseFloat(m.comissao_paga || 0)
            })) || [];

            const vendedores = metricasData?.filter(m => m.tipo_entidade === 'vendedor').map(m => ({
                id: m.id_entidade,
                nome: m.nome_entidade || 'Vendedor',
                clientesAtendidos: m.clientes_atendidos || 0,
                vendasGeradas: parseFloat(m.vendas_geradas || 0),
                comissao: parseFloat(m.comissao_paga || 0)
            })) || [];

            // Campanhas
            const { data: campanhasData } = await supabase
                .from('campanhas')
                .select('*')
                .eq('id_lojista', lojaId);
           
            const campanhasFormatadas = campanhasData?.map(c => ({
                id: c.id,
                nome: c.nome,
                dataInicio: c.data_inicio,
                dataFim: c.data_fim,
                investimento: 0,
                receita: 0,
                roi: 0,
                status: c.status,
            })) || [];

            // Vendas
            const { data: vendasData } = await supabase
                .from('vendas')
                .select('*')
                .eq('id_lojista', lojaId);
           
            setDataRelatorios({
                consultores,
                vendedores,
                campanhas: campanhasFormatadas,
                vendas: vendasData || []
            });

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setDataRelatorios({ consultores: [], vendedores: [], campanhas: [], vendas: [] });       
        } finally {
            setLoading(false);
        }
    };
   
    const convertToCSV = (arr) => {
        if (!arr || arr.length === 0) return "";
        const headers = Object.keys(arr[0]).join(';');
        const rows = arr.map(row => Object.values(row).map(v => {
            if (typeof v === 'string') {
                const clean = v.replace(/\n/g, ' ').replace(/"/g, '""');
                return (clean.includes(';') || clean.includes(',')) ? '"' + clean + '"' : clean;
            }
            return v;
        }).join(';')).join('\n');
        return headers + '\n' + rows;
    };

    // ✅ HANDLE EXPORTAR - VERSÃO TURBINADA COM PDF
    const handleExportarClick = async () => {
        setExportando(true);

        try {
            // ✅ SE FOR PDF, USA O BACKEND NOVO COM IA
            if (formatoExportacao === "PDF") {
                // Usar a função utilitária para download automático
                await downloadRelatorioPDFIA({
                    lojistaId: lojaId,
                    mesAtual: getMesAtual(),
                    mesAnterior: getMesAnterior(),
                    nomeArquivo: `Relatorio_IA_${formatarMesParaExibicao(getMesAtual()).replace('/', '_')}.pdf`
                });
                
                setExportando(false);
                return;
            }

            // 📊 EXPORTAÇÃO CSV/EXCEL (lógica existente)
            let exportData = [];
            let filename = `relatorio_${tipoExportacao}_${periodo}_${new Date().getTime()}.csv`;

            if (tipoExportacao === "TUDO") {
                exportData = [
                    ...dataRelatorios.consultores.map(c => ({...c, tipo_relatorio: "Consultor"})),       
                    ...dataRelatorios.vendedores.map(v => ({...v, tipo_relatorio: "Vendedor"})),
                    ...dataRelatorios.campanhas.map(c => ({...c, tipo_relatorio: "Campanha"})),
                    ...dataRelatorios.vendas.map(v => ({...v, tipo_relatorio: "Venda"})),
                ];
            } else if (tipoExportacao === "VENDEDORES") {
                exportData = dataRelatorios.vendedores;
            } else if (tipoExportacao === "CONSULTORES") {
                exportData = dataRelatorios.consultores;
            } else if (tipoExportacao === "CAMPANHAS") {
                exportData = dataRelatorios.campanhas;
            } else if (tipoExportacao === "VENDAS") {
                exportData = dataRelatorios.vendas;
            }
           
            if (exportData.length === 0) {
                alert("Nenhum dado disponível para exportar!");
                setExportando(false);
                return;
            }

            // Simular delay de processamento
            setTimeout(() => {
                const csvString = convertToCSV(exportData);
                const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
               
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                
                console.log("Exportação de " + tipoExportacao + " concluída!");
                setExportando(false);
            }, 500);

        } catch (error) {
            console.error("Erro na exportação:", error);
            alert("Ocorreu um erro ao exportar o arquivo: " + error.message);
            setExportando(false);
        }
    };

    // ✅ HANDLE VISUALIZAR PDF - Botão específico para visualização
    const handleVisualizarPDF = async () => {
        try {
            await visualizarRelatorioPDFIA({
                lojistaId: lojaId,
                mesAtual: getMesAtual(),
                mesAnterior: getMesAnterior()
            });
        } catch (error) {
            alert("Erro ao visualizar PDF: " + error.message);
        }
    };

    // 🤖 ANÁLISE COM IA
    const handleGerarResumoIA = async (forcar = false) => {
        if (!lojaId) return;
        setLoadingIA(true);
        setErroIA('');
        try {
            const params = { lojistaId: lojaId, mesAtual: getMesAtual(), mesAnterior: getMesAnterior() };
            const data = forcar ? await regenerarResumoIA(params) : await obterResumoMensalIA(params);
            setResumoIA(data.resumo);
            setFonteIA(data.fonte);
            setGeradoEmIA(data.geradoEm);
        } catch (err) {
            setErroIA(err.message || 'Erro ao gerar análise');
        } finally {
            setLoadingIA(false);
        }
    };

    const handleConfigurarCampanha = async (e) => {
        e.preventDefault();
       
        if (!lojaId) {
            alert('Erro: Loja não identificada');
            return;
        }

        try {
            const { error } = await supabase
                .from('campanhas')
                .insert([{
                    id_lojista: lojaId,
                    nome: configCampanha.nome,
                    data_inicio: configCampanha.dataInicio,
                    data_fim: configCampanha.dataFim,
                    status: 'ativa',
                    desconto_ativo: configCampanha.descontoAtivo,
                    cupom_ativo: configCampanha.cupomAtivo,
                }]);

            if (error) throw error;
           
            alert("Campanha " + configCampanha.nome + " criada com sucesso!");
            fetchData();
        } catch (error) {
            console.error("Erro ao criar campanha:", error);
            alert("Erro ao criar campanha: " + error.message);
        }
    };

    const renderTableRow = (p, isConsultorPlataforma) => {
        if (isConsultorPlataforma) {
            return (
                <tr key={p.id}>
                    <td style={styles.td}><strong>{p.nome || p.id.substring(0, 8) + '...'}</strong></td>
                    <td style={styles.tdCenter}>{p.clientesAtendidos}</td>
                    <td style={styles.tdRight}>R$ {p.vendasGeradas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td style={styles.tdRight}>R$ {p.comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                </tr>
            );
        }
        return (
            <tr key={p.id}>
                <td style={styles.td}>
                    <span>{p.nome}</span>
                    <br/>
                    <small style={{color: '#666'}}>{p.id.substring(0, 8)}...</small>
                </td>
                <td style={styles.tdCenter}>{p.clientesAtendidos}</td>
                <td style={styles.tdRight}>R$ {p.vendasGeradas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td style={styles.tdRight}>R$ {p.comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            </tr>
        );
    };
   
    const renderPerformanceTable = (title, data, isConsultorPlataforma) => {
        const totalClientes = data.reduce((s, p) => s + p.clientesAtendidos, 0);
        const totalVendas = data.reduce((s, p) => s + p.vendasGeradas, 0);
        const totalComissao = data.reduce((s, p) => s + p.comissao, 0);

        return (
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>{title}</h2>
                {loading && (
                    <div style={styles.loading}>Carregando...</div>
                )}
                {!loading && data.length === 0 && (
                    <div style={styles.noData}>Nenhum registro encontrado.</div>
                )}
                {!loading && data.length > 0 && (
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                                <th style={styles.th}>{isConsultorPlataforma ? 'Consultor' : 'Vendedor'}</th>
                                <th style={styles.thCenter}>Clientes</th>
                                <th style={styles.thRight}>Vendas</th>
                                <th style={styles.thRight}>Comissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(p => renderTableRow(p, isConsultorPlataforma))}
                            <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                                <td style={styles.td}>TOTAL</td>
                                <td style={styles.tdCenter}>{totalClientes}</td>
                                <td style={styles.tdRight}>R$ {totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                                <td style={styles.tdRight}>R$ {totalComissao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        );
    };
   
    const renderBuyCampaignPrompt = () => {
        return (
            <div style={styles.card}>
                <h2 style={styles.cardTitleRed}>📢 Campanha Inativa</h2>
                <div style={styles.centerBox}>
                    <p style={styles.promptText}>
                        Sua campanha de destaque está inativa. Adquira dias de destaque para ativar este recurso.
                    </p>
                    <a
                        href={STRIPE_PURCHASE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.stripeButton}
                    >
                        💳 Comprar Dias de Campanha Agora
                    </a>
                </div>
            </div>
        );
    };

    const renderCampaignConfiguration = () => {
        const remainingDays = boughtCampaign.remainingDays;
        const descontoTexto = configCampanha.descontoAtivo ? boughtCampaign.baseDiscount + "% Ativo" : "NÃO";
        const cupomTexto = configCampanha.cupomAtivo ? "SIM" : "NÃO";
        const tituloCard = configCampanha.nome ? "✅ Campanha Ativa" : "⚙️ Configurar Campanha";
        
        return (
            <div style={styles.card}>
                <h2 style={styles.cardTitleGreen}>{tituloCard}</h2>
                <div style={styles.summaryBox}>
                    <p style={styles.summaryItem}>
                        <strong>Nome:</strong> <span style={styles.summaryValue}>{configCampanha.nome || 'Nova Campanha'}</span>
                    </p>
                    <p style={styles.summaryItem}>
                        <strong>Dias Restantes:</strong> <span style={styles.summaryValue}>{remainingDays}</span>
                    </p>
                    <p style={styles.summaryItem}>
                        <strong>Data Início:</strong> <span style={styles.summaryValue}>{configCampanha.dataInicio || '--'}</span>
                    </p>
                    <p style={styles.summaryItem}>
                        <strong>Data Fim:</strong> <span style={styles.summaryValue}>{configCampanha.dataFim || '--'}</span>
                    </p>
                    <p style={styles.summaryItem}>
                        <strong>Desconto:</strong> <span style={styles.summaryValue}>{descontoTexto}</span>
                    </p>
                    <p style={styles.summaryItem}>
                        <strong>Cupom:</strong> <span style={styles.summaryValue}>{cupomTexto}</span>
                    </p>
                </div>
                <form onSubmit={handleConfigurarCampanha}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nome da Campanha:</label>
                        <input
                            type="text"
                            value={configCampanha.nome}
                            onChange={(e) => setConfigCampanha({...configCampanha, nome: e.target.value})}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Data Início:</label>
                            <input
                                type="date"
                                value={configCampanha.dataInicio}
                                onChange={(e) => setConfigCampanha({...configCampanha, dataInicio: e.target.value})}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Data Fim:</label>
                            <input
                                type="date"
                                value={configCampanha.dataFim}
                                onChange={(e) => setConfigCampanha({...configCampanha, dataFim: e.target.value})}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
                    <div style={styles.checkboxGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={configCampanha.descontoAtivo}
                                onChange={(e) => setConfigCampanha({...configCampanha, descontoAtivo: e.target.checked})}
                            />
                            Ativar Desconto Base ({boughtCampaign.baseDiscount}%)
                        </label>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={configCampanha.cupomAtivo}
                                onChange={(e) => setConfigCampanha({...configCampanha, cupomAtivo: e.target.checked})}
                            />
                            Ativar Cupom de Desconto
                        </label>
                    </div>
                    <button type="submit" style={styles.submitButton}>
                        💾 Salvar Campanha
                    </button>
                </form>
            </div>
        );
    };

    const showCampaignConfig = boughtCampaign.isPaid && boughtCampaign.remainingDays > 0;
   
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📊 Relatórios e Campanhas</h1>
                <span style={styles.planBadge}>PLANO BASIC</span>
            </div>
           
            {/* ✅ SEÇÃO DE EXPORTAÇÃO */}
            <div style={styles.exportSection}>
                <div style={styles.exportFilters}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Período:</label>
                        <select 
                            value={periodo} 
                            onChange={(e) => setPeriodo(e.target.value)} 
                            disabled={loading}
                            style={styles.select}
                        >
                            <option value="diario">📅 Diário</option>
                            <option value="semanal">📅 Semanal</option>
                            <option value="mensal">📅 Mensal</option>
                            <option value="anual">📅 Anual</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Exportar:</label>
                        <select 
                            value={tipoExportacao}
                            onChange={(e) => setTipoExportacao(e.target.value)}
                            disabled={loading}
                            style={styles.select}
                        >
                            <option value="TUDO">📦 Todos os Dados</option>
                            <option value="VENDEDORES">👥 Vendedores</option>
                            <option value="CONSULTORES">🤝 Consultores</option>
                            <option value="CAMPANHAS">📢 Campanhas</option>
                            <option value="VENDAS">💰 Vendas</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Formato:</label>
                        <select 
                            value={formatoExportacao}
                            onChange={(e) => setFormatoExportacao(e.target.value)}
                            disabled={loading}
                            style={styles.select}
                        >
                            <option value="CSV">📄 CSV</option>
                            <option value="EXCEL">📊 Excel (Em breve)</option>
                            <option value="PDF">📕 PDF com IA</option> {/* ✅ Atualizado! */}
                        </select>
                    </div>

                    <button 
                        onClick={handleExportarClick}
                        disabled={loading || exportando}
                        style={{
                            ...styles.exportButton,
                            backgroundColor: formatoExportacao === "PDF" ? "#f53342" : "#10b981", // Vermelho para PDF
                            opacity: (loading || exportando) ? 0.6 : 1,
                            cursor: (loading || exportando) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {exportando 
                            ? '⏳ Exportando...' 
                            : formatoExportacao === "PDF" 
                                ? '📕 Exportar PDF com IA' 
                                : '📥 Exportar Relatório'
                        }
                    </button>
                </div>
            </div>

            {/* 🤖 ANÁLISE INTELIGENTE COM IA */}
            <div style={styles.exportSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: resumoIA ? 16 : 0, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                            🤖 Análise Inteligente
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                            IA analisa seus dados e gera recomendações práticas
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {!resumoIA && !loadingIA && (
                            <button
                                onClick={() => handleGerarResumoIA(false)}
                                disabled={loadingIA || loading}
                                style={{
                                    padding: '10px 22px', borderRadius: 8, border: 'none',
                                    background: 'linear-gradient(135deg, #2f0d51, #bb25a6)',
                                    color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(187,37,166,0.25)',
                                    opacity: (loadingIA || loading) ? 0.6 : 1,
                                }}
                            >
                                ✨ Gerar Análise do Mês
                            </button>
                        )}
                        {resumoIA && (
                            <button
                                onClick={() => handleGerarResumoIA(true)}
                                disabled={loadingIA}
                                style={{
                                    padding: '8px 16px', borderRadius: 8,
                                    border: '1px solid #bb25a6', background: 'transparent',
                                    color: '#bb25a6', fontSize: '0.85rem', fontWeight: 600,
                                    cursor: 'pointer', opacity: loadingIA ? 0.6 : 1,
                                }}
                            >
                                🔄 Regenerar
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading IA */}
                {loadingIA && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={styles.spinner}></div>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Analisando seus resultados com IA...</p>
                    </div>
                )}

                {/* Erro IA */}
                {erroIA && !loadingIA && (
                    <div style={{ background: '#fff5f5', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <p style={{ color: '#c53030', fontSize: '0.9rem', margin: '0 0 8px' }}>⚠️ {erroIA}</p>
                        <button
                            onClick={() => handleGerarResumoIA(false)}
                            style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: '#f53342', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* ✅ Resumo IA COM BOTÃO DE PDF DIRETO */}
                {resumoIA && !loadingIA && (
                    <div>
                        <div style={{
                            background: '#f8f4fb', borderRadius: 10, padding: '20px 18px',
                            borderLeft: '4px solid #bb25a6',
                        }}>
                            {resumoIA.split('\n').map((line, i) => (
                                <p key={i} style={{
                                    fontSize: '0.9rem', color: '#333', lineHeight: 1.7,
                                    margin: line.trim() === '' ? '8px 0' : '4px 0',
                                }}>{line}</p>
                            ))}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    background: '#f3eef8', color: '#2f0d51', padding: '2px 8px',
                                    borderRadius: 10, fontSize: '0.75rem', fontWeight: 600,
                                }}>
                                    {fonteIA === 'cache' ? '📦 Cache' : fonteIA === 'ia-regenerado' ? '🔄 Regenerado' : '✨ Novo'}
                                </span>
                                {geradoEmIA && (
                                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                        {new Date(geradoEmIA).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            
                            {/* ✅ BOTÃO DE DOWNLOAD DIRETO DO RESUMO EM PDF */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={handleVisualizarPDF}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        backgroundColor: '#6366f1',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    👁️ Visualizar PDF
                                </button>
                                <button
                                    onClick={() => {
                                        setFormatoExportacao("PDF");
                                        handleExportarClick();
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        backgroundColor: '#f53342',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    📕 Baixar PDF com IA
                                </button>
                            </div>
                        </div>
                        
                        <p style={{ fontSize: '0.7rem', color: '#bbb', marginTop: 8, fontStyle: 'italic', textAlign: 'center' }}>
                            Análise gerada por IA com base nos dados disponíveis. Verifique antes de tomar decisões.
                        </p>
                    </div>
                )}
            </div>

            {loading && (
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Carregando dados...</p>
                </div>
            )}

            {!loading && (
                <div>
                    <div style={styles.grid}>
                        {renderPerformanceTable("👥 Vendedores Próprios", dataRelatorios.vendedores, false)}
                        {renderPerformanceTable("🤝 Consultores da Plataforma", dataRelatorios.consultores, true)}
                    </div>

                    <div style={styles.gridSingle}>
                        {showCampaignConfig ? renderCampaignConfiguration() : renderBuyCampaignPrompt()}
                    </div>
                </div>
            )}

            {/* ✅ Animação do spinner */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}} />
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
        backgroundColor: '#bb25a6',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    exportSection: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },
    exportFilters: {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '180px'
    },
    filterLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#475569'
    },
    select: {
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    exportButton: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#10b981',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
    },
    grid: { 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "30px", 
        marginBottom: "30px" 
    },
    gridSingle: { 
        marginBottom: "30px" 
    },
    card: { 
        backgroundColor: "white", 
        padding: "25px", 
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)" 
    },
    cardTitle: { 
        color: "#2c5aa0", 
        marginBottom: "20px",
        fontSize: '1.3rem',
        fontWeight: '600'
    },
    cardTitleRed: { 
        color: "#dc3545", 
        marginBottom: "20px",
        fontSize: '1.3rem',
        fontWeight: '600'
    },
    cardTitleGreen: { 
        color: "#2e7d32", 
        marginBottom: "20px",
        fontSize: '1.3rem',
        fontWeight: '600'
    },
    table: { 
        width: "100%", 
        borderCollapse: "collapse" 
    },
    th: { 
        padding: "12px", 
        textAlign: "left", 
        borderBottom: "2px solid #ddd",
        fontWeight: '600',
        color: '#475569'
    },
    thCenter: { 
        padding: "12px", 
        textAlign: "center", 
        borderBottom: "2px solid #ddd",
        fontWeight: '600',
        color: '#475569'
    },
    thRight: { 
        padding: "12px", 
        textAlign: "right", 
        borderBottom: "2px solid #ddd",
        fontWeight: '600',
        color: '#475569'
    },
    td: { 
        padding: "12px", 
        textAlign: "left", 
        borderBottom: "1px solid #f0f0f0",
        color: '#333'
    },
    tdCenter: { 
        padding: "12px", 
        textAlign: "center", 
        borderBottom: "1px solid #f0f0f0",
        color: '#333'
    },
    tdRight: { 
        padding: "12px", 
        textAlign: "right", 
        borderBottom: "1px solid #f0f0f0",
        color: '#333'
    },
    loading: {
        textAlign: "center",
        padding: "40px",
        color: "#666"
    },
    noData: {
        textAlign: "center",
        padding: "40px",
        color: "#999"
    },
    spinner: {
        width: '40px',
        height: '40px',
        margin: '0 auto 15px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #bb25a6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    centerBox: {
        textAlign: 'center',
        padding: '30px'
    },
    promptText: {
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '25px',
        lineHeight: '1.6'
    },
    stripeButton: {
        display: 'inline-block',
        padding: '14px 28px',
        backgroundColor: STRIPE_COLOR,
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'opacity 0.2s'
    },
    summaryBox: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px'
    },
    summaryItem: {
        margin: '10px 0',
        fontSize: '1rem',
        color: '#333'
    },
    summaryValue: {
        fontWeight: '600',
        color: '#2c5aa0',
        marginLeft: '10px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.95rem',
        cursor: 'pointer'
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2e7d32',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'opacity 0.2s'
    }
};

export default LojistaRelatoriosBasic;