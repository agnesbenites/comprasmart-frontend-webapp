// src/pages/VendedorDashboard/pages/VendedorDashboard.jsx
// VERSAO ATUALIZADA - Com Schedule e Status de Vendas

import React, { useState } from "react";
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

// Importar o GerenciadorPedidos da pasta shared
import GerenciadorPedidos from "../../../shared/components/GerenciadorPedidos";

// Importar Schedule (igual ao consultor) e Status de Vendas
import StatusVendasVendedor from "../components/StatusVendasVendedor";
import SchedulePanel from "../../ConsultorDashboard/components/SchedulePanel";

// Importar ArenaVendasPainel do ConsultorDashboard
import ArenaVendasPainel from "../../ConsultorDashboard/components/ArenaVendasPainel";
import { User } from '@phosphor-icons/react';

// =============================================================
// === CORES E CONSTANTES ===
// =============================================================
const VENDOR_PRIMARY = "#2f0d51";
const VENDOR_PRIMARY_DARK = "#2f0d51";
const VENDOR_SECONDARY = "#f8f9fa";
const VENDOR_LIGHT_BG = "#eaf2ff";

// === DADOS DE NAVEGACAO DO VENDEDOR (SIDEBAR) ===
const VENDEDOR_MENU_ITEMS = [
    { title: "Dashboard", rota: "/vendedor/dashboard", icon: "&#127968;", destaque: false },
    { title: "Pedidos", rota: "/vendedor/dashboard/pedidos", icon: "&#128230;", destaque: true },
    { title: "Status Vendas", rota: "/vendedor/dashboard/status", icon: "&#128202;", destaque: false },
    { title: "Atendimento", rota: "/vendedor/dashboard/atendimento", icon: "&#128172;", destaque: false },
    { title: "Agenda", rota: "/vendedor/dashboard/agenda", icon: "&#128197;", destaque: false },
    { title: "Integrar Venda", rota: "/vendedor/dashboard/integracao", icon: "&#128179;", destaque: false },
    { title: "Meus Clientes", rota: "/vendedor/dashboard/clientes", icon: "&#128101;", destaque: false },
    { title: "Catalogo", rota: "/vendedor/dashboard/produtos", icon: "&#128722;", destaque: false },
    { title: "Relatorios", rota: "/vendedor/dashboard/relatorio", icon: "&#128202;", destaque: false },
    { title: "Treinamentos", rota: "/vendedor/dashboard/treinamentos", icon: "&#127891;", destaque: false },
    { title: "Report", rota: "/vendedor/dashboard/report", icon: "&#128221;", destaque: false },
    { title: " Arena de Vendas", rota: "/vendedor/dashboard/arena", icon: "", destaque: false },
];

// === DADOS MOCKADOS DE CAMPANHAS ===
const MOCK_CAMPAIGNS_VENDEDOR = [
    { id: 1, loja: "Loja Central - Shopping Ibirapuera", nome: "Black Friday Antecipada", validade: "Ate 30/11", destaque: true, cor: VENDOR_PRIMARY },
    { id: 2, loja: "Loja Central - Shopping Ibirapuera", nome: "Cashback em Eletros", validade: "Ate 15/12", destaque: false, cor: "#bb25a6" },
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
            titulo: "Pedidos",
            descricao: "Gerenciar pedidos e separacao",
            cor: "#ffc107",
            rota: "/vendedor/dashboard/pedidos",
            icon: "&#128230;"
        },
        {
            titulo: "Status Vendas",
            descricao: "Acompanhar pagamentos e entregas",
            cor: "#bb25a6",
            rota: "/vendedor/dashboard/status",
            icon: "&#128202;"
        },
        {
            titulo: "Novo Atendimento",
            descricao: "Atender cliente na minha loja",
            cor: VENDOR_PRIMARY,
            rota: "/vendedor/dashboard/atendimento",
            icon: "&#128172;"
        },
        {
            titulo: "Agenda",
            descricao: "Ver agendamentos de clientes",
            cor: "#6f42c1",
            rota: "/vendedor/dashboard/agenda",
            icon: "&#128197;"
        },
        {
            titulo: "Integrar Venda",
            descricao: "Finalizar venda no caixa",
            cor: "#bb25a6",
            rota: "/vendedor/dashboard/integracao",
            icon: "&#128179;"
        },
        {
            titulo: "Performance",
            descricao: "Acompanhar desempenho e metas",
            cor: "#dc3545",
            rota: "/vendedor/dashboard/relatorio",
            icon: "&#128200;"
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
                                Atendo presencial ou remoto conforme acordo
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
                            Salario Fixo + Bonus
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
                <div style={vendedorStyles.metricCard("#e8f5e8", "#bb25a6")}>
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
                            style={vendedorStyles.fastAccessCard}
                            onClick={() => navigate(atalho.rota)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                                <span dangerouslySetInnerHTML={{ __html: atalho.icon }} />
                            </div>
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
// === PAGINAS PLACEHOLDER ===
// =============================================================
const VendedorClientesPage = () => (
    <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "10px" }}>
        <h2 style={{ color: VENDOR_PRIMARY }}>Meus Clientes</h2>
        <p>Lista de clientes atendidos na loja.</p>
    </div>
);

