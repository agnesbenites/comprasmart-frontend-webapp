// app-frontend/src/pages/ConsultorDashboard/components/ReviewsPanel.jsx

import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaFilter } from 'react-icons/fa';
import { supabase } from "@/supabaseClient";
import { House, CheckCircle, XCircle, Clock, Tag, HourglassHigh, Lifebuoy, Storefront, ChatCircle } from '@phosphor-icons/react';

// Inicializar Supabase

const CONSULTOR_PRIMARY = "#2f0d51";
const CONSULTOR_LIGHT_BG = "#f3e8ff";

const ReviewsPanel = ({ consultorId }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [filtroEstrelas, setFiltroEstrelas] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      setLoading(true);
      try {
        // Se não tiver consultorId, usar dados mock
        if (!consultorId) {
          // Dados simulados para demonstração
          const mockAvaliacoes = [
            {
              id: 1,
              chamadaId: 'CH-2024-001',
              estrelas: 5,
              comentario: 'Excelente atendimento! Muito atencioso e conhecedor dos produtos.',
              loja: 'Eletrônicos Center',
              produtos: ['Smartphone Samsung Galaxy S24'],
              data: '2024-12-20',
              horario: '14:30',
              duracao: '15 min',
            },
            {
              id: 2,
              chamadaId: 'CH-2024-002',
              estrelas: 4,
              comentario: 'Bom atendimento, mas poderia ser mais rápido.',
              loja: 'Tech Store',
              produtos: ['Notebook Dell', 'Mouse Logitech'],
              data: '2024-12-19',
              horario: '10:15',
              duracao: '25 min',
            },
            {
              id: 3,
              chamadaId: 'CH-2024-003',
              estrelas: 5,
              comentario: 'Perfeito! Recomendo!',
              loja: 'Casa & Decoração',
              produtos: ['Luminária LED'],
              data: '2024-12-18',
              horario: '16:45',
              duracao: '12 min',
            },
          ];
          
          setAvaliacoes(mockAvaliacoes);
          setLoading(false);
          return;
        }

        // Buscar avaliações do consultor no Supabase
        const { data, error } = await supabase
          .from('avaliacoes')
          .select(`
            id,
            nota,
            comentario,
            created_at,
            cliente_id,
            produto_id,
            loja_id,
            produtos:produto_id (
              nome,
              sku
            ),
            lojas:loja_id (
              nome_fantasia
            )
          `)
          .eq('consultor_id', consultorId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformar dados para o formato do componente
        const avaliacoesFormatadas = data.map(av => ({
          id: av.id,
          chamadaId: `CH-${new Date(av.created_at).getFullYear()}-${String(av.id).padStart(3, '0')}`,
          estrelas: av.nota,
          comentario: av.comentario || 'Sem comentário',
          loja: av.lojas?.nome_fantasia || 'Loja não identificada',
          produtos: av.produtos ? [av.produtos.nome] : ['Produto não identificado'],
          data: av.created_at.split('T')[0],
          horario: new Date(av.created_at).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duracao: '-- min',
        }));

        setAvaliacoes(avaliacoesFormatadas);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        alert('Erro ao carregar avaliações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarAvaliacoes();
  }, [consultorId]); //  Agora está correto!

  const calcularEstatisticas = () => {
    const total = avaliacoes.length;
    const soma = avaliacoes.reduce((acc, av) => acc + av.estrelas, 0);
    const media = total > 0 ? (soma / total).toFixed(1) : 0;
    
    const distribuicao = {
      5: avaliacoes.filter(av => av.estrelas === 5).length,
      4: avaliacoes.filter(av => av.estrelas === 4).length,
      3: avaliacoes.filter(av => av.estrelas === 3).length,
      2: avaliacoes.filter(av => av.estrelas === 2).length,
      1: avaliacoes.filter(av => av.estrelas === 1).length,
    };

    return { total, media, distribuicao };
  };

  const avaliacoesFiltradas = avaliacoes
    .filter(av => {
      if (filtroEstrelas === 'todas') return true;
      return av.estrelas === parseInt(filtroEstrelas);
    })
    .sort((a, b) => {
      if (ordenacao === 'recentes') {
        return new Date(b.data) - new Date(a.data);
      } else if (ordenacao === 'antigas') {
        return new Date(a.data) - new Date(b.data);
      } else if (ordenacao === 'melhores') {
        return b.estrelas - a.estrelas;
      } else if (ordenacao === 'piores') {
        return a.estrelas - b.estrelas;
      }
      return 0;
    });

  const stats = calcularEstatisticas();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando avaliações...</p>
      </div>
    );
  }

  const recarregarAvaliacoes = () => {
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      {/* Header com Estatisticas */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}> Minhas Avaliações</h2>
          <p style={styles.subtitle}>Veja o feedback dos seus clientes</p>
        </div>
        <button 
          onClick={recarregarAvaliacoes}
          style={styles.refreshButton}
        >
           Atualizar
        </button>
      </div>

      {/* Card de Estatisticas Gerais */}
      <div style={styles.statsCard}>
        <div style={styles.statsLeft}>
          <div style={styles.mediaContainer}>
            <span style={styles.mediaValor}>{stats.media}</span>
            <div style={styles.mediaEstrelas}>
              {renderStars(parseFloat(stats.media))}
            </div>
            <span style={styles.mediaTotalAvaliacoes}>{stats.total} avaliações</span>
          </div>
        </div>

        <div style={styles.statsRight}>
          {[5, 4, 3, 2, 1].map(estrela => {
            const quantidade = stats.distribuicao[estrela];
            const porcentagem = stats.total > 0 ? (quantidade / stats.total) * 100 : 0;
            
            return (
              <div key={estrela} style={styles.barraRow}>
                <span style={styles.barraLabel}>{estrela} </span>
                <div style={styles.barraContainer}>
                  <div 
                    style={{
                      ...styles.barraPreenchida,
                      width: `${porcentagem}%`,
                    }}
                  />
                </div>
                <span style={styles.barraQuantidade}>{quantidade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros e Ordenacao */}
      <div style={styles.filtrosContainer}>
        <div style={styles.filtrosLeft}>
          <FaFilter color="#666" />
          <select
            value={filtroEstrelas}
            onChange={(e) => setFiltroEstrelas(e.target.value)}
            style={styles.select}
          >
            <option value="todas">Todas as avaliações</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="2">2 estrelas</option>
            <option value="1">1 estrela</option>
          </select>
        </div>

        <div style={styles.filtrosRight}>
          <span style={styles.ordenarLabel}>Ordenar por:</span>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={styles.select}
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
            <option value="melhores">Melhor avaliadas</option>
            <option value="piores">Pior avaliadas</option>
          </select>
        </div>
      </div>

      {/* Lista de Avaliacoes */}
      <div style={styles.avaliacoesList}>
        {avaliacoesFiltradas.map(avaliacao => (
          <div key={avaliacao.id} style={styles.avaliacaoCard}>
            <div style={styles.avaliacaoHeader}>
              <div style={styles.chamadaInfo}>
                <div style={styles.chamadaIdBadge}>
                  🎫 {avaliacao.chamadaId}
                </div>
                <div style={styles.dataHoraInfo}>
                  <span style={styles.dataText}>
                    📅 {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </span>
                  <span style={styles.horarioText}>
                    🕐 {avaliacao.horario}
                  </span>
                  {avaliacao.duracao !== '-- min' && (
                    <span style={styles.duracaoText}>
                      ⏱️ {avaliacao.duracao}
                    </span>
                  )}
                </div>
              </div>
              
              <div style={styles.estrelasContainer}>
                {renderStars(avaliacao.estrelas)}
                <span style={styles.notaTexto}>{avaliacao.estrelas}/5</span>
              </div>
            </div>

            <p style={styles.comentario}>{avaliacao.comentario}</p>

            <div style={styles.avaliacaoFooter}>
              <div style={styles.footerRow}>
                <span style={styles.footerLabel}> Loja:</span>
                <span style={styles.footerValue}>{avaliacao.loja}</span>
              </div>
              <div style={styles.footerRow}>
                <span style={styles.footerLabel}> Produtos:</span>
                <span style={styles.footerValue}>
                  {avaliacao.produtos.join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando nao ha avaliacoes */}
      {avaliacoesFiltradas.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><HourglassHigh size={80} weight="duotone" color="#2f0d51" /></div>
          <p style={styles.emptyTitle}>Nenhuma avaliação encontrada</p>
          <p style={styles.emptySubtitle}>
            {filtroEstrelas !== 'todas' 
              ? 'Tente ajustar os filtros de busca'
              : 'Você ainda não recebeu avaliações dos clientes'}
          </p>
        </div>
      )}

      {/* CSS para animacao do spinner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

// Funcao auxiliar para renderizar estrelas
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#ffc107" size={18} />);
    } else {
      stars.push(<FaRegStar key={i} color="#ddd" size={18} />);
    }
  }
  return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '25px',
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
    borderTop: '4px solid #2f0d51',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  refreshButton: {
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statsLeft: {
    flex: '0 0 auto',
  },
  mediaContainer: {
    textAlign: 'center',
  },
  mediaValor: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#ffc107',
    display: 'block',
  },
  mediaEstrelas: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  mediaTotalAvaliacoes: {
    fontSize: '14px',
    color: '#666',
  },
  statsRight: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  barraRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  barraLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    width: '50px',
  },
  barraContainer: {
    flex: 1,
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#ffc107',
    transition: 'width 0.3s',
  },
  barraQuantidade: {
    fontSize: '14px',
    color: '#666',
    width: '30px',
    textAlign: 'right',
  },
  filtrosContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  filtrosLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filtrosRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  ordenarLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'white',
    outline: 'none',
  },
  avaliacoesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  avaliacaoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  avaliacaoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '15px',
  },
  chamadaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  chamadaIdBadge: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    color: CONSULTOR_PRIMARY,
    padding: '8px 15px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
  dataHoraInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  dataText: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
  horarioText: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
  duracaoText: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
    backgroundColor: '#f8f9fa',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  estrelasContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px',
  },
  notaTexto: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffc107',
  },
  comentario: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  avaliacaoFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '15px',
    borderTop: '1px solid #e9ecef',
  },
  footerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  footerLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
    minWidth: '80px',
  },
  footerValue: {
    fontSize: '13px',
    color: '#333',
    flex: 1,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  emptySubtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
};

export default ReviewsPanel;