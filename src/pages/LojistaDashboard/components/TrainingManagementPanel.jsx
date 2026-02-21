// app-frontend/src/pages/LojistaDashboard/components/TrainingManagementPanel.jsx
// Painel de Gerenciamento de Treinamentos para Lojistas - COM ARENA DE VENDAS

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaUsers, FaClock, FaTrophy, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa';

const LOJISTA_PRIMARY = "#bb25a6";

const TrainingManagementPanel = () => {
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showArenaInfo, setShowArenaInfo] = useState(false);
  const [editingTreinamento, setEditingTreinamento] = useState(null);
  const [arenaConfig, setArenaConfig] = useState(null);
  const [loadingArena, setLoadingArena] = useState(true);
  
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    consultoresInscritos: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    segmento: '', // NOVO: Segmento do produto
    categoria: 'produto', // FIXO: Sempre produto
    nivel: 'basico',
    duracao_estimada: 30,
    obrigatorio: false,
    ativo: true,
    conteudo: {
      modulos: []
    }
  });

  const [segmentos, setSegmentos] = useState([]);

  const lojistaId = localStorage.getItem('lojistaId') || '1'; // ID do lojista logado

  useEffect(() => {
    carregarTreinamentos();
    carregarEstatisticas();
    carregarSegmentos();
    carregarArenaConfig(); // NOVO: Carregar configuração da Arena
  }, []);

  // ======= CARREGAR DADOS =======
  const carregarTreinamentos = async () => {
    try {
      const response = await fetch(`/api/lojistas/${lojistaId}/treinamentos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar treinamentos');

      const data = await response.json();
      setTreinamentos(data.treinamentos || []);
      
    } catch (error) {
      console.error('Erro:', error);
      // Mock data para desenvolvimento
      setTreinamentos(mockTreinamentos);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Carregar configuração da Arena
  const carregarArenaConfig = async () => {
    try {
      const response = await fetch(`/api/arena/config/${lojistaId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar configuração da Arena');

      const data = await response.json();
      setArenaConfig(data.config || null);
      
    } catch (error) {
      console.error('Erro:', error);
      // Mock data para desenvolvimento
      setArenaConfig({
        id: 'arena-123',
        loja_id: lojistaId,
        ativo: false,
        tier: null,
        acesso_consultores: false,
        stripe_subscription_id: null,
        semana_referencia: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoadingArena(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch(`/api/lojistas/${lojistaId}/treinamentos/estatisticas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar estatisticas');

      const data = await response.json();
      setStats(data.stats);
      
    } catch (error) {
      console.error('Erro:', error);
      setStats({
        total: mockTreinamentos.length,
        ativos: mockTreinamentos.filter(t => t.ativo).length,
        consultoresInscritos: 45,
      });
    }
  };

  const carregarSegmentos = async () => {
    try {
      const response = await fetch(`/api/lojistas/${lojistaId}/segmentos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar segmentos');

      const data = await response.json();
      setSegmentos(data.segmentos || []);
      
    } catch (error) {
      console.error('Erro:', error);
      // Mock data de segmentos
      setSegmentos(mockSegmentos);
    }
  };

  // ======= MANIPULAR ARENA =======
  const habilitarArena = async (tier) => {
    try {
      const response = await fetch('/api/arena/habilitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          loja_id: lojistaId,
          tier: tier
        })
      });

      if (!response.ok) throw new Error('Erro ao habilitar Arena');

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirecionar para checkout do Stripe
        window.location.href = data.checkoutUrl;
      } else {
        alert(' Arena habilitada com sucesso!');
        carregarArenaConfig();
      }
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao habilitar Arena');
    }
  };

  const desativarArena = async () => {
    if (!confirm('Tem certeza que deseja desativar a Arena de Vendas?')) return;

    try {
      const response = await fetch(`/api/arena/desativar/${lojistaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao desativar Arena');

      alert(' Arena desativada com sucesso!');
      carregarArenaConfig();
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao desativar Arena');
    }
  };

  const irParaArena = () => {
    window.location.href = `/lojista/dashboard/arena`;
  };

  // ======= HANDLERS =======
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      lojista_id: lojistaId,
    };

    try {
      const url = editingTreinamento
        ? `/api/treinamentos/${editingTreinamento.id}`
        : '/api/treinamentos';

      const response = await fetch(url, {
        method: editingTreinamento ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao salvar treinamento');

      alert(editingTreinamento ? ' Treinamento atualizado!' : ' Treinamento criado!');
      
      setShowModal(false);
      resetForm();
      carregarTreinamentos();
      carregarEstatisticas();
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao salvar treinamento');
    }
  };

  const handleEdit = (treinamento) => {
    setEditingTreinamento(treinamento);
    setFormData({
      titulo: treinamento.titulo,
      descricao: treinamento.descricao,
      segmento: treinamento.segmento || '',
      categoria: 'produto', // Sempre produto
      nivel: treinamento.nivel,
      duracao_estimada: treinamento.duracao_estimada,
      obrigatorio: treinamento.obrigatorio,
      ativo: treinamento.ativo,
      conteudo: treinamento.conteudo || { modulos: [] }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este treinamento?')) return;

    try {
      const response = await fetch(`/api/treinamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao excluir');

      alert(' Treinamento excluído!');
      carregarTreinamentos();
      carregarEstatisticas();
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao excluir treinamento');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/treinamentos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ativo: !currentStatus })
      });

      if (!response.ok) throw new Error('Erro ao alterar status');

      alert(` Treinamento ${!currentStatus ? 'ativado' : 'desativado'}!`);
      carregarTreinamentos();
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao alterar status');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      segmento: '',
      categoria: 'produto', // Sempre produto
      nivel: 'basico',
      duracao_estimada: 30,
      obrigatorio: false,
      ativo: true,
      conteudo: { modulos: [] }
    });
    setEditingTreinamento(null);
  };

  const handleAddModulo = () => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        modulos: [
          ...prev.conteudo.modulos,
          { titulo: '', descricao: '', video_url: '', duracao: 10 }
        ]
      }
    }));
  };

  const handleModuloChange = (index, field, value) => {
    setFormData(prev => {
      const modulos = [...prev.conteudo.modulos];
      modulos[index][field] = value;
      return {
        ...prev,
        conteudo: { ...prev.conteudo, modulos }
      };
    });
  };

  const handleRemoveModulo = (index) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        modulos: prev.conteudo.modulos.filter((_, i) => i !== index)
      }
    }));
  };

  if (loading || loadingArena) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  const arenaAtiva = arenaConfig?.ativo;
  const tierAtual = arenaConfig?.tier;
  const podeAcessarArena = arenaAtiva;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}> Gerenciar Treinamentos</h2>
          <p style={styles.subtitle}>Crie e gerencie treinamentos para seus consultores</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.addButton}>
          <FaPlus /> Novo Treinamento
        </button>
      </div>

      {/* SEÇÃO DA ARENA DE VENDAS */}
      <div style={styles.arenaSection}>
        <div style={styles.arenaHeader}>
          <FaTrophy style={styles.arenaIcon} />
          <div>
            <h3 style={styles.arenaTitle}> Arena de Vendas</h3>
            <p style={styles.arenaDescription}>
              Sistema gamificado para competição saudável entre seus consultores
            </p>
            <button onClick={() => setShowArenaInfo(true)} style={{
              marginTop: 8, background: 'transparent', color: '#bb25a6',
              border: '2px solid #bb25a6', padding: '6px 20px', borderRadius: 50,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
            }}>
              Saiba Mais sobre a Arena →
            </button>
          </div>
        </div>

        {/* MODAL SAIBA MAIS - ARENA DE VENDAS */}
        {showArenaInfo && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }} onClick={() => setShowArenaInfo(false)}>
            <div style={{
              background: '#fff', borderRadius: 24, padding: '40px 36px',
              maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto',
              position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowArenaInfo(false)} style={{
                position: 'absolute', top: 16, right: 16, background: 'none',
                border: 'none', color: '#999', cursor: 'pointer', padding: 8,
              }}>
                <FaTimes size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontSize: 48 }}></span>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2f0d51', marginTop: 12 }}>
                  Kaslee Arena de Vendas
                </h2>
                <p style={{ fontSize: 15, color: '#777', marginTop: 8 }}>
                  O sistema de gamificação que transforma treinamento em resultados
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                {[
                  { emoji: '', title: 'Simulação com Personas', desc: 'Pratique com personas de clientes reais em diferentes níveis de dificuldade. Cada interação simula cenários do dia a dia de vendas.' },
                  { emoji: '', title: 'Sistema de Pontos', desc: 'Ganhe pontos por cada venda simulada, atendimento correto e desafio completado. Quanto mais difícil a persona, mais pontos.' },
                  { emoji: '', title: 'Ranking Semanal', desc: 'Os melhores consultores ganham destaque e são priorizados nas oportunidades de venda.' },
                  { emoji: '', title: 'Níveis e Badges', desc: 'Evolua de Iniciante até Mestre de Vendas. Cada nível desbloqueia badges exclusivas no perfil.' },
                  { emoji: '', title: 'Desafios Semanais', desc: 'Missões especiais com recompensas. Complete objetivos como "Venda 5 produtos técnicos".' },
                  { emoji: '', title: 'Feedback com IA', desc: 'A IA analisa sua abordagem, identifica pontos fortes e sugere melhorias personalizadas.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#f9f7fb', borderRadius: 16, padding: '20px 16px', textAlign: 'center',
                  }}>
                    <span style={{ fontSize: 28 }}>{item.emoji}</span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#2f0d51', margin: '8px 0 6px' }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
                  A Arena de Vendas está disponível em todos os planos. Consultores treinam e melhoram suas habilidades continuamente.
                </p>
                <button onClick={() => setShowArenaInfo(false)} style={{
                  background: '#bb25a6', color: '#fff', border: 'none',
                  padding: '14px 36px', borderRadius: 50, fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(187,37,166,0.3)',
                }}>
                  Entendi, Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.arenaContent}>
          {arenaAtiva ? (
            <div style={styles.arenaActive}>
              <div style={styles.arenaStatus}>
                <span style={styles.arenaBadgeActive}> ATIVA</span>
                <span style={styles.arenaTier}>Plano: {tierAtual?.toUpperCase() || 'BÁSICO'}</span>
              </div>
              <div style={styles.arenaBenefits}>
                <h4 style={styles.arenaBenefitsTitle}>Benefícios ativos:</h4>
                <ul style={styles.arenaBenefitsList}>
                  <li> Ranking em tempo real de consultores</li>
                  <li> Dashboard de desempenho detalhado</li>
                  <li> Metas e desafios semanais</li>
                  <li> Sistema de recompensas e premiações</li>
                  {arenaConfig?.acesso_consultores && <li> Acesso dos consultores ao ranking</li>}
                </ul>
              </div>
              <div style={styles.arenaActions}>
                <button onClick={irParaArena} style={styles.arenaActionPrimary}>
                  Acessar Arena
                </button>
                <button onClick={desativarArena} style={styles.arenaActionSecondary}>
                  Desativar Arena
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.arenaInactive}>
              <div style={styles.arenaStatus}>
                <span style={styles.arenaBadgeInactive}> DESATIVADA</span>
              </div>
              <div style={styles.arenaPlans}>
                <h4 style={styles.arenaPlansTitle}>Escolha um plano:</h4>
                <div style={styles.plansGrid}>
                  <div style={styles.planCard}>
                    <h5 style={styles.planTitle}>BÁSICO</h5>
                    <p style={styles.planPrice}>R$ 15/mês</p>
                    <ul style={styles.planFeatures}>
                      <li> Ranking básico</li>
                      <li> 5 métricas principais</li>
                      <li> 3 desafios semanais</li>
                      <li> Acesso apenas para administradores</li>
                    </ul>
                    <button onClick={() => habilitarArena('basico')} style={styles.planButton}>
                      Ativar Plano
                    </button>
                  </div>
                  
                  <div style={styles.planCard}>
                    <div style={styles.planRecommended}>RECOMENDADO</div>
                    <h5 style={styles.planTitle}>PRO</h5>
                    <p style={styles.planPrice}>R$ 40/mês</p>
                    <ul style={styles.planFeatures}>
                      <li> Tudo do Básico</li>
                      <li> Acesso para consultores</li>
                      <li> Dashboard avançado</li>
                      <li> 10 desafios semanais</li>
                      <li> Relatórios detalhados</li>
                    </ul>
                    <button onClick={() => habilitarArena('pro')} style={styles.planButtonPro}>
                      Ativar Plano
                    </button>
                  </div>
                  
                  <div style={styles.planCard}>
                    <h5 style={styles.planTitle}>ENTERPRISE</h5>
                    <p style={styles.planPrice}>R$ 60/mês</p>
                    <ul style={styles.planFeatures}>
                      <li> Tudo do Pro</li>
                      <li>🏢 Múltiplas filiais</li>
                      <li> API de integração</li>
                      <li>👨‍💼 Suporte prioritário</li>
                      <li>🔧 Personalização completa</li>
                    </ul>
                    <button onClick={() => habilitarArena('enterprise')} style={styles.planButton}>
                      Ativar Plano
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📚</div>
          <div>
            <p style={styles.statLabel}>Total de Treinamentos</p>
            <p style={styles.statValue}>{stats.total}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <p style={styles.statLabel}>Treinamentos Ativos</p>
            <p style={styles.statValue}>{stats.ativos}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <p style={styles.statLabel}>Consultores Inscritos</p>
            <p style={styles.statValue}>{stats.consultoresInscritos}</p>
          </div>
        </div>
      </div>

      {/* TABELA DE TREINAMENTOS */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeaderSection}>
          <h3 style={styles.tableTitle}>Treinamentos Cadastrados</h3>
          <p style={styles.tableSubtitle}>Gerencie seus treinamentos de produtos</p>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Segmento</th>
              <th style={styles.th}>Nível</th>
              <th style={styles.th}>Duração</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Obrigatório</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {treinamentos.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.emptyState}>
                  Nenhum treinamento cadastrado. Clique em "Novo Treinamento" para começar.
                </td>
              </tr>
            ) : (
              treinamentos.map((treinamento) => (
                <tr key={treinamento.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <strong>{treinamento.titulo}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{getSegmentoLabel(treinamento.segmento)}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={getNivelStyle(treinamento.nivel)}>{getNivelLabel(treinamento.nivel)}</span>
                  </td>
                  <td style={styles.td}>
                    <FaClock style={{ marginRight: 5 }} />
                    {treinamento.duracao_estimada} min
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleToggleStatus(treinamento.id, treinamento.ativo)}
                      style={treinamento.ativo ? styles.badgeActive : styles.badgeInactive}
                    >
                      {treinamento.ativo ? ' Ativo' : ' Inativo'}
                    </button>
                  </td>
                  <td style={styles.td}>
                    {treinamento.obrigatorio ? ' Sim' : 'Não'}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => handleEdit(treinamento)} style={styles.actionBtn} title="Editar">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(treinamento.id)} style={{...styles.actionBtn, color: '#dc3545'}} title="Excluir">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO (código original mantido) */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingTreinamento ? '✏️ Editar Treinamento' : '📝 Novo Treinamento'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={styles.closeButton}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* INFORMAÇÕES BÁSICAS */}
              <div style={styles.formSection}>
                <h4 style={styles.formSectionTitle}> Informações Básicas</h4>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    style={styles.input}
                    required
                    placeholder="Ex: Treinamento de Eletrônicos - Smartphones"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descrição *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    style={styles.textarea}
                    required
                    rows={3}
                    placeholder="Descreva o conteúdo e objetivos do treinamento..."
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Segmento do Produto *</label>
                    <select
                      value={formData.segmento}
                      onChange={(e) => setFormData({...formData, segmento: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="">Selecione um segmento</option>
                      {segmentos.map((seg) => (
                        <option key={seg.id} value={seg.id}>{seg.nome}</option>
                      ))}
                    </select>
                    <small style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '5px' }}>
                      Apenas consultores deste segmento verão este treinamento
                    </small>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nível *</label>
                    <select
                      value={formData.nivel}
                      onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="basico">Básico</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Duração (min) *</label>
                    <input
                      type="number"
                      value={formData.duracao_estimada}
                      onChange={(e) => setFormData({...formData, duracao_estimada: parseInt(e.target.value)})}
                      style={styles.input}
                      required
                      min={5}
                      max={240}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.obrigatorio}
                      onChange={(e) => setFormData({...formData, obrigatorio: e.target.checked})}
                      style={styles.checkbox}
                    />
                    📌 Treinamento Obrigatório
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      style={styles.checkbox}
                    />
                     Ativar Imediatamente
                  </label>
                </div>
              </div>

              {/* MÓDULOS */}
              <div style={styles.formSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4 style={styles.formSectionTitle}>📚 Módulos do Treinamento</h4>
                  <button type="button" onClick={handleAddModulo} style={styles.addModuloButton}>
                    <FaPlus /> Adicionar Módulo
                  </button>
                </div>

                {formData.conteudo.modulos.map((modulo, index) => (
                  <div key={index} style={styles.moduloCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <strong>Módulo {index + 1}</strong>
                      <button type="button" onClick={() => handleRemoveModulo(index)} style={styles.removeModuloButton}>
                        <FaTrash /> Remover
                      </button>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.labelSmall}>Título do Módulo</label>
                      <input
                        type="text"
                        value={modulo.titulo}
                        onChange={(e) => handleModuloChange(index, 'titulo', e.target.value)}
                        style={styles.inputSmall}
                        placeholder="Ex: Introdução aos Smartphones"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.labelSmall}>Descrição</label>
                      <textarea
                        value={modulo.descricao}
                        onChange={(e) => handleModuloChange(index, 'descricao', e.target.value)}
                        style={styles.textareaSmall}
                        rows={2}
                        placeholder="Breve descrição do conteúdo..."
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.labelSmall}>URL do Vídeo (opcional)</label>
                        <input
                          type="url"
                          value={modulo.video_url}
                          onChange={(e) => handleModuloChange(index, 'video_url', e.target.value)}
                          style={styles.inputSmall}
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.labelSmall}>Duração (min)</label>
                        <input
                          type="number"
                          value={modulo.duracao}
                          onChange={(e) => handleModuloChange(index, 'duracao', parseInt(e.target.value))}
                          style={styles.inputSmall}
                          min={1}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.conteudo.modulos.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
                    Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
                  </p>
                )}
              </div>

              {/* BOTÕES */}
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingTreinamento ? '💾 Salvar Alterações' : ' Criar Treinamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ======= HELPERS =======
const getSegmentoLabel = (segmentoId) => {
  const segmento = mockSegmentos.find(s => s.id === segmentoId);
  return segmento ? segmento.nome : 'Não definido';
};

