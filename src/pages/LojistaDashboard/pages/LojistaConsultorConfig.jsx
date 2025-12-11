// app-frontend/src/pages/LojistaDashboard/pages/LojistaConsultorConfig.jsx
// VERSAO ATUALIZADA COM SISTEMA DE SCORE

import React, { useState, useEffect } from 'react';
import ConsultorCandidatoCard from '../../ConsultorDashboard/components/ConsultorCandidatoCard';

const LojistaConsultorConfig = () => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendentes'); // pendentes, aprovados, recusados

  useEffect(() => {
    carregarCandidaturas();
  }, [activeTab]);

  const carregarCandidaturas = async () => {
    setLoading(true);
    try {
      // TODO: Substituir pelo ID real do lojista logado
      const lojistaId = localStorage.getItem('lojistaId') || '1';
      
      const response = await fetch(`/api/lojistas/${lojistaId}/candidaturas?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar candidaturas');

      const data = await response.json();
      setCandidaturas(data.candidaturas || []);
      
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      // Usar dados mock para desenvolvimento
      setCandidaturas(mockCandidaturas);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (consultorId) => {
    try {
      const lojistaId = localStorage.getItem('lojistaId') || '1';
      
      const response = await fetch(`/api/lojistas/${lojistaId}/candidaturas/${consultorId}/aprovar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao aprovar consultor');

      alert(' Consultor aprovado com sucesso!');
      carregarCandidaturas(); // Recarregar lista
      
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert(' Erro ao aprovar consultor');
    }
  };

  const handleRecusar = async (consultorId) => {
    const motivo = prompt('Motivo da recusa (opcional):');
    
    try {
      const lojistaId = localStorage.getItem('lojistaId') || '1';
      
      const response = await fetch(`/api/lojistas/${lojistaId}/candidaturas/${consultorId}/recusar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo })
      });

      if (!response.ok) throw new Error('Erro ao recusar consultor');

      alert(' Consultor recusado');
      carregarCandidaturas(); // Recarregar lista
      
    } catch (error) {
      console.error('Erro ao recusar:', error);
      alert(' Erro ao recusar consultor');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}> Gestao de Consultores</h1>
        <p style={styles.subtitle}>Avalie e aprove consultores para sua loja</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('pendentes')}
          style={{
            ...styles.tab,
            ...(activeTab === 'pendentes' ? styles.tabActive : {})
          }}
        >
          o Pendentes {candidaturas.length > 0 && `(${candidaturas.length})`}
        </button>
        <button
          onClick={() => setActiveTab('aprovados')}
          style={{
            ...styles.tab,
            ...(activeTab === 'aprovados' ? styles.tabActive : {})
          }}
        >
           Aprovados
        </button>
        <button
          onClick={() => setActiveTab('recusados')}
          style={{
            ...styles.tab,
            ...(activeTab === 'recusados' ? styles.tabActive : {})
          }}
        >
           Recusados
        </button>
      </div>

      {/* Conteudo */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Carregando candidaturas...</p>
          </div>
        ) : candidaturas.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}></p>
            <p style={styles.emptyText}>
              {activeTab === 'pendentes' && 'Nenhuma candidatura pendente no momento'}
              {activeTab === 'aprovados' && 'Nenhum consultor aprovado ainda'}
              {activeTab === 'recusados' && 'Nenhum consultor recusado'}
            </p>
          </div>
        ) : (
          <div style={styles.candidaturasList}>
            {candidaturas.map((candidatura) => (
              <ConsultorCandidatoCard
                key={candidatura.id}
                consultor={candidatura.consultor}
                onAprovar={handleAprovar}
                onRecusar={handleRecusar}
                showActions={activeTab === 'pendentes'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data para desenvolvimento
const mockCandidaturas = [
  {
    id: 'cand1',
    consultor: {
      id: 'cons123',
      nome: 'Carlos Mendes',
      email: 'carlos@email.com',
      cidade: 'Sao Paulo',
      estado: 'SP',
      tempoPlataforma: '6 meses',
      lojasAtivas: 3,
      score: {
        scoreTotal: 8.7,
        nivel: 'Ouro',
        ranking: 'Top 15%',
        componentes: {
          atendimento: {
            nota: 9.6,
            peso: 40,
            avaliacaoMedia: 4.8,
            totalAvaliacoes: 156,
            taxaSatisfacao: 96.2,
            percentual: 96,
          },
          vendas: {
            nota: 8.2,
            peso: 35,
            totalVendas: 156,
            vendasUltimos30Dias: 22,
            ticketMedio: 350.00,
            percentual: 82,
          },
          treinamentos: {
            nota: 9.2,
            peso: 25,
            total: 12,
            concluidos: 11,
            obrigatoriosConcluidos: true,
            percentual: 92,
          }
        }
      }
    },
    status: 'pendente',
    dataCandidatura: '2024-12-01'
  },
  {
    id: 'cand2',
    consultor: {
      id: 'cons456',
      nome: 'Ana Silva',
      email: 'ana@email.com',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      tempoPlataforma: '3 meses',
      lojasAtivas: 1,
      score: {
        scoreTotal: 6.5,
        nivel: 'Prata',
        ranking: 'Top 45%',
        componentes: {
          atendimento: {
            nota: 7.5,
            peso: 40,
            avaliacaoMedia: 3.8,
            totalAvaliacoes: 42,
            taxaSatisfacao: 78.5,
            percentual: 76,
          },
          vendas: {
            nota: 5.8,
            peso: 35,
            totalVendas: 58,
            vendasUltimos30Dias: 8,
            ticketMedio: 220.00,
            percentual: 58,
          },
          treinamentos: {
            nota: 6.7,
            peso: 25,
            total: 12,
            concluidos: 8,
            obrigatoriosConcluidos: true,
            percentual: 67,
          }
        }
      }
    },
    status: 'pendente',
    dataCandidatura: '2024-11-28'
  }
];

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e9ecef',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#666',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  tabActive: {
    color: '#28a745',
    borderBottomColor: '#28a745',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '4rem',
    margin: '0 0 20px 0',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#666',
  },
  candidaturasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
};

// Adicionar animacao do spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LojistaConsultorConfig;
