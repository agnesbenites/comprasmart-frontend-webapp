import React, { useState, useEffect } from 'react';

// =================================================================================
// UTILS
// =================================================================================

// Função para calcular o tempo de atividade formatado (dias/meses)
const calculateTimeActive = (dataCadastro) => {
    const start = new Date(dataCadastro);
    const now = new Date();
    // Usa getTime() para garantir a comparação de milissegundos
    const diffTime = Math.abs(now.getTime() - start.getTime()); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays < 30) {
        return `${diffDays} dias`;
    } else {
        const months = Math.floor(diffDays / 30);
        return `${months} meses`;
    }
};

// =================================================================================
// DADOS MOCKADOS (Simulando registros reais do Supabase)
// O ID é o UUID real do usuário consultor no Supabase.
// =================================================================================

const generateConsultor = (id, status, vendas, atendimentos, dataAprovacaoLojista = null) => ({
  id: id, // UUID real do usuário no Supabase
  nome: `Consultor ${id.slice(0, 4)}`, // Nome real (mantido internamente, mas oculto na interface)
  email: `consultor-${id.slice(0, 4)}@plataforma.com`, // E-mail (mantido internamente, mas oculto na interface)
  telefone: '(XX) XXXXX-XXXX', // Telefone (mantido internamente, mas oculto na interface)
  // Dados visíveis para o lojista
  nomeVisivel: 'Consultor #' + id.slice(0, 8).toUpperCase(), // Pseudônimo para exibição (parte do UUID)
  segmento: id.includes('1') ? 'Eletrônicos' : id.includes('2') ? 'Móveis' : id.includes('3') ? 'Eletrodomésticos' : 'Tecnologia',
  experiencia: id.includes('1') ? '3 anos' : id.includes('2') ? '5 anos' : id.includes('3') ? '2 anos' : '4 anos',
  status: status,
  dataCadastro: id.includes('3') ? '2024-03-05' : '2024-01-15', // Data de cadastro na plataforma
  dataAprovacaoLojista: dataAprovacaoLojista, // Data de aprovação do lojista
  mediaVendas: vendas,
  mediaAtendimentosDiarios: atendimentos,
  totalVendas: vendas * 4,
  avaliacao: id.includes('3') ? 0 : 4.8,
  especialidades: ['Smartphones', 'Tablets', 'Notebooks']
});

const consultoresMock = [
  generateConsultor('uuid-001-abc', 'ativo', 12500, 8, '2024-04-01'), // Aprovado há mais de 60 dias
  generateConsultor('uuid-002-def', 'ativo', 8900, 6, '2024-02-10'), // Aprovado há mais de 60 dias
  generateConsultor('uuid-003-ghi', 'pendente', 0, 0, null), // Pendente (sem data de aprovação)
  generateConsultor('uuid-004-jkl', 'inativo', 15200, 10, '2023-10-20'),
  generateConsultor('uuid-200-xyz', 'ativo', 5000, 4, '2024-11-20'), // Aprovado recentemente para teste de 60 dias
];


// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================

