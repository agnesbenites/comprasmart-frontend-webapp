import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

const LOJISTA_ID = "858f50c0-f472-4d1d-9e6e-21952f40c7e5";
const STRIPE_PURCHASE_URL = "https://buy.stripe.com/14AeVdgpWemMaBMb0RgQE07";
const STRIPE_COLOR = "#635bff";

const LojistaRelatorios = () => {
    const [periodo, setPeriodo] = useState("mensal");
    const [loading, setLoading] = useState(false);
   
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
   
    const fetchData = async () => {
        if (!supabase) {
            console.error("Supabase nao inicializado");
            return;
        }

        setLoading(true);

        try {
            const { data: saldoData } = await supabase
                .from('saldos_lojista')
                .select('dias_restantes, desconto_base_percentual')
                .eq('id_lojista', LOJISTA_ID)
                .single();
           
            if (saldoData) {
                setBoughtCampaign({
                    isPaid: saldoData.dias_restantes > 0,
                    remainingDays: saldoData.dias_restantes,
                    baseDiscount: saldoData.desconto_base_percentual,
                });
            }

            const { data: metricasData } = await supabase
                .from('metricas_performance')
                .select('*')
                .eq('id_lojista', LOJISTA_ID);
           
            const consultores = metricasData?.filter(m => m.tipo_entidade === 'consultor').map(m => ({
                id: m.id_entidade,
                clientesAtendidos: m.clientes_atendidos || 0,
                vendasGeradas: parseFloat(m.vendas_geradas || 0),
                comissao: parseFloat(m.comissao_paga || 0)
            })) || [];

            const vendedores = metricasData?.filter(m => m.tipo_entidade === 'vendedor').map(m => ({ 
                id: m.id_entidade,
                nome: "Vendedor " + m.id_entidade,
                clientesAtendidos: m.clientes_atendidos || 0,
                vendasGeradas: parseFloat(m.vendas_geradas || 0),
                comissao: parseFloat(m.comissao_paga || 0)
            })) || [];

            const { data: campanhasData } = await supabase
                .from('campanhas')
                .select('*')
                .eq('id_lojista', LOJISTA_ID);

            const campanhasFormatadas = campanhasData?.map(c => ({
                id: c.id,
                nome: c.nome,
                periodo: c.data_inicio + " a " + c.data_fim,
                vendasCampanha: 0,
                roi: 0,
                status: c.status,
            })) || [];

            const { data: vendasData } = await supabase
                .from('vendas')
                .select('*')
                .eq('id_lojista', LOJISTA_ID);
           
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

    useEffect(() => {
        fetchData();
    }, [periodo]);
   
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

    const handleExport = (tipo) => {
        let exportData = [];
        let filename = "relatorio_" + tipo + "_" + periodo + ".csv";

        if (tipo === "TUDO") {
            exportData = [
                ...dataRelatorios.consultores.map(c => ({...c, tipo_relatorio: "Consultor"})),       
                ...dataRelatorios.vendedores.map(v => ({...v, tipo_relatorio: "Vendedor"})),
                ...dataRelatorios.campanhas.map(c => ({...c, tipo_relatorio: "Campanha"})),
                ...dataRelatorios.vendas.map(v => ({...v, tipo_relatorio: "Venda"})),
            ];
        } else if (tipo === "VENDEDORES") {
            exportData = dataRelatorios.vendedores;
        } else if (tipo === "CONSULTORES") {
            exportData = dataRelatorios.consultores;
        } else if (tipo === "CAMPANHAS") {
            exportData = dataRelatorios.campanhas;
        } else if (tipo === "VENDAS") {
            exportData = dataRelatorios.vendas;
        }
       
        if (exportData.length === 0) {
            console.warn("Nenhum dado para exportar: " + tipo);
            return;
        }

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
        console.log("Exportacao de " + tipo + " concluida!");
    };

    const handleConfigurarCampanha = async (e) => {
        e.preventDefault();
       
        if (!supabase) {
            console.error("Erro: Supabase nao inicializado");
            return;
        }

        try {
            const { error } = await supabase
                .from('campanhas')
                .insert([{
                    id_lojista: LOJISTA_ID,
                    nome: configCampanha.nome,
                    data_inicio: configCampanha.dataInicio,
                    data_fim: configCampanha.dataFim,
                    status: 'ativa',
                    desconto_ativo: configCampanha.descontoAtivo,
                    cupom_ativo: configCampanha.cupomAtivo,
                }]);

            if (error) throw error;
           
            console.log("Campanha " + configCampanha.nome + " criada com sucesso!");
            fetchData();
        } catch (error) {
            console.error("Erro ao criar campanha:", error);
        }
    };

    const renderTableRow = (p, isConsultorPlataforma) => {
        if (isConsultorPlataforma) {
            return (
                <tr key={p.id}>
                    <td style={styles.td}><strong>{p.id}</strong></td>
                    <td style={styles.tdCenter}>{p.clientesAtendidos}</td>
                    <td style={styles.tdRight}>R$ {p.vendasGeradas.toLocaleString('pt-BR')}</td>
                    <td style={styles.tdRight}>R$ {p.comissao.toLocaleString('pt-BR')}</td>
                </tr>
            );
        }
        return (
            <tr key={p.id}>
                <td style={styles.td}>
                    <span>{p.nome}</span>
                    <br/>
                    <small>{p.id}</small>
                </td>
                <td style={styles.tdCenter}>{p.clientesAtendidos}</td>
                <td style={styles.tdRight}>R$ {p.vendasGeradas.toLocaleString('pt-BR')}</td>
                <td style={styles.tdRight}>R$ {p.comissao.toLocaleString('pt-BR')}</td>
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
                                <th style={styles.th}>{isConsultorPlataforma ? 'Consultor ID' : 'Vendedor'}</th>
                                <th style={styles.thCenter}>Clientes</th>
                                <th style={styles.thRight}>Vendas</th>
                                <th style={styles.thRight}>Comissao</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(p => renderTableRow(p, isConsultorPlataforma))}
                            <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                                <td style={styles.td}>TOTAL</td>
                                <td style={styles.tdCenter}>{totalClientes}</td>
                                <td style={styles.tdRight}>R$ {totalVendas.toLocaleString('pt-BR')}</td>
                                <td style={styles.tdRight}>R$ {totalComissao.toLocaleString('pt-BR')}</td>
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
                <h2 style={styles.cardTitleRed}>Campanha Inativa - Compre Destaque!</h2>
                <div style={styles.centerBox}>
                    <p style={styles.promptText}>
                        Sua campanha de destaque esta inativa. Adquira dias de destaque para ativar este recurso.
                    </p>
                    <a
                        href={STRIPE_PURCHASE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.stripeButton}
                    >
                        Comprar Dias de Campanha Agora
                    </a>
                </div>
            </div>
        );
    };

    const renderCampaignConfiguration = () => {
        const remainingDays = boughtCampaign.remainingDays;
        const descontoTexto = configCampanha.descontoAtivo ? boughtCampaign.baseDiscount + "% Ativo" : "NAO";
        const cupomTexto = configCampanha.cupomAtivo ? "SIM" : "NAO";
        const tituloCard = configCampanha.nome ? "Campanha Ativa" : "Configurar Campanha";
        const descontoStatusColor = configCampanha.descontoAtivo ? '#2e7d32' : '#dc3545';
        const cupomStatusColor = configCampanha.cupomAtivo ? '#2e7d32' : '#dc3545';
        
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
                        <strong>Data Inicio:</strong> <span style={styles.summaryValue}>{configCampanha.dataInicio || '--'}</span>
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
                            placeholder="Ex: Mes do Cliente 2025"
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.dateGrid}>
                        <div>
                            <label style={styles.label}>Data Inicio:</label>
                            <input
                                type="date"
                                value={configCampanha.dataInicio}
                                onChange={(e) => setConfigCampanha({...configCampanha, dataInicio: e.target.value})}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div>
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
                            <span>Desconto Base ({boughtCampaign.baseDiscount}%): </span>
                            <strong style={{ color: descontoStatusColor }}>
                                {configCampanha.descontoAtivo ? 'ATIVO' : 'INATIVO'}
                            </strong>
                        </label>
                        <label style={styles.checkboxLabel}>       
                            <input
                                type="checkbox"
                                checked={configCampanha.cupomAtivo}
                                onChange={(e) => setConfigCampanha({...configCampanha, cupomAtivo: e.target.checked})}
                            />
                            <span>Cupom Condicional: </span>
                            <strong style={{ color: cupomStatusColor }}>
                                {configCampanha.cupomAtivo ? 'ATIVO' : 'INATIVO'}
                            </strong>
                        </label>
                    </div>
                    <button type="submit" style={styles.button}>
                        Salvar e Ativar Campanha
                    </button>
                </form>
            </div>
        );
    };

    const showCampaignConfig = boughtCampaign.isPaid && boughtCampaign.remainingDays > 0;

    return (
        <div style={styles.container}>
            <h1>Relatorios e Campanhas</h1>
           
            <div style={styles.filters}>
                <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} disabled={loading}>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                </select>

                <select onChange={(e) => handleExport(e.target.value)} defaultValue="" disabled={loading}>
                    <option value="" disabled>Exportar...</option>
                    <option value="TUDO">Todos os Dados</option>
                    <option value="VENDEDORES">Vendedores</option>
                    <option value="CONSULTORES">Consultores</option>
                    <option value="CAMPANHAS">Campanhas</option>
                    <option value="VENDAS">Vendas</option>
                </select>
            </div>

            {loading && (
                <div style={styles.loading}>Carregando...</div>
            )}

            {!loading && (
                <div>
                    <div style={styles.grid}>
                        {renderPerformanceTable("Vendedores", dataRelatorios.vendedores, false)}
                        {renderPerformanceTable("Consultores", dataRelatorios.consultores, true)}
                    </div>

                    <div style={styles.gridSingle}>
                        {showCampaignConfig ? renderCampaignConfiguration() : renderBuyCampaignPrompt()}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { 
        padding: "30px", 
        fontFamily: "Inter, sans-serif" 
    },
    filters: { 
        display: "flex", 
        gap: "20px", 
        marginBottom: "30px" 
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
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
    },
    cardTitle: { 
        color: "#2c5aa0", 
        marginBottom: "20px" 
    },
    cardTitleRed: { 
        color: "#dc3545", 
        marginBottom: "20px" 
    },
    cardTitleGreen: { 
        color: "#2e7d32", 
        marginBottom: "20px" 
    },
    table: { 
        width: "100%", 
        borderCollapse: "collapse" 
    },
    th: { 
        padding: "12px", 
        textAlign: "left", 
        borderBottom: "2px solid #ddd" 
    },
    thCenter: { 
        padding: "12px", 
        textAlign: "center", 
        borderBottom: "2px solid #ddd" 
    },
    thRight: { 
        padding: "12px", 
        textAlign: "right", 
        borderBottom: "2px solid #ddd" 
    },
    td: { 
        padding: "12px", 
        borderBottom: "1px solid #eee" 
    },
    tdCenter: { 
        padding: "12px", 
        textAlign: "center", 
        borderBottom: "1px solid #eee" 
    },
    tdRight: { 
        padding: "12px", 
        textAlign: "right", 
        borderBottom: "1px solid #eee" 
    },
    loading: { 
        textAlign: 'center', 
        padding: '50px', 
        color: '#666' 
    },
    noData: { 
        textAlign: 'center', 
        padding: '50px', 
        color: '#999' 
    },
    input: { 
        width: "100%", 
        padding: "10px", 
        margin: "10px 0", 
        borderRadius: "4px", 
        border: "1px solid #ddd", 
        boxSizing: "border-box" 
    },
    button: { 
        padding: "12px 30px", 
        backgroundColor: "#2e7d32", 
        color: "white", 
        border: "none", 
        borderRadius: "5px", 
        cursor: "pointer", 
        fontWeight: "bold" 
    },
    stripeButton: { 
        padding: "12px 30px", 
        backgroundColor: STRIPE_COLOR, 
        color: "white", 
        border: "none", 
        borderRadius: "5px", 
        cursor: "pointer", 
        textDecoration: "none", 
        display: "inline-block" 
    },
    summaryBox: {
        padding: '15px',
        backgroundColor: '#e3f2fd',
        border: '1px solid #1565c0',
        borderRadius: '4px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
    },
    summaryItem: {
        margin: '0',
        fontSize: '0.9rem'
    },
    summaryValue: {
        fontWeight: 'normal',
        color: '#333'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    dateGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '15px'
    },
    checkboxGroup: {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    centerBox: {
        padding: '20px',
        textAlign: 'center'
    },
    promptText: {
        fontSize: '1.1rem',
        marginBottom: '20px'
    }
};

export default LojistaRelatorios;