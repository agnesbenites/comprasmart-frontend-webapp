// src/pages/ConsultorDashboard/components/ArenaSimulador.jsx
// Chat da simulação de vendas - Arena de Vendas
// Consultor conversa, IA responde como cliente

import React, { useState, useRef, useEffect } from 'react';

const CONSULTOR_PRIMARY = '#2c5aa0';
const CONSULTOR_ACCENT  = '#bb25a6';
const VERDE_DESTAQUE    = '#6BCB77';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 560,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },

  header: {
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY}, ${CONSULTOR_ACCENT})`,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerEsquerda: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 22,
  },
  headerInfo: {},
  headerProduto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    margin: 0,
  },
  headerCenario: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    margin: '2px 0 0',
  },
  btnVoltar: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  cenarioBar: {
    background: '#F0F7FF',
    borderBottom: '1px solid #ECECEC',
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cenarioBarTexto: {
    fontSize: 12,
    color: '#666',
  },
  cenarioBarBadge: {
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
  },

  mensagens: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#FAFAFA',
  },

  msgConsultor: {
    alignSelf: 'flex-end',
    maxWidth: '72%',
  },
  msgConsultorBolha: {
    background: CONSULTOR_ACCENT,
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: 14,
    lineHeight: 1.4,
  },
  msgConsultorRotulo: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginBottom: 4,
    fontWeight: 600,
  },
  msgConsultorTempo: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
    marginTop: 4,
  },

  msgCliente: {
    alignSelf: 'flex-start',
    maxWidth: '72%',
  },
  msgClienteBolha: {
    background: '#fff',
    color: '#333',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    fontSize: 14,
    lineHeight: 1.4,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  msgClienteRotulo: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    fontWeight: 600,
  },
  msgClienteTempo: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
  },

  msgSistema: {
    alignSelf: 'center',
    background: '#EEE',
    borderRadius: 12,
    padding: '6px 14px',
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  digitando: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#999',
    fontSize: 13,
    fontStyle: 'italic',
  },

  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid #ECECEC',
    background: '#fff',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: 24,
    border: '2px solid #E8F0F8',
    fontSize: 14,
    outline: 'none',
    resize: 'none',
    minHeight: 44,
    maxHeight: 100,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  btnEnviar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY}, ${CONSULTOR_ACCENT})`,
    border: 'none',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    flexShrink: 0,
  },
  btnAbandonar: {
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid #FFB3B3',
    background: '#FFF5F5',
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  turnosBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 20px',
    background: '#FFF',
    borderBottom: '1px solid #ECECEC',
  },
  turnosTexto: {
    fontSize: 12,
    color: '#888',
  },
  turnosDestaque: {
    fontWeight: 700,
    color: CONSULTOR_ACCENT,
  },

  feedbackOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 16,
  },
  feedbackCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '90%',
    maxWidth: 380,
    maxHeight: '85%',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  feedbackTitulo: {
    fontSize: 18,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
    textAlign: 'center',
    margin: '0 0 4px',
  },
  feedbackResultado: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  feedbackPontuacaoCirculo: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  feedbackPontuacaoNumero: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
  },
  feedbackPontuacaoMax: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  feedbackResumo: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 18,
    padding: '0 8px',
  },
  feedbackSeção: {
    marginBottom: 14,
  },
  feedbackSectionTitulo: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: 6,
  },
  feedbackItem: {
    fontSize: 13,
    color: '#444',
    padding: '4px 0',
    paddingLeft: 16,
    position: 'relative',
  },
  feedbackBtnFechar: {
    width: '100%',
    padding: '12px 0',
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY}, ${CONSULTOR_ACCENT})`,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
  },
};

function corPontuacao(nota) {
  if (nota >= 8) return VERDE_DESTAQUE;
  if (nota >= 5) return '#F5A623';
  return '#E74C3C';
}

const BADGE_DIFICULDADE = {
  facil:   { bg: '#E8F5E9', color: '#2E7D32', label: 'Fácil' },
  medio:   { bg: '#FFF8E1', color: '#F57F17', label: 'Médio' },
  dificil: { bg: '#FCE4EC', color: '#C62828', label: 'Difícil' },
};

export default function ArenaSimulador({ sessao, produto, cenario, consultorId, lojaId, onFechar }) {
  const [mensagens, setMensagens]   = useState([]);
  const [input, setInput]           = useState('');
  const [enviando, setEnviando]     = useState(false);
  const [finalizada, setFinalizada] = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [turnosRestantes, setTurnosRestantes] = useState(8);
  const scrollRef                   = useRef(null);
  const inputRef                    = useRef(null);

  const badge = BADGE_DIFICULDADE[cenario?.dificuldade] || BADGE_DIFICULDADE.facil;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens, enviando]);

  useEffect(() => {
    setMensagens([
      {
        id: 'sistema-init',
        role: 'sistema',
        content: `Simulação iniciada! Você vai vender um ${produto?.nome} (R$ ${Number(produto?.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) para um "${cenario?.nome}". Boa sorte!`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const enviar = async () => {
    if (!input.trim() || enviando || finalizada) return;

    const textoConsultor = input.trim();
    setInput('');

    const msgConsultor = {
      id: Date.now().toString(),
      role: 'consultor',
      content: textoConsultor,
      timestamp: new Date()
    };
    setMensagens(prev => [...prev, msgConsultor]);
    setEnviando(true);

    try {
      const res = await fetch('/api/arena/mensagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessaoId: sessao.id,
          mensagem: textoConsultor
        })
      });

      const dados = await res.json();

      const msgCliente = {
        id: (Date.now() + 1).toString(),
        role: 'cliente',
        content: dados.mensagem_cliente,
        timestamp: new Date()
      };
      setMensagens(prev => [...prev, msgCliente]);

      if (dados.turnos_restantes !== undefined) {
        setTurnosRestantes(dados.turnos_restantes);
      }

      if (dados.finalizada) {
        setFinalizada(true);
        setFeedback(dados.feedback);

        const motivo = dados.fechou
          ? '🎉 O cliente fechou a compra!'
          : dados.desistiu
            ? 'O cliente decidiu não comprar.'
            : '⏰ Limite de turnos atingido.';

        setMensagens(prev => [...prev, {
          id: 'sistema-fim',
          role: 'sistema',
          content: motivo,
          timestamp: new Date()
        }]);
      }

    } catch (err) {
      console.error('[ArenaSimulador] enviar:', err);
      setMensagens(prev => [...prev, {
        id: 'erro-' + Date.now(),
        role: 'sistema',
        content: 'Erro ao enviar mensagem. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setEnviando(false);
      inputRef.current?.focus();
    }
  };

  const abandonar = async () => {
    if (!confirm('Tem certeza que quer abandonar esta simulação?')) return;
    try {
      await fetch('/api/arena/abandonar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessaoId: sessao.id })
      });
    } catch (err) {
      console.error('[ArenaSimulador] abandonar:', err);
    }
    onFechar();
  };

  const formataTempo = (date) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  return (
    <div style={{ ...styles.container, position: 'relative' }}>

      <div style={styles.header}>
        <div style={styles.headerEsquerda}>
          <span style={styles.headerEmoji}>🎯</span>
          <div style={styles.headerInfo}>
            <p style={styles.headerProduto}>{produto?.nome}</p>
            <p style={styles.headerCenario}>{cenario?.nome} · {badge.label}</p>
          </div>
        </div>
        <button style={styles.btnVoltar} onClick={onFechar}>← Voltar</button>
      </div>

      <div style={styles.cenarioBar}>
        <span style={styles.cenarioBarTexto}>Cenário:</span>
        <span style={{
          ...styles.cenarioBarBadge,
          background: badge.bg,
          color: badge.color
        }}>{badge.label}</span>
        <span style={{ ...styles.cenarioBarTexto, marginLeft: 'auto' }}>
          {cenario?.descricao}
        </span>
      </div>

      <div style={styles.turnosBar}>
        <span style={styles.turnosTexto}>
          Turnos restantes: <span style={styles.turnosDestaque}>{turnosRestantes}</span>
        </span>
        {!finalizada && (
          <button style={styles.btnAbandonar} onClick={abandonar}>Abandonar</button>
        )}
      </div>

      <div style={styles.mensagens} ref={scrollRef}>
        {mensagens.map(msg => {
          if (msg.role === 'sistema') {
            return (
              <div key={msg.id} style={styles.msgSistema}>
                {msg.content}
              </div>
            );
          }

          if (msg.role === 'consultor') {
            return (
              <div key={msg.id} style={styles.msgConsultor}>
                <p style={styles.msgConsultorRotulo}>Você</p>
                <div style={styles.msgConsultorBolha}>{msg.content}</div>
                <p style={styles.msgConsultorTempo}>{formataTempo(msg.timestamp)}</p>
              </div>
            );
          }

          return (
            <div key={msg.id} style={styles.msgCliente}>
              <p style={styles.msgClienteRotulo}>Cliente</p>
              <div style={styles.msgClienteBolha}>{msg.content}</div>
              <p style={styles.msgClienteTempo}>{formataTempo(msg.timestamp)}</p>
            </div>
          );
        })}

        {enviando && (
          <div style={styles.digitando}>
            Cliente digitando...
          </div>
        )}
      </div>

      {!finalizada && (
        <div style={styles.inputArea}>
          <textarea
            ref={inputRef}
            style={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            placeholder="Digite sua resposta..."
            rows={1}
          />
          <button
            style={{ ...styles.btnEnviar, ...(enviando ? { opacity: 0.5 } : {}) }}
            onClick={enviar}
            disabled={enviando || !input.trim()}
          >
            ▶
          </button>
        </div>
      )}

      {finalizada && feedback && (
        <div style={styles.feedbackOverlay}>
          <div style={styles.feedbackCard}>
            <p style={styles.feedbackTitulo}>Resultado</p>
            <p style={styles.feedbackResultado}>
              {feedback.pontuacao >= 7 ? '🎉 Excelente!' : feedback.pontuacao >= 4 ? '👍 Bom esforço!' : '📚 Vamos melhorar!'}
            </p>

            <div style={{
              ...styles.feedbackPontuacaoCirculo,
              background: corPontuacao(feedback.pontuacao)
            }}>
              <span style={styles.feedbackPontuacaoNumero}>{feedback.pontuacao}</span>
              <span style={styles.feedbackPontuacaoMax}>/10</span>
            </div>

            <p style={styles.feedbackResumo}>"{feedback.resumo}"</p>

            <div style={styles.feedbackSeção}>
              <p style={{ ...styles.feedbackSectionTitulo, color: '#2E7D32' }}>✅ O que foi bem</p>
              {(feedback.areas_bem || []).map((item, i) => (
                <p key={i} style={styles.feedbackItem}>• {item}</p>
              ))}
            </div>

            <div style={styles.feedbackSeção}>
              <p style={{ ...styles.feedbackSectionTitulo, color: '#F57F17' }}>📌 Pra melhorar</p>
              {(feedback.areas_melhorar || []).map((item, i) => (
                <p key={i} style={styles.feedbackItem}>• {item}</p>
              ))}
            </div>

            <div style={styles.feedbackSeção}>
              <p style={{ ...styles.feedbackSectionTitulo, color: CONSULTOR_ACCENT }}>💡 Dicas pra próxima</p>
              {(feedback.dicas || []).map((item, i) => (
                <p key={i} style={styles.feedbackItem}>• {item}</p>
              ))}
            </div>

            <button style={styles.feedbackBtnFechar} onClick={onFechar}>
              Voltar pra Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}