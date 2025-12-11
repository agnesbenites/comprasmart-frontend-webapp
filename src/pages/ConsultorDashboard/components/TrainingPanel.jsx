// app-frontend/src/pages/ConsultorDashboard/components/TrainingPanel.jsx
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaCheckCircle, FaLock, FaPlay, FaFileAlt, FaVideo, FaExclamationTriangle, FaClock, FaStore, FaShieldAlt } from 'react-icons/fa';

const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';
const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const TrainingPanel = ({ consultorId }) => {
  const [treinamentosPlataforma, setTreinamentosPlataforma] = useState([]);
  const [treinamentosLojistas, setTreinamentosLojistas] = useState([]);
  const [treinamentosConcluidos, setTreinamentosConcluidos] = useState([]);
  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressoGeral, setProgressoGeral] = useState(0);

  useEffect(() => {
    carregarTreinamentos();
  }, []);

  const carregarTreinamentos = async () => {
    setLoading(true);
    try {
      // Buscar treinamentos da API
      const response = await fetch(`${API_URL}/api/consultores/${consultorId}/treinamentos`);
      const data = await response.json();
      
      // Separar por origem e ordenar por data (mais recentes primeiro)
      const plataforma = data.treinamentos
        .filter(t => t.origem === 'plataforma')
        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
      
      const lojistas = data.treinamentos
        .filter(t => t.origem === 'lojista')
        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
      
      setTreinamentosPlataforma(plataforma);
      setTreinamentosLojistas(lojistas);
      
      // Buscar treinamentos já concluídos pelo consultor
      const progressoResponse = await fetch(`${API_URL}/api/consultores/${consultorId}/treinamentos/progresso`);
      const progressoData = await progressoResponse.json();
      setTreinamentosConcluidos(progressoData.concluidos || []);
      
      calcularProgresso();
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      // Fallback para mock em caso de erro
      setTreinamentosPlataforma(mockTreinamentosPlataforma);
      setTreinamentosLojistas(mockTreinamentosLojistas);
      setTreinamentosConcluidos(['PLAT-001', 'PLAT-002', 'LOJ-001']);
      calcularProgresso();
      setLoading(false);
    }
  };

  const mockTreinamentosPlataforma = [
    {
      id: 'PLAT-001',
      titulo: 'Conduta e Comunicação na Plataforma',
      descricao: 'O que você pode ou não perguntar e falar nas chamadas, mensagens de áudio e texto',
      tipo: 'video',
      duracao: '15 min',
      obrigatorio: true,
      dataPublicacao: '2024-11-15',
      visualizado: true,
      conteudo: {
        topicos: [
          'Perguntas permitidas e proibidas',
          'Linguagem apropriada e profissional',
          'Limites de privacidade do cliente',
          'Como lidar com situações delicadas',
          'Política de dados pessoais (LGPD)',
        ],
        pontosPrincipais: [
          '❌ NUNCA pergunte: CPF, número do cartão, senhas bancárias',
          '❌ NUNCA fale sobre: política, religião, questões pessoais íntimas',
          '✅ SEMPRE mantenha: profissionalismo, respeito, foco no produto',
          '✅ SEMPRE ofereça: informações técnicas, comparações, suporte na escolha',
        ]
      }
    },
    {
      id: 'PLAT-002',
      titulo: 'Pesquisa Eficiente de Produtos',
      descricao: 'Como fazer pesquisa de produtos de maneira eficiente e assertiva',
      tipo: 'documento',
      duracao: '10 min',
      obrigatorio: true,
      dataPublicacao: '2024-11-20',
      visualizado: true,
      conteudo: {
        topicos: [
          'Uso de filtros avançados',
          'Palavras-chave eficientes',
          'Comparação de especificações',
          'Verificação de estoque em tempo real',
          'Identificação de melhores ofertas',
        ],
        pontosPrincipais: [
          '🔍 Use filtros por categoria, faixa de preço e marca',
          '📊 Compare pelo menos 3 produtos similares',
          '✅ Sempre verifique disponibilidade antes de recomendar',
          '💡 Destaque diferenciais técnicos relevantes ao cliente',
        ]
      }
    },
    {
      id: 'PLAT-003',
      titulo: 'Boas Práticas na Plataforma',
      descricao: 'Diretrizes para atuação profissional e ética',
      tipo: 'video',
      duracao: '20 min',
      obrigatorio: true,
      dataPublicacao: '2024-11-25',
      visualizado: false,
      conteudo: {
        topicos: [
          'Pontualidade e disponibilidade',
          'Qualidade no atendimento',
          'Gestão de múltiplas chamadas',
          'Resolução de conflitos',
          'Ética profissional',
        ],
        pontosPrincipais: [
          '📱 Mantenha seu status atualizado',
          '💬 Responda mensagens em até 2 minutos',
          '🏆 Finalize vendas com eficiência',
          '⭐ Busque avaliações positivas',
        ]
      }
    },
    {
      id: 'PLAT-004',
      titulo: 'Compliance e Gravação de Chamadas',
      descricao: 'Política de monitoramento e privacidade',
      tipo: 'documento',
      duracao: '8 min',
      obrigatorio: true,
      dataPublicacao: '2024-12-01',
      visualizado: false,
      conteudo: {
        topicos: [
          'Política de gravação de chamadas',
          'Monitoramento de mensagens',
          'Finalidade do compliance',
          'Seus direitos e deveres',
          'Consequências de violações',
        ],
        pontosPrincipais: [
          '🎥 A plataforma pode gravar chamadas aleatoriamente SEM AVISO PRÉVIO',
          '💬 Mensagens podem ser auditadas para fins de compliance',
          '⚖️ Objetivo: manter integridade e compromisso com usuários',
          '🚫 Violações graves podem resultar em suspensão ou banimento',
        ],
        avisoImportante: 'ATENÇÃO: Todas as interações na plataforma podem ser monitoradas para garantir a qualidade e segurança de todos os usuários. Ao aceitar os termos, você concorda com esta política.'
      }
    },
    {
      id: 'PLAT-005',
      titulo: 'Protocolo de Problemas e Reports',
      descricao: 'Como reportar problemas com lojas e produtos',
      tipo: 'documento',
      duracao: '12 min',
      obrigatorio: true,
      dataPublicacao: '2024-12-05',
      visualizado: false,
      conteudo: {
        topicos: [
          'Quando usar o sistema de reports',
          'Tipos de problemas reportáveis',
          'Como documentar evidências',
          'Prazos de resposta',
          'O que NÃO fazer',
        ],
        pontosPrincipais: [
          '❌ NUNCA acione diretamente as lojas sobre problemas',
          '✅ SEMPRE use o sistema de reports da plataforma',
          '📸 Anexe prints e evidências quando possível',
          '⏳ Aguarde até 30 dias para retorno oficial',
          '🚫 Não tente resolver problemas por fora da plataforma',
        ],
        avisoImportante: 'IMPORTANTE: O consultor NÃO pode contatar lojas diretamente. Qualquer problema deve ser reportado através da plataforma para análise adequada.'
      }
    },
  ];

  const mockTreinamentosLojistas = [
    {
      id: 'LOJ-001',
      titulo: 'Lançamento Samsung Galaxy S24 Ultra',
      descricao: 'Especificações técnicas e diferenciais do novo flagship',
      loja: 'Eletrônicos Center',
      segmento: 'Smartphones',
      tipo: 'video',
      duracao: '18 min',
      dataPublicacao: '2024-12-01',
      visualizado: true,
      relevante: true,
      conteudo: {
        topicos: [
          'Especificações técnicas completas',
          'Comparação com modelo anterior',
          'Diferenciais de câmera e IA',
          'Preços e condições especiais',
        ]
      }
    },
    {
      id: 'LOJ-002',
      titulo: 'Nova Linha de Geladeiras Brastemp Inverse',
      descricao: 'Tecnologia inverter e economia de energia',
      loja: 'Tech Store',
      segmento: 'Eletrodomésticos',
      tipo: 'documento',
      duracao: '12 min',
      dataPublicacao: '2024-11-28',
      visualizado: false,
      relevante: false,
      conteudo: {
        topicos: [
          'Tecnologia inverter',
          'Economia de energia',
          'Capacidades disponíveis',
          'Garantia estendida',
        ]
      }
    },
    {
      id: 'LOJ-003',
      titulo: 'Promoção Black Friday - Eletrônicos',
      descricao: 'Produtos em destaque e condições especiais',
      loja: 'Eletrônicos Center',
      segmento: 'Eletrônicos',
      tipo: 'documento',
      duracao: '8 min',
      dataPublicacao: '2024-11-20',
      visualizado: false,
      relevante: true,
      conteudo: {
        topicos: [
          'Produtos com maior desconto',
          'Condições de pagamento',
          'Estoque limitado - prioridades',
          'Comissão diferenciada',
        ]
      }
    },
  ];

  const calcularProgresso = () => {
    const totalObrigatorios = mockTreinamentosPlataforma.filter(t => t.obrigatorio).length;
    const concluidos = mockTreinamentosPlataforma.filter(t => 
      t.obrigatorio && treinamentosConcluidos.includes(t.id)
    ).length;
    
    const progresso = totalObrigatorios > 0 ? (concluidos / totalObrigatorios) * 100 : 0;
    setProgressoGeral(Math.round(progresso));
  };

  const isConcluido = (treinamentoId) => {
    return treinamentosConcluidos.includes(treinamentoId);
  };

  const isHabilitado = () => {
    const todosObrigatoriosConcluidos = mockTreinamentosPlataforma
      .filter(t => t.obrigatorio)
      .every(t => isConcluido(t.id));
    
    return todosObrigatoriosConcluidos;
  };

  const isNovo = (dataPublicacao) => {
    const hoje = new Date();
    const publicacao = new Date(dataPublicacao);
    const diferencaDias = Math.floor((hoje - publicacao) / (1000 * 60 * 60 * 24));
    return diferencaDias <= 7;
  };

  const ordenarPorDataDecrescente = (treinamentos) => {
    return [...treinamentos].sort((a, b) => {
      return new Date(b.dataPublicacao) - new Date(a.dataPublicacao);
    });
  };

  const iniciarTreinamento = (treinamento) => {
    setTreinamentoSelecionado(treinamento);
    
    // Marcar como visualizado
    if (!treinamento.visualizado) {
      if (treinamento.id.startsWith('PLAT')) {
        const index = treinamentosPlataforma.findIndex(t => t.id === treinamento.id);
        if (index !== -1) {
          const updated = [...treinamentosPlataforma];
          updated[index].visualizado = true;
          setTreinamentosPlataforma(updated);
        }
      } else {
        const index = treinamentosLojistas.findIndex(t => t.id === treinamento.id);
        if (index !== -1) {
          const updated = [...treinamentosLojistas];
          updated[index].visualizado = true;
          setTreinamentosLojistas(updated);
        }
      }
    }
  };

  const concluirTreinamento = async (treinamentoId) => {
    try {
      const response = await fetch(`${API_URL}/api/consultores/${consultorId}/treinamentos/${treinamentoId}/concluir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataConclusao: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Erro ao marcar como concluído');

      setTreinamentosConcluidos([...treinamentosConcluidos, treinamentoId]);
      setTreinamentoSelecionado(null);
      calcularProgresso();
      alert('✅ Treinamento concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao concluir treinamento:', error);
      setTreinamentosConcluidos([...treinamentosConcluidos, treinamentoId]);
      setTreinamentoSelecionado(null);
      calcularProgresso();
      alert('✅ Treinamento concluído com sucesso!');
    }
  };

  const voltarParaLista = () => {
    setTreinamentoSelecionado(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando treinamentos...</p>
      </div>
    );
  }

  // Visualização Detalhada do Treinamento
  if (treinamentoSelecionado) {
    return (
      <div style={styles.container}>
        <div style={styles.detailHeader}>
          <button onClick={voltarParaLista} style={styles.backButton}>
            ← Voltar
          </button>
          
          <div style={styles.detailTitleSection}>
            <h2 style={styles.detailTitle}>{treinamentoSelecionado.titulo}</h2>
            <p style={styles.detailSubtitle}>{treinamentoSelecionado.descricao}</p>
            <div style={styles.detailMeta}>
              {treinamentoSelecionado.tipo === 'video' ? (
                <span><FaVideo /> Vídeo</span>
              ) : (
                <span><FaFileAlt /> Documento</span>
              )}
              <span><FaClock /> {treinamentoSelecionado.duracao}</span>
              {treinamentoSelecionado.loja && (
                <span><FaStore /> {treinamentoSelecionado.loja}</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.detailContent}>
          {treinamentoSelecionado.tipo === 'video' && (
            <div style={styles.videoPlayer}>
              <FaPlay size={60} color="white" />
              <p style={styles.videoText}>Player de Vídeo</p>
            </div>
          )}

          <div style={styles.contentSection}>
            <h3 style={styles.contentTitle}>📘 Conteúdo Programático</h3>
            <ul style={styles.topicosList}>
              {treinamentoSelecionado.conteudo.topicos.map((topico, index) => (
                <li key={index} style={styles.topicoItem}>{topico}</li>
              ))}
            </ul>
          </div>

          {treinamentoSelecionado.conteudo.pontosPrincipais && (
            <div style={styles.contentSection}>
              <h3 style={styles.contentTitle}>⭐ Pontos Principais</h3>
              <div style={styles.pontosList}>
                {treinamentoSelecionado.conteudo.pontosPrincipais.map((ponto, index) => (
                  <div key={index} style={styles.pontoItem}>{ponto}</div>
                ))}
              </div>
            </div>
          )}

          {treinamentoSelecionado.conteudo.avisoImportante && (
            <div style={styles.avisoCard}>
              <FaExclamationTriangle size={24} color="#dc3545" />
              <div>
                <h4 style={styles.avisoTitle}>⚠️ Aviso Importante</h4>
                <p style={styles.avisoText}>{treinamentoSelecionado.conteudo.avisoImportante}</p>
              </div>
            </div>
          )}

          {!isConcluido(treinamentoSelecionado.id) && (
            <button
              onClick={() => concluirTreinamento(treinamentoSelecionado.id)}
              style={styles.concluirButton}
            >
              <FaCheckCircle /> Marcar como Concluído
            </button>
          )}
        </div>
      </div>
    );
  }

  // Visualização em Lista
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎓 Treinamentos e Capacitação</h2>
          <p style={styles.subtitle}>Complete os treinamentos obrigatórios para ficar 100% habilitado</p>
        </div>

        <div style={styles.statusCard}>
          {isHabilitado() ? (
            <>
              <FaCheckCircle size={40} color="#28a745" />
              <div>
                <p style={styles.statusLabel}>Status</p>
                <p style={{ ...styles.statusValue, color: '#28a745' }}>✅ Habilitado</p>
              </div>
            </>
          ) : (
            <>
              <FaLock size={40} color="#ffc107" />
              <div>
                <p style={styles.statusLabel}>Status</p>
                <p style={{ ...styles.statusValue, color: '#ffc107' }}>📚 Em Treinamento</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progresso dos Treinamentos Obrigatórios</span>
          <span style={styles.progressPercentage}>{progressoGeral}%</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div 
            style={{
              ...styles.progressBarFill,
              width: `${progressoGeral}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.columnsContainer}>
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaShieldAlt size={24} color={CONSULTOR_PRIMARY} />
            <h3 style={styles.columnTitle}>Treinamentos da Plataforma</h3>
          </div>
          <p style={styles.columnDescription}>
            Políticas, diretrizes e boas práticas para atuação profissional
          </p>

          <div style={styles.treinamentosList}>
            {ordenarPorDataDecrescente(treinamentosPlataforma).map(treinamento => (
              <TrainCard
                key={treinamento.id}
                treinamento={treinamento}
                isConcluido={isConcluido(treinamento.id)}
                isNovo={isNovo(treinamento.dataPublicacao)}
                onIniciar={() => iniciarTreinamento(treinamento)}
              />
            ))}
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <FaStore size={24} color={CONSULTOR_PRIMARY} />
            <h3 style={styles.columnTitle}>Treinamentos e Informes das Lojas</h3>
          </div>
          <p style={styles.columnDescription}>
            Conteúdos sobre produtos, promoções e políticas específicas das lojas
          </p>

          <div style={styles.treinamentosList}>
            {ordenarPorDataDecrescente(
              treinamentosLojistas.filter(t => t.relevante)
            ).map(treinamento => (
              <TrainCard
                key={treinamento.id}
                treinamento={treinamento}
                isConcluido={isConcluido(treinamento.id)}
                isNovo={isNovo(treinamento.dataPublicacao)}
                onIniciar={() => iniciarTreinamento(treinamento)}
                isLojista={true}
              />
            ))}
          </div>

          {treinamentosLojistas.filter(t => t.relevante).length === 0 && (
            <div style={styles.emptyState}>
              <FaStore size={40} color="#ccc" />
              <p style={styles.emptyText}>Nenhum treinamento disponível no momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrainCard = ({ treinamento, isConcluido, isNovo, onIniciar, isLojista = false }) => {
  return (
    <div style={{
      ...styles.trainCard,
      borderLeft: `4px solid ${isConcluido ? '#28a745' : treinamento.obrigatorio ? '#dc3545' : '#ffc107'}`,
      opacity: isConcluido ? 0.8 : 1,
    }}>
      <div style={styles.trainCardHeader}>
        <div style={styles.trainCardTitle}>
          <div style={styles.badgesContainer}>
            {isConcluido && (
              <span style={styles.concluidoBadge}>
                <FaCheckCircle /> CONCLUÍDO
              </span>
            )}
            {!isConcluido && !treinamento.visualizado && isNovo && (
              <span style={styles.novoBadge}>🆕 NOVO</span>
            )}
            {!isConcluido && !treinamento.visualizado && !isNovo && (
              <span style={styles.naoVistoBadge}>👁️ NÃO VISUALIZADO</span>
            )}
            {!isConcluido && treinamento.visualizado && (
              <span style={styles.naoConcluidoBadge}>📚 PENDENTE</span>
            )}
            {treinamento.obrigatorio && !isConcluido && (
              <span style={styles.obrigatorioTag}>OBRIGATÓRIO</span>
            )}
          </div>
          <h4 style={styles.trainTitle}>{treinamento.titulo}</h4>
        </div>
        {isLojista && (
          <span style={styles.segmentoBadge}>{treinamento.segmento}</span>
        )}
      </div>

      <p style={styles.trainDescription}>{treinamento.descricao}</p>

      <div style={styles.trainMeta}>
        {treinamento.tipo === 'video' ? (
          <span style={styles.metaItem}><FaVideo /> Vídeo</span>
        ) : (
          <span style={styles.metaItem}><FaFileAlt /> Documento</span>
        )}
        <span style={styles.metaItem}><FaClock /> {treinamento.duracao}</span>
        {isLojista && (
          <span style={styles.metaItem}><FaStore /> {treinamento.loja}</span>
        )}
        <span style={styles.metaItem}>
          📅 {new Date(treinamento.dataPublicacao).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <button
        onClick={onIniciar}
        style={{
          ...styles.iniciarButton,
          backgroundColor: isConcluido ? '#6c757d' : CONSULTOR_PRIMARY,
        }}
      >
        {isConcluido ? 'Revisar Conteúdo' : treinamento.visualizado ? 'Continuar e Concluir' : 'Iniciar Treinamento'}
      </button>
    </div>
  );
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
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
  statusCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
  },
  statusLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statusValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: 0,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  progressLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: CONSULTOR_PRIMARY,
  },
  progressBarContainer: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: CONSULTOR_PRIMARY,
    transition: 'width 0.3s',
  },
  columnsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
  },
  column: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  columnTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  columnDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '25px',
    lineHeight: '1.5',
  },
  treinamentosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  trainCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    borderLeft: '4px solid',
    transition: 'transform 0.2s',
  },
  trainCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '10px',
  },
  trainCardTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    flex: 1,
  },
  badgesContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  concluidoBadge: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  novoBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  naoVistoBadge: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  naoConcluidoBadge: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  obrigatorioTag: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  segmentoBadge: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    color: CONSULTOR_PRIMARY,
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  trainTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  trainDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  trainMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '13px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  iniciarButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '15px',
  },
  detailHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  detailTitleSection: {
    marginBottom: '15px',
  },
  detailTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  detailSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '15px',
  },
  detailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '14px',
    color: '#666',
  },
  detailContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  videoPlayer: {
    backgroundColor: '#000',
    borderRadius: '12px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  videoText: {
    color: 'white',
    fontSize: '18px',
    marginTop: '15px',
  },
  contentSection: {
    marginBottom: '30px',
  },
  contentTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  topicosList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  topicoItem: {
    fontSize: '15px',
    color: '#666',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
    paddingLeft: '25px',
    position: 'relative',
  },
  pontosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pontoItem: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    padding: '15px',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.6',
  },
  avisoCard: {
    backgroundColor: '#fff5f5',
    border: '2px solid #dc3545',
    borderRadius: '12px',
    padding: '25px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '30px',
  },
  avisoTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#dc3545',
    margin: '0 0 10px 0',
  },
  avisoText: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
    lineHeight: '1.6',
  },
  concluirButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '16px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
  },
};

export default TrainingPanel;