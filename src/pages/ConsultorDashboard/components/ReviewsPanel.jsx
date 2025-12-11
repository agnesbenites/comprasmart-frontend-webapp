// app-frontend/src/pages/ConsultorDashboard/components/ReviewsPanel.jsx

import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaFilter } from 'react-icons/fa';

const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const ReviewsPanel = ({ consultorId }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [filtroEstrelas, setFiltroEstrelas] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    setLoading(true);
    try {
      // TODO: Buscar da API
      // const response = await fetch(`${API_URL}/api/consultores/${consultorId}/avaliacoes`);
      
      // Mock de dados
      setTimeout(() => {
        setAvaliacoes(mockAvaliacoes);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar avaliacoes:', error);
      setLoading(false);
    }
  };

  const mockAvaliacoes = [
    {
      id: 1,
      chamadaId: 'CH-2024-001',
      estrelas: 5,
      comentario: 'Excelente atendimento! O consultor foi muito atencioso e me ajudou a escolher o produto perfeito. Recomendo!',
      loja: 'Eletr´nicos Center',
      produtos: ['Smart TV 55"', 'Soundbar Premium'],
      data: '2024-12-05',
      horario: '14:30',
      duracao: '18 min',
    },
    {
      id: 2,
      chamadaId: 'CH-2024-002',
      estrelas: 4,
      comentario: 'Bom atendimento, apenas demorou um pouco para responder minhas duvidas.',
      loja: 'Tech Store',
      produtos: ['Notebook Gamer'],
      data: '2024-12-03',
      horario: '10:15',
      duracao: '25 min',
    },
    {
      id: 3,
      chamadaId: 'CH-2024-003',
      estrelas: 5,
      comentario: 'Profissional muito competente! Tirou todas as minhas duvidas e me passou muita confianca na compra.',
      loja: 'Eletr´nicos Center',
      produtos: ['Geladeira Inverter', 'Micro-ondas'],
      data: '2024-12-01',
      horario: '16:45',
      duracao: '22 min',
    },
    {
      id: 4,
      chamadaId: 'CH-2024-004',
      estrelas: 3,
      comentario: 'Atendimento ok, mas esperava mais detalhes sobre o produto.',
      loja: 'Casa & Decoracao',
      produtos: ['Sofa 3 Lugares'],
      data: '2024-11-28',
      horario: '11:20',
      duracao: '12 min',
    },
    {
      id: 5,
      chamadaId: 'CH-2024-005',
      estrelas: 5,
      comentario: 'Simplesmente perfeito! Super recomendo este consultor.',
      loja: 'Tech Store',
      produtos: ['Air Fryer', 'Liquidificador'],
      data: '2024-11-25',
      horario: '09:30',
      duracao: '15 min',
    },
  ];

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
        <p>Carregando avaliacoes...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header com Estatisticas */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>i Minhas Avaliacoes</h2>
          <p style={styles.subtitle}>Veja o feedback dos seus clientes</p>
        </div>
      </div>

      {/* Card de Estatisticas Gerais */}
      <div style={styles.statsCard}>
        <div style={styles.statsLeft}>
          <div style={styles.mediaContainer}>
            <span style={styles.mediaValor}>{stats.media}</span>
            <div style={styles.mediaEstrelas}>
              {renderStars(parseFloat(stats.media))}
            </div>
            <span style={styles.mediaTotalAvaliacoes}>{stats.total} avaliacoes</span>
          </div>
        </div>

        <div style={styles.statsRight}>
          {[5, 4, 3, 2, 1].map(estrela => {
            const quantidade = stats.distribuicao[estrela];
            const porcentagem = stats.total > 0 ? (quantidade / stats.total) * 100 : 0;
            
            return (
              <div key={estrela} style={styles.barraRow}>
                <span style={styles.barraLabel}>{estrela} i</span>
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
            <option value="todas">Todas as avaliacoes</option>
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
                   {avaliacao.chamadaId}
                </div>
                <div style={styles.dataHoraInfo}>
                  <span style={styles.dataText}>
                     {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </span>
                  <span style={styles.horarioText}>
                     {avaliacao.horario}
                  </span>
                  <span style={styles.duracaoText}>
                    ± {avaliacao.duracao}
                  </span>
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
          <div style={styles.emptyIcon}>i</div>
          <p style={styles.emptyTitle}>Nenhuma avaliacao encontrada</p>
          <p style={styles.emptySubtitle}>
            {filtroEstrelas !== 'todas' 
              ? 'Tente ajustar os filtros de busca'
              : 'Voca ainda nao recebeu avaliacoes dos clientes'}
          </p>
        </div>
      )}
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
    borderTop: '4px solid #2c5aa0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
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
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
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
