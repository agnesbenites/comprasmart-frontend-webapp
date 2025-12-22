// src/pages/LojistaDashboard/pages/LojistaDashboard.jsx
import React from "react";
import { Routes, Route, Outlet, Link, useLocation, Navigate } from "react-router-dom";

/* ===================== PÁGINAS ===================== */
import LojistaHomePanel from "./LojistaHomePanel";
import ProdutosPage from "./produtos/ProdutosPage";
import LojistaUsuarios from "./LojistaUsuarios";
import LojistaVendedores from "./LojistaVendedores";
import LojistaConsultorConfig from "./LojistaConsultorConfig";
import LojistaFiliais from "./LojistaFiliais";
import LojistaQRCode from "./LojistaQRCode";
import LojistaRelatorios from "./LojistaRelatorios";
import LojistaCadastro from "./LojistaCadastro";
import LojistaProfile from "./LojistaProfile";
import IntegracaoVenda from "./IntegracaoVenda";
import PlanosPage from "./planos/Planos.page";
import ExcluirContaLojista from './components/ExcluirContaLojista';

/* ===================== COMPONENTES ===================== */
import TrainingManagementPanel from "../components/TrainingManagementPanel";
import ReportPanelLojista from "../components/ReportPanelLojista";
import GerenciadorPedidos from "../../../shared/components/GerenciadorPedidos";

/* ===================== ESTILOS ===================== */
const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7f9",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#fff",
    paddingTop: "20px",
    boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
  },
  logoTitle: {
    fontSize: "1.5rem",
    padding: "10px 20px 30px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#2c5aa0",
    borderBottom: "1px solid #eee",
  },
  menuItem: {
    display: "block",
    padding: "12px 20px",
    color: "#2c5aa0",
    textDecoration: "none",
    marginRight: "20px",
    borderLeft: "3px solid transparent",
  },
  menuItemActive: {
    display: "block",
    padding: "12px 20px",
    fontWeight: "700",
    color: "#2c5aa0",
    backgroundColor: "#fff",
    borderLeft: "3px solid #2c5aa0",
    marginRight: "20px",
    textDecoration: "none",
  },
  mainContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderBottom: "1px solid #eee",
  },
};

/* ===================== MENU ===================== */
const menuItems = [
  { title: "Dashboard", rota: "" },
  { title: "Pedidos", rota: "pedidos" },
  { title: "Produtos e Estoque", rota: "produtos" },
  { title: "Usuários", rota: "usuarios" },
  { title: "Vendedores", rota: "vendedores" },
  { title: "Consultores", rota: "consultores" },
  { title: "Filiais", rota: "filiais" },
  { title: "QR Codes", rota: "qrcode" },
  { title: "Pagamentos", rota: "pagamentos" },
  { title: "Relatórios", rota: "relatorios" },
  { title: "Treinamentos", rota: "treinamentos" },
  { title: "Cadastro", rota: "cadastro" },
];

/* ===================== LAYOUT ===================== */
const LojistaDashboardLayout = () => {
  const location = useLocation();
  const basePath = "/lojista/dashboard";
  const current = location.pathname.replace(basePath, "").replace(/^\/+/, "");
  const empresaNome = localStorage.getItem("lojistaNome") || "Minha Empresa";

  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logoTitle}>CompraSmart</h2>

        <nav>
          {menuItems.map((item) => {
            const isActive = item.rota === current;
            return (
              <Link
                key={item.rota}
                to={item.rota ? `${basePath}/${item.rota}` : basePath}
                style={isActive ? styles.menuItemActive : styles.menuItem}
                data-cy={`menu-${item.rota || "dashboard"}`}
              >
                {item.title}
              </Link>
            );
          })}

          <Link
            to={`${basePath}/profile`}
            style={current === "profile" ? styles.menuItemActive : styles.menuItem}
            data-cy="menu-profile"
          >
            Meu Perfil
          </Link>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1>Dashboard Lojista</h1>
          <p>Bem-vindo, {empresaNome}</p>
        </header>

        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/* ===================== ROTAS ===================== */
/*
  IMPORTANTE: Como no App.jsx temos:
  
    <Route path="/lojista/*" element={<LojistaDashboard />} />
  
  O React Router já "consumiu" o /lojista, então aqui usamos
  caminhos RELATIVOS (sem o /lojista na frente).
  
  /lojista/* significa que este componente recebe tudo após /lojista/
  Então "dashboard" aqui vira "/lojista/dashboard" na URL final.
*/
export default function LojistaDashboard() {
  return (
    <Routes>
      {/* Rota principal do dashboard com layout */}
      <Route path="dashboard" element={<LojistaDashboardLayout />}>
        <Route index element={<LojistaHomePanel />} />
        <Route path="pedidos" element={<GerenciadorPedidos tipoUsuario="lojista" />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="pagamentos" element={<PlanosPage />} />
        <Route path="usuarios" element={<LojistaUsuarios />} />
        <Route path="vendedores" element={<LojistaVendedores />} />
        <Route path="consultores" element={<LojistaConsultorConfig />} />
        <Route path="filiais" element={<LojistaFiliais />} />
        <Route path="qrcode" element={<LojistaQRCode />} />
        <Route path="relatorios" element={<LojistaRelatorios />} />
        <Route path="treinamentos" element={<TrainingManagementPanel />} />
        <Route path="cadastro" element={<LojistaCadastro />} />
        <Route path="profile" element={<LojistaProfile />} />
        <Route path="integracao" element={<IntegracaoVenda />} />
        <Route path="report" element={<ReportPanelLojista />} />
      </Route>

      {/* Redireciona /lojista para /lojista/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Qualquer rota não encontrada vai para dashboard */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}