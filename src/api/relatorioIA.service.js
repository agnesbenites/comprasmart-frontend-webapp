// app-frontend/src/api/relatorioIA.service.js
const API_BASE = import.meta.env.VITE_API_URL || '';

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

export async function obterHistoricoRelatorios({ lojistaId, limite = 6 }) {
  const params = new URLSearchParams({ lojistaId, limite: String(limite) });

  const res = await fetch(`${API_BASE}/api/relatorio/mensal/historico?${params}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
  });

  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json();
}

export function getMesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

export function getMesAnterior() {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}
