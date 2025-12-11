// shared/utils/validators.js

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se valido
 */
export const validarEmail = (email) => {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se valido
 */
export const validarCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove caracteres nao numericos
  const apenasNumeros = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 digitos
  if (apenasNumeros.length !== 11) return false;
  
  // Verifica se todos os digitos sao iguais
  if (/^(\d)\1{10}$/.test(apenasNumeros)) return false;
  
  // Validacao do primeiro digito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(apenasNumeros.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(apenasNumeros.charAt(9))) return false;
  
  // Validacao do segundo digito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(apenasNumeros.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(apenasNumeros.charAt(10))) return false;
  
  return true;
};

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} - true se valido
 */
export const validarCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  const apenasNumeros = cnpj.replace(/\D/g, '');
  
  if (apenasNumeros.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(apenasNumeros)) return false;
  
  // Validacao dos digitos verificadores
  let tamanho = apenasNumeros.length - 2;
  let numeros = apenasNumeros.substring(0, tamanho);
  const digitos = apenasNumeros.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = apenasNumeros.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

/**
 * Valida telefone
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} - true se valido
 */
export const validarTelefone = (telefone) => {
  if (!telefone) return false;
  
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Aceita 10 ou 11 digitos (com ou sem 9 no celular)
  return apenasNumeros.length === 10 || apenasNumeros.length === 11;
};

/**
 * Valida senha forte
 * @param {string} senha - Senha a ser validada
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarSenhaForte = (senha) => {
  if (!senha) {
    return { valido: false, mensagem: 'Senha e obrigatoria' };
  }
  
  if (senha.length < 8) {
    return { valido: false, mensagem: 'Senha deve ter no minimo 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(senha)) {
    return { valido: false, mensagem: 'Senha deve conter ao menos uma letra maiuscula' };
  }
  
  if (!/[a-z]/.test(senha)) {
    return { valido: false, mensagem: 'Senha deve conter ao menos uma letra minuscula' };
  }
  
  if (!/[0-9]/.test(senha)) {
    return { valido: false, mensagem: 'Senha deve conter ao menos um numero' };
  }
  
  return { valido: true, mensagem: 'Senha valida' };
};

/**
 * Valida CEP
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} - true se valido
 */
export const validarCEP = (cep) => {
  if (!cep) return false;
  
  const apenasNumeros = cep.replace(/\D/g, '');
  return apenasNumeros.length === 8;
};

/**
 * Valida URL
 * @param {string} url - URL a ser validada
 * @returns {boolean} - true se valido
 */
export const validarURL = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Valida campo vazio
 * @param {string} valor - Valor a ser validado
 * @returns {boolean} - true se nao estiver vazio
 */
export const validarCampoObrigatorio = (valor) => {
  return valor !== null && valor !== undefined && valor.trim() !== '';
};

/**
 * Valida valor numerico positivo
 * @param {number} valor - Valor a ser validado
 * @returns {boolean} - true se positivo
 */
export const validarValorPositivo = (valor) => {
  return typeof valor === 'number' && valor > 0;
};
