// src/hooks/useAuth.js (VERSÃO CORRIGIDA)
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuth = (userType = 'lojista') => {
  const { 
    loginWithRedirect, 
    logout, 
    isAuthenticated, 
    user, 
    isLoading
  } = useAuth0();
  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redireciona automaticamente para o dashboard correto após autenticação
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const currentPath = location.pathname;
      
      // Se estiver na página de login, redireciona para o dashboard
      if (currentPath.includes('/login')) {
        const dashboardPath = `/${userType}/dashboard`;
        console.log(`✅ Autenticado! Redirecionando para: ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, userType, navigate, location.pathname]);

  const handleLogin = async () => {
    const dashboardPath = `/${userType}/dashboard`;
    
    console.log(`🔧 Login: ${userType} | Destino após login: ${dashboardPath}`);
    
    try {
      await loginWithRedirect({
        appState: {
          returnTo: dashboardPath // ✅ Passa o destino via appState
        },
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });
    } catch (error) {
      console.error('❌ Erro no login:', error);
    }
  };

  const handleLogout = () => {
    // Limpa dados do localStorage
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    
    logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated,
    user,
    isLoading,
    userType
  };
};