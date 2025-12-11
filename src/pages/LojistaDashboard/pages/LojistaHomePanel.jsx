import React from "react";
// Mantenha o useNavigate e Link para a navegacao interna
import { useNavigate, Link } from "react-router-dom";

const LojistaHomePanel = () => {
    const navigate = useNavigate();

    // Dados mockados do lojista
    const lojistaInfo = {
        nome: "Joao Silva",
        empresa: "Loja do Joao LTDA",
        plano: "Completo Online",
        vencimento: "15/03/2024",
        status: "ativo",
    };

    // Estatisticas mockadas
    const estatisticas = {
        vendasMes: 15420.5,
        vendasSemana: 3250.75,
        clientesNovos: 47,
        produtosAtivos: 128,
        comissaoPaga: 2850.3,
        metaAtingida: 85,
    };

    // Modulos do sistema (ROTAS CORRIGIDAS)
    const modules = [
        {
            id: "filiais",
            title: " Filiais",
            description: "Gerencie suas lojas fisicas e virtuais",
            color: "#007bff",
            features: [
                "Cadastrar filiais",
                "Definir responsaveis",
                "Limites por plano",
            ],
            estatistica: "3 filiais ativas",
            rota: "/lojista/dashboard/filiais", // CORRIGIDO
        },
        {
            id: "produtos",
            title: " Produtos",
            description: "Cadastro e gestao de produtos",
            color: "#28a745",
            features: ["Categorias", "Estoque", "Precos", "Comissoes"],
            estatistica: "128 produtos ativos",
            rota: "/lojista/dashboard/produtos", // CORRIGIDO
        },
        {
            id: "qrcode",
            title: " QR Codes",
            description: "Gerar codigos para consultores",
            color: "#6f42c1",
            features: ["QR por secao", "Rastreamento", "Relatorios"],
            estatistica: "15 QR Codes gerados",
            rota: "/lojista/dashboard/qrcode", // CORRIGIDO
        },
        {
            id: "usuarios",
            title: " Usuarios",
            description: "Controle de acesso da equipe",
            color: "#fd7e14",
            features: ["Permissoes", "Visualizadores", "Gerentes"],
            estatistica: "8 usuarios ativos",
            rota: "/lojista/dashboard/usuarios", // CORRIGIDO
        },
        {
            id: "vendedores",
            title: " Vendedores",
            description: "Sua equipe de vendas propria",
            color: "#e83e8c",
            features: ["Cadastro", "Matriculas", "Dashboard simples"],
            estatistica: "5 vendedores ativos",
            rota: "/lojista/dashboard/vendedores", // CORRIGIDO
        },
        {
            id: "relatorios",
            title: " Relatorios",
            description: "Relatorios e analises de performance",
            color: "#20c997",
            features: ["Vendas", "Comissoes", "Performance", "Metas"],
            estatistica: "12 relatorios disponiveis",
            rota: "/lojista/dashboard/relatorios", // CORRIGIDO
        },
        {
            id: "pagamentos",
            title: " Pagamentos",
            description: "Gestao de faturas, boletos e dados de pagamento",
            color: "#17a2b8",
            features: [
                "Faturas e notas fiscais",
                "Boletos bancarios",
                "Cartoes criptografados",
                "Historico de pagamentos"
            ],
            estatistica: "Proxima fatura: 15/03/2024",
            rota: "/lojista/dashboard/pagamentos", // CORRIGIDO
        },
    ];

    // Alertas e notificacoes
    const alertas = [
        {
            id: 1,
            tipo: "estoque",
            mensagem: "5 produtos com estoque baixo",
            cor: "#ffc107",
            icone: " ",
        },
        {
            id: 2,
            tipo: "vendas",
            mensagem: "Meta da semana atingida em 85%",
            cor: "#28a745",
            icone: "",
        },
        {
            id: 3,
            tipo: "comissao",
            mensagem: "R$ 2.850,30 em comissoes pagas este mas",
            cor: "#17a2b8",
            icone: "",
        },
    ];

    return (
        <div style={styles.container}>
            {/* Header com informacoes do lojista */}
            <div style={styles.header}>
                <div style={styles.welcomeSection}>
                    <h1 style={styles.title}>Bem-vindo, {lojistaInfo.nome}! </h1>
                    <p style={styles.subtitle}>
                        {lojistaInfo.empresa} * Plano {lojistaInfo.plano}
                    </p>
                    <div style={styles.statusBar}>
                        <Link to="/lojista/dashboard/pagamentos" style={{textDecoration: 'none'}}>
                            <div style={styles.statusAtivoClicavel}>
                                 Conta Ativa
                            </div>
                        </Link>
                        <Link to="/lojista/dashboard/pagamentos" style={{textDecoration: 'none'}}>
                            <div style={styles.vencimentoClicavel}>
                                 Vencimento: {lojistaInfo.vencimento}
                            </div>
                        </Link>
                    </div>
                </div>
                <div style={styles.quickStats}>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}></div>
                        <div>
                            <div style={styles.statValue}>
                                R$ {estatisticas.vendasMes.toLocaleString("pt-BR")}
                            </div>
                            <div style={styles.statLabel}>Vendas do Mas</div>
                        </div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}></div>
                        <div>
                            <div style={styles.statValue}>{estatisticas.clientesNovos}</div>
                            <div style={styles.statLabel}>Novos Clientes</div>
                        </div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}></div>
                        <div>
                            <div style={styles.statValue}>{estatisticas.produtosAtivos}</div>
                            <div style={styles.statLabel}>Produtos Ativos</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertas */}
            <div style={styles.alertasSection}>
                <h2 style={styles.sectionTitle}> Alertas e Notificacoes</h2>
                <div style={styles.alertasGrid}>
                    {alertas.map((alerta) => (
                        <div
                            key={alerta.id}
                            style={{
                                ...styles.alertaCard,
                                borderLeft: `4px solid ${alerta.cor}`,
                            }}
                        >
                            <div style={styles.alertaIcon}>{alerta.icone}</div>
                            <div style={styles.alertaContent}>
                                <p style={styles.alertaMensagem}>{alerta.mensagem}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modulos do Sistema */}
            <div style={styles.modulesSection}>
                <h2 style={styles.sectionTitle}> Modulos do Sistema</h2>
                <div style={styles.modulesGrid}>
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            style={{
                                ...styles.moduleCard,
                                borderLeft: `4px solid ${module.color}`,
                                background: `linear-gradient(135deg, ${module.color}10, ${module.color}05)`,
                            }}
                            // AQUI ‰ USADA A ROTA ABSOLUTA CORRETA
                            onClick={() => navigate(module.rota)} 
                        >
                            <div style={styles.moduleHeader}>
                                <h3 style={{ ...styles.moduleTitle, color: module.color }}>
                                    {module.title}
                                </h3>
                                <div style={styles.moduleEstatistica}>{module.estatistica}</div>
                            </div>

                            <p style={styles.moduleDescription}>{module.description}</p>

                            <ul style={styles.featuresList}>
                                {module.features.map((feature, index) => (
                                    <li key={index} style={styles.feature}>
                                        * {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                style={{
                                    ...styles.accessButton,
                                    backgroundColor: module.color,
                                }}
                            >
                                Acessar Modulo &#8592;’
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Rapida */}
            <div style={styles.performanceSection}>
                <div style={styles.performanceCard}>
                    <h3 style={styles.performanceTitle}> Performance do Mas</h3>
                    <div style={styles.performanceContent}>
                        <div style={styles.metaProgress}>
                            <div style={styles.metaHeader}>
                                <span>Meta de Vendas</span>
                                <span style={styles.metaPercent}>
                                    {estatisticas.metaAtingida}%
                                </span>
                            </div>
                            <div style={styles.progressBar}>
                                <div
                                    style={{
                                        ...styles.progressFill,
                                        width: `${estatisticas.metaAtingida}%`,
                                        backgroundColor:
                                            estatisticas.metaAtingida >= 100
                                                ? "#28a745"
                                                : estatisticas.metaAtingida >= 70
                                                    ? "#ffc107"
                                                    : "#dc3545",
                                    }}
                                />
                            </div>
                            <div style={styles.metaValues}>
                                <span>R$ {estatisticas.vendasMes.toLocaleString("pt-BR")}</span>
                                <span>Meta: R$ 18.000,00</span>
                            </div>
                        </div>

                        <div style={styles.comissaoInfo}>
                            <div style={styles.comissaoItem}>
                                <span style={styles.comissaoLabel}>Comissoes Pagas:</span>
                                <span style={styles.comissaoValue}>
                                    R$ {estatisticas.comissaoPaga.toLocaleString("pt-BR")}
                                </span>
                            </div>
                            <div style={styles.comissaoItem}>
                                <span style={styles.comissaoLabel}>Vendas da Semana:</span>
                                <span style={styles.comissaoValue}>
                                    R$ {estatisticas.vendasSemana.toLocaleString("pt-BR")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.quickActions}>
                    <h3 style={styles.quickActionsTitle}>a Acoes Rapidas</h3>
                    <div style={styles.actionsGrid}>
                        <button
                            style={styles.quickActionButton}
                            onClick={() => navigate("/lojista/dashboard/pagamentos")} // CORRIGIDO
                        >
                             Gerenciar Pagamentos
                        </button>
                        <button
                            style={styles.quickActionButton}
                            onClick={() => navigate("/lojista/dashboard/produtos")} // CORRIGIDO
                        >
                            O Adicionar Produto
                        </button>
                        <button
                            style={styles.quickActionButton}
                            onClick={() => navigate("/lojista/dashboard/qrcode")} // CORRIGIDO
                        >
                             Gerar QR Code
                        </button>
                        <button
                            style={styles.quickActionButton}
                            onClick={() => navigate("/lojista/dashboard/vendedores")} // CORRIGIDO
                        >
                             Cadastrar Vendedor
                        </button>
                        <button
                            style={styles.quickActionButton}
                            onClick={() => navigate("/lojista/dashboard/relatorios")} // CORRIGIDO
                        >
                             Ver Relatorios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos profissionais
const styles = {
    container: {
        padding: "30px 20px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
    },
    header: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "40px",
        marginBottom: "40px",
        alignItems: "start",
    },
    welcomeSection: {
        flex: 1,
    },
    title: {
        fontSize: "2.5rem",
        color: "#333",
        marginBottom: "8px",
        fontWeight: "700",
    },
    subtitle: {
        fontSize: "1.2rem",
        color: "#666",
        marginBottom: "15px",
    },
    statusBar: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },
    statusAtivoClicavel: {
        backgroundColor: "#d4edda",
        color: "#155724",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: "600",
        border: "1px solid #c3e6cb",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "inline-block",
        ":hover": {
            backgroundColor: "#c3e6cb",
            transform: "scale(1.05)",
            boxShadow: "0 2px 8px rgba(21, 87, 36, 0.2)"
        }
    },
    vencimentoClicavel: {
        color: "#666",
        fontSize: "0.9rem",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        display: "inline-block",
        ":hover": {
            backgroundColor: "#f8f9fa",
            color: "#007bff",
            transform: "scale(1.05)"
        }
    },
    quickStats: {
        display: "flex",
        gap: "20px",
    },
    statItem: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        minWidth: "180px",
    },
    statIcon: {
        fontSize: "2rem",
    },
    statValue: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "4px",
    },
    statLabel: {
        fontSize: "0.9rem",
        color: "#666",
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: "1.8rem",
        color: "#333",
        marginBottom: "25px",
        fontWeight: "600",
    },
    alertasSection: {
        marginBottom: "40px",
    },
    alertasGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "15px",
    },
    alertaCard: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        border: "1px solid #e9ecef",
    },
    alertaIcon: {
        fontSize: "1.5rem",
    },
    alertaContent: {
        flex: 1,
    },
    alertaMensagem: {
        margin: 0,
        fontSize: "1rem",
        color: "#333",
        fontWeight: "500",
    },
    modulesSection: {
        marginBottom: "40px",
    },
    modulesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "25px",
    },
    moduleCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        border: "1px solid #e9ecef",
    },
    moduleHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "15px",
    },
    moduleTitle: {
        fontSize: "1.4rem",
        fontWeight: "700",
        margin: 0,
    },
    moduleEstatistica: {
        backgroundColor: "rgba(0,0,0,0.05)",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "0.8rem",
        fontWeight: "600",
        color: "#666",
    },
    moduleDescription: {
        color: "#666",
        fontSize: "1rem",
        marginBottom: "20px",
        lineHeight: "1.5",
    },
    featuresList: {
        listStyle: "none",
        padding: 0,
        marginBottom: "25px",
    },
    feature: {
        padding: "6px 0",
        color: "#555",
        fontSize: "0.9rem",
    },
    accessButton: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "opacity 0.3s ease",
    },
    performanceSection: {
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "30px",
    },
    performanceCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #e9ecef",
    },
    performanceTitle: {
        fontSize: "1.3rem",
        color: "#333",
        marginBottom: "20px",
        fontWeight: "600",
    },
    performanceContent: {
        display: "grid",
        gap: "25px",
    },
    metaProgress: {
        marginBottom: "15px",
    },
    metaHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        fontWeight: "600",
    },
    metaPercent: {
        fontSize: "1.1rem",
        fontWeight: "bold",
    },
    progressBar: {
        width: "100%",
        height: "10px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
        overflow: "hidden",
        marginBottom: "8px",
    },
    progressFill: {
        height: "100%",
        borderRadius: "5px",
        transition: "width 0.3s ease",
    },
    metaValues: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        color: "#666",
    },
    comissaoInfo: {
        display: "grid",
        gap: "12px",
    },
    comissaoItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
    },
    comissaoLabel: {
        fontWeight: "500",
        color: "#555",
    },
    comissaoValue: {
        fontWeight: "600",
        color: "#333",
    },
    quickActions: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #e9ecef",
    },
    quickActionsTitle: {
        fontSize: "1.3rem",
        color: "#333",
        marginBottom: "20px",
        fontWeight: "600",
    },
    actionsGrid: {
        display: "grid",
        gap: "12px",
    },
    quickActionButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 16px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        textAlign: "left",
    },
};

// Efeitos hover
Object.assign(styles, {
    moduleCard: {
        ...styles.moduleCard,
        ":hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
    },
    accessButton: {
        ...styles.accessButton,
        ":hover": {
            opacity: 0.9,
        },
    },
    quickActionButton: {
        ...styles.quickActionButton,
        ":hover": {
            backgroundColor: "#0056b3",
        },
    },
});

export default LojistaHomePanel;
