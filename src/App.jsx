// app-frontend/src/App.jsx

import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; 
import { NotificationProvider } from "./contexts/NotificationContext";
import { withAuthenticationRequired } from "@auth0/auth0-react"; 
import { useAuthInterceptor } from "./hooks/useAuthInterceptor";

// === PÁGINAS PRINCIPAIS ===
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

// === ADMIN ===
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin.jsx";
import AdminAprovacao from "./pages/AdminDashboard/pages/AdminAprovacao.jsx";
import AdminCadastroVendedor from "./pages/AdminDashboard/pages/AdminCadastroVendedor.jsx";

// === CONSULTOR ===
import ConsultorDashboardLayout, { ConsultorHomePanel } from "./pages/ConsultorDashboard/pages/ConsultorDashboard.jsx";
import ConsultorRegister from "./pages/ConsultorDashboard/pages/ConsultorRegister.jsx";
import ConsultantLoginPage from "./pages/ConsultorDashboard/pages/Consultant/ConsultorLogin.jsx";

// CONSULTOR - Componentes
import QueuePanel from "./pages/ConsultorDashboard/components/QueuePanel.jsx";
import StoresPanel from "./pages/ConsultorDashboard/components/StoresPanel.jsx";
import ChatPanel from "./pages/ConsultorDashboard/components/ChatPanel.jsx";
import AnalyticsPanel from "./pages/ConsultorDashboard/components/AnalyticsPanel.jsx";
import ProfilePanel from "./pages/ConsultorDashboard/components/ProfilePanel.jsx";

// === LOJISTA ===
import LojistaDashboardLayout from "./pages/LojistaDashboard/pages/LojistaDashboard.jsx";
import LojistaUsuarios from "./pages/LojistaDashboard/pages/LojistaUsuarios.jsx";
import LojistaVendedores from "./pages/LojistaDashboard/pages/LojistaVendedores.jsx";
import LojistaFiliais from "./pages/LojistaDashboard/pages/LojistaFiliais.jsx";
import LojistaPagamentos from "./pages/LojistaDashboard/pages/LojistaPagamentos.jsx";
import LojistaCadastro from "./pages/LojistaDashboard/pages/LojistaCadastro.jsx";
import LojistaRelatorios from "./pages/LojistaDashboard/pages/LojistaRelatorios.jsx";
import LojistaQRCode from "./pages/LojistaDashboard/pages/LojistaQRCode.jsx";
import LojistaConsultorConfig from "./pages/LojistaDashboard/pages/LojistaConsultorConfig.jsx";
import LojistaLogin from "./pages/LojistaDashboard/pages/LojistaLogin.jsx";
import LojistaProfile from "./pages/LojistaDashboard/pages/LojistaProfile.jsx";
import LojistaProdutosEstoque from "./pages/LojistaDashboard/pages/LojistaProdutosEstoque.jsx";
import LojistaHomePanel from "./pages/LojistaDashboard/pages/LojistaHomePanel.jsx";
import IntegracaoVenda from "./pages/LojistaDashboard/pages/IntegracaoVenda.jsx";
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha.jsx";

// === VENDEDOR ===
import VendedorDashboardLayout, { VendedorHomePanel } from "./pages/VendedorDashboard/pages/VendedorDashboard.jsx";
import VendedorLogin from "./pages/VendedorDashboard/pages/VendedorLogin.jsx";
import VendedorAtendimentoPage from "./pages/VendedorDashboard/pages/VendedorAtendimentoPage.jsx";
import RelatorioPageVendedor from "./pages/VendedorDashboard/components/RelatorioPageVendedor.jsx";
import VendedorRegisterPage from "./pages/VendedorDashboard/pages/VendedorRegisterPage.jsx";
import VendedorProfile from "./pages/VendedorDashboard/pages/VendedorProfile.jsx";

// === OUTRAS PÁGINAS ===
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao.jsx";
import ApprovalsPage from "./pages/ApprovalsPage.jsx";
import AwaitingApproval from "./pages/AwaitingApproval.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import TermsPage from "./pages/TermsPage";

