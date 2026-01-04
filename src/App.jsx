// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { PlanoProvider } from './contexts/PlanoContext';

import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import LoginsPanel from "./pages/LoginsPanel";
import TermsPage from "./pages/TermsPage";
import AwaitingApproval from "./pages/AwaitingApproval";
import ApprovalsPage from "./pages/ApprovalsPage";
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao";
import MarketingOnboarding from "./pages/Onboarding/MarketingOnboarding"; // ✅ NOVO

import RegisterPage from "./pages/RegisterPage";
import LojistaRegisterPage from "./pages/LojistaDashboard/pages/LojistaRegisterPage";
import VendedorRegisterPage from "./pages/VendedorDashboard/pages/VendedorRegisterPage";

import ConsultorLogin from "./pages/ConsultorDashboard/pages/Consultant/ConsultorLogin";
import LojistaLogin from "./pages/LojistaDashboard/pages/LojistaLogin";
import VendedorLogin from "./pages/VendedorDashboard/pages/VendedorLogin";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin";
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha";

import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard";
import LojistaDashboard from "./pages/LojistaDashboard/LojistaDashboard"; // ✅ CORRIGIDO
import VendedorDashboard from "./pages/VendedorDashboard/pages/VendedorDashboard";
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard";

const SupabaseCallback = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.hash.replace("#", ""));
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
        <button onClick={() => (window.location.href = "/entrar")}>Voltar</button>
      </div>
    );
  }

  return null;
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
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

function App() {
  return (
    <PlanoProvider>
      <Routes>
        {/* Página inicial - Onboarding */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<MarketingOnboarding />} />
        <Route path="/cadastro/lojista" element={<LojistaRegisterPage />} />

        {/* Páginas públicas */}
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
        <Route path="/agnes-admin-2025" element={<Navigate to="/admin/login" replace />} />

        {/* Dashboards protegidos */}
        <Route path="/consultor/dashboard/*" element={<ProtectedRoute><ConsultorDashboard /></ProtectedRoute>} />
        <Route path="/lojista/*" element={<ProtectedRoute><LojistaDashboard /></ProtectedRoute>} />
        <Route path="/vendedor/*" element={<ProtectedRoute><VendedorDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<h1 style={{ textAlign: "center" }}>404 - Pagina nao encontrada</h1>} />
      </Routes>
    </PlanoProvider>
  );
}

export default App;