const VendedorProdutosPage = () => (
    <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "10px" }}>
        <h2 style={{ color: VENDOR_PRIMARY }}>Catalogo da Loja</h2>
        <p>Produtos disponiveis para venda na sua loja.</p>
    </div>
);

// =============================================================
// === LAYOUT DO DASHBOARD ===
// =============================================================
const VENDEDOR_MOBILE_PRIORITY = [
    "/vendedor/dashboard",
    "/vendedor/dashboard/pedidos",
    "/vendedor/dashboard/atendimento",
    "/vendedor/dashboard/status",
    "/vendedor/dashboard/profile",
];

const VendedorDashboardLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const vendedorNome = localStorage.getItem("vendedorNome") || "Vendedor";
    const [menuAberto, setMenuAberto] = useState(false);

    const isMobilePriority = VENDEDOR_MOBILE_PRIORITY.some(r =>
        currentPath === r || currentPath.startsWith(r + "/")
    );

    const getMenuItemStyle = (item) => {
        const rota = item.rota;
        const isExactMatch = rota === currentPath;
        const isPrefixMatch = currentPath.startsWith(rota + "/");
        let isActive = false;
        if (rota === "/vendedor/dashboard") {
            isActive = isExactMatch;
        } else {
            isActive = isExactMatch || isPrefixMatch;
        }
        if (item.destaque) {
            return isActive ? sidebarStyles.menuItemDestaqueActive : sidebarStyles.menuItemDestaque;
        }
        return isActive ? sidebarStyles.menuItemActive : sidebarStyles.menuItem;
    };

    return (
        <div style={sidebarStyles.dashboardContainer}>

            {/* OVERLAY mobile */}
            {menuAberto && (
                <div
                    onClick={() => setMenuAberto(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 20 }}
                />
            )}

            {/* SIDEBAR */}
            <div style={{
                ...sidebarStyles.sidebar,
                position: menuAberto ? 'fixed' : 'relative',
                top: 0, left: 0,
                height: menuAberto ? '100vh' : undefined,
                zIndex: 30,
                overflowY: 'auto',
            }} className={`vendedor-sidebar${menuAberto ? ' sidebar-open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 0' }}>
                    <h2 style={{ ...sidebarStyles.logoTitle, padding: 0, borderBottom: 'none', marginBottom: '10px' }}>Kaslee</h2>
                    <button
                        onClick={() => setMenuAberto(false)}
                        className="sidebar-close-btn"
                        style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#999' }}
                    >✕</button>
                </div>
                <nav>
                    {VENDEDOR_MENU_ITEMS.map((item) => (
                        <Link key={item.rota} to={item.rota} style={getMenuItemStyle(item)} onClick={() => setMenuAberto(false)}>
                            <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ marginRight: "10px" }} />
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        to="/vendedor/dashboard/profile"
                        style={getMenuItemStyle({ rota: "/vendedor/dashboard/profile", destaque: false })}
                        onClick={() => setMenuAberto(false)}
                    >
                        <span dangerouslySetInnerHTML={{ __html: "&#128100;" }} style={{ marginRight: "10px" }} />
                        Meu Perfil
                    </Link>
                </nav>
            </div>

            <main style={{ ...sidebarStyles.mainContent, minWidth: 0 }}>
                <header style={{ ...sidebarStyles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setMenuAberto(true)}
                            className="hamburger-btn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '4px', padding: '4px' }}
                        >
                            <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
                            <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
                            <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
                        </button>
                        <div>
                            <h1 style={sidebarStyles.headerTitle}>Dashboard Vendedor</h1>
                            <p style={sidebarStyles.headerSubtitle}>Bem-vindo, {vendedorNome}</p>
                        </div>
                    </div>
                    <Link to="/vendedor/dashboard/profile" style={sidebarStyles.profileButton} onClick={() => setMenuAberto(false)}>
                        <span style={sidebarStyles.profileName}>
                            <User size={20} weight="duotone" color="currentColor" /> Meu Perfil
                        </span>
                    </Link>
                </header>

                {!isMobilePriority && (
                    <div className="mobile-banner" style={{ backgroundColor: '#fffbeb', borderBottom: '1px solid #fcd34d', padding: '8px 16px', fontSize: '0.8rem', color: '#92400e' }}>
                        💻 Esta tela é melhor no computador. No celular, use: Pedidos, Atendimento e Status.
                    </div>
                )}

                <div style={{ padding: "20px" }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// =============================================================
// === ESTILOS DO SIDEBAR ===
// =============================================================
const sidebarStyles = {
    dashboardContainer: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f7f9",
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
        fontSize: "1.4rem",
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
    menuItemDestaque: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        color: "#fff",
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: "15px",
        borderLeft: "3px solid #ffc107",
        backgroundColor: "#ffc107",
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        marginBottom: "5px",
        fontWeight: "600",
    },
    menuItemDestaqueActive: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#e6ac00",
        color: "#fff",
        fontWeight: "700",
        borderLeft: "3px solid #cc9900",
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
};

// =============================================================
// === ESTILOS DO VENDEDOR HOME ===
// =============================================================
const vendedorStyles = {
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
        border: performance >= 80 ? "2px solid #bb25a6" : "2px solid #ffc107"
    }),
    performanceLabel: {
        fontSize: "12px",
        color: "#666",
        marginBottom: "5px"
    },
    performanceValue: (performance) => ({
        fontSize: "24px",
        fontWeight: "bold",
        color: performance >= 80 ? "#bb25a6" : "#ffc107",
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
    // Simulando dados do usuário (em produção, viria do contexto de autenticação)
    const user = { id: "vendedor-123" };
    const lojaVinculada = { id: "loja-456" };

    return (
        <Routes>
            <Route path="/" element={<VendedorDashboardLayout />}>
                {/* Rota index */}
                <Route index element={<VendedorHomePanel />} />
                
                {/* Rota /vendedor/dashboard */}
                <Route path="dashboard" element={<VendedorHomePanel />} />
                
                {/* Sub-rotas */}
                <Route path="dashboard/pedidos" element={<GerenciadorPedidos tipoUsuario="vendedor" />} />
                <Route path="dashboard/status" element={<StatusVendasVendedor />} />
                <Route path="dashboard/atendimento" element={<VendedorAtendimentoPage />} />
                <Route path="dashboard/agenda" element={<SchedulePanel tipoUsuario="vendedor" />} />
                <Route path="dashboard/integracao" element={<IntegracaoVenda />} />
                <Route path="dashboard/clientes" element={<VendedorClientesPage />} />
                <Route path="dashboard/produtos" element={<VendedorProdutosPage />} />
                <Route path="dashboard/relatorio" element={<RelatorioPageVendedor />} />
                <Route path="dashboard/treinamentos" element={<TrainingPanel />} />
                <Route path="dashboard/report" element={<ReportPanel />} />
                <Route path="dashboard/profile" element={<VendedorProfile />} />
                <Route
                    path="dashboard/arena"
                    element={
                        <ArenaVendasPainel
                            consultorId={user?.id}
                            lojaId={lojaVinculada?.id || null}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}