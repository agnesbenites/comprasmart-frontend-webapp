// src/pages/LojistaDashboard/components/ArenaConfig.jsx
// Gerenciamento da Arena de Vendas pelo lojista

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = '#2f0d51';
const CONSULTOR_ACCENT  = '#bb25a6';
const VERDE_DESTAQUE    = '#6BCB77';

const styles = {
  container: {
    padding: 24,
    background: '#fff',
    borderRadius: 16,
    fontFamily: "'Inter', sans-serif",
  },

  header: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  // Status atual
  statusBox: {
    background: '#F0F7FF',
    border: `2px solid ${CONSULTOR_ACCENT}33`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusTitulo: {
    fontSize: 16,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  statusAtivo: {
    background: '#E8F5E9',
    color: '#2E7D32',
  },
  statusInativo: {
    background: '#FFEBEE',
    color: '#C62828',
  },

  // Grid de info
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginTop: 16,
  },
  infoCard: {
    background: '#fff',
    border: '1px solid #E0E0E0',
    borderRadius: 10,
    padding: 14,
    textAlign: 'center',
  },
  infoNumero: {
    fontSize: 20,
    fontWeight: 800,
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
  infoRotulo: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  // Toggle
  toggleBox: {
    background: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  toggleSwitch: {
    position: 'relative',
    width: 48,
    height: 26,
    borderRadius: 13,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  toggleSlider: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    transition: 'transform 0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },

  // Planos (se não tiver assinatura)
  planosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 24,
  },
  planoCard: {
    background: '#FAFAFA',
    border: '2px solid #E0E0E0',
    borderRadius: 12,
    padding: 20,
    textAlign: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  planoCardDestaque: {
    borderColor: CONSULTOR_ACCENT,
    background: '#F0F7FF',
    transform: 'scale(1.03)',
  },
  planoNome: {
    fontSize: 16,
    fontWeight: 700,
    color: '#333',
    marginBottom: 8,
  },
  planoPreco: {
    fontSize: 28,
    fontWeight: 800,
    color: CONSULTOR_PRIMARY,
    margin: '12px 0',
  },
  planoPrecoPor: {
    fontSize: 13,
    color: '#888',
  },
  planoLista: {
    listStyle: 'none',
    padding: 0,
    margin: '16px 0 0',
    textAlign: 'left',
  },
  planoItem: {
    fontSize: 13,
    color: '#555',
    padding: '6px 0',
    paddingLeft: 20,
    position: 'relative',
  },
  planoBtn: {
    width: '100%',
    padding: '12px 0',
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY}, ${CONSULTOR_ACCENT})`,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 16,
    transition: 'opacity 0.2s',
  },

  // Badge destaque
  destaqueBadge: {
    display: 'inline-block',
    background: CONSULTOR_ACCENT,
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Contador uso
  contadorBox: {
    background: '#F0F7FF',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },
  contadorTitulo: {
    fontSize: 13,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
    marginBottom: 10,
  },
  contadorBarra: {
    width: '100%',
    height: 8,
    background: '#E8F0F8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  contadorBarraFill: {
    height: '100%',
    borderRadius: 4,
    background: `linear-gradient(90deg, ${VERDE_DESTAQUE}, #A8E6B0)`,
    transition: 'width 0.4s ease',
  },
  contadorTexto: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },

  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#aaa',
    fontSize: 14,
  },
};

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 15,
    link: 'https://buy.stripe.com/7sYbJ1b5CdiI39kfh7gQE0d',
    destaque: false,
    features: [
      '5 simulações por semana',
      'Produtos genéricos + da loja',
      'Cenários fácil e médio',
      'Só vendedores internos',
      'Feedback com IA'
    ]
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 40,
    link: 'https://buy.stripe.com/9B600j0qY3I89xIfh7gQE0c',
    destaque: true,
    features: [
      '20 simulações por semana',
      'Produtos genéricos + da loja',
      'Todos os cenários',
      'Vendedores + consultores',
      'Feedback com IA'
    ]
  },
  {
    id: 'enterprise',
    nome: 'Enterprise',
    preco: 60,
    link: 'https://buy.stripe.com/5kQ5kDflSfqQaBMb0RgQE0b',
    destaque: false,
    features: [
      'Simulações ilimitadas',
      'Produtos genéricos + da loja',
      'Todos os cenários',
      'Vendedores + consultores',
      'Ranking + histórico completo'
    ]
  }
];

