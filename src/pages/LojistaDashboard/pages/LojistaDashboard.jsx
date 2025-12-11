// src/pages/LojistaDashboard/pages/LojistaDashboard.jsx
// VERSAO CORRIGIDA - Com Routes internas e importacoes dos componentes reais

import React from "react";
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";

// =============================================================
// === IMPORTACOES DOS COMPONENTES/PGINAS REAIS ===
// =============================================================
import LojistaHomePanel from "./LojistaHomePanel";
import LojistaProdutosEstoque from "./LojistaProdutosEstoque";
import LojistaUsuarios from "./LojistaUsuarios";
import LojistaVendedores from "./LojistaVendedores";
import LojistaConsultorConfig from "./LojistaConsultorConfig";
import LojistaFiliais from "./LojistaFiliais";
import LojistaQRCode from "./LojistaQRCode";
import LojistaPagamentos from "./LojistaPagamentos";
import LojistaRelatorios from "./LojistaRelatorios";
import LojistaCadastro from "./LojistaCadastro";
import LojistaProfile from "./LojistaProfile";
import IntegracaoVenda from "./IntegracaoVenda";

// Importar o TrainingManagementPanel da pasta components
import TrainingManagementPanel from "../components/TrainingManagementPanel";

// Importar o ReportPanelLojista da pasta components
import ReportPanelLojista from "../components/ReportPanelLojista";

// =============================================================
// === ESTILOS ===
// =============================================================
const styles = {
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
        fontSize: "1.5rem",
        padding: "10px 20px 30px",
        textAlign: "center",
        borderBottom: "1px solid #eee",
        fontWeight: "bold",
        color: "#2c5aa0",
    },
    topAction: {
        padding: "0 20px 20px",
    },
    integrationButton: {
        display: "block",
        backgroundColor: "#28a745",
        color: "white",
        padding: "12px 10px",
        borderRadius: "8px",
        textAlign: "center",
        textDecoration: "none",
        fontWeight: "600",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "background-color 0.2s",
        border: 'none'
    },
    menuItem: {
        display: "block",
        padding: "12px 20px",
        color: "#2c5aa0",
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: '15px',
        borderLeft: '3px solid transparent',
        backgroundColor: "#eaf2ff",
        borderRadius: '0 50px 50px 0',
        marginRight: '20px',
    },
    menuItemActive: {
        display: "block",
        padding: "12px 20px",
        backgroundColor: "#FFFFFF",
        color: "#2c5aa0",
        fontWeight: "700",
        borderLeft: '3px solid #2c5aa0',
        borderRadius: '0 50px 50px 0',
        marginRight: '20px',
        textDecoration: "none",
    },
    mainContent: {
        flexGrow: 1,
        width: "calc(100% - 250px)",
        overflowY: 'auto',
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
        color: "#2c5aa0",
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
        color: "#2c5aa0",
        gap: "10px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "2px solid #2c5aa0",
        backgroundColor: "white",
        transition: "all 0.3s ease",
        fontWeight: "600",
    },
    profileName: {
        fontSize: "1rem",
    },
};

// === DADOS DE NAVEGACAO ===
const menuItems = [
    { title: "  Dashboard", rota: "/lojista/dashboard" },
    { title: " Produtos e Estoque", rota: "/lojista/dashboard/produtos" },
    { title: " Usuarios", rota: "/lojista/dashboard/usuarios" },
    { title: " Vendedores", rota: "/lojista/dashboard/vendedores" },
    { title: " Consultores", rota: "/lojista/dashboard/consultores" },
    { title: " Filiais", rota: "/lojista/dashboard/filiais" },
    { title: " QR Codes", rota: "/lojista/dashboard/qrcode" },
    { title: " Pagamentos", rota: "/lojista/dashboard/pagamentos" },
    { title: " Relatorios", rota: "/lojista/dashboard/relatorios" },
    { title: " Treinamentos", rota: "/lojista/dashboard/treinamentos" },
    { title: " Cadastro", rota: "/lojista/dashboard/cadastro" },
    { title: "  Report", rota: "/lojista/dashboard/report" },
];