const getNivelLabel = (nivel) => {
  const labels = {
    basico: 'Básico',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
  };
  return labels[nivel] || nivel;
};

const getNivelStyle = (nivel) => {
  const styles = {
    basico: { backgroundColor: '#bb25a6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    intermediario: { backgroundColor: '#ffc107', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    avancado: { backgroundColor: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }
  };
  return styles[nivel] || styles.basico;
};

// ======= MOCK DATA =======
const mockSegmentos = [
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'smartphones', nome: 'Smartphones' },
  { id: 'informatica', nome: 'Informática' },
  { id: 'eletrodomesticos', nome: 'Eletrodomésticos' },
  { id: 'moveis', nome: 'Móveis' },
  { id: 'moda', nome: 'Moda e Vestuário' },
  { id: 'cosmeticos', nome: 'Cosméticos e Beleza' },
  { id: 'esportes', nome: 'Esportes e Lazer' },
  { id: 'livros', nome: 'Livros e Papelaria' },
  { id: 'alimentos', nome: 'Alimentos e Bebidas' },
];

const mockTreinamentos = [
  {
    id: 1,
    titulo: 'Conhecendo Smartphones Samsung',
    descricao: 'Aprenda sobre os principais modelos e características da linha Galaxy',
    segmento: 'smartphones',
    categoria: 'produto',
    nivel: 'basico',
    duracao_estimada: 45,
    obrigatorio: true,
    ativo: true,
    conteudo: {
      modulos: [
        { titulo: 'Introdução à Samsung', descricao: 'História e posicionamento', video_url: '', duracao: 10 },
        { titulo: 'Linha Galaxy S', descricao: 'Modelos premium', video_url: '', duracao: 20 },
        { titulo: 'Linha Galaxy A', descricao: 'Modelos intermediários', video_url: '', duracao: 15 },
      ]
    }
  },
  {
    id: 2,
    titulo: 'Notebooks para Diferentes Perfis',
    descricao: 'Como recomendar notebooks de acordo com o uso do cliente',
    segmento: 'informatica',
    categoria: 'produto',
    nivel: 'intermediario',
    duracao_estimada: 60,
    obrigatorio: false,
    ativo: true,
    conteudo: { modulos: [] }
  },
  {
    id: 3,
    titulo: 'Técnicas Avançadas - TVs 4K e 8K',
    descricao: 'Entenda as tecnologias e diferenciais das Smart TVs',
    segmento: 'eletronicos',
    categoria: 'produto',
    nivel: 'avancado',
    duracao_estimada: 90,
    obrigatorio: false,
    ativo: false,
    conteudo: { modulos: [] }
  }
];

