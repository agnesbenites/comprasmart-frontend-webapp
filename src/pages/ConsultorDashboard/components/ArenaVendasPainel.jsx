// src/pages/ConsultorDashboard/components/ArenaVendasPainel.jsx
// Painel principal da Arena de Vendas no dashboard do consultor
// Fase 1: produtos genéricos (antes de ter loja)
// Fase 2: produtos da loja (quando já está vinculado)

import React, { useState } from 'react';
import { useArena } from '../../../hooks/useArena'; // Importamos o hook que já limpamos
import ArenaSimulador from './ArenaSimulador';
import ArenaProgresso from './ArenaProgresso';

// ─── CORES (baseadas na paleta do consultor) ──────
const CONSULTOR_PRIMARY = '#2f0d51';
const CONSULTOR_ACCENT  = '#bb25a6';
const VERDE_DESTAQUE    = '#cccc0c';

// ─── STYLES ────────────────────────────────────────
const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    minHeight: '100%',
    fontFamily: "'Inter', sans-serif",
  },

  // Header
  header: {
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY} 0%, ${CONSULTOR_ACCENT} 100%)`,
    borderRadius: '16px 16px 0 0',
    padding: '28px 24px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  headerLogoBox: {
    width: 48,
    height: 48,
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
  },
  headerTexto: {
    flex: 1,
  },
  headerTitulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.3px',
  },
  headerSubtitulo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    margin: '4px 0 0',
  },

  // Badge da fase
  faseBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: '4px 12px',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
  },
  faseDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#cccc0c',
  },

  // Corpo
  corpo: {
    padding: 24,
  },

  // Tabs: Simulador | Progresso
  tabs: {
    display: 'flex',
    gap: 4,
    background: '#F0F0F3',
    borderRadius: 10,
    padding: 3,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabAtivo: {
    background: '#fff',
    color: CONSULTOR_PRIMARY,
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },

  // Contador de simulações
  contadorBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#f3e8ff',
    border: `1px solid ${CONSULTOR_ACCENT}33`,
    borderRadius: 10,
    padding: '10px 16px',
    marginBottom: 20,
  },
  contadorTexto: {
    fontSize: 13,
    color: CONSULTOR_PRIMARY,
    fontWeight: 600,
  },
  contadorSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  contadorBarra: {
    width: 120,
    height: 6,
    background: '#f3e8ff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  contadorBarraFill: {
    height: '100%',
    borderRadius: 3,
    background: `linear-gradient(90deg, ${VERDE_DESTAQUE}, #cccc0c)`,
    transition: 'width 0.4s ease',
  },

  // Seção de seleção
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: CONSULTOR_PRIMARY,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Filtro de categorias
  filtros: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filtroBtn: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid #E0E0E0',
    background: '#fff',
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filtroBtnAtivo: {
    background: CONSULTOR_PRIMARY,
    color: '#fff',
    borderColor: CONSULTOR_PRIMARY,
  },

  // Grid de produtos
  gridProdutos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 10,
    marginBottom: 24,
  },
  cardProduto: {
    border: '2px solid #ECECEC',
    borderRadius: 12,
    padding: 14,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  cardProdutoAtivo: {
    borderColor: CONSULTOR_ACCENT,
    background: '#f3e8ff',
    boxShadow: `0 0 0 3px ${CONSULTOR_ACCENT}22`,
  },
  cardProdutoEmoji: {
    fontSize: 28,
    marginBottom: 8,
    display: 'block',
  },
  cardProdutoNome: {
    fontSize: 12,
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
  },
  cardProdutoPreco: {
    fontSize: 12,
    color: VERDE_DESTAQUE,
    fontWeight: 700,
  },

  // Grid de cenários
  gridCenarios: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  cardCenario: {
    border: '2px solid #ECECEC',
    borderRadius: 12,
    padding: '12px 16px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  cardCenarioAtivo: {
    borderColor: CONSULTOR_ACCENT,
    background: '#f3e8ff',
    boxShadow: `0 0 0 3px ${CONSULTOR_ACCENT}22`,
  },
  cenarioBadge: {
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  cenarioTexto: {
    flex: 1,
  },
  cenarioNome: {
    fontSize: 13,
    fontWeight: 700,
    color: '#333',
  },
  cenarioDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  cenarioLocked: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  // Botão iniciar
  btnIniciar: {
    width: '100%',
    padding: '14px 0',
    background: `linear-gradient(135deg, ${CONSULTOR_PRIMARY}, ${CONSULTOR_ACCENT})`,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s, transform 0.1s',
  },
  btnIniciarDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },

  // Estados vazios / loading
  emptyBox: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
    fontSize: 14,
  },
  loadingBox: {
    textAlign: 'center',
    padding: 40,
    color: '#aaa',
    fontSize: 14,
  },

  // Limite atingido
  alerteLimite: {
    background: '#FFF3E0',
    border: '1px solid #FFB74D',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  alerteLimiteTexto: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: 600,
  },
  alerteLimiteDesc: {
    fontSize: 12,
    color: '#BF360C',
    marginTop: 2,
  },
};

