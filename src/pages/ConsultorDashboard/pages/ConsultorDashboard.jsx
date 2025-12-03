import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// === DADOS DE NAVEGAÇÃO DO CONSULTOR (SIDEBAR) ===
const CONSULTOR_MENU_ITEMS = [
    { title: "🏠 Home", icon: "🏠", rota: "/consultor/dashboard" },
    { title: "📞 Fila de Atendimento", icon: "📞", rota: "/consultor/dashboard/fila" },
    { title: "💬 Atendimento Ativo", icon: "💬", rota: "/consultor/dashboard/chat" },
    { title: "💰 Comissões", icon: "💰", rota: "/consultor/dashboard/analytics" }, // Foco em Comissões
    { title: "🏪 Minhas Lojas", icon: "🏪", rota: "/consultor/dashboard/lojas" }, // Gerenciamento das Lojas que atende
    { title: "👤 Perfil", icon: "👤", rota: "/consultor/dashboard/profile" },
];

// === CONSULTOR HOME PANEL (CONTEÚDO PRINCIPAL DO USUÁRIO) ===
export const ConsultorHomePanel = () => {
    const navigate = useNavigate();

    // Dados do consultor (fictícios)
    const consultorInfo = {
        nome: "Agnes Consultora",
        segmentos: ["Eletrodomésticos", "Tecnologia", "Móveis"],
        lojasAtendidas: 7,
        comissaoAcumulada: 12500.50,
        atendimentosMes: 45,
        ratingMedio: 4.8, 
    };

    const atalhos = [
        {
            titulo: "📞 Próximo da Fila",
            descricao: "Iniciar um novo atendimento da fila prioritária",
            cor: "#007bff",
            rota: "/consultor/dashboard/fila" 
        },
        {
            titulo: "🏪 Lojas Atendidas",
            descricao: "Gerenciar minhas lojas e configurar categorias",
            cor: "#28a745", 
            rota: "/consultor/dashboard/lojas" 
        },
        {
            titulo: "💰 Sacar Comissão",
            descricao: "Ver detalhes de comissão e solicitar saque",
            cor: "#ffc107",
            rota: "/consultor/dashboard/analytics" 
        },
        {
            titulo: "💬 Chat Ativo",
            descricao: "Acessar atendimentos em andamento",
            cor: "#17a2b8",
            rota: "/consultor/dashboard/chat" 
        }
    ];

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Cabeçalho Pessoal */}
            <div style={consultorStyles.consultorHeaderCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ color: "#2c5aa0", margin: "0 0 5px 0" }}>
                            🎯 Olá, {consultorInfo.nome}!
                        </h1>
                        <p style={{ color: "#666", margin: "0 0 15px 0" }}>
                            Segmentos de Atuação: {consultorInfo.segmentos.join(', ')}
                        </p>
                        
                        {/* Informação de Múltiplas Lojas */}
                        <div style={{ marginBottom: "15px" }}>
                            <h3 style={consultorStyles.infoTitle}>
                                🏪 Atendendo {consultorInfo.lojasAtendidas} Lojas no momento
                            </h3>
                            <button onClick={() => navigate("/consultor/dashboard/lojas")} style={consultorStyles.lojasButton}>
                                Ver Detalhes das Lojas
                            </button>
                        </div>
                    </div>
                    
                    {/* Comissionamento (Diferencial Consultor) */}
                    <div style={consultorStyles.comissaoBox}>
                        <div style={consultorStyles.comissaoLabel}>
                            Comissão Acumulada
                        </div>
                        <div style={consultorStyles.comissaoValue}>
                            R$ {consultorInfo.comissaoAcumulada.toFixed(2).replace('.', ',')}
                        </div>
                        <button onClick={() => navigate("/consultor/dashboard/analytics")} style={consultorStyles.sacarButton}>
                            Sacar Agora
                        </button>
                    </div>
                </div>
            </div>

            {/* Atalhos Rápidos */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={consultorStyles.sectionTitle}>🚀 Ações de Atendimento</h2>
                <div style={consultorStyles.fastAccessGrid}>
                    {atalhos.map((atalho, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(atalho.rota)}
                            style={{ ...consultorStyles.fastAccessCard, borderLeft: `4px solid ${atalho.cor}` }}
                        >
                            <h3 style={{ ...consultorStyles.fastAccessTitle, color: atalho.cor }}>
                                {atalho.titulo}
                            </h3>
                            <p style={consultorStyles.fastAccessDescription}>
                                {atalho.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Métricas Chave */}
            <div style={consultorStyles.metricsGrid}>
                {/* Métrica 1: Atendimentos */}
                <div style={consultorStyles.metricCard("#e3f2fd", "#007bff")}>
                    <h3 style={consultorStyles.metricTitle("#0d47a1")}>📞 Atendimentos (Mês)</h3>
                    <p style={consultorStyles.metricValue("#0d47a1")}>
                        {consultorInfo.atendimentosMes}
                    </p>
                </div>

                {/* Métrica 2: Rating */}
                <div style={consultorStyles.metricCard("#fff8e1", "#ffc107")}>
                    <h3 style={consultorStyles.metricTitle("#856404")}>⭐ Rating Médio</h3>
                    <p style={consultorStyles.metricValue("#856404")}>
                        {consultorInfo.ratingMedio} / 5.0
                    </p>
                </div>

                {/* Métrica 3: Lojas Ativas */}
                <div style={consultorStyles.metricCard("#e6fffb", "#17a2b8")}>
                    <h3 style={consultorStyles.metricTitle("#004d40")}>🏪 Lojas Ativas</h3>
                    <p style={consultorStyles.metricValue("#004d40")}>
                        {consultorInfo.lojasAtendidas}
                    </p>
                </div>
            </div>
        </div>
    );
};

// === COMPONENTE LAYOUT DO CONSULTOR (WRAPER COM SIDEBAR E OUTLET) ===
const ConsultorDashboardLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const userName = localStorage.getItem("userName") || "Agnes Consultora";

    // Lógica de rota ativa
    const getMenuItemStyle = (rota) => {
        const isExactMatch = rota === currentPath;
        const isPrefixMatch = currentPath.startsWith(rota + "/");

        let isActive = false;

        if (rota === "/consultor/dashboard") {
            isActive = isExactMatch;
        } else {
            isActive = isExactMatch || isPrefixMatch;
        }

        return isActive
            ? consultorStyles.menuItemActive
            : consultorStyles.menuItem;
    };

    return (
        <div style={consultorStyles.dashboardContainer}>
            <div style={consultorStyles.sidebar}>
                <h2 style={consultorStyles.logoTitle}>Consultor Autônomo</h2>

                <nav>
                    {CONSULTOR_MENU_ITEMS.map((item) => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            style={getMenuItemStyle(item.rota)}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <main style={consultorStyles.mainContent}>
                <header style={consultorStyles.header}>
                    <div>
                        <h1 style={consultorStyles.headerTitle}>Painel do Consultor</h1>
                        <p style={consultorStyles.headerSubtitle}>
                            Bem-vindo(a), {userName}
                        </p>
                    </div>
                    <Link
                        to="/consultor/dashboard/profile"
                        style={consultorStyles.profileButton}
                    >
                        <span style={consultorStyles.profileName}>👤 Meu Perfil</span>
                    </Link>
                </header>

                <div style={{ padding: '20px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// Estilos do Consultor
const CONSULTOR_PRIMARY = "#2c5aa0"; // Azul corporativo
const CONSULTOR_SECONDARY = "#f4f7f9"; // Fundo da área de trabalho

const consultorStyles = {
    dashboardContainer: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: CONSULTOR_SECONDARY,
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
        color: CONSULTOR_PRIMARY,
    },
    menuItem: {
        display: "block",
        padding: "12px 20px",
        color: CONSULTOR_PRIMARY,
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: "15px",
        borderLeft: "3px solid transparent",
        backgroundColor: "#eaf2ff", // Azul claro (padrão)
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        ":hover": {
            backgroundColor: "#d0e4ff",
            color: "#1c3d73",
        },
    },
    menuItemActive: {
        backgroundColor: "#FFFFFF",
        color: CONSULTOR_PRIMARY,
        fontWeight: "700",
        borderLeft: `3px solid ${CONSULTOR_PRIMARY}`,
        borderRadius: "0 50px 50px 0",
        marginRight: "20px",
        padding: "12px 20px", // Garantir o mesmo padding
        display: "block", // Garantir que seja bloco
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
        color: CONSULTOR_PRIMARY,
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
        color: CONSULTOR_PRIMARY,
        gap: "10px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "2px solid #eaf2ff", // Borda sutil
        backgroundColor: "white",
        transition: "all 0.3s ease",
        fontWeight: "600",
        ":hover": {
            backgroundColor: "#eaf2ff",
            color: CONSULTOR_PRIMARY,
        },
    },
    profileName: {
        fontSize: "1rem",
    },
    // Estilos do Home Panel
    consultorHeaderCard: { 
        backgroundColor: "white", 
        padding: "25px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "25px"
    },
    infoTitle: {
        color: "#666", 
        margin: "0 0 10px 0", 
        fontSize: "16px"
    },
    lojasButton: {
        backgroundColor: "#17a2b8",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    comissaoBox: {
        textAlign: "center",
        backgroundColor: "#e8f5e8",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "180px",
        border: "2px solid #28a745",
        boxShadow: '0 4px 8px rgba(40, 167, 69, 0.1)'
    },
    comissaoLabel: {
        fontSize: "12px", 
        color: "#155724", 
        marginBottom: "5px"
    },
    comissaoValue: {
        fontSize: "26px", 
        fontWeight: "bold", 
        color: "#28a745",
        margin: '0 0 10px 0'
    },
    sacarButton: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        cursor: "pointer"
    },
    sectionTitle: { 
        color: CONSULTOR_PRIMARY, 
        marginBottom: "15px", 
        fontSize: "1.5rem"
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
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
        ":hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)"
        }
    },
    fastAccessTitle: {
        margin: "0 0 10px 0",
        fontSize: "20px"
    },
    fastAccessDescription: {
        color: "#666", 
        margin: 0,
        fontSize: "14px"
    }
};

export default ConsultorDashboardLayout;