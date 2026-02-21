// src/components/UniversalLogin.jsx
// REMOVIDO: Supabase migrado para Supabase
import React from 'react';

const UniversalLogin = ({ userType = 'lojista', companyName = '', cnpj = '' }) => {
  const { login, logout, isAuthenticated, user, isLoading } = useAuth();

  // Define o redirecionamento baseado no tipo de usuario
  const getRedirectPath = () => {
    const paths = {
      lojista: '/lojista/dashboard',
      vendedor: '/vendedor/dashboard', 
      consultor: '/consultor/dashboard',
      admin: '/admin/dashboard'
    };
    return paths[userType] || '/lojista/dashboard';
  };

  const handleLogin = () => {
    login({
      authorizationParams: {
        redirect_uri: `${window.location.origin}${getRedirectPath()}`,
      },
      appState: {
        returnTo: getRedirectPath(),
        userType: userType
      }
    });
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>o Carregando autenticacao...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Header com informacoes da empresa */}
      {(companyName || cnpj) && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #2f0d51'
        }}>
          {companyName && <p><strong> Empresa:</strong> {companyName}</p>}
          {cnpj && <p><strong> CNPJ:</strong> {cnpj}</p>}
          <button 
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: 'none',
              color: "#2f0d51",
              cursor: 'pointer',
              fontSize: '14px',
              padding: '5px 0'
            }}
          >
            &#8592; Trocar empresa
          </button>
        </div>
      )}

      <h2 style={{ 
        textAlign: 'center', 
        color: "#2f0d51", 
        marginBottom: '10px' 
      }}>
        {getLoginTitle(userType)}
      </h2>

      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '30px' 
      }}>
        Autenticacao gerenciada pelo Supabase
      </p>

      {!isAuthenticated ? (
        <div>
          <button 
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#2f0d51',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}
          >
             Entrar no Sistema
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              &#8592; Voltar para Home
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p> <strong>Autenticado como:</strong></p>
            <p>{user?.name || user?.email}</p>
            <p><small>Tipo: {userType}</small></p>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
             Sair
          </button>
          
          <button 
            onClick={() => window.location.href = getRedirectPath()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#bb25a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
             Ir para Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function para titulos
const getLoginTitle = (userType) => {
  const titles = {
    lojista: 'Login Lojista',
    vendedor: 'Login Vendedor',
    consultor: 'Login Consultor',
    admin: 'Login Administrador'
  };
  return titles[userType] || 'Login';
};

export default UniversalLogin;


