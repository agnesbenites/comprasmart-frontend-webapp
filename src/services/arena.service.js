// src/services/arena.service.js
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function criarOuObterSessao({ consultorId, produtoId, cenarioId, produtoGenerico = false }) {
  const params = new URLSearchParams({ consultorId, produtoId, cenarioId, produtoGenerico });
  const res = await fetch(`${API_BASE}/api/arena/sessoes?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao criar ou obter sessão');
  }
  return res.json();
}

export async function enviarMensagem(sessaoId, mensagem) {
  const res = await fetch(`${API_BASE}/api/arena/mensagem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({ sessaoId, mensagem }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao enviar mensagem');
  }
  return res.json();
}

export async function abandonarSessao(sessaoId) {
  const res = await fetch(`${API_BASE}/api/arena/abandonar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({ sessaoId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao abandonar sessão');
  }
  return res.json();
}
