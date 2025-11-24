import React from "react";
// 💡 ELEMENTOS CHAVE ADICIONADOS: Outlet e Link
import { Outlet, Link, useLocation } from "react-router-dom"; // Adicionado useLocation para detectar rota ativa

// === DADOS DE NAVEGAÇÃO (MOCKADOS PARA O MENU LATERAL) ===
const menuItems = [
    { title: "🏠 Dashboard", rota: "/lojista" }, // Rota raiz /lojista
    { title: "📦 Produtos", rota: "/lojista/produtos" },
    { title: "👥 Usuários", rota: "/lojista/usuarios" },
    { title: "💼 Vendedores", rota: "/lojista/vendedores" },
    { title: "🏪 Filiais", rota: "/lojista/filiais" },
    { title: "🔳 QR Codes", rota: "/lojista/qrcode" }, // CORRIGIDO: qrcodes -> qrcode (para bater com o app.jsx)
    { title: "💳 Pagamentos", rota: "/lojista/pagamentos" },
    { title: "📊 Relatórios", rota: "/lojista/relatorios" },
    { title: "⚙️ Cadastro", rota: "/lojista/cadastro" },
];

// === COMPONENTE LAYOUT ===
const LojistaDashboardLayout = () => {
    const location = useLocation(); // Hook para saber a rota atual

    // Função auxiliar para aplicar estilo de item ativo
    const getMenuItemStyle = (rota) => {
        const baseStyle = styles.menuItem;
        // Verifica se a rota atual começa com a rota do item do menu
        const isActive = location.pathname === rota || 
          (rota !== "/lojista" && location.pathname.startsWith(rota));

        return isActive 
          ? {...baseStyle, ...styles.menuItemActive} 
          : baseStyle;
    };

    return (
        <div style={styles.dashboardContainer}>
            
            {/* ⬅️  Menu Lateral */}
            <div style={styles.sidebar}>
                <h2 style={styles.logoTitle}>Agnes Lojista</h2>
                
                {/* NOVO: Botão em Destaque para Integração */}
                <div style={styles.topAction}>
                    {/* Rota para a página de Integração de Venda (mock com ID de exemplo) */}
                    <Link to="/lojista/integracao?vendaId=venda_exemplo_123" style={styles.integrationButton}>
                        ✨ Integrar Nova Venda
                    </Link>
                </div>

                <nav>
                    {menuItems.map(item => (
                        // Usamos a função de estilo
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
                {/* 💡 O Outlet é fundamental para rotas aninhadas */}
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
        backgroundColor: "#FFFFFF", // Fundo Branco (Minimalista)
        color: "#333", // Texto Escuro
        paddingTop: "20px",
        flexShrink: 0,
        boxShadow: "4px 0 10px rgba(0,0,0,0.05)", // Sombra suave
    },
    logoTitle: {
        fontSize: "1.5rem",
        padding: "10px 20px 30px",
        textAlign: "center",
        borderBottom: "1px solid #eee", // Linha divisória clara
        fontWeight: "bold",
        color: "#2c5aa0", // Mantém a cor da marca no logo
    },
    // Botão de Ação
    topAction: {
        padding: "0 20px 20px",
    },
    integrationButton: {
        display: "block",
        backgroundColor: "#28a745", // Verde de destaque
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
        color: "#555", // Texto cinza para minimalismo
        textDecoration: "none",
        transition: "all 0.2s",
        fontSize: '15px',
        borderLeft: '3px solid transparent', // Espaço para destaque ativo
    },
    // NOVO ESTILO: Item de Menu Ativo
    menuItemActive: {
        backgroundColor: "#eaf2ff", // Azul clarinho
        color: "#2c5aa0", // Cor principal forte
        fontWeight: "600",
        borderLeft: '3px solid #2c5aa0', // Destaque lateral
    },
    mainContent: {
        flexGrow: 1,
        width: "calc(100% - 250px)", // Ocupa o restante da tela
        overflowY: 'auto', // Permite scroll no conteúdo
        padding: '20px', // Adiciona padding ao conteúdo principal
    },
};

// === EXPORTS ATUALIZADOS ===
// Export DEFAULT para ser importado como 'LojistaDashboard' no app.jsx
export default LojistaDashboardLayout; 

// Export LojistaEscolha (Geralmente fora do Layout)
export const LojistaEscolha = () => (
    <div style={{ padding: "50px", textAlign: "center", color: '#333' }}>
        <h1>✅ Lojista Escolha</h1>
    </div>
);

// Outros Exports (APENAS OS QUE NÃO TEM ARQUIVOS SEPARADOS)
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