import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// === PÁGINAS GERAIS ===
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsPage";
import AwaitingApproval from "./pages/AwaitingApproval";
import ProductsPage from "./pages/ProductsPage";
import ClientsPage from "./pages/ClientsPage";

// === CONSULTOR ===
import { ConsultorRegister, ConsultorDashboard, ChatPanel } from "./pages/ConsultorDashboard";

// === LOJISTA ===
import { 
  LojistaEscolha, 
  LojistaDashboard, 
  LojistaProducts, 
  LojistaUsuarios, 
  LojistaVendedores, 
  LojistaFiliais, 
  LojistaQRCode, 
  LojistaCadastro, 
  LojistaHomePanel, 
  LojistaPagamentos, 
  LojistaRelatorios 
} from "./pages/LojistaDashboard";

// === VENDEDOR ===
import VendedorDashboard from "./pages/VendedorDashboard";
import VendedorRegisterPage from "./pages/VendedorRegisterPage";
import VendedorLogin from "./pages/VendedorLogin";
import RelatorioPageVendedor from "./pages/RelatorioPageVendedor";

// === ADMIN ===
import { AdminLogin, AdminCadastroVendedor, AdminDashboard, AdminAprovacao } from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        {/* === NAVEGAÇÃO SIMPLES === */}
        <nav style={{ padding: "10px", backgroundColor: "#2c5aa0", color: "white", marginBottom: "20px" }}>
          <strong>🧭 NAVEGAÇÃO:</strong>
          <Link to="/" style={{ color: "white", margin: "0 10px" }}>Home</Link>
          <Link to="/login" style={{ color: "white", margin: "0 10px" }}>Login</Link>
          <Link to="/lojista/escolha" style={{ color: "white", margin: "0 10px" }}>Lojista</Link>
          <Link to="/vendedor/login" style={{ color: "white", margin: "0 10px" }}>Vendedor</Link>
          <Link to="/atendimento" style={{ color: "white", margin: "0 10px" }}>Atendimento</Link>
        </nav>

        <Routes>
          {/* === HOME === */}
          <Route path="/" element={<HomePage />} />

          {/* === CONSULTOR === */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ConsultorRegister />} />
          <Route path="/aguardando-aprovacao" element={<AwaitingApproval />} />
          <Route path="/dashboard" element={<ConsultorDashboard />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/atendimento" element={<ChatPanel />} />
          <Route path="/chat" element={<ChatPanel />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />

          {/* === LOJISTA === */}
          <Route path="/lojista/escolha" element={<LojistaEscolha />} />
          <Route path="/lojista/login" element={<AdminLogin />} />
          <Route path="/lojista" element={<LojistaDashboard />}>
            <Route index element={<LojistaHomePanel />} />
            <Route path="produtos" element={<LojistaProducts />} />
            <Route path="usuarios" element={<LojistaUsuarios />} />
            <Route path="vendedores" element={<LojistaVendedores />} />
            <Route path="filiais" element={<LojistaFiliais />} />
            <Route path="qrcode" element={<LojistaQRCode />} />
            <Route path="cadastro" element={<LojistaCadastro />} />
            <Route path="home" element={<LojistaHomePanel />} />
            <Route path="pagamentos" element={<LojistaPagamentos />} />
            <Route path="relatorios" element={<LojistaRelatorios />} />
          </Route>

          {/* === VENDEDOR === */}
          <Route path="/vendedor/login" element={<VendedorLogin />} />
          <Route path="/vendedor/dashboard" element={<VendedorDashboard />} />
          <Route path="/vendedor/register" element={<VendedorRegisterPage />} />
          <Route path="/vendedor/cadastro" element={<AdminCadastroVendedor />} />
          <Route path="/relatorios" element={<RelatorioPageVendedor />} />

          {/* === ADMIN === */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/aprovacao" element={<AdminAprovacao />} />
          <Route path="/admin/cadastro-vendedor" element={<AdminCadastroVendedor />} />

          {/* === 404 === */}
          <Route
            path="*"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>❌ 404 - Página Não Encontrada</h1>
                <p>Rota: <strong>{window.location.pathname}</strong></p>
                <Link to="/" style={{ color: "#2c5aa0" }}>Voltar para Home</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