// === COMPONENTE LAYOUT ===
const LojistaDashboardLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const empresaNome = localStorage.getItem('lojistaNome') || "Minha Empresa";

    const getMenuItemStyle = (rota) => {
        const isExactMatch = rota === currentPath;
        const isPrefixMatch = currentPath.startsWith(rota + '/');

        let isActive = false;

        if (rota === "/lojista/dashboard") {
            isActive = isExactMatch;
        } else {
            isActive = isExactMatch || isPrefixMatch;
        }

        return isActive ? styles.menuItemActive : styles.menuItem;
    };

    return (
        <div style={styles.dashboardContainer}>
            <div style={styles.sidebar}>
                <h2 style={styles.logoTitle}>Agnes Lojista</h2>

                <div style={styles.topAction}>
                    <Link to="/lojista/dashboard/integracao" style={styles.integrationButton}>
                        ¨ Integrar Nova Venda
                    </Link>
                </div>

                <nav>
                    {menuItems.map(item => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            style={getMenuItemStyle(item.rota)}
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        to="/lojista/dashboard/profile"
                        style={getMenuItemStyle("/lojista/dashboard/profile")}
                    >
                         Meu Perfil
                    </Link>
                </nav>
            </div>

            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.headerTitle}>Dashboard Lojista</h1>
                        <p style={styles.headerSubtitle}>Bem-vindo, {empresaNome}</p>
                    </div>
                    <Link to="/lojista/dashboard/profile" style={styles.profileButton}>
                        <span style={styles.profileName}> Meu Perfil</span>
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
// === COMPONENTE FALLBACK ===
// =============================================================
export const ComponenteFallback = () => (
    <div style={{ 
        padding: "30px", 
        backgroundColor: '#ffffff', 
        borderRadius: '10px', 
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)' 
    }}>
        <h1 style={{ 
            color: '#2c5aa0', 
            fontSize: '2rem', 
            marginBottom: '10px',
            borderBottom: '2px solid #eee',
            paddingBottom: '10px'
        }}>
             Pagina em Desenvolvimento
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1rem' }}>
            Esta funcionalidade estara disponivel em breve!
        </p>
    </div>
);

// =============================================================
// === COMPONENTE PRINCIPAL COM ROTAS ===
// =============================================================
export default function LojistaDashboard() {
    return (
        <Routes>
            <Route path="/" element={<LojistaDashboardLayout />}>
                {/* Rota index */}
                <Route index element={<LojistaHomePanel />} />
                
                {/* Rota /lojista/dashboard */}
                <Route path="dashboard" element={<LojistaHomePanel />} />
                
                {/* Sub-rotas - USANDO OS COMPONENTES IMPORTADOS */}
                <Route path="dashboard/produtos" element={<LojistaProdutosEstoque />} />
                <Route path="dashboard/usuarios" element={<LojistaUsuarios />} />
                <Route path="dashboard/vendedores" element={<LojistaVendedores />} />
                <Route path="dashboard/consultores" element={<LojistaConsultorConfig />} />
                <Route path="dashboard/filiais" element={<LojistaFiliais />} />
                <Route path="dashboard/qrcode" element={<LojistaQRCode />} />
                <Route path="dashboard/pagamentos" element={<LojistaPagamentos />} />
                <Route path="dashboard/relatorios" element={<LojistaRelatorios />} />
                <Route path="dashboard/treinamentos" element={<TrainingManagementPanel />} />
                <Route path="dashboard/cadastro" element={<LojistaCadastro />} />
                <Route path="dashboard/profile" element={<LojistaProfile />} />
                <Route path="dashboard/integracao" element={<IntegracaoVenda />} />
                <Route path="dashboard/report" element={<ReportPanelLojista />} />
            </Route>
        </Routes>
    );
}
