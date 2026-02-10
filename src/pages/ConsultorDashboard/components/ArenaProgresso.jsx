// src/pages/ConsultorDashboard/components/ArenaProgresso.jsx
// Tab "Meu Progresso" dentro da Arena de Vendas

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = '#2c5aa0';
const CONSULTOR_ACCENT  = '#bb25a6';
const VERDE_DESTAQUE    = '#6BCB77';

const styles = {
  container: { padding: 0 },

  resumoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 24,
  },
  resumoCard: {
    background: '#F0F7FF',
    border: '1px solid #E8F0F8',
    borderRadius: 12,
    padding: '14px 12px',
    textAlign: 'center',
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: 800,
    color: CONSULTOR_PRIMARY,
    margin: '0 0 2px',
  },
  resumoRotulo: {
    fontSize: 11,
    color: '#888',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  evolucaoBox: {
    background: '#fff',
    border: '1px solid #ECECEC',
    borderRadius: 12,
    padding: '16px 18px',
    marginBottom: 20,
  },
  evolucaoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  evolucaoTitulo: {
    fontSize: 13,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
  },
  evolucaoNivel: {
    fontSize: 12,
    fontWeight: 700,
    color: CONSULTOR_ACCENT,
    background: '#F0F7FF',
    padding: '3px 10px',
    borderRadius: 12,
  },
  evolucaoBarra: {
    width: '100%',
    height: 8,
    background: '#F0F7FF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  evolucaoBarraFill: {
    height: '100%',
    borderRadius: 4,
    background: `linear-gradient(90deg, ${CONSULTOR_ACCENT}, ${VERDE_DESTAQUE})`,
    transition: 'width 0.6s ease',
  },
  evolucaoTexto: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },

  sectionTitulo: {
    fontSize: 13,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },

  sessoesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sessaoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: '#FAFAFA',
    border: '1px solid #ECECEC',
    borderRadius: 10,
  },

  notaCirculo: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notaNumero: {
    fontSize: 15,
    fontWeight: 800,
    color: '#fff',
  },

  sessaoInfo: {
    flex: 1,
    minWidth: 0,
  },
  sessaoNome: {
    fontSize: 13,
    fontWeight: 700,
    color: '#333',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sessaoMeta: {
    fontSize: 11,
    color: '#999',
    margin: '3px 0 0',
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },

  resultadoBadge: {
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
  },

  difBadge: {
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 700,
  },

  vazio: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#aaa',
    fontSize: 14,
  },

  niveisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 6,
    marginBottom: 24,
  },
  nivelCard: {
    textAlign: 'center',
    padding: '10px 4px',
    borderRadius: 10,
    border: '2px solid #ECECEC',
    background: '#FAFAFA',
  },
  nivelCardAtivo: {
    borderColor: CONSULTOR_ACCENT,
    background: '#F0F7FF',
  },
  nivelEmoji: {
    fontSize: 18,
    display: 'block',
    marginBottom: 4,
  },
  nivelNome: {
    fontSize: 10,
    fontWeight: 700,
    color: '#666',
  },
  nivelNomeAtivo: {
    color: CONSULTOR_ACCENT,
  },
};

const NIVEIS = [
  { nome: 'Iniciante', emoji: '🌱', minSessoes: 0  },
  { nome: 'Bronze',    emoji: '🥉', minSessoes: 5  },
  { nome: 'Prata',     emoji: '🥈', minSessoes: 15 },
  { nome: 'Ouro',      emoji: '🥇', minSessoes: 30 },
  { nome: 'Diamante',  emoji: '💎', minSessoes: 60 },
];

function calcNivel(totalSessoes) {
  let nivel = NIVEIS[0];
  for (const n of NIVEIS) {
    if (totalSessoes >= n.minSessoes) nivel = n;
  }
  return nivel;
}

function calcProgressoNivel(totalSessoes) {
  for (let i = NIVEIS.length - 1; i >= 0; i--) {
    if (totalSessoes >= NIVEIS[i].minSessoes) {
      if (i === NIVEIS.length - 1) return 100;
      const atual = NIVEIS[i].minSessoes;
      const proximo = NIVEIS[i + 1].minSessoes;
      return Math.round(((totalSessoes - atual) / (proximo - atual)) * 100);
    }
  }
  return 0;
}

function corNota(nota) {
  if (nota >= 8) return VERDE_DESTAQUE;
  if (nota >= 5) return '#F5A623';
  return '#E74C3C';
}

const DIF_CORES = {
  facil:   { bg: '#E8F5E9', color: '#2E7D32' },
  medio:   { bg: '#FFF8E1', color: '#F57F17' },
  dificil: { bg: '#FCE4EC', color: '#C62828' },
};
const DIF_LABEL = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

