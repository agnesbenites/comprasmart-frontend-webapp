import axios from "axios";

// 🛑 Ler a variável de ambiente do Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("🚀 Base URL do Axios:", API_BASE_URL);

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false, // Auth0 usa Authorization header, não cookies
});

// Interceptor para adicionar token JWT do Auth0
api.interceptors.request.use(
  async (config) => {
    // Tentar obter token do localStorage (fallback)
    let token = localStorage.getItem('auth0_token');
    
    // Se estiver usando Auth0 React SDK, pegue o token de forma assíncrona
    if (window.auth0Client) {
      try {
        const accessToken = await window.auth0Client.getTokenSilently();
        token = accessToken;
      } catch (error) {
        console.warn('Não foi possível obter token silenciosamente:', error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Token expirado ou inválido');
      
      // Redirecionar para login do Auth0
      if (window.auth0Client) {
        window.auth0Client.loginWithRedirect();
      } else {
        // Fallback: limpar token e recarregar
        localStorage.removeItem('auth0_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Função para configurar o cliente Auth0 globalmente
export const setAuth0Client = (client) => {
  window.auth0Client = client;
};

// Função para atualizar token manualmente
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth0_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth0_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;