// ======= ESTILOS =======
const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '1.2rem',
    color: '#666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  // Arena Section
  arenaSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '30px',
    overflow: 'hidden',
  },
  arenaHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 25px',
    backgroundColor: '#f8f9ff',
    borderBottom: '1px solid #e2e8f0',
  },
  arenaIcon: {
    fontSize: '2.5rem',
    color: '#ffd700',
    marginRight: '15px',
  },
  arenaTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333',
  },
  arenaDescription: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },
  arenaContent: {
    padding: '25px',
  },
  arenaActive: {
    backgroundColor: '#f0fff4',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #c6f6d5',
  },
  arenaInactive: {
    backgroundColor: '#fff5f5',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #fed7d7',
  },
  arenaStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  arenaBadgeActive: {
    padding: '8px 16px',
    backgroundColor: '#48bb78',
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  arenaBadgeInactive: {
    padding: '8px 16px',
    backgroundColor: '#f56565',
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  arenaTier: {
    padding: '8px 16px',
    backgroundColor: '#bb25a6',
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  arenaBenefits: {
    marginBottom: '25px',
  },
  arenaBenefitsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#2d3748',
  },
  arenaBenefitsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#4a5568',
  },
  arenaActions: {
    display: 'flex',
    gap: '15px',
  },
  arenaActionPrimary: {
    padding: '12px 24px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  arenaActionSecondary: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#f56565',
    border: '2px solid #f56565',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  arenaPlans: {},
  arenaPlansTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#2d3748',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  planCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    position: 'relative',
  },
  planRecommended: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#bb25a6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#2d3748',
    textAlign: 'center',
  },
  planPrice: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 20px 0',
    color: '#2d3748',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px 0',
    color: '#4a5568',
  },
  planFeaturesLi: {
    padding: '5px 0',
    fontSize: '14px',
  },
  planButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  planButtonPro: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  
  // Table
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  tableHeaderSection: {
    padding: '20px 25px',
    borderBottom: '1px solid #e2e8f0',
  },
  tableTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333',
  },
  tableSubtitle: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    borderBottom: '2px solid #dee2e6',
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#333',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '14px',
  },
  badge: {
    padding: '4px 10px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeActive: {
    padding: '4px 10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: 'none',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  badgeInactive: {
    padding: '4px 10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: 'none',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: LOJISTA_PRIMARY,
    padding: '5px',
  },
  
  // Modal (mantido do original)
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    padding: '20px 25px',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  form: {
    padding: '25px',
  },
  formSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  formSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  labelSmall: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  inputSmall: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '13px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  textareaSmall: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  addModuloButton: {
    padding: '8px 16px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  moduloCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #dee2e6',
  },
  removeModuloButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '25px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default TrainingManagementPanel;