// ─── MAPEAMENTO: categoria → emoji ────────────────
const EMOJI_CATEGORIA = {
  'Eletrônicos':      '📺', // Mudado de celular para TV/Monitor
  'Eletrodomésticos': '',
  'Moda':             '👗',
  'Calçados':         '👡', // Mudado de tênis para sandália feminina
  'Acessórios':       '🕶️', // Mudado para óculos
  'Esportes':         '👟', // Tênis fica aqui
  'Outros':           '',
};

// ─── CORES das badges de dificuldade ───────────────
const BADGE_DIFICULDADE = {
  facil:   { bg: '#f3e8ff', color: '#cccc0c' },
  medio:   { bg: '#FFF8E1', color: '#F57F17' },
  dificil: { bg: '#FCE4EC', color: '#C62828' },
};

const LABEL_DIFICULDADE = {
  facil:   'Fácil',
  medio:   'Médio',
  dificil: 'Difícil',
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────
export default function ArenaVendasPainel({ consultorId, lojaId }) {
  const [tab, setTab] = useState('simulador');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [cenarioSelecionado, setCenarioSelecionado] = useState(null);
  const [simuladorAberto, setSimuladorAberto] = useState(false);

  // --- AQUI ESTÁ A MÁGICA ---
  // Chamamos o hook e passamos o consultorId. 
  // O Hook já tem as travas "if (!consultorId) return" que colocamos antes!
  const { 
    fase, 
    produtos, 
    cenarios, 
    acesso, 
    loading, 
    iniciarSimulacao: iniciarSim, 
    sessaoAtual: sessaoDoHook,
    refetch 
  } = useArena({ consultorId, lojaId });

  // Filtros de interface (processados apenas no navegador, não batem no banco)
  const produtosFiltrados = categoriaFiltro === 'todos'
    ? produtos
    : produtos.filter(p => p.categoria === categoriaFiltro);

  const categorias = ['todos', ...new Set(produtos.map(p => p.categoria))];
  const cenariosFiltrados = cenarios.filter(c => c.fase_minima <= fase);

  const limiteSims   = acesso?.limite;
  const usadaSims    = acesso?.usadas || 0;
  const semLimite    = limiteSims === null || limiteSims === undefined;
  const podeIniciar  = acesso?.pode && produtoSelecionado && cenarioSelecionado;

  // --- FUNÇÕES DE AÇÃO ---
  const handleIniciar = async () => {
    if (!podeIniciar) return;
    try {
      const sessao = await iniciarSim(produtoSelecionado, cenarioSelecionado);
      if (sessao) {
        setSimuladorAberto(true);
        // O refetch aqui é seguro pois o consultorId já existe
        await refetch(); 
      }
    } catch (err) {
      console.error('[ArenaVendas] erro ao iniciar:', err);
      alert('Erro ao iniciar simulação.');
    }
  };

  const fecharSimulador = () => {
    setSimuladorAberto(false);
    setProdutoSelecionado(null);
    setCenarioSelecionado(null);
    refetch(); 
  };

  // Se estiver carregando ou sem ID, mostramos o loading em vez de dar erro 400
  if (loading || !consultorId) {
    return <div style={styles.loadingBox}>Carregando Arena de Vendas...</div>;
  }
  
  if (simuladorAberto && sessaoDoHook) {
    return (
      <ArenaSimulador
        sessao={sessaoDoHook}
        produto={produtoSelecionado}
        cenario={cenarioSelecionado}
        consultorId={consultorId}
        lojaId={lojaId}
        onFechar={fecharSimulador}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLogoBox}></div>
        <div style={styles.headerTexto}>
          <p style={styles.headerTitulo}>Arena de Vendas</p>
          <p style={styles.headerSubtitulo}>
            {fase === 1
              ? 'Treine com produtos genéricos antes de entrar numa loja'
              : 'Simule vendas com os produtos da sua loja'}
          </p>
        </div>
        <div style={styles.faseBadge}>
          <span style={styles.faseDot}></span>
          Fase {fase}
        </div>
      </div>

      <div style={styles.corpo}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'simulador' ? styles.tabAtivo : {}) }}
            onClick={() => setTab('simulador')}
          >
            Simulador
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'progresso' ? styles.tabAtivo : {}) }}
            onClick={() => setTab('progresso')}
          >
            Meu Progresso
          </button>
        </div>

        {tab === 'progresso' && (
          <ArenaProgresso consultorId={consultorId} />
        )}

        {tab === 'simulador' && (
          <>
            {acesso && !acesso.pode && acesso.motivo === 'limite_atingido' && (
              <div style={styles.alerteLimite}>
                <span style={{ fontSize: 20 }}></span>
                <div>
                  <p style={styles.alerteLimiteTexto}>Limite semanal atingido</p>
                  <p style={styles.alerteLimiteDesc}>
                    Você usou {usadaSims} de {limiteSims} simulações esta semana. O limite reseta toda segunda-feira.
                  </p>
                </div>
              </div>
            )}

            {!semLimite && acesso?.pode && (
              <div style={styles.contadorBar}>
                <div>
                  <p style={styles.contadorTexto}>{usadaSims} / {limiteSims} simulações esta semana</p>
                  <p style={styles.contadorSub}>Reseta toda segunda-feira</p>
                </div>
                <div style={styles.contadorBarra}>
                  <div style={{
                    ...styles.contadorBarraFill,
                    width: `${(usadaSims / limiteSims) * 100}%`
                  }}></div>
                </div>
              </div>
            )}

            <p style={styles.sectionLabel}>1. Escolha ou digite o produto</p>

            {/* NOVO CAMPO DE DIGITAÇÃO */}
            <input 
              type="text"
              placeholder="Ou digite o nome do produto aqui..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                marginBottom: '20px'
              }}
              onChange={(e) => setProdutoSelecionado({ 
                id: 'custom', 
                nome: e.target.value, 
                generico: true,
                categoria: 'Outros' 
              })}
            />

            <div style={styles.filtros}>
              {categorias.map(cat => (
                <button
                  key={cat}
                  style={{
                    ...styles.filtroBtn,
                    ...(categoriaFiltro === cat ? styles.filtroBtnAtivo : {})
                  }}
                  onClick={() => setCategoriaFiltro(cat)}
                >
                  {cat === 'todos' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div style={styles.gridProdutos}>
              {produtosFiltrados.map(produto => (
                <div
                  key={produto.id}
                  style={{
                    ...styles.cardProduto,
                    ...(produtoSelecionado?.id === produto.id ? styles.cardProdutoAtivo : {})
                  }}
                  onClick={() => setProdutoSelecionado(produto)}
                >
                  <span style={styles.cardProdutoEmoji}>
                    {EMOJI_CATEGORIA[produto.categoria] || ''}
                  </span>
                  
                  {/* EXIBE APENAS O NOME DO PRODUTO (Sem marca ou preço) */}
                  <p style={styles.cardProdutoNome}>{produto.nome}</p>
                  
                  {/* REMOVEMOS A LINHA DO PREÇO DAQUI */}
                </div>
              ))}
            </div>

            <p style={styles.sectionLabel}>2. Escolha o cenário</p>

            <div style={styles.gridCenarios}>
              {cenariosFiltrados.map(cenario => {
                const badge = BADGE_DIFICULDADE[cenario.dificuldade];
                const bloqueadoPelaRegra = (cenario.dificuldade === 'medio' || cenario.dificuldade === 'dificil') && !lojaId;

                return (
                  <div
                    key={cenario.id}
                    style={{
                      ...styles.cardCenario,
                      ...(bloqueadoPelaRegra ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                      ...(cenarioSelecionado?.id === cenario.id ? styles.cardCenarioAtivo : {})
                    }}
                    onClick={() => !bloqueadoPelaRegra && setCenarioSelecionado(cenario)}
                  >
                    <span style={{
                      ...styles.cenarioBadge,
                      background: badge.bg,
                      color: badge.color
                    }}>
                      {LABEL_DIFICULDADE[cenario.dificuldade]}
                    </span>

                    <div style={styles.cenarioTexto}>
                      <p style={styles.cenarioNome}>
                        {cenario.nome} {bloqueadoPelaRegra && ''}
                      </p>
                      <p style={styles.cenarioDesc}>{cenario.descricao}</p>
                      {bloqueadoPelaRegra && (
                        <span style={{ fontSize: '10px', color: CONSULTOR_ACCENT }}>
                          Disponível para parceiros
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              style={{
                ...styles.btnIniciar,
                ...(!podeIniciar ? styles.btnIniciarDisabled : {})
              }}
              onClick={handleIniciar}
              disabled={!podeIniciar}
            >
              {acesso?.pode ? '▶ Iniciar Simulação' : ' Limite Atingido'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}