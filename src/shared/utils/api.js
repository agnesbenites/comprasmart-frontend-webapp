// shared/utils/api.js

// ====================================
// CONFIGURACAO DA API
// ====================================

const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  
  endpoints: {
    // CONSULTOR
    consultor: {
      register: '/api/consultores/register',
      login: '/api/consultores/login',
      profile: '/api/consultores/profile',
      metricas: (id, periodo) => `/api/consultores/metricas/${id}?periodo=${periodo}`,
      lojas: '/api/consultores/lojas',
      candidatar: '/api/consultores/candidatar-loja',
    },
    
    // VENDEDOR
    vendedor: {
      register: '/api/vendedores/register',
      login: '/api/vendedores/login',
      profile: '/api/vendedores/profile',
      metricas: (id, periodo) => `/api/vendedores/metricas/${id}?periodo=${periodo}`,
    },
    
    // LOJISTA
    lojista: {
      register: '/api/lojistas/register',
      login: '/api/lojistas/login',
      profile: '/api/lojistas/profile',
      produtos: '/api/lojistas/produtos',
      vendedores: '/api/lojistas/vendedores',
      filiais: '/api/lojistas/filiais',
    },
    
    // ADMIN
    admin: {
      login: '/api/admin/login',
      aprovacoes: {
        consultores: '/api/aprovacoes/consultores',
        lojistas: '/api/aprovacoes/lojistas',
        aprovar: (tipo, id) => `/api/aprovacoes/${tipo}/${id}`,
      },
    },
    
    // VENDAS (Compartilhado)
    vendas: {
      criar: '/api/vendas/criar',
      listar: (tipo, id) => `/api/vendas/${tipo}/${id}`,
      buscar: (id) => `/api/vendas/${id}`,
      enviarQRCode: '/api/vendas/enviar-qrcode',
      confirmarPagamento: '/api/vendas/confirmar-pagamento',
      validarQRCode: (paymentIntentId) => `/api/vendas/validar-qrcode/${paymentIntentId}`,
      pendentesCaixa: (lojistaId) => `/api/vendas/pendentes-caixa/${lojistaId}`,
    },
    
    // PAGAMENTO
    payment: {
      create: '/api/payment/create',
      webhook: '/api/webhooks/stripe',
    },
    
    // COMISSOES
    comissoes: {
      consultor: (consultorId) => `/api/comissoes/consultor/${consultorId}`,
      aprovar: (id) => `/api/comissoes/aprovar/${id}`,
      pagar: (id) => `/api/comissoes/pagar/${id}`,
    },
  },
};

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Retorna URL completa do endpoint
 * @param {string} endpoint - Endpoint da API
 * @returns {string} - URL completa
 */
export const getFullUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

/**
 * Faz requisicao GET
 * @param {string} endpoint - Endpoint da API
 * @param {object} options - Opcoes adicionais
 * @returns {Promise} - Resposta da API
 */
export const apiGet = async (endpoint, options = {}) => {
  try {
    const url = getFullUrl(endpoint);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(' Erro na requisicao GET:', error);
    throw error;
  }
};

/**
 * Faz requisicao POST
 * @param {string} endpoint - Endpoint da API
 * @param {object} body - Corpo da requisicao
 * @param {object} options - Opcoes adicionais
 * @returns {Promise} - Resposta da API
 */
export const apiPost = async (endpoint, body = {}, options = {}) => {
  try {
    const url = getFullUrl(endpoint);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(' Erro na requisicao POST:', error);
    throw error;
  }
};

/**
 * Faz requisicao PATCH
 * @param {string} endpoint - Endpoint da API
 * @param {object} body - Corpo da requisicao
 * @param {object} options - Opcoes adicionais
 * @returns {Promise} - Resposta da API
 */
export const apiPatch = async (endpoint, body = {}, options = {}) => {
  try {
    const url = getFullUrl(endpoint);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(' Erro na requisicao PATCH:', error);
    throw error;
  }
};

/**
 * Faz requisicao DELETE
 * @param {string} endpoint - Endpoint da API
 * @param {object} options - Opcoes adicionais
 * @returns {Promise} - Resposta da API
 */
export const apiDelete = async (endpoint, options = {}) => {
  try {
    const url = getFullUrl(endpoint);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(' Erro na requisicao DELETE:', error);
    throw error;
  }
};

/**
 * Salva token de autenticacao
 * @param {string} token - Token JWT
 */
export const salvarToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token de autenticacao
 */
export const removerToken = () => {
  localStorage.removeItem('token');
};

/**
 * Retorna token de autenticacao
 * @returns {string|null} - Token JWT ou null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Verifica se usuario esta autenticado
 * @returns {boolean} - true se autenticado
 */
export const isAutenticado = () => {
  return !!getToken();
};

export default API_CONFIG;
