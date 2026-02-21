// src/pages/LojistaDashboard/LojistaDashboard.jsx - VERSÃO FINAL CORRIGIDA
import React, { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

/* ===================== PÁGINAS ===================== */
import LojistaHomePanel from "./pages/LojistaHomePanel";
import ProdutosPage from "./pages/produtos/ProdutosPage";
import LojistaUsuarios from "./pages/LojistaUsuarios";
import LojistaVendedores from "./pages/LojistaVendedores";
import LojistaConsultorConfig from "./pages/LojistaConsultorConfig";
import LojistaFiliais from "./pages/LojistaFiliais";
import LojistaQRCode from "./pages/LojistaQRCode";
import LojistaRelatorios from "./pages/LojistaRelatorios";
import LojistaCadastro from "./pages/LojistaCadastro";
import LojistaProfile from "./pages/LojistaProfile";
import IntegracaoVenda from "./pages/IntegracaoVenda";
import LojistaCupom from "./pages/LojistaCupom";
import LojistaLive from "./pages/LojistaLive";
import PlanosPage from "./pages/planos/Planos.page";
import DashboardEnterprise from "./pages/DashboardEnterprise";
import NotificacoesPage from "./pages/NotificacoesPage"; 

/* ===================== COMPONENTES ===================== */
import MenuLateral from "./components/MenuLateral";
import TrainingManagementPanel from "./components/TrainingManagementPanel";
import ReportPanelLojista from "./components/ReportPanelLojista";
import GerenciadorPedidos from "../../shared/components/GerenciadorPedidos";

// Importar ArenaVendasPainel do ConsultorDashboard
import ArenaVendasPainel from "../ConsultorDashboard/components/ArenaVendasPainel";

/* ===================== ESTILOS ===================== */
const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#fff",
    boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  logoTitle: {
    fontSize: "1.5rem",
    padding: "25px 20px",
    textAlign: "center",
    fontWeight: "700",
    color: "#bb25a6",
    borderBottom: "2px solid #e2e8f0",
    background: "linear-gradient(135deg, #2f0d51 0%, #bb25a6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  mainContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderBottom: "2px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 5px 0",
  },
  headerSubtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    margin: 0,
  },
  contentArea: {
    padding: "30px",
    flexGrow: 1,
    overflowY: "auto",
  },
};

/* ===================== LAYOUT ===================== */
const LojistaDashboardLayout = () => {
  const empresaNome = localStorage.getItem("lojistaNome") || "Empresa 999999";
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div style={styles.dashboardContainer}>

      {/* OVERLAY mobile */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 20,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        position: menuAberto ? 'fixed' : 'relative',
        top: 0, left: 0, height: menuAberto ? '100vh' : undefined,
        zIndex: 30,
        transform: 'translateX(0)',
      }} className={`lojista-sidebar${menuAberto ? ' sidebar-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.logoTitle}>Kaslee</h2>
          <button
            onClick={() => setMenuAberto(false)}
            className="sidebar-close-btn"
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#999', paddingRight: '16px' }}
          >✕</button>
        </div>
        <MenuLateral onNavigate={() => setMenuAberto(false)} />
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ ...styles.mainContent, minWidth: 0 }}>
        <header style={{ ...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMenuAberto(true)}
              className="hamburger-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '4px', padding: '4px' }}
            >
              <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
              <span style={{ width: '20px', height: '2px', backgroundColor: '#2f0d51', display: 'block' }}></span>
            </button>
            <div>
              <h1 style={styles.headerTitle}>Dashboard Lojista</h1>
              <p style={styles.headerSubtitle}>Bem-vindo, {empresaNome}</p>
            </div>
          </div>
        </header>

        <div style={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/* ===================== ROTAS ===================== */
export default function LojistaDashboard() {
  // Simulando dados do usuário (em produção, viria do contexto de autenticação)
  const user = { id: "lojista-123" };
  const lojaAtual = { id: "loja-456" };

  return (
    <Routes>
      {/* Rota principal do dashboard com layout */}
      <Route path="dashboard" element={<LojistaDashboardLayout />}>
        <Route index element={<LojistaHomePanel />} />
        <Route path="integracao" element={<IntegracaoVenda />} />
        <Route path="pedidos" element={<GerenciadorPedidos tipoUsuario="lojista" />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="pagamentos" element={<PlanosPage />} />
        <Route path="usuarios" element={<LojistaUsuarios />} />
        <Route path="vendedores" element={<LojistaVendedores />} />
        <Route path="consultores" element={<LojistaConsultorConfig />} />
        <Route path="filiais" element={<LojistaFiliais />} />
        <Route path="qrcode" element={<LojistaQRCode />} /> {/*  SEM HÍFEN */}
        <Route path="notificacoes" element={<NotificacoesPage />} /> {/*  NOVO */}
        <Route path="relatorios" element={<LojistaRelatorios />} />
        <Route path="treinamentos" element={<TrainingManagementPanel />} />
        <Route path="cadastro" element={<LojistaCadastro />} />
        <Route path="profile" element={<LojistaProfile />} />
        <Route path="meu-perfil" element={<LojistaProfile />} />
        <Route path="report" element={<ReportPanelLojista />} />
        <Route path="cupom" element={<LojistaCupom />} />
        <Route path="live" element={<LojistaLive />} />
        <Route path="enterprise" element={<DashboardEnterprise />} />
        {/*  NOVA ROTA DA ARENA DE VENDAS */}
        <Route
          path="arena"
          element={
            <ArenaVendasPainel
              consultorId={user?.id}
              lojaId={lojaAtual?.id || null}
            />
          }
        />
      </Route>

      {/*  Redireciona /lojista para /lojista/dashboard com CAMINHO ABSOLUTO */}
      <Route index element={<Navigate to="/lojista/dashboard" replace />} />
      
      {/*  Qualquer rota não encontrada vai para dashboard com CAMINHO ABSOLUTO */}
      <Route path="*" element={<Navigate to="/lojista/dashboard" replace />} />
    </Routes>
  );
}