export default function ArenaConfig({ lojaId }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarConfig();
  }, [lojaId]);

  const carregarConfig = async () => {
    try {
      const { data } = await supabase
        .from('arena_config')
        .select('*')
        .eq('loja_id', lojaId)
        .single();
      
      setConfig(data);
    } catch (err) {
      console.error('[ArenaConfig] erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAcessoConsultores = async () => {
    if (!config || !config.ativo) return;

    const novoValor = !config.acesso_consultores;
    
    try {
      await supabase
        .from('arena_config')
        .update({ acesso_consultores: novoValor })
        .eq('loja_id', lojaId);
      
      setConfig({ ...config, acesso_consultores: novoValor });
    } catch (err) {
      console.error('[ArenaConfig] toggle erro:', err);
      alert('Erro ao atualizar configuração');
    }
  };

  const assinarPlano = (link) => {
    // Redireciona pro Stripe Checkout
    // Adicione metadata na URL se necessário (loja_id, tier)
    window.location.href = `${link}?client_reference_id=${lojaId}`;
  };

  if (loading) {
    return <div style={styles.loading}>Carregando Arena de Vendas...</div>;
  }

  // ─── Se não tem assinatura, mostra os planos ────
  if (!config || !config.ativo) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.titulo}> Arena de Vendas</h2>
          <p style={styles.subtitulo}>
            Treine sua equipe com simulações de vendas com IA. 
            Escolha o plano ideal pra sua operação.
          </p>
        </div>

        <div style={styles.planosGrid}>
          {PLANOS.map(plano => (
            <div
              key={plano.id}
              style={{
                ...styles.planoCard,
                ...(plano.destaque ? styles.planoCardDestaque : {})
              }}
              onClick={() => assinarPlano(plano.link)}
            >
              {plano.destaque && (
                <span style={styles.destaqueBadge}>Mais popular</span>
              )}
              
              <h3 style={styles.planoNome}>{plano.nome}</h3>
              
              <div style={styles.planoPreco}>
                R$ {plano.preco}
                <span style={styles.planoPrecoPor}>/mês</span>
              </div>

              <ul style={styles.planoLista}>
                {plano.features.map((feature, i) => (
                  <li key={i} style={styles.planoItem}>
                    <span style={{ position: 'absolute', left: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={styles.planoBtn}>
                Assinar {plano.nome}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 16, background: '#FFF8E1', borderRadius: 10, fontSize: 13, color: '#F57F17' }}>
          <strong> Dica:</strong> Comece com o plano Básico pra testar. Você pode fazer upgrade a qualquer momento.
        </div>
      </div>
    );
  }

  // ─── Se tem assinatura ativa, mostra gerenciamento ─
  const planoAtual = PLANOS.find(p => p.id === config.tier) || PLANOS[0];
  const limite = config.tier === 'enterprise' ? null : (config.tier === 'pro' ? 20 : 5);
  const usadas = config.sims_usadas_semana || 0;
  const percentual = limite ? Math.round((usadas / limite) * 100) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.titulo}> Arena de Vendas</h2>
        <p style={styles.subtitulo}>
          Gerencie o acesso da sua equipe às simulações de vendas com IA.
        </p>
      </div>

      {/* Status atual */}
      <div style={styles.statusBox}>
        <div style={styles.statusHeader}>
          <span style={styles.statusTitulo}>Plano {planoAtual.nome}</span>
          <span style={{ ...styles.statusBadge, ...styles.statusAtivo }}>
            ✓ Ativo
          </span>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <p style={styles.infoNumero}>R$ {planoAtual.preco}</p>
            <p style={styles.infoRotulo}>Por mês</p>
          </div>
          <div style={styles.infoCard}>
            <p style={styles.infoNumero}>{usadas}</p>
            <p style={styles.infoRotulo}>Usadas esta semana</p>
          </div>
          <div style={styles.infoCard}>
            <p style={styles.infoNumero}>{limite || '∞'}</p>
            <p style={styles.infoRotulo}>Limite semanal</p>
          </div>
        </div>

        {/* Barra de progresso (se tiver limite) */}
        {limite && (
          <div style={styles.contadorBox}>
            <p style={styles.contadorTitulo}>Uso semanal</p>
            <div style={styles.contadorBarra}>
              <div style={{ ...styles.contadorBarraFill, width: `${percentual}%` }}></div>
            </div>
            <p style={styles.contadorTexto}>
              {usadas} de {limite} simulações usadas · Reseta toda segunda-feira
            </p>
          </div>
        )}

        {/* Toggle acesso consultores (só Pro e Enterprise) */}
        {(config.tier === 'pro' || config.tier === 'enterprise') && (
          <div style={styles.toggleBox}>
            <div>
              <p style={styles.toggleLabel}>Liberar pra consultores externos</p>
              <p style={styles.toggleDesc}>
                Permite que consultores independentes usem a Arena
              </p>
            </div>
            <div
              style={{
                ...styles.toggleSwitch,
                background: config.acesso_consultores ? VERDE_DESTAQUE : '#ccc'
              }}
              onClick={toggleAcessoConsultores}
            >
              <div style={{
                ...styles.toggleSlider,
                transform: config.acesso_consultores ? 'translateX(22px)' : 'translateX(0)'
              }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade (se não for Enterprise) */}
      {config.tier !== 'enterprise' && (
        <div style={{ marginTop: 20, padding: 16, background: '#F0F7FF', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: CONSULTOR_PRIMARY, margin: 0 }}>
              Quer mais simulações ou acesso completo?
            </p>
            <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
              Faça upgrade pro plano {config.tier === 'basico' ? 'Pro ou Enterprise' : 'Enterprise'}
            </p>
          </div>
          <button
            style={{
              padding: '10px 20px',
              background: CONSULTOR_PRIMARY,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => {
              const proximoPlano = config.tier === 'basico' ? PLANOS[1] : PLANOS[2];
              assinarPlano(proximoPlano.link);
            }}
          >
            Ver planos
          </button>
        </div>
      )}

      {/* Gerenciar assinatura */}
      <div style={{ marginTop: 20, padding: 16, background: '#F5F5F5', borderRadius: 10, fontSize: 13, color: '#666' }}>
        <p style={{ margin: 0 }}>
          <strong>Gerenciar assinatura:</strong> Cancelar, atualizar forma de pagamento ou ver histórico de faturas no{' '}
          <a
            href="https://billing.stripe.com/p/login/test_XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: CONSULTOR_ACCENT, textDecoration: 'underline' }}
          >
            portal do cliente Stripe
          </a>
        </p>
      </div>
    </div>
  );
}