export default function ArenaProgresso({ consultorId }) {
  const [sessoes, setSessoes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [mediaNota, setMediaNota] = useState(0);
  const [streak, setStreak]       = useState(0);

  useEffect(() => {
    carregarSessoes();
  }, [consultorId]);

  const carregarSessoes = async () => {
    try {
      const { data } = await supabase
        .from('sessoes_simulacao')
        .select(`
          id,
          produto_id,
          produto_generico,
          fase,
          status,
          resultado_fechou,
          pontuacao,
          iniciada_em,
          cenarios_simulacao ( nome, dificuldade )
        `)
        .eq('consultor_id', consultorId)
        .eq('status', 'finalizada')
        .order('iniciada_em', { ascending: false })
        .limit(30);

      const sessoesFiltradas = data || [];
      setSessoes(sessoesFiltradas);

      if (sessoesFiltradas.length > 0) {
        const soma = sessoesFiltradas.reduce((acc, s) => acc + (Number(s.pontuacao) || 0), 0);
        setMediaNota(Math.round((soma / sessoesFiltradas.length) * 10) / 10);
      }

      const hoje = new Date();
      let streakCount = 0;
      for (let d = 0; d < 30; d++) {
        const dia = new Date(hoje);
        dia.setDate(dia.getDate() - d);
        const temSessao = sessoesFiltradas.some(s => {
          const sessaoDate = new Date(s.iniciada_em);
          return sessaoDate.getDate() === dia.getDate() &&
                 sessaoDate.getMonth() === dia.getMonth();
        });
        if (temSessao) streakCount++;
        else if (d > 0) break;
      }
      setStreak(streakCount);

    } catch (err) {
      console.error('[ArenaProgresso]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.vazio}>Carregando progresso...</div>;
  }

  const totalSessoes  = sessoes.length;
  const totalFechou   = sessoes.filter(s => s.resultado_fechou).length;
  const nivel         = calcNivel(totalSessoes);
  const progresso     = calcProgressoNivel(totalSessoes);
  const proximoNivel  = NIVEIS.find(n => n.minSessoes > totalSessoes);

  return (
    <div style={styles.container}>

      <div style={styles.niveisGrid}>
        {NIVEIS.map((n, i) => {
          const ativo = totalSessoes >= n.minSessoes;
          return (
            <div key={n.nome} style={{ ...styles.nivelCard, ...(ativo ? styles.nivelCardAtivo : {}) }}>
              <span style={styles.nivelEmoji}>{n.emoji}</span>
              <p style={{ ...styles.nivelNome, ...(ativo ? styles.nivelNomeAtivo : {}) }}>{n.nome}</p>
            </div>
          );
        })}
      </div>

      <div style={styles.evolucaoBox}>
        <div style={styles.evolucaoHeader}>
          <span style={styles.evolucaoTitulo}>Seu nível</span>
          <span style={styles.evolucaoNivel}>{nivel.emoji} {nivel.nome}</span>
        </div>
        <div style={styles.evolucaoBarra}>
          <div style={{ ...styles.evolucaoBarraFill, width: `${progresso}%` }}></div>
        </div>
        <p style={styles.evolucaoTexto}>
          {proximoNivel
            ? `${proximoNivel.minSessoes - totalSessoes} sessões até ${proximoNivel.emoji} ${proximoNivel.nome}`
            : 'Nível máximo atingido! 🎉'}
        </p>
      </div>

      <div style={styles.resumoGrid}>
        <div style={styles.resumoCard}>
          <p style={styles.resumoNumero}>{totalSessoes}</p>
          <p style={styles.resumoRotulo}>Simulações</p>
        </div>
        <div style={styles.resumoCard}>
          <p style={{ ...styles.resumoNumero, color: VERDE_DESTAQUE }}>{mediaNota}</p>
          <p style={styles.resumoRotulo}>Média nota</p>
        </div>
        <div style={styles.resumoCard}>
          <p style={{ ...styles.resumoNumero, color: '#F5A623' }}>{streak}d</p>
          <p style={styles.resumoRotulo}>Streak</p>
        </div>
      </div>

      <div style={{ ...styles.evolucaoBox, marginBottom: 20 }}>
        <div style={styles.evolucaoHeader}>
          <span style={styles.evolucaoTitulo}>Taxa de fechamento</span>
          <span style={{ ...styles.evolucaoNivel, color: VERDE_DESTAQUE, background: '#E8F5E9' }}>
            {totalSessoes > 0 ? Math.round((totalFechou / totalSessoes) * 100) : 0}%
          </span>
        </div>
        <div style={styles.evolucaoBarra}>
          <div style={{
            ...styles.evolucaoBarraFill,
            width: `${totalSessoes > 0 ? (totalFechou / totalSessoes) * 100 : 0}%`,
            background: `linear-gradient(90deg, ${VERDE_DESTAQUE}, #A8E6B0)`
          }}></div>
        </div>
        <p style={styles.evolucaoTexto}>
          {totalFechou} de {totalSessoes} vendas fechadas
        </p>
      </div>

      <p style={styles.sectionTitulo}>Histórico</p>

      {sessoes.length === 0 ? (
        <div style={styles.vazio}>
          Nenhuma simulação finalizada ainda.<br />
          <span style={{ fontSize: 12 }}>Vai pra aba Simulador e começa!</span>
        </div>
      ) : (
        <div style={styles.sessoesList}>
          {sessoes.map(s => {
            const dif = s.cenarios_simulacao?.dificuldade || 'facil';
            const difCores = DIF_CORES[dif];
            const nota = Number(s.pontuacao) || 0;

            return (
              <div key={s.id} style={styles.sessaoCard}>
                <div style={{ ...styles.notaCirculo, background: corNota(nota) }}>
                  <span style={styles.notaNumero}>{nota}</span>
                </div>

                <div style={styles.sessaoInfo}>
                  <p style={styles.sessaoNome}>
                    {s.cenarios_simulacao?.nome || 'Cenário desconhecido'}
                  </p>
                  <div style={styles.sessaoMeta}>
                    <span style={{
                      ...styles.difBadge,
                      background: difCores.bg,
                      color: difCores.color
                    }}>{DIF_LABEL[dif]}</span>
                    <span>Fase {s.fase}</span>
                    <span>{new Date(s.iniciada_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <span style={{
                  ...styles.resultadoBadge,
                  background: s.resultado_fechou ? '#E8F5E9' : '#FFF3E0',
                  color: s.resultado_fechou ? '#2E7D32' : '#E65100'
                }}>
                  {s.resultado_fechou ? '✓ Fechou' : '✗ Não fechou'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}