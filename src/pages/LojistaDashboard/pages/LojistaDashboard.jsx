import React from "react";
// 💡 ELEMENTOS CHAVE ADICIONADOS: Outlet e Link
import { Outlet, Link, useLocation } from "react-router-dom"; 

// === DADOS DE NAVEGAÇÃO (MOCKADOS PARA O MENU LATERAL) ===
const menuItems = [
    // CORRIGIDO: Todas as rotas agora usam o padrão '/lojista/dashboard/' para navegação interna
    { title: "🏠 Dashboard", rota: "/lojista/dashboard" }, 
    { title: "📦 Produtos", rota: "/lojista/dashboard/produtos" },
    { title: "👥 Usuários", rota: "/lojista/dashboard/usuarios" },
    { title: "💼 Vendedores", rota: "/lojista/dashboard/vendedores" },
    { title: "🏪 Filiais", rota: "/lojista/dashboard/filiais" },
    { title: "🔳 QR Codes", rota: "/lojista/dashboard/qrcode" }, 
    { title: "💳 Pagamentos", rota: "/lojista/dashboard/pagamentos" },
    { title: "📊 Relatórios", rota: "/lojista/dashboard/relatorios" },
    { title: "⚙️ Cadastro", rota: "/lojista/dashboard/cadastro" },
];

// === COMPONENTE LAYOUT ===
const LojistaDashboardLayout = () => {
    const location = useLocation(); // Hook para saber a rota atual

    // Função auxiliar para aplicar estilo de item ativo
    const getMenuItemStyle = (rota) => {
        const baseStyle = styles.menuItem;
        
        // Verifica se a rota atual começa com a rota do item do menu
        const isActive = rota === location.pathname || 
          (rota !== "/lojista/dashboard" && location.pathname.startsWith(rota));

        return isActive 
          ? {...baseStyle, ...styles.menuItemActive} 
          : baseStyle;
    };

    return (
        <div style={styles.dashboardContainer}>
            
            {/* ⬅️  Menu Lateral */}
            <div style={styles.sidebar}>
                <h2 style={styles.logoTitle}>Agnes Lojista</h2>
                
                {/* Botão em Destaque para Integração */}
                <div style={styles.topAction}>
                    {/* Rota para a página de Integração de Venda (mock com ID de exemplo) */}
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
                </nav>
            </div>

            {/* ➡️ CONTEÚDO PRINCIPAL: AQUI AS PÁGINAS FILHAS SERÃO RENDERIZADAS */}
            <main style={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

// === ESTILOS BÁSICOS DO LAYOUT (ATUALIZADOS PARA MINIMALISMO) ===
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
    // Botão de Ação
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
        color: "#555", 
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: '15px',
        borderLeft: '3px solid transparent', 
    },
    // Item de Menu Ativo
    menuItemActive: {
        backgroundColor: "#eaf2ff", 
        color: "#2c5aa0", 
        fontWeight: "600",
        borderLeft: '3px solid #2c5aa0', 
    },
    mainContent: {
        flexGrow: 1,
        width: "calc(100% - 250px)", 
        overflowY: 'auto', 
        padding: '20px', 
    },
    // NOVO: Estilos para a tela de escolha
    escolhaContainer: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center'
    },
    escolhaGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginTop: '30px',
    },
    escolhaCard: {
        padding: '30px 20px',
        borderRadius: '12px',
        border: '1px solid #ddd',
        textDecoration: 'none',
        color: '#333',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '1.1rem'
    },
    escolhaCardHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
    },
    escolhaIcon: {
        fontSize: '3rem',
        marginBottom: '10px'
    }
};

// === COMPONENTE LojistaEscolha (AGORA FUNCIONAL) ===
export const LojistaEscolha = () => {
    // Para aplicar o hover, usaremos o estilo direto ou uma função de evento no seu ambiente real.
    // Aqui aplicamos a estrutura principal.
    return (
        <div style={styles.escolhaContainer}>
            <h1>Selecione o Perfil de Acesso</h1>
            <p style={{marginBottom: '30px', color: '#666'}}>Escolha se você está acessando como Administrador da Loja ou como um Vendedor.</p>
            <div style={styles.escolhaGrid}>
                {/* Opção 1: Administrador da Loja (Lojista Admin) */}
                <Link to="/lojista/login" style={{...styles.escolhaCard, borderColor: '#2c5aa0'}}>
                    <span style={{...styles.escolhaIcon, color: '#2c5aa0'}}>👑</span>
                    Administrador da Loja
                </Link>
                
                {/* Opção 2: Vendedor (Lojista Vendedor) */}
                <Link to="/vendedor/login" style={{...styles.escolhaCard, borderColor: '#28a745'}}>
                    <span style={{...styles.escolhaIcon, color: '#28a745'}}>💼</span>
                    Vendedor
                </Link>
            </div>
        </div>
    );
};


// === EXPORTS ATUALIZADOS ===
// Export DEFAULT para ser importado como 'LojistaDashboard' no app.jsx
export default LojistaDashboardLayout; 

// Outros Exports (MOCKADOS)
export const LojistaProducts = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>📦 Produtos do Lojista</h1>
    </div>
);
export const LojistaUsuarios = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>👥 Usuários do Lojista</h1>
    </div>
);
export const LojistaVendedores = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>💼 Vendedores do Lojista</h1>
        <p>Pagina mockada, precisa ser implementada.</p>
    </div>
);
export const LojistaFiliais = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>🏪 Filiais do Lojista</h1>
    </div>
);
export const LojistaCadastro = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>⚙️ Cadastro do Lojista</h1>
    </div>
);
export const LojistaPagamentos = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>💳 Pagamentos do Lojista</h1>
        <p>Pagina mockada, precisa ser implementada.</p>
    </div>
);