const LojistaConsultorConfig = () => {
  // Simulação de dados do usuário autenticado (Auth0/Supabase Auth)
  const userId = 'lojista-123'; // ID do lojista logado
  const userRole = 'lojista'; // Papel do usuário logado (usado para autorização de exibição)

  const [consultores, setConsultores] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [loading, setLoading] = useState(true);

  // Simulação de carregamento de dados da API do Supabase
  useEffect(() => {
    // Aqui ocorreria a chamada: const { data } = await supabase.from('consultores').select('*').eq('lojista_id', userId);
    if (userRole === 'lojista') {
      setTimeout(() => {
        setConsultores(consultoresMock);
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);

  if (userRole !== 'lojista') {
    return <div style={{padding: '50px', textAlign: 'center', fontSize: '1.2rem', color: '#dc3545', backgroundColor: '#f8d9da', borderRadius: '8px', margin: '20px'}}>
      ❌ Acesso Negado. Você não tem permissão de Lojista para visualizar esta página.
    </div>;
  }

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center', fontSize: '1.2rem', color: '#007bff'}}>
      Carregando dados dos consultores... ⏳
    </div>;
  }

  // ---------------------------------------------------------------------------------
  // Lógica de Filtro
  // ---------------------------------------------------------------------------------
  const consultoresFiltrados = consultores.filter(consultor => {
    const matchStatus = filtroStatus === 'todos' || consultor.status === filtroStatus;
    // A busca agora é feita apenas por dados visíveis ao lojista (ID, Segmento)
    const matchBusca = 
      consultor.id.toLowerCase().includes(busca.toLowerCase()) ||
      consultor.segmento.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  // Estatísticas (comissão total removida)
  const estatisticas = {
    total: consultores.length,
    ativos: consultores.filter(c => c.status === 'ativo').length,
    pendentes: consultores.filter(c => c.status === 'pendente').length,
    inativos: consultores.filter(c => c.status === 'inativo').length,
    vendasTotais: consultores.reduce((total, c) => total + c.totalVendas, 0),
  };

  // ---------------------------------------------------------------------------------
  // Ações (Com Modais)
  // ---------------------------------------------------------------------------------
    const showModal = (type, consultor) => {
        setModalOpen(true);

        if (type === 'details') {
            setModalContent({
                title: `Detalhes do Consultor`,
                subtitle: consultor.nomeVisivel,
                message: null,
                details: {
                    id: consultor.id,
                    ativoNaPlataforma: calculateTimeActive(consultor.dataCadastro),
                    mediaAtendimentos: consultor.mediaAtendimentosDiarios,
                    segmento: consultor.segmento,
                    especialidades: consultor.especialidades.join(', '),
                    avaliacao: consultor.avaliacao > 0 ? consultor.avaliacao.toFixed(1) : 'Sem avaliação',
                    status: consultor.status,
                    dataAprovacaoLojista: consultor.dataAprovacaoLojista ? new Date(consultor.dataAprovacaoLojista).toLocaleDateString('pt-BR') : 'Ainda não aprovado'
                },
                confirmAction: () => setModalOpen(false),
                confirmText: 'Fechar',
                isConfirm: false,
            });
        }
        else if (type === 'approve') {
            setModalContent({
                title: 'Confirmar Aprovação',
                subtitle: consultor.nomeVisivel,
                message: `Você está prestes a aprovar o consultor ${consultor.nomeVisivel} para trabalhar em sua loja.
                
                ATENÇÃO: Após a aprovação, você deve aguardar 60 dias antes de poder desativá-lo novamente.`,
                confirmAction: () => handleAprovarConsultor(consultor.id),
                confirmText: 'Aprovar Consultor',
                cancelText: 'Cancelar',
                isConfirm: true,
            });
        } else if (type === 'reject') {
            setModalContent({
                title: 'Confirmar Rejeição',
                subtitle: consultor.nomeVisivel,
                message: `Você tem certeza que deseja rejeitar o convite do consultor ${consultor.nomeVisivel}? Ele será movido para o status Inativo para sua loja.`,
                confirmAction: () => handleRejeitarConsultor(consultor.id),
                confirmText: 'Rejeitar Convite',
                cancelText: 'Cancelar',
                isConfirm: true,
            });
        } else if (type === 'toggle') {
            const daysSinceApproval = consultor.dataAprovacaoLojista 
                ? Math.ceil((new Date().getTime() - new Date(consultor.dataAprovacaoLojista).getTime()) / (1000 * 60 * 60 * 24)) 
                : 90; 
            
            const isTryingToDesactivate = consultor.status === 'ativo';
            const canDesactivate = isTryingToDesactivate ? (daysSinceApproval >= 60) : true;
            
            let message = '';
            let confirmText = isTryingToDesactivate ? 'Desativar' : 'Ativar';
            let cancelText = isTryingToDesactivate ? 'Cancelar' : null;

            if (isTryingToDesactivate) {
                 if (!canDesactivate) {
                     const unlockDate = new Date(new Date(consultor.dataAprovacaoLojista).getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
                     message = `AVISO: O consultor ${consultor.nomeVisivel} foi aprovado há apenas ${daysSinceApproval} dias (em ${new Date(consultor.dataAprovacaoLojista).toLocaleDateString('pt-BR')}). Você deve aguardar 60 dias completos após a aprovação para poder desativá-lo. Você só poderá desativar este consultor a partir de ${unlockDate}.`;
                     confirmText = 'Entendi';
                     cancelText = null;
                 } else {
                     message = `Você tem certeza que deseja desativar o consultor ${consultor.nomeVisivel}?`;
                 }
            } else {
                message = `Você tem certeza que deseja reativar o consultor ${consultor.nomeVisivel}?`;
            }

            setModalContent({
                title: isTryingToDesactivate ? 'Desativar Consultor' : 'Reativar Consultor',
                subtitle: consultor.nomeVisivel,
                message: message,
                confirmAction: canDesactivate ? () => handleToggleStatus(consultor.id) : null,
                confirmText: confirmText,
                cancelText: cancelText,
                isConfirm: canDesactivate,
            });
        }
    };

    const handleAprovarConsultor = (id) => {
        // Simula a chamada de API: await supabase.from('consultores').update({status: 'ativo', data_aprovacao: new Date()}).eq('id', id);
        setConsultores(prev => 
          prev.map(c => c.id === id ? { 
                ...c, 
                status: 'ativo', 
                dataAprovacaoLojista: new Date().toISOString().split('T')[0] // Registra a data de aprovação atual
            } : c)
        );
        setModalOpen(false);
    };

    const handleRejeitarConsultor = (id) => {
        // Simula a chamada de API: await supabase.from('consultores').update({status: 'inativo'}).eq('id', id);
        setConsultores(prev => 
          prev.map(c => c.id === id ? { ...c, status: 'inativo' } : c)
        );
        setModalOpen(false);
    };
    
    const handleToggleStatus = (id) => {
        // Simula a chamada de API
        setConsultores(prev => 
          prev.map(c => 
            c.id === id ? { ...c, status: c.status === 'ativo' ? 'inativo' : 'ativo' } : c
          )
        );
        setModalOpen(false);
    };

  // ---------------------------------------------------------------------------------
  // Renderização de Componentes
  // ---------------------------------------------------------------------------------

  const getStatusBadge = (status) => {
    const styles = {
      ativo: { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' },
      pendente: { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7' },
      inativo: { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' }
    };

    const textos = {
      ativo: 'Ativo',
      pendente: 'Pendente',
      inativo: 'Inativo'
    };

    return (
      <span style={{
        ...styles[status],
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        border: '1px solid'
      }}>
        {textos[status]}
      </span>
    );
  };

  const getAvaliacaoStars = (avaliacao) => {
    if (avaliacao === 0) return 'Sem avaliação';
    
    return (
      <span style={{ color: '#ffc107' }}>
        {'⭐'.repeat(Math.floor(avaliacao))}
        {avaliacao % 1 >= 0.5 && '⭐'}
        <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '5px' }}>
          ({avaliacao.toFixed(1)})
        </span>
        </span>
    );
  };

  // Componente Modal para detalhes e confirmações
  const ModalComponent = ({ content, onClose }) => {
    if (!modalOpen) return null;

    const isError = content.confirmAction === null && content.isConfirm;
    // Verifica se é uma ação de sucesso/confirmação (aprovar/rejeitar/ativar/desativar)
    const isSuccess = content.confirmAction !== null && content.isConfirm && content.confirmText !== 'Entendi'; 
    // É apenas uma visualização de detalhes
    const isDetailView = !content.isConfirm && content.details; 

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
                <h3 style={{...modalStyles.title, color: isError ? '#dc3545' : isSuccess ? '#28a745' : isDetailView ? '#2c5aa0' : '#17a2b8'}}>
                    {content.title}
                </h3>
                {content.subtitle && <p style={modalStyles.subtitle}>{content.subtitle}</p>}

                {content.message && <p style={modalStyles.message}>{content.message}</p>}
                
                {content.details && (
                    <div style={modalStyles.detailsGrid}>
                        <div style={modalStyles.detailItem}>
                            <strong>ID (Supabase):</strong> <span>{content.details.id}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Segmento:</strong> <span>{content.details.segmento}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Status p/ Loja:</strong> <span>{content.details.status}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Avaliação:</strong> <span>{content.details.avaliacao}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Ativo na Plataforma:</strong> <span>{content.details.ativoNaPlataforma}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Média Atendimentos/dia:</strong> <span>{content.details.mediaAtendimentos}</span>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <strong>Especialidades:</strong> <span>{content.details.especialidades}</span>
                        </div>
                        {/* CAMPO DATA DE ACEITE */}
                        <div style={modalStyles.detailItem}>
                            <strong>Data de Aceite (Loja):</strong> <span>{content.details.dataAprovacaoLojista}</span>
                        </div>
                    </div>
                )}

                <div style={modalStyles.actions}>
                    {content.cancelText && (
                        <button onClick={onClose} style={{...modalStyles.button, backgroundColor: '#6c757d'}}>
                            {content.cancelText}
                        </button>
                    )}
                    {content.confirmText && (
                        <button 
                            onClick={content.confirmAction || onClose} 
                            style={{
                                ...modalStyles.button, 
                                // Cores para Aprovar, Rejeitar, Ativar/Desativar ou Apenas Entendi/Fechar
                                backgroundColor: content.confirmText.includes('Aprovar') ? '#28a745' :
                                                 content.confirmText.includes('Rejeitar') ? '#dc3545' :
                                                 content.confirmText.includes('Desativar') ? '#dc3545' :
                                                 content.confirmText.includes('Ativar') ? '#28a745' :
                                                 '#007bff', // Cor padrão para Entendi/Fechar
                                opacity: content.confirmAction || content.confirmText === 'Entendi' || content.confirmText === 'Fechar' ? 1 : 0.6
                            }}
                            disabled={content.confirmAction === null && isError}
                        >
                            {content.confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
  };
  
  return (
    <div style={styles.container}>
        <ModalComponent content={modalContent} onClose={() => setModalOpen(false)} />

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Gestão de Consultores</h1>
          <p style={styles.subtitle}>
            Gerencie consultores externos que trabalham para sua loja
          </p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{estatisticas.total}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{estatisticas.ativos}</span>
            <span style={styles.statLabel}>Ativos</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{estatisticas.pendentes}</span>
            <span style={styles.statLabel}>Pendentes</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>R$ {estatisticas.vendasTotais.toLocaleString('pt-BR')}</span>
            <span style={styles.statLabel}>Vendas Totais</span>
          </div>
        </div>
        </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Buscar por ID ou Segmento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={styles.filterSelect}
        >
          {/* Ícones removidos do filtro */}
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="pendente">Pendentes</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* Lista de Consultores */}
      <div style={styles.listaContainer}>
        <h2 style={styles.listaTitle}>
          Consultores ({consultoresFiltrados.length})
          </h2>

        {consultoresFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>Nenhum consultor encontrado</h3>
            <p style={styles.emptyText}>
              {busca || filtroStatus !== 'todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Nenhum consultor cadastrado ainda'
              }
            </p>
          </div>
        ) : (
          <div style={styles.consultoresGrid}>
            {consultoresFiltrados.map(consultor => (
              <div key={consultor.id} style={styles.consultorCard}>
                <div style={styles.consultorHeader}>
                  <div style={styles.consultorAvatar}>
                    <img
                      src={`https://placehold.co/60x60/17a2b8/fff?text=${consultor.id.slice(0, 4)}`}
                      alt={consultor.id}
                      style={styles.avatarImage}
                    />
                  </div>
                  <div style={styles.consultorInfo}>
                    {/* NOME EXIBIDO É O PSEUDÔNIMO APENAS */}
                    <h3 style={styles.consultorNome}>{consultor.nomeVisivel}</h3>
                    <p style={styles.consultorId}>ID: {consultor.id}</p>
                  </div>
                  <div style={styles.consultorBadges}>
                    {getStatusBadge(consultor.status)}
                    {consultor.avaliacao > 0 && getAvaliacaoStars(consultor.avaliacao)}
                  </div>
                </div>

                <div style={styles.consultorDetalhes}>
                  <div style={styles.detalheItem}>
                    <strong>Segmento:</strong> {consultor.segmento}
                  </div>
                  <div style={styles.detalheItem}>
                    <strong>Experiência:</strong> {consultor.experiencia}
                  </div>
                  <div style={styles.detalheItem}>
                    <strong>Especialidades:</strong> {consultor.especialidades.join(', ')}
                  </div>
                  <div style={styles.detalheItem}>
                    <strong>Cadastro:</strong> {new Date(consultor.dataCadastro).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Métricas de Performance */}
                {(consultor.mediaVendas > 0 || consultor.mediaAtendimentosDiarios > 0) && (
                  <div style={styles.performanceSection}>
                    <h4 style={styles.performanceTitle}>📊 Performance (Média)</h4>
                    <div style={styles.metricsGrid}>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>Média de Vendas:</span>
                        <span style={styles.metricValue}>
                          R$ {consultor.mediaVendas.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>Atendimentos/dia:</span>
                        <span style={styles.metricValue}>
                          {consultor.mediaAtendimentosDiarios}
                        </span>
                      </div>
                      <div style={styles.metricItem}>
                        <span style={styles.metricLabel}>Total Vendas:</span>
                        <span style={styles.metricValue}>
                          {consultor.totalVendas}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div style={styles.consultorActions}>
                  {consultor.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => showModal('approve', consultor)}
                        style={styles.aprovarButton}
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => showModal('reject', consultor)}
                        style={styles.rejeitarButton}
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                  
                  {consultor.status !== 'pendente' && (
                    <button
                      onClick={() => showModal('toggle', consultor)}
                      style={consultor.status === 'ativo' ? styles.desativarButton : styles.ativarButton}
                    >
                      {consultor.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => showModal('details', consultor)}
                    style={styles.detalhesButton}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
    </div>
  );
};

// Estilos do Modal (janela suspensa)
const modalStyles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '5px',
        fontWeight: '700',
        lineHeight: '1.2'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '15px',
    },
    message: {
        fontSize: '1rem',
        color: '#333',
        marginBottom: '25px',
        whiteSpace: 'pre-line', // Preserva quebras de linha
        textAlign: 'left'
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        textAlign: 'left',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '25px',
    },
    detailItem: {
        fontSize: '0.95rem',
        color: '#555',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    }
};


// Estilos do Card (mantidos os estilos originais)
const baseButton = { // Definição de baseButton como uma variável separada
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #e0e0e0',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#f0f0f0',
    }
};

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '2.2rem',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  stats: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '120px',
  },
  statNumber: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  filterSelect: {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    minWidth: '200px',
  },
  listaContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  listaTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '25px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  emptyText: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '30px',
  },
  consultoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  consultorCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s ease',
  },
  consultorHeader: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  consultorAvatar: {
    flexShrink: 0,
  },
  avatarImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid #e0e0e0',
  },
  consultorInfo: {
    flex: 1,
  },
  consultorNome: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '0 0 5px 0',
    fontWeight: '600',
  },
  consultorId: {
    color: '#17a2b8',
    fontSize: '0.85rem',
    margin: 0,
    fontWeight: '500',
  },
  consultorBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'flex-end',
  },
  consultorDetalhes: {
    marginBottom: '20px',
  },
  detalheItem: {
    margin: '5px 0',
    fontSize: '0.9rem',
    color: '#555',
  },
  performanceSection: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e9ecef',
  },
  performanceTitle: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '10px',
    fontWeight: '600',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  metricItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  metricLabel: {
    color: '#666',
  },
  metricValue: {
    fontWeight: '600',
    color: '#333',
  },
  consultorActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
    // Botão Aprovar (baseado no baseButton, mas com destaque verde)
  aprovarButton: {
    ...baseButton,
    color: '#28a745',
    borderColor: '#28a745',
    ':hover': {
        backgroundColor: '#e6f5e6',
    }
  },
    // Botão Rejeitar/Desativar (baseado no baseButton, mas com destaque vermelho)
  rejeitarButton: {
    ...baseButton,
    color: '#dc3545',
    borderColor: '#dc3545',
    ':hover': {
        backgroundColor: '#fbebeb',
    }
  },
  ativarButton: {
    ...baseButton,
    color: '#28a745',
    borderColor: '#28a745',
    ':hover': {
        backgroundColor: '#e6f5e6',
    }
  },
  desativarButton: {
    ...baseButton,
    color: '#dc3545',
    borderColor: '#dc3545',
    ':hover': {
        backgroundColor: '#fbebeb',
    }
  },
    // Botão Detalhes (baseado no baseButton, com destaque azul)
  detalhesButton: {
    ...baseButton,
    color: '#17a2b8',
    borderColor: '#17a2b8',
    ':hover': {
        backgroundColor: '#e6f7f9',
    }
  },
};

export default LojistaConsultorConfig;