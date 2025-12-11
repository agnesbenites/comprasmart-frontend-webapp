// src/pages/VendedorDashboard/pages/VendedorDashboard.jsx
// VERSAO CORRIGIDA - Com Integracao de Venda

import React from "react";
import { Routes, Route, Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// =============================================================
// === IMPORTACOES DOS COMPONENTES/PAGINAS REAIS ===
// =============================================================
import VendedorAtendimentoPage from "./VendedorAtendimentoPage";
import VendedorProfile from "./VendedorProfile";

// Importar o RelatorioPageVendedor da pasta components
import RelatorioPageVendedor from "../components/RelatorioPageVendedor";

// Importar o TrainingPanel do Consultor (igual)
import TrainingPanel from "../../ConsultorDashboard/components/TrainingPanel";

// Importar o ReportPanel da pasta components do Vendedor
import ReportPanel from "../components/ReportPanel";

// Importar a pagina de Integracao de Venda do Lojista (compartilhada)
import IntegracaoVenda from "../../LojistaDashboard/pages/IntegracaoVenda";

// =============================================================
// === CORES E CONSTANTES ===
// =============================================================
const VENDOR_PRIMARY = "#4a6fa5";
const VENDOR_PRIMARY_DARK = "#2c3e50";
const VENDOR_SECONDARY = "#f8f9fa";
const VENDOR_LIGHT_BG = "#eaf2ff";

// === DADOS DE NAVEGACAO DO VENDEDOR (SIDEBAR) ===
const VENDEDOR_MENU_ITEMS = [
    { title: "Dashboard", rota: "/vendedor/dashboard", icon: "&#127968;" },
    { title: "Atendimento", rota: "/vendedor/dashboard/atendimento", icon: "&#128172;" },
    { title: "Integrar Venda", rota: "/vendedor/dashboard/integracao", icon: "&#128179;" },
    { title: "Meus Clientes", rota: "/vendedor/dashboard/clientes", icon: "&#128101;" },
    { title: "Catalogo", rota: "/vendedor/dashboard/produtos", icon: "&#128230;" },
    { title: "Relatorios", rota: "/vendedor/dashboard/relatorio", icon: "&#128202;" },
    { title: "Treinamentos", rota: "/vendedor/dashboard/treinamentos", icon: "&#127891;" },
    { title: "Report", rota: "/vendedor/dashboard/report", icon: "&#128221;" },
];

// === DADOS MOCKADOS DE CAMPANHAS ===
const MOCK_CAMPAIGNS_VENDEDOR = [
    { id: 1, loja: "Loja Central - Shopping Ibirapuera", nome: "Black Friday Antecipada", validade: "Ate 30/11", destaque: true, cor: VENDOR_PRIMARY },
    { id: 2, loja: "Loja Central - Shopping Ibirapuera", nome: "Cashback em Eletros", validade: "Ate 15/12", destaque: false, cor: "#17a2b8" },
];

// =============================================================
// === VENDEDOR HOME PANEL ===
// =============================================================
export const VendedorHomePanel = () => {
    const navigate = useNavigate();

    const vendedorInfo = {
        nome: "Ana Vendedora",
        setores: ["Moveis", "Brinquedos", "Eletrodomesticos"],
        loja: "Loja Central - Shopping Ibirapuera",
        metaMensal: 50,
        vendasRealizadas: 32,
        clientesAtendidos: 15,
        performance: 85,
        comissaoAcumulada: 4200.75,
    };

    const campanhasAtivas = MOCK_CAMPAIGNS_VENDEDOR;

    const atalhos = [
        {
            titulo: "Novo Atendimento",
            descricao: "Atender cliente na minha loja",
            cor: VENDOR_PRIMARY,
            rota: "/vendedor/dashboard/atendimento",
            icon: "&#128172;"
        },
        {
            titulo: "Integrar Venda",
            descricao: "Finalizar venda no caixa",
            cor: "#28a745",
            rota: "/vendedor/dashboard/integracao",
            icon: "&#128179;"
        },
        {
            titulo: "Catalogo da Loja",
            descricao: "Ver produtos disponiveis",
            cor: "#17a2b8",
            rota: "/vendedor/dashboard/produtos",
            icon: "&#128230;"
        },
        {
            titulo: "Performance",
            descricao: "Acompanhar desempenho e metas",
            cor: "#fd7e14",
            rota: "/vendedor/dashboard/relatorio",
            icon: "&#128202;"
        }
    ];

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Cabecalho Pessoal */}
            <div style={vendedorStyles.vendedorHeaderCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 style={{ color: VENDOR_PRIMARY, margin: "0 0 5px 0" }}>
                            Ola, {vendedorInfo.nome}!
                        </h1>
                        <p style={{ color: "#666", margin: "0 0 15px 0" }}>
                            <strong>Vendedor Vinculado</strong> - {vendedorInfo.loja}
                        </p>

                        <div style={{ marginBottom: "15px" }}>
                            <h3 style={vendedorStyles.setoresTitle}>
                                Setores da Minha Loja:
                            </h3>
                            <div style={vendedorStyles.setoresContainer}>
                                {vendedorInfo.setores.map((setor, index) => (
                                    <span key={index} style={vendedorStyles.setorBadge}>
                                        {setor}
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: "10px", color: "#666", fontSize: "0.9rem" }}>
                                Atendo apenas esta loja
                            </div>
                        </div>
                    </div>

                    <div style={vendedorStyles.performanceBox(vendedorInfo.performance)}>
                        <div style={vendedorStyles.performanceLabel}>
                            Performance da Loja
                        </div>
                        <div style={vendedorStyles.performanceValue(vendedorInfo.performance)}>
                            {vendedorInfo.performance}%
                        </div>
                        <div style={vendedorStyles.comissaoPequena}>
                            Comissao: R$ {vendedorInfo.comissaoAcumulada.toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Campanhas da Loja */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={vendedorStyles.sectionTitle}>
                    Campanhas da {vendedorInfo.loja.split(' - ')[0]}
                </h2>
                <div style={vendedorStyles.campaignsGrid}>
                    {campanhasAtivas.map(campanha => (
                        <div
                            key={campanha.id}
                            style={{ ...vendedorStyles.campaignCard, borderLeft: `4px solid ${campanha.cor}` }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: campanha.cor, fontSize: "1.1rem" }}>
                                        {campanha.nome}
                                    </h4>
                                    <p style={{ margin: '5px 0 0 0', fontSize: "0.9rem", color: '#666' }}>
                                        Minha Loja
                                    </p>
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                    {campanha.validade}
                                </span>
                            </div>
                            {campanha.destaque && (
                                <span style={vendedorStyles.campaignTag}>Destaque</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Metricas Rapidas */}
            <div style={vendedorStyles.metricsGrid}>
                <div style={vendedorStyles.metricCard("#e8f5e8", "#28a745")}>
                    <h3 style={vendedorStyles.metricTitle("#155724")}>Vendas do Mes</h3>
                    <p style={vendedorStyles.metricValue("#155724")}>
                        {vendedorInfo.vendasRealizadas}/{vendedorInfo.metaMensal}
                    </p>
                </div>

                <div style={vendedorStyles.metricCard("#e3f2fd", "#2196f3")}>
                    <h3 style={vendedorStyles.metricTitle("#0d47a1")}>Clientes Atendidos</h3>
                    <p style={vendedorStyles.metricValue("#0d47a1")}>
                        {vendedorInfo.clientesAtendidos}
                    </p>
                </div>

                <div style={vendedorStyles.metricCard("#fff3cd", "#ffc107")}>
                    <h3 style={vendedorStyles.metricTitle("#856404")}>Faltam para Meta</h3>
                    <p style={vendedorStyles.metricValue("#856404")}>
                        {vendedorInfo.metaMensal - vendedorInfo.vendasRealizadas} Vendas
                    </p>
                </div>

                <div style={vendedorStyles.metricCard("#eaf2ff", VENDOR_PRIMARY)}>
                    <h3 style={vendedorStyles.metricTitle(VENDOR_PRIMARY_DARK)}>Performance</h3>
                    <p style={vendedorStyles.metricValue(VENDOR_PRIMARY_DARK)}>
                        {vendedorInfo.performance}%
                    </p>
                </div>
            </div>

            {/* Atalhos Rapidos */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={vendedorStyles.sectionTitle}>Acesso Rapido</h2>
                <div style={vendedorStyles.fastAccessGrid}>
                    {atalhos.map((atalho, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(atalho.rota)}
                            style={{ ...vendedorStyles.fastAccessCard, borderLeft: `4px solid ${atalho.cor}`, cursor: 'pointer' }}
                        >
                            <div 
                                style={{ fontSize: "2rem", marginBottom: "10px" }}
                                dangerouslySetInnerHTML={{ __html: atalho.icon }}
                            />
                            <h3 style={{ ...vendedorStyles.fastAccessTitle, color: atalho.cor }}>
                                {atalho.titulo}
                            </h3>
                            <p style={vendedorStyles.fastAccessDescription}>
                                {atalho.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// =============================================================
// === PAGINAS PLACEHOLDER (para as que nao existem ainda) ===
// =============================================================
const VendedorClientesPage = () => (
    <div style={{ padding: "30px", backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: VENDOR_PRIMARY, fontSize: '2rem', marginBottom: '10px' }}>Meus Clientes</h1>
        <p style={{ color: '#6c757d' }}>Lista de clientes atendidos.</p>
    </div>
);

const VendedorProdutosPage = () => (
    <div style={{ padding: "30px", backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: VENDOR_PRIMARY, fontSize: '2rem', marginBottom: '10px' }}>Catalogo de Produtos</h1>
        <p style={{ color: '#6c757d' }}>Produtos disponiveis na loja.</p>
    </div>
);

// =============================================================
// === COMPONENTE LAYOUT DO VENDEDOR ===
// =============================================================
const VendedorDashboardLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const userName = localStorage.getItem("userName") || "Ana Vendedora";

    const getMenuItemStyle = (rota) => {
        const isExactMatch = rota === currentPath;
        const isPrefixMatch = currentPath.startsWith(rota + "/");

        let isActive = false;

        if (rota === "/vendedor/dashboard") {
            isActive = isExactMatch;
        } else {
            isActive = isExactMatch || isPrefixMatch;
        }

        return isActive ? vendedorStyles.menuItemActive : vendedorStyles.menuItem;
    };

    return (
        <div style={vendedorStyles.dashboardContainer}>
            <div style={vendedorStyles.sidebar}>
                <h2 style={vendedorStyles.logoTitle}>Smart Seller</h2>

                <nav>
                    {VENDEDOR_MENU_ITEMS.map((item) => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            style={getMenuItemStyle(item.rota)}
                        >
                            <span 
                                style={{ marginRight: "8px" }}
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                            />
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        to="/vendedor/dashboard/profile"
                        style={getMenuItemStyle("/vendedor/dashboard/profile")}
                    >
                        <span style={{ marginRight: "8px" }}>&#128100;</span>
                        Meu Perfil
                    </Link>
                </nav>
            </div>

            <main style={vendedorStyles.mainContent}>
                <header style={vendedorStyles.header}>
                    <div>
                        <h1 style={vendedorStyles.headerTitle}>Painel do Vendedor</h1>
                        <p style={vendedorStyles.headerSubtitle}>
                            Bem-vindo(a), {userName} | <strong>Vendedor Vinculado</strong> - Atende apenas uma loja
                        </p>
                    </div>
                    <Link
                        to="/vendedor/dashboard/profile"
                        style={vendedorStyles.profileButton}
                    >
                        <span style={vendedorStyles.profileName}>Meu Perfil</span>
                    </Link>
                </header>

                <div style={{ padding: '20px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// =============================================================
// === ESTILOS DO VENDEDOR ===
// =============================================================
const vendedorStyles = {
    dashboardContainer: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: VENDOR_SECONDARY,
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#FFFFFF",
        color: "#333",
        paddingTop: "20px",
        flexShrink: 0,
        boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
    },
    logoTitle: {
        fontSize: "1.5rem",
        padding: "10px 20px 30px",
        textAlign: "center",
        borderBottom: "1px solid #eee",
        fontWeight: "bold",
        color: VENDOR_PRIMARY,
    },
    menuItem: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        color: VENDOR_PRIMARY,
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: "15px",
        borderLeft: "3px solid transparent",
        backgroundColor: VENDOR_LIGHT_BG,
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        marginBottom: "5px",
    },
    menuItemActive: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#FFFFFF",
        color: VENDOR_PRIMARY,
        fontWeight: "700",
        borderLeft: `3px solid ${VENDOR_PRIMARY}`,
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        marginBottom: "5px",
        textDecoration: "none",
    },
    mainContent: {
        flexGrow: 1,
        width: "calc(100% - 250px)",
        overflowY: "auto",
    },
    header: {
        backgroundColor: "white",
        padding: "20px 30px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    headerTitle: {
        fontSize: "1.5rem",
        color: VENDOR_PRIMARY,
        margin: 0,
        fontWeight: "600",
    },
    headerSubtitle: {
        fontSize: "0.9rem",
        color: "#6c757d",
        margin: "5px 0 0 0",
    },
    profileButton: {
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: VENDOR_PRIMARY,
        gap: "10px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: `2px solid ${VENDOR_LIGHT_BG}`,
        backgroundColor: "white",
        transition: "all 0.3s ease",
        fontWeight: "600",
    },
    profileName: {
        fontSize: "1rem",
    },
    vendedorHeaderCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "25px"
    },
    setoresTitle: {
        color: VENDOR_PRIMARY,
        margin: "0 0 10px 0",
        fontSize: "16px"
    },
    setoresContainer: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },
    setorBadge: {
        backgroundColor: VENDOR_LIGHT_BG,
        color: VENDOR_PRIMARY_DARK,
        padding: "8px 15px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "500",
        border: `1px solid ${VENDOR_PRIMARY}33`
    },
    performanceBox: (performance) => ({
        textAlign: "center",
        backgroundColor: performance >= 80 ? "#e8f5e8" : "#fff3cd",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "150px",
        border: performance >= 80 ? "2px solid #28a745" : "2px solid #ffc107"
    }),
    performanceLabel: {
        fontSize: "12px",
        color: "#666",
        marginBottom: "5px"
    },
    performanceValue: (performance) => ({
        fontSize: "24px",
        fontWeight: "bold",
        color: performance >= 80 ? "#28a745" : "#ffc107",
        margin: "0 0 10px 0"
    }),
    comissaoPequena: {
        fontSize: "11px",
        color: "#666",
        marginTop: "5px"
    },
    sectionTitle: {
        color: VENDOR_PRIMARY,
        marginBottom: "15px",
        fontSize: "1.5rem"
    },
    campaignsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "15px",
    },
    campaignCard: {
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        position: 'relative',
    },
    campaignTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ffc107',
        color: '#333',
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        fontWeight: 'bold',
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
    },
    metricCard: (bg, border) => ({
        backgroundColor: bg,
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        borderLeft: `4px solid ${border}`
    }),
    metricTitle: (color) => ({
        margin: "0 0 10px 0",
        color: color,
        fontSize: "14px"
    }),
    metricValue: (color) => ({
        fontSize: "24px",
        fontWeight: "bold",
        color: color,
        margin: 0
    }),
    fastAccessGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
    },
    fastAccessCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
    },
    fastAccessTitle: {
        margin: "0 0 10px 0",
        fontSize: "18px"
    },
    fastAccessDescription: {
        color: "#666",
        margin: 0,
        fontSize: "14px"
    }
};

// =============================================================
// === COMPONENTE PRINCIPAL COM ROTAS ===
// =============================================================
export default function VendedorDashboard() {
    return (
        <Routes>
            <Route path="/" element={<VendedorDashboardLayout />}>
                {/* Rota index */}
                <Route index element={<VendedorHomePanel />} />
                
                {/* Rota /vendedor/dashboard */}
                <Route path="dashboard" element={<VendedorHomePanel />} />
                
                {/* Sub-rotas */}
                <Route path="dashboard/atendimento" element={<VendedorAtendimentoPage />} />
                <Route path="dashboard/integracao" element={<IntegracaoVenda />} />
                <Route path="dashboard/clientes" element={<VendedorClientesPage />} />
                <Route path="dashboard/produtos" element={<VendedorProdutosPage />} />
                <Route path="dashboard/relatorio" element={<RelatorioPageVendedor />} />
                <Route path="dashboard/treinamentos" element={<TrainingPanel />} />
                <Route path="dashboard/report" element={<ReportPanel />} />
                <Route path="dashboard/profile" element={<VendedorProfile />} />
            </Route>
        </Routes>
    );
}