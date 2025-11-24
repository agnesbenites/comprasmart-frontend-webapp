import React from "react";
// Importamos o Navigate para fazer o redirecionamento
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"; 

// === PÁGINAS PRINCIPAIS ===
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

// === ADMIN ===
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin.jsx";
import AdminAprovacao from "./pages/AdminDashboard/pages/AdminAprovacao.jsx";
import AdminCadastroVendedor from "./pages/AdminDashboard/pages/AdminCadastroVendedor.jsx";

// === CONSULTOR ===
// CORRIGIDO: O Dashboard do Consultor está em pages/ConsultorDashboard/pages/ConsultorDashboard.jsx
import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard.jsx";
import ConsultorRegister from "./pages/ConsultorDashboard/pages/ConsultorRegister.jsx";
import ConsultantLoginPage from "./pages/ConsultorDashboard/pages/Consultant/LoginPage.jsx";
// Se houver uma Dashboard separada para o Consultant, precisamos ter o caminho certo. Assumindo ConsultorDashboard é o layout principal.


// === LOJISTA ===
// 1. IMPORTAÇÃO PADRÃO (DEFAULT): O componente de Layout que contém o Outlet.
import LojistaDashboard from "./pages/LojistaDashboard/pages/LojistaDashboard.jsx"; 
// 2. IMPORTAÇÕES CORRIGIDAS: Importa de arquivos individuais (visto no `find` do terminal)
import LojistaHomePanel from "./pages/LojistaDashboard/pages/LojistaHomePanel.jsx";
import LojistaProducts from "./pages/LojistaDashboard/pages/LojistaProducts.jsx";
import LojistaUsuarios from "./pages/LojistaDashboard/pages/LojistaUsuarios.jsx";
import LojistaVendedores from "./pages/LojistaDashboard/pages/LojistaVendedores.jsx";
import LojistaFiliais from "./pages/LojistaDashboard/pages/LojistaFiliais.jsx";
import LojistaQRCode from "./pages/LojistaDashboard/pages/LojistaQRCode.jsx";
import LojistaPagamentos from "./pages/LojistaDashboard/pages/LojistaPagamentos.jsx";
import LojistaRelatorios from "./pages/LojistaDashboard/pages/LojistaRelatorios.jsx";
import IntegracaoVenda from "./pages/LojistaDashboard/pages/IntegracaoVenda.jsx";
// 3. CORREÇÃO DE IMPORTAÇÃO: Importando Escolha e Cadastro de seus próprios arquivos
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha.jsx";
import LojistaCadastro from "./pages/LojistaDashboard/pages/LojistaCadastro.jsx";


// === VENDEDOR ===
import VendedorDashboard from "./pages/VendedorDashboard.jsx";
import VendedorLogin from "./pages/VendedorLogin.jsx";
import VendedorRegisterPage from "./pages/VendedorRegisterPage.jsx";

// === OUTRAS PÁGINAS ===
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao.jsx";
import ApprovalsPage from "./pages/ApprovalsPage.jsx";
import AwaitingApproval from "./pages/AwaitingApproval.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import RelatorioPageVendedor from "./pages/RelatorioPageVendedor.jsx";
import TermsPage from "./pages/TermsPage.jsx";

// Componente de navegação simplificado
const Navigation = () => {
  const location = useLocation();
  const path = location.pathname;

  // Estilos (MANTIDOS)
  const linkStyle = { color: "#555", textDecoration: "none", fontWeight: "500", padding: "8px 16px", borderRadius: "8px", transition: "all 0.3s ease", fontSize: "14px", };
  const linksStyle = { display: "flex", gap: "25px", alignItems: "center", };
  const logoStyle = { fontSize: "24px", fontWeight: "bold", color: "#2c5aa0", };
  const navContentStyle = { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", };
  const navStyle = { background: "white", padding: "15px 30px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", borderBottom: "1px solid #eaeaea", marginBottom: "0", position: "sticky", top: 0, zIndex: 1000, };
  
  // ✅ PÁGINAS QUE NÃO DEVEM TER MENU SUPERIOR
  const noMenuPages = [
    '/',
    '/login',
    '/admin/login',
    '/consultor/login', 
    '/consultor/register',
    '/vendedor/login',
    '/vendedor/register',
    '/lojista/escolha',
    '/lojista/login',
    '/lojista/integracao'
  ];

  // ✅ NÃO mostrar navegação nas páginas da lista
  if (noMenuPages.some(page => path === page || path.includes(page))) {
    return null;
  }

  const getNavigationMenu = () => {
    // Corrigido links de navegação para usar o padrão /role/dashboard
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
          <a href="/vendedor/dashboard" style={linkStyle}>💼 Vendedor</a>
          <a href="/consultor/dashboard" style={linkStyle}>🔍 Consultor</a>
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
      </div>
    </nav>
  );
};


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />

        <Routes>
          {/* === PÁGINAS PÚBLICAS === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* === ADMIN === */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/aprovacao" element={<AdminAprovacao />} />
          <Route path="/admin/cadastro-vendedor" element={<AdminCadastroVendedor />} />
          
          {/* === CONSULTOR === */}
          <Route path="/consultor/login" element={<ConsultantLoginPage />} />
          <Route path="/consultor/register" element={<ConsultorRegister />} />
          <Route path="/consultor/dashboard" element={<ConsultorDashboard />} />
          
          {/* === LOJISTA === */}
          {/* Páginas públicas do lojista */}
          <Route path="/lojista/escolha" element={<LojistaEscolha />} />
          <Route path="/lojista/login" element={<LoginPage />} /> 
          
          {/* 💡 REDIRECIONAMENTO: Garante que /lojista vá para o dashboard padrão */}
          <Route path="/lojista" element={<Navigate to="/lojista/dashboard" replace />} />
          
          {/* Dashboard do lojista (rotas aninhadas sob o novo padrão) */}
          <Route path="/lojista/dashboard" element={<LojistaDashboard />}>
            <Route index element={<LojistaHomePanel />} /> {/* Rota padrão para /lojista/dashboard */}
            <Route path="home" element={<LojistaHomePanel />} />
            <Route path="produtos" element={<LojistaProducts />} />
            <Route path="usuarios" element={<LojistaUsuarios />} />
            <Route path="vendedores" element={<LojistaVendedores />} />
            <Route path="filiais" element={<LojistaFiliais />} />
            <Route path="qrcode" element={<LojistaQRCode />} />
            <Route path="pagamentos" element={<LojistaPagamentos />} />
            <Route path="relatorios" element={<LojistaRelatorios />} />
            <Route path="cadastro" element={<LojistaCadastro />} />
            <Route path="integracao" element={<IntegracaoVenda />} />
          </Route>
          
          {/* === VENDEDOR === */}
          <Route path="/vendedor/login" element={<VendedorLogin />} />
          <Route path="/vendedor/register" element={<VendedorRegisterPage />} />
          <Route path="/vendedor/dashboard" element={<VendedorDashboard />} />
          <Route path="/vendedor/relatorio" element={<RelatorioPageVendedor />} />
          
          {/* === OUTRAS ROTAS === */}
          <Route path="/aplicativo-confirmacao" element={<AplicativoConfirmacao />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/awaiting-approval" element={<AwaitingApproval />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          
          {/* === 404 === */}
          <Route path="*" element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h1>❌ 404 - Página Não Encontrada</h1>
              <a href="/" style={{ color: "#2c5aa0" }}>Voltar para Home</a>
            </div>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;