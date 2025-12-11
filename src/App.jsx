// src/App.jsx - VERSÀO CORRIGIDA SEM CARACTERES ESPECIAIS
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { supabase } from './supabaseClient';

// --- IMPORTACOES DE PAGINAS PUBLICAS ---
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import LoginsPanel from "./pages/LoginsPanel";
import TermsPage from "./pages/TermsPage";
import AwaitingApproval from "./pages/AwaitingApproval";
import ApprovalsPage from "./pages/ApprovalsPage";
import AplicativoConfirmacao from "./pages/AplicativoConfirmacao";

// --- CADASTROS ---
import RegisterPage from "./pages/RegisterPage";
import LojistaRegisterPage from "./pages/LojistaDashboard/pages/LojistaRegisterPage";
import VendedorRegisterPage from "./pages/VendedorDashboard/pages/VendedorRegisterPage";

// --- LOGINS ---
import ConsultorLogin from "./pages/ConsultorDashboard/pages/Consultant/ConsultorLogin";
import LojistaLogin from "./pages/LojistaDashboard/pages/LojistaLogin";
import VendedorLogin from "./pages/VendedorDashboard/pages/VendedorLogin";
import AdminLogin from "./pages/AdminDashboard/pages/AdminLogin";
import LojistaEscolha from "./pages/LojistaDashboard/pages/LojistaEscolha";

// --- DASHBOARDS ---
import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard";
import LojistaDashboard from "./pages/LojistaDashboard/pages/LojistaDashboard";
import VendedorDashboard from "./pages/VendedorDashboard/pages/VendedorDashboard";
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (error) {
        console.error("Erro ao verificar sessao:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};

const SupabaseCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorDescription = hashParams.get('error_description');
        if (errorDescription) {
          setError(errorDescription);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/entrar';
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ fontSize: '48px' }}>⌛</div>
        <h2 style={{ color: '#2c5aa0' }}>Processando autenticacao...</h2>
        <p style={{ color: '#666' }}>Aguarde um momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ fontSize: '48px' }}>❌</div>
        <h2 style={{ color: '#dc2626' }}>Erro na autenticacao</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <button
          onClick={() => window.location.href = '/entrar'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2c5aa0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Voltar para Login
        </button>
      </div>
    );
  }

  return null;
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>⌛ Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
};

const PlaceholderPage = ({ title, children }) => (
  <div className="p-8 bg-white rounded-xl shadow-lg m-4">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    {children ?? <p className="text-gray-500 mt-2">Conteudo em desenvolvimento.</p>}
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/callback" element={<SupabaseCallback />} />
      <Route path="/" element={<Landingpage />} />
      <Route path="/entrar" element={<LoginsPanel />} />
      <Route path="/login" element={<LoginsPanel />} />
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<TermsPage />} />
      <Route path="/aguardando-aprovacao" element={<AwaitingApproval />} />
      <Route path="/aprovacoes" element={<ApprovalsPage />} />
      <Route path="/aplicativo-confirmacao" element={<AplicativoConfirmacao />} />
      <Route path="/consultor/cadastro" element={<RegisterPage />} />
      <Route path="/lojista/cadastro" element={<LojistaRegisterPage />} />
      <Route path="/vendedor/cadastro" element={<VendedorRegisterPage />} />
      <Route path="/consultor/login" element={<ConsultorLogin />} />
      <Route path="/lojista/login" element={<LojistaLogin />} />
      <Route path="/vendedor/login" element={<VendedorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/lojista/escolha" element={<LojistaEscolha />} />
      <Route path="/agnes-admin-2025" element={<Navigate to="/admin/login" replace />} />
      <Route path="/consultor/*" element={<ProtectedRoute><ConsultorDashboard /></ProtectedRoute>} />
      <Route path="/lojista/*" element={<ProtectedRoute><LojistaDashboard /></ProtectedRoute>} />
      <Route path="/vendedor/*" element={<ProtectedRoute><VendedorDashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<PlaceholderPage title="404 - Pagina nao encontrada" />} />
    </Routes>
  );
}

export default App;