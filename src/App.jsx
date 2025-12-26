// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // USA O CONTEXTO!

/* =========================
   PAGINAS PUBLICAS
========================= */
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import LoginsPanel from "./pages/LoginsPanel";
import TermsPage from "./pages/TermsPage";
import AwaitingApproval from "./pages/AwaitingApproval";
import ApprovalsPage from "./pages/ApprovalsPage";
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao";

/* =========================
   CADASTROS
========================= */
import RegisterPage from "./pages/RegisterPage";
import LojistaRegisterPage from "./pages/LojistaDashboard/pages/LojistaRegisterPage";
import VendedorRegisterPage from "./pages/VendedorDashboard/pages/VendedorRegisterPage";

/* =========================
   LOGINS
========================= */
import ConsultorLogin from "./pages/ConsultorDashboard/pages/Consultant/ConsultorLogin";
import LojistaLogin from "./pages/LojistaDashboard/pages/LojistaLogin";
import VendedorLogin from "./pages/VendedorDashboard/pages/VendedorLogin";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin";
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha";

/* =========================
   DASHBOARDS
========================= */
import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard";
import LojistaDashboard from "./pages/LojistaDashboard/pages/LojistaDashboard";
import VendedorDashboard from "./pages/VendedorDashboard/pages/VendedorDashboard";
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard";

/* =========================
   CALLBACK SUPABASE
========================= */
const SupabaseCallback = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(
        window.location.hash.replace("#", "")
      );
      const errorDescription = params.get("error_description");

      if (errorDescription) {
        setError(errorDescription);
      }
    } catch (e) {
      setError("Erro no callback de autenticacao");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/entrar";
      }, 3000);
    }
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Processando autenticacao...</p>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Erro na autenticacao</h2>
        <p>{error}</p>
        <button onClick={() => (window.location.href = "/entrar")}>
          Voltar
        </button>
      </div>
    );
  }

  return null;
};

/* =========================
   ROTA PROTEGIDA
========================= */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // USA O useAuth DO CONTEXTO!
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  if (adminOnly && user.app_metadata?.role !== "admin") {
    return <Navigate to="/entrar" replace />;
  }

  return children;
};

/* =========================
   APP
========================= */
function App() {
  return (
    <Routes>
      {/* Publicas */}
      <Route path="/" element={<Landingpage />} />
      <Route path="/entrar" element={<LoginsPanel />} />
      <Route path="/login" element={<LoginsPanel />} />
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<TermsPage />} />
      <Route path="/aguardando-aprovacao" element={<AwaitingApproval />} />
      <Route path="/aprovacoes" element={<ApprovalsPage />} />
      <Route path="/aplicativo-confirmacao" element={<AplicativoConfirmacao />} />
      <Route path="/callback" element={<SupabaseCallback />} />

      {/* Cadastros */}
      <Route path="/consultor/cadastro" element={<RegisterPage />} />
      <Route path="/lojista/cadastro" element={<LojistaRegisterPage />} />
      <Route path="/vendedor/cadastro" element={<VendedorRegisterPage />} />

      {/* Logins */}
      <Route path="/consultor/login" element={<ConsultorLogin />} />
      <Route path="/lojista/login" element={<LojistaLogin />} />
      <Route path="/vendedor/login" element={<VendedorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/lojista/escolha" element={<LojistaEscolha />} />

      {/* Atalho admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdminRoute />}>
       <Route index element={<AdminDashboard />} />
       <Route path="dashboard" element={<AdminDashboard />} />
       <Route path="lojistas" element={<AdminLojistas />} />
       <Route path="consultores" element={<AdminConsultores />} />
       <Route path="manutencao" element={<AdminManutencao />} />
       <Route path="scores" element={<ScoreStatisticsPanel />} />
       <Route path="cadastro-vendedor" element={<AdminCadastroVendedor />} />
       <Route path="aprovacoes" element={<AdminAprovacao />} />
      />

      {/* Dashboards protegidos */}
      <Route
        path="/consultor/*"
        element={
          <ProtectedRoute>
            <ConsultorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lojista/*"
        element={
          <ProtectedRoute>
            <LojistaDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendedor/*"
        element={
          <ProtectedRoute>
            <VendedorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<h1 style={{ textAlign: "center" }}>404 - Pagina nao encontrada</h1>}
      />
    </Routes>
  );
}

export default App;