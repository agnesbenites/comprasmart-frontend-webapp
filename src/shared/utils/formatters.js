// shared/utils/formatters.js

/**
 * Formata valor para moeda brasileira (R$)
 * @param {number} valor - Valor numérico
 * @returns {string} - Valor formatado (ex: R$ 1.250,00)
 */
export const formatarMoeda = (valor) => {
  if (typeof valor !== 'number') return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

/**
 * Formata data para formato brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Data formatada (ex: 01/12/2024)
 */
export const formatarData = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dataObj);
};

/**
 * Formata data e hora
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Data e hora formatada (ex: 01/12/2024 14:30)
 */
export const formatarDataHora = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
};

/**
 * Formata apenas hora
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Hora formatada (ex: 14:30)
 */
export const formatarHora = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
};

/**
 * Formata CPF
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (ex: 123.456.789-00)
 */
export const formatarCPF = (cpf) => {
  if (!cpf) return '';
  
  const apenasNumeros = cpf.replace(/\D/g, '');
  
  return apenasNumeros.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  );
};

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} - CNPJ formatado (ex: 12.345.678/0001-00)
 */
export const formatarCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  const apenasNumeros = cnpj.replace(/\D/g, '');
  
  return apenasNumeros.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  );
};

/**
 * Formata telefone
 * @param {string} telefone - Telefone sem formatação
 * @returns {string} - Telefone formatado (ex: (11) 98765-4321)
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

/**
 * Formata porcentagem
 * @param {number} valor - Valor decimal (ex: 0.08 para 8%)
 * @returns {string} - Porcentagem formatada (ex: 8%)
 */
export const formatarPorcentagem = (valor) => {
  if (typeof valor !== 'number') return '0%';
  
  return `${(valor * 100).toFixed(0)}%`;
};

/**
 * Trunca texto longo
 * @param {string} texto - Texto a ser truncado
 * @param {number} limite - Número máximo de caracteres
 * @returns {string} - Texto truncado com "..."
 */
export const truncarTexto = (texto, limite = 50) => {
  if (!texto) return '';
  if (texto.length <= limite) return texto;
  
  return `${texto.substring(0, limite)}...`;
};

/**
 * Capitaliza primeira letra
 * @param {string} texto - Texto
 * @returns {string} - Texto com primeira letra maiúscula
 */
export const capitalizarPrimeiraLetra = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Remove acentos de um texto
 * @param {string} texto - Texto com acentos
 * @returns {string} - Texto sem acentos
 */
export const removerAcentos = (texto) => {
  if (!texto) return '';
  
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};