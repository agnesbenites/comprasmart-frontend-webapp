// app-frontend/src/pages/LojistaDashboard/components/ConsultorCandidatoCard.jsx

import React from 'react';
import { FaStar, FaGraduationCap, FaShoppingCart, FaTrophy, FaCheckCircle, FaClock } from 'react-icons/fa';

const LOJISTA_PRIMARY = "#bb25a6";
const LOJISTA_LIGHT_BG = "#e8f5e9";

/**
 * Card que o LOJISTA va ao avaliar candidaturas de consultores
 * Mostra o SCORE calculado automaticamente baseado em:
 * - Avaliacoes recebidas (peso 40%)
 * - Quantidade de vendas (peso 35%)
 * - Treinamentos concluidos (peso 25%)
 */
const ConsultorCandidatoCard = ({ consultor, onAprovar, onRecusar }) => {
  
  const getNivelBadge = (nivel) => {
    const badges = {
      'Diamante': { color: '#b9f2ff', icon: '', textColor: '#006d8f' },
      'Ouro': { color: '#ffd700', icon: '', textColor: '#8b6914' },
      'Prata': { color: '#c0c0c0', icon: '', textColor: '#6b6b6b' },
      'Bronze': { color: '#cd7f32', icon: '', textColor: '#5c3a1a' },
      'Iniciante': { color: '#e9ecef', icon: '', textColor: '#495057' },
    };
    return badges[nivel] || badges['Iniciante'];
  };

  const nivelInfo = getNivelBadge(consultor.score.nivel);

  return (
    <div style={styles.card}>
      {/* Header com Score em Destaque */}
      <div style={styles.header}>
        <div style={styles.consultorInfo}>
          <div style={styles.avatar}>
            {consultor.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={styles.nome}>{consultor.nome}</h3>
            <p style={styles.localidade}>{consultor.cidade}, {consultor.estado}</p>
          </div>
        </div>

        <div style={styles.scoreContainer}>
          <div style={{
            ...styles.nivelBadge,
            backgroundColor: nivelInfo.color,
            color: nivelInfo.textColor,
          }}>
            <span style={styles.nivelIcon}>{nivelInfo.icon}</span>
            <span style={styles.nivelTexto}>{consultor.score.nivel}</span>
          </div>
          <div style={styles.scoreNumero}>
            <span style={styles.scoreValor}>{consultor.score.scoreTotal.toFixed(1)}</span>
            <span style={styles.scoreMax}>/10</span>
          </div>
          <p style={styles.rankingTexto}>
            <FaTrophy color="#ffc107" /> {consultor.score.ranking}
          </p>
        </div>
      </div>

      {/* Metricas Detalhadas */}
      <div style={styles.metricas}>
        
        {/* Avaliacoes */}
        <div style={styles.metricaItem}>
          <div style={styles.metricaHeader}>
            <FaStar color="#ffc107" size={18} />
            <span style={styles.metricaLabel}>Avaliacoes</span>
          </div>
          <div style={styles.metricaValor}>
            <span style={styles.metricaNumero}>
              {consultor.score.componentes.atendimento.avaliacaoMedia.toFixed(1)}
            </span>
            <span style={styles.metricaSubtexto}>
              ({consultor.score.componentes.atendimento.totalAvaliacoes} avaliacoes)
            </span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${consultor.score.componentes.atendimento.percentual}%`,
                backgroundColor: '#ffc107',
              }}
            />
          </div>
          <p style={styles.metricaDetalhe}>
            {consultor.score.componentes.atendimento.taxaSatisfacao.toFixed(0)}% de satisfacao
          </p>
        </div>

        {/* Vendas */}
        <div style={styles.metricaItem}>
          <div style={styles.metricaHeader}>
            <FaShoppingCart color="#bb25a6" size={18} />
            <span style={styles.metricaLabel}>Vendas</span>
          </div>
          <div style={styles.metricaValor}>
            <span style={styles.metricaNumero}>
              {consultor.score.componentes.vendas.totalVendas}
            </span>
            <span style={styles.metricaSubtexto}>vendas totais</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${consultor.score.componentes.vendas.percentual}%`,
                backgroundColor: '#bb25a6',
              }}
            />
          </div>
          <p style={styles.metricaDetalhe}>
            {consultor.score.componentes.vendas.vendasUltimos30Dias} vendas nos ultimos 30 dias
          </p>
        </div>

        {/* Treinamentos */}
        <div style={styles.metricaItem}>
          <div style={styles.metricaHeader}>
            <FaGraduationCap color="#2c5aa0" size={18} />
            <span style={styles.metricaLabel}>Treinamentos</span>
          </div>
          <div style={styles.metricaValor}>
            <span style={styles.metricaNumero}>
              {consultor.score.componentes.treinamentos.concluidos}
            </span>
            <span style={styles.metricaSubtexto}>
              de {consultor.score.componentes.treinamentos.total} concluidos
            </span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${consultor.score.componentes.treinamentos.percentual}%`,
                backgroundColor: '#2c5aa0',
              }}
            />
          </div>
          <p style={styles.metricaDetalhe}>
            {consultor.score.componentes.treinamentos.obrigatoriosConcluidos 
              ? ' Todos obrigatorios concluidos' 
              : 'o Treinamentos obrigatorios pendentes'}
          </p>
        </div>
      </div>

      {/* Informacoes Adicionais */}
      <div style={styles.infoAdicional}>
        <div style={styles.infoItem}>
          <FaClock color="#666" />
          <span>Cadastrado ha {consultor.tempoPlataforma}</span>
        </div>
        <div style={styles.infoItem}>
          <FaCheckCircle color="#bb25a6" />
          <span>{consultor.lojasAtivas} lojas ativas</span>
        </div>
      </div>

      {/* Explicacao do Score */}
      <div style={styles.scoreExplicacao}>
        <p style={styles.explicacaoTexto}>
           <strong>Score calculado por:</strong> Avaliacoes (40%) + Vendas (35%) + Treinamentos (25%)
        </p>
      </div>

      {/* Botoes de Acao */}
      <div style={styles.acoes}>
        <button onClick={() => onRecusar(consultor.id)} style={styles.recusarButton}>
          O Recusar
        </button>
        <button onClick={() => onAprovar(consultor.id)} style={styles.aprovarButton}>
          “ Aprovar Consultor
        </button>
      </div>
    </div>
  );
};

// Exemplo de dados que viriam da API
export const mockConsultorCandidato = {
  id: 'cons123',
  nome: 'Carlos Mendes',
  cidade: 'Sao Paulo',
  estado: 'SP',
  tempoPlataforma: '6 meses',
  lojasAtivas: 3,
  score: {
    scoreTotal: 8.7, // Calculado automaticamente pelo backend
    nivel: 'Ouro', // Diamante (9-10), Ouro (7.5-8.9), Prata (6-7.4), Bronze (4-5.9), Iniciante (<4)
    ranking: 'Top 15%', // Posicao entre todos os consultores
    componentes: {
      atendimento: {
        peso: 40, // 40% do score total
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 156,
        taxaSatisfacao: 96.2,
        percentual: 96, // (4.8/5.0) * 100
      },
      vendas: {
        peso: 35, // 35% do score total
        totalVendas: 156,
        vendasUltimos30Dias: 22,
        percentual: 82, // Baseado em metas/benchmarks
      },
      treinamentos: {
        peso: 25, // 25% do score total
        total: 12,
        concluidos: 11,
        obrigatoriosConcluidos: true,
        percentual: 92, // (11/12) * 100
      }
    }
  }
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e9ecef',
  },
  consultorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  nome: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  localidade: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  scoreContainer: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  nivelBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  nivelIcon: {
    fontSize: '18px',
  },
  nivelTexto: {
    textTransform: 'uppercase',
  },
  scoreNumero: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px',
  },
  scoreValor: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: LOJISTA_PRIMARY,
  },
  scoreMax: {
    fontSize: '1.2rem',
    color: '#999',
  },
  rankingTexto: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  metricas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  metricaItem: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
  },
  metricaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  metricaLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
  },
  metricaValor: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginBottom: '10px',
  },
  metricaNumero: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
  },
  metricaSubtexto: {
    fontSize: '12px',
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  metricaDetalhe: {
    fontSize: '11px',
    color: '#666',
    margin: 0,
  },
  infoAdicional: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px 0',
    borderTop: '1px solid #e9ecef',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '15px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  scoreExplicacao: {
    backgroundColor: '#fff8e1',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  explicacaoTexto: {
    fontSize: '13px',
    color: '#856404',
    margin: 0,
    lineHeight: '1.5',
  },
  acoes: {
    display: 'flex',
    gap: '12px',
  },
  recusarButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  aprovarButton: {
    flex: 2,
    padding: '14px',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ConsultorCandidatoCard;
