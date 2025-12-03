import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom"; 

// =============================================================
// === ESTILOS ===
// =============================================================

// Estilos do layout principal
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
    // ESTILO PADRÃO: Agora com fundo azul claro
    menuItem: {
        display: "block",
        padding: "12px 20px",
        color: "#2c5aa0", // Cor do texto azul
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: '15px',
        borderLeft: '3px solid transparent',
        backgroundColor: "#eaf2ff", // Fundo azul claro para o padrão
        borderRadius: '0 50px 50px 0',
        marginRight: '20px',
    },
    // ESTILO ATIVO: Agora com fundo branco
    menuItemActive: {
        backgroundColor: "#FFFFFF", // Fundo branco
        color: "#2c5aa0", 
        fontWeight: "700", // Mais negrito para o ativo
        borderLeft: '3px solid #2c5aa0', 
        borderRadius: '0 50px 50px 0',
        marginRight: '20px',
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

// Efeitos hover
Object.assign(styles, {
    integrationButton: {
        ...styles.integrationButton,
        ":hover": {
            backgroundColor: "#218838",
        },
    },
    menuItem: {
        ...styles.menuItem,
        ":hover": {
            // Efeito hover no estado padrão
            backgroundColor: "#d0e4ff", // Azul mais escuro no hover
            color: "#1c3d73", // Texto mais escuro
        },
    },
    profileButton: {
        ...styles.profileButton,
        ":hover": {
            backgroundColor: "#2c5aa0",
            color: "white",
        },
    },
});

// === DADOS DE NAVEGAÇÃO ===
const menuItems = [
  { title: "🏠 Dashboard", rota: "/lojista/dashboard" }, 
  { title: "📦 Produtos e Estoque", rota: "/lojista/dashboard/produtos" },
  { title: "👥 Usuários", rota: "/lojista/dashboard/usuarios" },
  { title: "💼 Vendedores", rota: "/lojista/dashboard/vendedores" },
  { title: "👥 Consultores", rota: "/lojista/dashboard/consultores" },
  { title: "🏪 Filiais", rota: "/lojista/dashboard/filiais" },
  { title: "🔳 QR Codes", rota: "/lojista/dashboard/qrcode" }, 
  { title: "💳 Pagamentos", rota: "/lojista/dashboard/pagamentos" },
  { title: "📊 Relatórios", rota: "/lojista/dashboard/relatorios" },
  { title: "⚙️ Cadastro", rota: "/lojista/dashboard/cadastro" },
];

// === COMPONENTE LAYOUT ===
const LojistaDashboardLayout = () => {
    const currentPath = window.location.pathname;
    const empresaNome = localStorage.getItem('lojistaNome') || "Minha Empresa";

    // LÓGICA CORRIGIDA para resolver o problema de destaque travado:
    // Usa correspondência de rota exata OU correspondência de prefixo de rota,
    // e restringe a rota base (Dashboard) para só ativar em correspondência exata.
    const getMenuItemStyle = (rota) => {
        const baseStyle = styles.menuItem;
        
        const isExactMatch = rota === currentPath;
        const isPrefixMatch = currentPath.startsWith(rota + '/');

        let isActive = false;

        if (rota === "/lojista/dashboard") {
            // A rota base só é ativa se for uma correspondência EXATA.
            isActive = isExactMatch;
        } else {
            // Para todas as sub-rotas, ative se for uma correspondência exata ou de sub-caminho.
            isActive = isExactMatch || isPrefixMatch;
        }
        
        return isActive 
          ? {...baseStyle, ...styles.menuItemActive} 
          : baseStyle;
    };

    return (
        <div style={styles.dashboardContainer}>
            <div style={styles.sidebar}>
                <h2 style={styles.logoTitle}>Agnes Lojista</h2>
                
                <div style={styles.topAction}>
                    <Link to="/lojista/dashboard/integracao?vendaId=venda_exemplo_123" style={styles.integrationButton}>
                        ✨ Integrar Nova Venda
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
                    {/* Botão de Perfil no Menu */}
                    <Link 
                        to="/lojista/dashboard/profile" 
                        style={getMenuItemStyle("/lojista/dashboard/profile")}
                    >
                        👤 Meu Perfil
                    </Link>
                </nav>
            </div>

            <main style={styles.mainContent}>
                {/* Header com botão de perfil */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.headerTitle}>Dashboard Lojista</h1>
                        <p style={styles.headerSubtitle}>Bem-vindo, {empresaNome}</p>
                    </div>
                    <Link to="/lojista/dashboard/profile" style={styles.profileButton}>
                        <span style={styles.profileName}>👤 Meu Perfil</span>
                    </Link>
                </header>
                
                <Outlet />
            </main>
            
            {/* O componente LojistaHomePanel foi removido daqui para evitar conflito de código */}
        </div>
    );
};

// =============================================================
// === COMPONENTE FALLBACK PARA PÁGINAS EM DESENVOLVIMENTO ===
// =============================================================

export const ComponenteFallback = () => {
    const mockStyles = {
        pageContainer: {
            padding: "30px",
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        },
        pageTitle: {
            color: '#2c5aa0',
            fontSize: '2rem',
            marginBottom: '10px',
            borderBottom: '2px solid #eee',
            paddingBottom: '10px'
        },
        pageSubtitle: {
            color: '#6c757d',
            fontSize: '1rem',
            marginBottom: '30px'
        }
    };

    return (
        <div style={mockStyles.pageContainer}>
            <h1 style={mockStyles.pageTitle}>🚧 Página em Desenvolvimento</h1>
            <p style={mockStyles.pageSubtitle}>Esta funcionalidade estará disponível em breve!</p>
        </div>
    );
};

// REMOVA TODAS AS OUTRAS EXPORTAÇÕES - ELAS ESTÃO EM ARQUIVOS SEPARADOS
// NÃO EXPORTE: LojistaFiliais, LojistaVendedores, LojistaCadastro, etc...

export default LojistaDashboardLayout;