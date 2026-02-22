// src/App.jsx - CORRIGIDO - SEM BrowserRouter AQUI
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { PlanoProvider } from './contexts/PlanoContext';

// Importação das páginas
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import LoginsPanel from "./pages/LoginsPanel";
import TermsPage from "./pages/TermsPage";
import AwaitingApproval from "./pages/AwaitingApproval";
import ApprovalsPage from "./pages/ApprovalsPage";
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao";
import MarketingOnboarding from "./pages/Onboarding/MarketingOnboarding";
import PlanQuiz from "./pages/Quiz/PlanQuiz";
import StripeSuccess from "./pages/StripeSuccess";
import Institucional from "./pages/Institucional";
// import KasBook from "./pages/KasBook";

// Importações de registro
import RegisterPage from "./pages/RegisterPage";
import LojistaRegisterPage from "./pages/LojistaDashboard/pages/LojistaRegisterPage";
import VendedorRegisterPage from "./pages/VendedorDashboard/pages/VendedorRegisterPage";

// Importações de login
import ConsultorLogin from "./pages/ConsultorDashboard/pages/Consultant/ConsultorLogin";
import LojistaLogin from "./pages/LojistaDashboard/pages/LojistaLogin";
import VendedorLogin from "./pages/VendedorDashboard/pages/VendedorLogin";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin";
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha";

// Importações de dashboard
import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard";
import LojistaDashboard from "./pages/LojistaDashboard/LojistaDashboard";
import VendedorDashboard from "./pages/VendedorDashboard/pages/VendedorDashboard";
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard";

// Importação da Arena de Vendas
import ArenaVendasPainel from "./pages/ConsultorDashboard/components/ArenaVendasPainel";

// Componente de callback do Supabase
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

// Componente para rotas protegidas
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

// Componente auxiliar para passar os IDs reais para a Arena
const ArenaRouteWrapper = () => {
  const { user } = useAuth(); // Pega o usuário logado do contexto
  
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Aqui passamos o ID real do usuário e a loja vinculada nos metadados */}
      <ArenaVendasPainel 
        consultorId={user?.id} 
        lojaId={user?.user_metadata?.loja_id || null} 
      />
    </div>
  );
};

// Componente principal da aplicação
function App() {
  return (
    <PlanoProvider>
      <Routes>
        {/* PÁGINA INICIAL */}
        <Route path="/" element={<Landingpage />} />
        
        {/* PÁGINA INSTITUCIONAL */}
        <Route path="/institucional" element={<Institucional />} />
        
        {/* PÁGINA DE CADASTRO PRINCIPAL */}
        <Route path="/cadastro" element={<LojistaRegisterPage />} />
        
        {/* ONBOARDING */}
        <Route path="/onboarding" element={<MarketingOnboarding />} />
        
        {/* QUIZ */}
        <Route path="/quiz" element={<PlanQuiz />} />
        
        {/* STRIPE SUCCESS */}
        <Route path="/stripe-success" element={<StripeSuccess />} />
        
        {/* CADASTROS ESPECÍFICOS */}
        <Route path="/cadastro/lojista" element={<LojistaRegisterPage />} />
        <Route path="/consultor/cadastro" element={<RegisterPage />} />
        <Route path="/lojista/cadastro" element={<LojistaRegisterPage />} />
        <Route path="/vendedor/cadastro" element={<VendedorRegisterPage />} />

        {/* PÁGINAS PÚBLICAS */}
        <Route path="/entrar" element={<LoginsPanel />} />
        <Route path="/login" element={<LoginsPanel />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/privacidade" element={<TermsPage />} />
        <Route path="/aguardando-aprovacao" element={<AwaitingApproval />} />
        <Route path="/aprovacoes" element={<ApprovalsPage />} />
        <Route path="/aplicativo-confirmacao" element={<AplicativoConfirmacao />} />
        <Route path="/callback" element={<SupabaseCallback />} />
	{/* <Route path="/kasbook" element={<KasBook />} /> */}

        {/* LOGINS ESPECÍFICOS */}
        <Route path="/consultor/login" element={<ConsultorLogin />} />
        <Route path="/lojista/login" element={<LojistaLogin />} />
        <Route path="/vendedor/login" element={<VendedorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/lojista/escolha" element={<LojistaEscolha />} />
        <Route path="/agnes-admin-2025" element={<Navigate to="/admin/login" replace />} />

        {/* DASHBOARDS PROTEGIDOS */}
        <Route 
          path="/consultor/dashboard/*" 
          element={
            <ProtectedRoute>
              <ConsultorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* ARENA DE VENDAS - CORRIGIDO COM WRAPPER */}
        <Route 
          path="/consultor/arena" 
          element={
            <ProtectedRoute>
              <ArenaRouteWrapper />
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

        {/* PÁGINA 404 */}
        <Route 
          path="*" 
          element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column',
              backgroundColor: '#f5f5f5'
            }}>
              <h1 style={{ fontSize: '48px', color: '#333', marginBottom: '20px' }}>404</h1>
              <p style={{ fontSize: '18px', color: '#666' }}>Página não encontrada</p>
              <a 
                href="/" 
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#f53342',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                Voltar para a página inicial
              </a>
            </div>
          } 
        />
      </Routes>
    </PlanoProvider>
  );
}

export default App;