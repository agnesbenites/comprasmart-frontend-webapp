import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === DEBUG DE IMPORTS ===
console.log("🔄 Iniciando App.jsx");

// === PÁGINAS GERAIS ===
import HomePage from "./pages/HomePage";
console.log("✅ HomePage importada:", !!HomePage);

import LojistaEscolha from "./pages/LojistaEscolha";
console.log("✅ LojistaEscolha importada:", !!LojistaEscolha);

// === CONSULTOR ===
import LoginPage from "./pages/LoginPage";
console.log("✅ LoginPage importada:", !!LoginPage);

import ConsultantRegisterPage from "./pages/ConsultantRegisterPage";
console.log("✅ ConsultantRegisterPage importada:", !!ConsultantRegisterPage);

import TermsPage from "./pages/TermsPage";
console.log("✅ TermsPage importada:", !!TermsPage);

import AwaitingApproval from "./pages/AwaitingApproval";
console.log("✅ AwaitingApproval importada:", !!AwaitingApproval);

import Dashboard from "./pages/Dashboard";
console.log("✅ Dashboard importada:", !!Dashboard);

// === LOJISTA ===
import AdminLogin from "./pages/AdminLogin";
console.log("✅ AdminLogin importada:", !!AdminLogin);

import LojistaDashboard from "./pages/LojistaDashboard";
console.log("✅ LojistaDashboard importada:", !!LojistaDashboard);

import LojistaProducts from "./pages/LojistaProducts";
console.log("✅ LojistaProducts importada:", !!LojistaProducts);

import LojistaUsuarios from "./pages/LojistaUsuarios";
console.log("✅ LojistaUsuarios importada:", !!LojistaUsuarios);

import LojistaVendedores from "./pages/LojistaVendedores";
console.log("✅ LojistaVendedores importada:", !!LojistaVendedores);

import LojistaFiliais from "./pages/LojistaFiliais";
console.log("✅ LojistaFiliais importada:", !!LojistaFiliais);

import LojistaQRCode from "./pages/LojistaQRCode";
console.log("✅ LojistaQRCode importada:", !!LojistaQRCode);

import LojistaCadastro from "./pages/LojistaCadastro";
console.log("✅ LojistaCadastro importada:", !!LojistaCadastro);

import LojistaHomePanel from "./pages/LojistaHomePanel";
console.log("✅ LojistaHomePanel importada:", !!LojistaHomePanel);

// === VENDEDOR ===
import VendedorDashboard from "./pages/VendedorDashboard";
console.log("✅ VendedorDashboard importada:", !!VendedorDashboard);

import VendedorRegisterPage from "./pages/VendedorRegisterPage";
console.log("✅ VendedorRegisterPage importada:", !!VendedorRegisterPage);

import VendedorLogin from "./pages/VendedorLogin";
console.log("✅ VendedorLogin importada:", !!VendedorLogin);

import AdminCadastroVendedor from "./pages/AdminCadastroVendedor";
console.log("✅ AdminCadastroVendedor importada:", !!AdminCadastroVendedor);

import RelatorioPageVendedor from "./pages/RelatorioPageVendedor";
console.log("✅ RelatorioPageVendedor importada:", !!RelatorioPageVendedor);

// === ADMIN ===
import AdminDashboard from "./pages/AdminDashboard";
console.log("✅ AdminDashboard importada:", !!AdminDashboard);

import AdminAprovacao from "./pages/AdminAprovacao";
console.log("✅ AdminAprovacao importada:", !!AdminAprovacao);

// === ATENDIMENTO/VENDAS ===
import ChatPanel from "./pages/ChatPanel";
console.log("✅ ChatPanel importada:", !!ChatPanel);

import ProductsPage from "./pages/ProductsPage";
console.log("✅ ProductsPage importada:", !!ProductsPage);

import ClientsPage from "./pages/ClientsPage";
console.log("✅ ClientsPage importada:", !!ClientsPage);

function App() {
  console.log("🎯 App component montado");

  return (
    <Router>
      <div className="App">
        {/* === NAVEGAÇÃO SIMPLES === */}
        <nav
          style={{
            padding: "10px",
            backgroundColor: "#2c5aa0",
            color: "white",
            marginBottom: "20px",
          }}
        >
          <strong>🧭 NAVEGAÇÃO:</strong>
          <a href="/" style={{ color: "white", margin: "0 10px" }}>
            Home
          </a>
          <a href="/login" style={{ color: "white", margin: "0 10px" }}>
            Login
          </a>
          <a
            href="/lojista/escolha"
            style={{ color: "white", margin: "0 10px" }}
          >
            Lojista
          </a>
          <a
            href="/vendedor/login"
            style={{ color: "white", margin: "0 10px" }}
          >
            Vendedor
          </a>
          <a
            href="/atendimento"
            style={{ color: "white", margin: "0 10px" }}
          >
            Atendimento
          </a>
        </nav>

        <Routes>
          {/* === HOME === */}
          <Route path="/" element={<HomePage />} />

          {/* === CONSULTOR === */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ConsultantRegisterPage />} />
          <Route path="/aguardando-aprovacao" element={<AwaitingApproval />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/termos" element={<TermsPage />} />

          {/* === LOJISTA === */}
          <Route path="/lojista/escolha" element={<LojistaEscolha />} />
          <Route path="/lojista/login" element={<AdminLogin />} />
          <Route path="/lojista/dashboard" element={<LojistaDashboard />} />
          <Route path="/lojista/produtos" element={<LojistaProducts />} />
          <Route path="/lojista/usuarios" element={<LojistaUsuarios />} />
          <Route path="/lojista/vendedores" element={<LojistaVendedores />} />
          <Route path="/lojista/filiais" element={<LojistaFiliais />} />
          <Route path="/lojista/qrcode" element={<LojistaQRCode />} />
          <Route path="/lojista/cadastro" element={<LojistaCadastro />} />
          <Route path="/lojista/home" element={<LojistaHomePanel />} />

          {/* === VENDEDOR === */}
          <Route path="/vendedor/login" element={<VendedorLogin />} />
          <Route path="/vendedor/dashboard" element={<VendedorDashboard />} />
          <Route path="/vendedor/register" element={<VendedorRegisterPage />} />
          <Route
            path="/vendedor/cadastro"
            element={<AdminCadastroVendedor />}
          />
	  <Route path="/relatorios" element={<RelatorioPageVendedor />} />

          {/* === ATENDIMENTO/VENDAS === */}
          <Route path="/atendimento" element={<ChatPanel />} />
          <Route path="/chat" element={<ChatPanel />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />

          {/* === ADMIN === */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/aprovacao" element={<AdminAprovacao />} />
          <Route
            path="/admin/cadastro-vendedor"
            element={<AdminCadastroVendedor />}
          />

          {/* === 404 === */}
          <Route
            path="*"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>❌ 404 - Página Não Encontrada</h1>
                <p>
                  Rota: <strong>{window.location.pathname}</strong>
                </p>
                <a href="/" style={{ color: "#2c5aa0" }}>
                  Voltar para Home
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;