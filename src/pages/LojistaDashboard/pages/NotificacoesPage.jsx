// src/pages/LojistaDashboard/pages/NotificacoesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../supabaseClient';

const NotificacoesPage = () => {
  const { userProfile } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // todas, lidas, nao-lidas

  useEffect(() => {
    carregarNotificacoes();
  }, [filtro]);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('notificacoes')
        .select('*')
        .eq('loja_id', userProfile?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filtro === 'lidas') {
        query = query.eq('lida', true);
      } else if (filtro === 'nao-lidas') {
        query = query.eq('lida', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      setNotificacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      // Usar dados mockados se der erro
      setNotificacoes(MOCK_NOTIFICACOES);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;

      setNotificacoes(prev =>
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('loja_id', userProfile?.id)
        .eq('lida', false);

      if (error) throw error;

      setNotificacoes(prev =>
        prev.map(n => ({ ...n, lida: true }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const excluirNotificacao = async (id) => {
    if (!confirm('Deseja excluir esta notificação?')) return;

    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotificacoes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const formatarTempo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now - time) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h atrás`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`;
    return time.toLocaleDateString('pt-BR');
  };

  const getIconeTipo = (tipo) => {
    const icones = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      payment: '💳',
      order: '🛒',
      user: '👤',
      system: '⚙️',
    };
    return icones[tipo] || 'ℹ️';
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔔 Notificações</h1>
        {notificacoesNaoLidas > 0 && (
          <span style={styles.badge}>
            {notificacoesNaoLidas} não {notificacoesNaoLidas === 1 ? 'lida' : 'lidas'}
          </span>
        )}
      </div>

      <div style={styles.actions}>
        <div style={styles.filtros}>
          <button
            onClick={() => setFiltro('todas')}
            style={{
              ...styles.filtroButton,
              ...(filtro === 'todas' && styles.filtroButtonActive),
            }}
          >
            Todas ({notificacoes.length})
          </button>
          <button
            onClick={() => setFiltro('nao-lidas')}
            style={{
              ...styles.filtroButton,
              ...(filtro === 'nao-lidas' && styles.filtroButtonActive),
            }}
          >
            Não lidas ({notificacoesNaoLidas})
          </button>
          <button
            onClick={() => setFiltro('lidas')}
            style={{
              ...styles.filtroButton,
              ...(filtro === 'lidas' && styles.filtroButtonActive),
            }}
          >
            Lidas ({notificacoes.length - notificacoesNaoLidas})
          </button>
        </div>

        {notificacoesNaoLidas > 0 && (
          <button onClick={marcarTodasComoLidas} style={styles.marcarTodasButton}>
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📭</span>
          <h3>Nenhuma notificação</h3>
          <p>Você está em dia! Não há notificações para exibir.</p>
        </div>
      ) : (
        <div style={styles.listaNotificacoes}>
          {notificacoes.map(notif => (
            <div
              key={notif.id}
              style={{
                ...styles.notifCard,
                ...(notif.lida ? styles.notifLida : styles.notifNaoLida),
              }}
              onClick={() => !notif.lida && marcarComoLida(notif.id)}
            >
              <div style={styles.notifIcone}>
                {getIconeTipo(notif.tipo)}
              </div>
              <div style={styles.notifContent}>
                <div style={styles.notifHeader}>
                  <h4 style={styles.notifTitulo}>{notif.titulo}</h4>
                  <span style={styles.notifTempo}>
                    {formatarTempo(notif.created_at)}
                  </span>
                </div>
                <p style={styles.notifMensagem}>{notif.mensagem}</p>
                {!notif.lida && <div style={styles.unreadDot}></div>}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  excluirNotificacao(notif.id);
                }}
                style={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

// Dados mockados para fallback
const MOCK_NOTIFICACOES = [
  {
    id: 1,
    titulo: 'Novo pedido recebido',
    mensagem: 'Você recebeu um novo pedido #1234',
    tipo: 'order',
    lida: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: 'Pagamento aprovado',
    mensagem: 'Seu pagamento foi aprovado com sucesso',
    tipo: 'payment',
    lida: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    titulo: 'Bem-vindo ao Kaslee!',
    mensagem: 'Obrigado por se cadastrar. Explore todas as funcionalidades.',
    tipo: 'success',
    lida: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #bb25a6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  filtros: {
    display: 'flex',
    gap: '10px',
  },
  filtroButton: {
    padding: '10px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  filtroButtonActive: {
    borderColor: '#bb25a6',
    backgroundColor: '#bb25a6',
    color: 'white',
  },
  marcarTodasButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  listaNotificacoes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  notifCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
  },
  notifNaoLida: {
    backgroundColor: '#eff6ff',
    borderColor: '#bb25a6',
  },
  notifLida: {
    backgroundColor: 'white',
    opacity: 0.7,
  },
  notifIcone: {
    fontSize: '2rem',
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  notifTitulo: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  notifTempo: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  notifMensagem: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
  unreadDot: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#bb25a6',
  },
  deleteButton: {
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'background-color 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '20px',
  },
};

export default NotificacoesPage;