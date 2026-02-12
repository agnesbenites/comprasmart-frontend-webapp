// app-frontend/src/api/relatorioIA.service.js
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Obtém o resumo gerado por IA para um mês específico
 */
export async function obterResumoMensalIA({ lojistaId, mesAtual, mesAnterior }) {
  const params = new URLSearchParams({ lojistaId, mesAtual });
  if (mesAnterior) params.append('mesAnterior', mesAnterior);

  const res = await fetch(`${API_BASE}/api/relatorio/mensal/resumo?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao gerar resumo');
  }
  return res.json();
}

/**
 * Regenera/força uma nova análise da IA para um mês específico
 */
export async function regenerarResumoIA({ lojistaId, mesAtual, mesAnterior }) {
  const res = await fetch(`${API_BASE}/api/relatorio/mensal/regenerar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({ lojistaId, mesAtual, mesAnterior }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao regenerar resumo');
  }
  return res.json();
}

/**
 * Obtém histórico de relatórios anteriores
 */
export async function obterHistoricoRelatorios({ lojistaId, limite = 6 }) {
  const params = new URLSearchParams({ lojistaId, limite: String(limite) });

  const res = await fetch(`${API_BASE}/api/relatorio/mensal/historico?${params}`, {
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}` 
    },
  });

  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json();
}

/**
 * ✅ EXPORTAÇÃO DE PDF
 * Gera e faz download do relatório em PDF com análise da IA
 * 
 * @param {Object} params - Parâmetros para geração do PDF
 * @param {string} params.lojistaId - ID do lojista
 * @param {string} params.mesAtual - Mês de referência (formato YYYY-MM-DD, sempre dia 01)
 * @param {string} params.mesAnterior - Mês anterior para comparação (opcional)
 * @param {string} params.nomeArquivo - Nome personalizado para o arquivo (opcional)
 * @returns {Promise<Blob>} Blob do arquivo PDF
 * @throws {Error} Em caso de falha na geração
 */
export async function exportarRelatorioPDFIA({ 
  lojistaId, 
  mesAtual, 
  mesAnterior,
  nomeArquivo 
}) {
  try {
    // Construir query string
    const params = new URLSearchParams({ 
      lojistaId: String(lojistaId), 
      mesAtual 
    });
    
    if (mesAnterior) {
      params.append('mesAnterior', mesAnterior);
    }

    // Fazer requisição para a API
    const response = await fetch(`${API_BASE}/api/relatorio/mensal/exportar-pdf?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Accept': 'application/pdf',
      },
    });

    // Tratar erros
    if (!response.ok) {
      let errorMessage = 'Erro ao gerar PDF';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Se não for JSON, tenta pegar texto
        try {
          errorMessage = await response.text() || errorMessage;
        } catch {}
      }
      throw new Error(errorMessage);
    }

    // Obter blob do PDF
    const pdfBlob = await response.blob();

    // Validar se é realmente um PDF
    if (!pdfBlob.type.includes('pdf') && pdfBlob.type !== 'application/octet-stream') {
      console.warn('Tipo de arquivo inesperado:', pdfBlob.type);
    }

    return pdfBlob;

  } catch (error) {
    console.error('Erro na exportação do PDF:', error);
    throw error;
  }
}

/**
 * ✅ FUNÇÃO UTILITÁRIA
 * Dispara o download automático do PDF no navegador
 * 
 * @param {Object} params - Mesmos parâmetros do exportarRelatorioPDFIA
 * @returns {Promise<void>}
 */
export async function downloadRelatorioPDFIA(params) {
  try {
    // Gerar PDF
    const pdfBlob = await exportarRelatorioPDFIA(params);
    
    // Criar URL do blob
    const url = window.URL.createObjectURL(pdfBlob);
    
    // Nome do arquivo
    const mesFormatado = params.mesAtual.slice(0, 7); // YYYY-MM
    const nomeSugerido = params.nomeArquivo || `Relatorio_IA_${mesFormatado}.pdf`;
    
    // Criar link temporário e clicar
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeSugerido;
    document.body.appendChild(link);
    link.click();
    
    // Limpeza
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error);
    throw error;
  }
}

/**
 * ✅ FUNÇÃO UTILITÁRIA
 * Abre o PDF em uma nova aba (para visualização antes do download)
 * 
 * @param {Object} params - Mesmos parâmetros do exportarRelatorioPDFIA
 * @returns {Promise<void>}
 */
export async function visualizarRelatorioPDFIA(params) {
  try {
    const pdfBlob = await exportarRelatorioPDFIA(params);
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
    
    // Limpar URL após um tempo
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('Erro ao visualizar PDF:', error);
    throw error;
  }
}

/**
 * Utilitário: Obtém o primeiro dia do mês atual no formato YYYY-MM-DD
 */
export function getMesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Utilitário: Obtém o primeiro dia do mês anterior no formato YYYY-MM-DD
 */
export function getMesAnterior() {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Utilitário: Formata um mês no formato YYYY-MM para exibição
 */
export function formatarMesParaExibicao(mes) {
  if (!mes) return '';
  const [ano, mesNum] = mes.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${meses[parseInt(mesNum) - 1]}/${ano}`;
}

/**
 * Utilitário: Valida se uma string de mês está no formato correto
 */
export function validarFormatoMes(mes) {
  if (!mes) return false;
  const regex = /^\d{4}-\d{2}-01$/;
  return regex.test(mes);
}