// ✅ Componente para proteger rotas - CORRIGIDO
const ProtectedRoute = ({ component: Component, redirectTo }) => {
    const location = useLocation();
    
    // ✅ Usa a rota atual como returnTo se não especificado
    const returnPath = redirectTo || location.pathname;
    
    const ComponentWithAuth = withAuthenticationRequired(Component, {
        onRedirecting: () => (
            <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>🔐 Verificando Autenticação...</h1>
                <p>Aguarde o redirecionamento ou login.</p>
            </div>
        ),
        returnTo: returnPath // ✅ Retorna para a rota que estava tentando acessar
    });
    return <ComponentWithAuth />;
};

// ✅ Componente de navegação (sem alterações)
const Navigation = () => {
    const location = useLocation();
    const path = location.pathname;

    const linkStyle = { 
        color: "#555", 
        textDecoration: "none", 
        fontWeight: "500", 
        padding: "8px 16px", 
        borderRadius: "8px", 
        transition: "all 0.3s ease", 
        fontSize: "14px" 
    };
    
    const linksStyle = { 
        display: "flex", 
        gap: "25px", 
        alignItems: "center" 
    };
    
    const logoStyle = { 
        fontSize: "24px", 
        fontWeight: "bold", 
        color: "#2c5aa0" 
    };
    
    const navContentStyle = { 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
    };
    
    const navStyle = { 
        background: "white", 
        padding: "15px 30px", 
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", 
        borderBottom: "1px solid #eaeaea", 
        marginBottom: "0", 
        position: "sticky", 
        top: 0, 
        zIndex: 1000 
    };

    const noMenuPages = [
        '/', '/login', '/admin/login', '/consultor/login', '/consultor/register', '/consultor/cadastro',
        '/vendedor/login', '/vendedor/register', '/lojista/escolha', '/lojista/login', 
        '/lojista/integracao',
    ];
    
    const isAuthRedirect = location.search.includes('code=') && location.search.includes('state=');

    if (noMenuPages.some(page => path === page || path.includes(page)) || isAuthRedirect) {
        return null;
    }

    const getNavigationMenu = () => {
        if (path.includes('/admin')) {
            return (
                <>
                    <a href="/admin/dashboard" style={linkStyle}>🏠 Admin</a>
                    <a href="/lojista/dashboard" style={linkStyle}>🏪 Lojista</a>
                    <a href="/vendedor/dashboard" style={linkStyle}>💼 Vendedor</a>
                </>
            );
        } else if (path.includes('/vendedor')) {
            return (
                <>
                    <a href="/vendedor/dashboard" style={linkStyle}>🏠 Vendedor</a>
                    <a href="/lojista/dashboard" style={linkStyle}>🏪 Lojista</a>
                    <a href="/consultor/dashboard" style={linkStyle}>🔍 Consultor</a>
                </>
            );
        } else if (path.includes('/lojista')) {
            return (
                <>
                    <a href="/lojista/dashboard" style={linkStyle}>🏠 Lojista</a>
                    <a href="/vendedor/dashboard" style={linkStyle}>💼 Vendedor</a>
                    <a href="/consultor/dashboard" style={linkStyle}>🔍 Consultor</a>
                </>
            );
        } else if (path.includes('/consultor')) {
            return (
                <>
                    <a href="/consultor/dashboard" style={linkStyle}>🏠 Consultor</a>
                    <a href="/lojista/dashboard" style={linkStyle}>🏪 Lojista</a>
                    <a href="/vendedor/dashboard" style={linkStyle}>💼 Vendedor</a>
                </>
            );
        } else {
            return (
                <>
                    <a href="/" style={linkStyle}>🏠 Home</a>
                    <a href="/login" style={linkStyle}>🔐 Login</a>
                    <a href="/lojista/escolha" style={linkStyle}>🏪 Lojista</a>
                    <a href="/vendedor/login" style={linkStyle}>💼 Vendedor</a>
                    <a href="/consultor/login" style={linkStyle}>🔍 Consultor</a>
                </>
            );
        }
    };

    return (
        <nav style={navStyle}>
            <div style={navContentStyle}>
                <div style={logoStyle}>🧭 Compra Smart</div>
                <div style={linksStyle}>
                    {getNavigationMenu()}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                    a:hover {
                        background-color: #f0f0f0;
                        color: #2c5aa0;
                    }
                `}} />
            </div>
        </nav>
    );
};

function App() {
    useAuthInterceptor();
    
    return (
        <NotificationProvider>
            <div className="App">
                <Navigation />

                <Routes>
                    {/* === PÁGINAS PÚBLICAS === */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/dashboard" element={<Navigate to="/lojista/dashboard" replace />} />
                    
                    {/* === ADMIN === */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute component={AdminDashboard} redirectTo="/admin/dashboard" />} />
                    <Route path="/admin/aprovacao" element={<ProtectedRoute component={AdminAprovacao} redirectTo="/admin/aprovacao" />} />
                    <Route path="/admin/cadastro-vendedor" element={<ProtectedRoute component={AdminCadastroVendedor} redirectTo="/admin/cadastro-vendedor" />} />
                    
                    {/* === CONSULTOR === */}
                    <Route path="/consultor/login" element={<ConsultantLoginPage />} />
                    <Route path="/consultor/register" element={<ConsultorRegister />} />
                    <Route path="/consultor/cadastro" element={<ConsultorRegister />} />
                    
                    <Route path="/consultor/dashboard" element={<ProtectedRoute component={ConsultorDashboardLayout} redirectTo="/consultor/dashboard" />}>
                        <Route index element={<ConsultorHomePanel />} /> 
                        <Route path="fila" element={<QueuePanel />} />
                        <Route path="lojas" element={<StoresPanel />} />
                        <Route path="chat" element={<ChatPanel />} />
                        <Route path="analytics" element={<AnalyticsPanel />} />
                        <Route path="profile" element={<ProfilePanel />} />
                        <Route path="detalhe-alerta/:id" element={<div style={{ padding: '30px' }}>Detalhe do Alerta (Em desenvolvimento)</div>} />
                    </Route>
                    
                    {/* === LOJISTA === */}
                    <Route path="/lojista/escolha" element={<LojistaEscolha />} />
                    <Route path="/lojista/login" element={<LojistaLogin />} /> 
                    
                    <Route path="/lojista/dashboard" element={<ProtectedRoute component={LojistaDashboardLayout} redirectTo="/lojista/dashboard" />}>
                        <Route index element={<LojistaHomePanel />} /> 
                        <Route path="home" element={<LojistaHomePanel />} />
                        <Route path="produtos" element={<LojistaProdutosEstoque />} />
                        <Route path="usuarios" element={<LojistaUsuarios />} />
                        <Route path="vendedores" element={<LojistaVendedores />} />
                        <Route path="consultores" element={<LojistaConsultorConfig />} />
                        <Route path="filiais" element={<LojistaFiliais />} />
                        <Route path="qrcode" element={<LojistaQRCode />} />
                        <Route path="pagamentos" element={<LojistaPagamentos />} />
                        <Route path="relatorios" element={<LojistaRelatorios />} />
                        <Route path="cadastro" element={<LojistaCadastro />} />
                        <Route path="integracao" element={<IntegracaoVenda />} />
                        <Route path="profile" element={<LojistaProfile />} />
                    </Route>
                    
                    {/* === VENDEDOR === */}
                    <Route path="/vendedor/login" element={<VendedorLogin />} />
                    <Route path="/vendedor/register" element={<VendedorRegisterPage />} />
                    <Route path="/vendedor/dashboard" element={<ProtectedRoute component={VendedorDashboardLayout} redirectTo="/vendedor/dashboard" />}>
                        <Route index element={<VendedorHomePanel />} /> 
                        <Route path="relatorio" element={<RelatorioPageVendedor />} />
                        <Route path="clientes" element={<ClientsPage />} /> 
                        <Route path="produtos" element={<ProductsPage />} /> 
                        <Route path="atendimento" element={<VendedorAtendimentoPage />} />
                        <Route path="profile" element={<VendedorProfile />} />
                    </Route>
                    
                    {/* === OUTRAS ROTAS === */}
                    <Route path="/aplicativo-confirmacao" element={<AplicativoConfirmacao />} />
                    <Route path="/approvals" element={<ApprovalsPage />} />
                    <Route path="/awaiting-approval" element={<AwaitingApproval />} />
                    
                    <Route path="*" element={
                        <div style={{ padding: "50px", textAlign: "center" }}>
                            <h1>❌ 404 - Página Não Encontrada</h1>
                            <a href="/" style={{ color: "#2c5aa0" }}>Voltar para Home</a>
                        </div>
                    }/>
                </Routes>
            </div>
        </NotificationProvider>
    );
}

export default App;