// app-frontend/src/pages/LojistaDashboard/components/TrainingManagementPanel.jsx
// Painel de Gerenciamento de Treinamentos para Lojistas

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaUsers, FaClock } from 'react-icons/fa';

const LOJISTA_PRIMARY = "#28a745";

const TrainingManagementPanel = () => {
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTreinamento, setEditingTreinamento] = useState(null);
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
    carregarSegmentos(); // NOVO
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

  // NOVO: Carregar segmentos do lojista
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
      alert(' Erro ao salvar treinamento');
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

      alert(' Treinamento excluido!');
      carregarTreinamentos();
      carregarEstatisticas();
      
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao excluir treinamento');
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
      alert(' Erro ao alterar status');
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

  if (loading) {
    return <div style={styles.loading}>Carregando treinamentos...</div>;
  }

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

      {/* ESTATSTICAS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
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
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Titulo</th>
              <th style={styles.th}>Segmento</th>
              <th style={styles.th}>Nivel</th>
              <th style={styles.th}>Duracao</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Obrigatorio</th>
              <th style={styles.th}>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {treinamentos.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.emptyState}>
                  Nenhum treinamento cadastrado. Clique em "Novo Treinamento" para comecar.
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
                      {treinamento.ativo ? ' Ativo' : ' Inativo'}
                    </button>
                  </td>
                  <td style={styles.td}>
                    {treinamento.obrigatorio ? '  Sim' : 'Nao'}
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

      {/* MODAL DE CRIACAO/EDICAO */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingTreinamento ? ' Editar Treinamento' : 'O Novo Treinamento'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={styles.closeButton}>O</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* INFORMACOES BSICAS */}
              <div style={styles.formSection}>
                <h4 style={styles.formSectionTitle}> Informacoes Basicas</h4>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Titulo *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    style={styles.input}
                    required
                    placeholder="Ex: Treinamento de Eletr´nicos - Smartphones"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descricao *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    style={styles.textarea}
                    required
                    rows={3}
                    placeholder="Descreva o conteudo e objetivos do treinamento..."
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
                      Apenas consultores deste segmento verao este treinamento
                    </small>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nivel *</label>
                    <select
                      value={formData.nivel}
                      onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="basico">Basico</option>
                      <option value="intermediario">Intermediario</option>
                      <option value="avancado">Avancado</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Duracao (min) *</label>
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
                      Treinamento Obrigatorio
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

              {/* M“DULOS */}
              <div style={styles.formSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4 style={styles.formSectionTitle}> Modulos do Treinamento</h4>
                  <button type="button" onClick={handleAddModulo} style={styles.addModuloButton}>
                    <FaPlus /> Adicionar Modulo
                  </button>
                </div>

                {formData.conteudo.modulos.map((modulo, index) => (
                  <div key={index} style={styles.moduloCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <strong>Modulo {index + 1}</strong>
                      <button type="button" onClick={() => handleRemoveModulo(index)} style={styles.removeModuloButton}>
                        <FaTrash /> Remover
                      </button>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.labelSmall}>Titulo do Modulo</label>
                      <input
                        type="text"
                        value={modulo.titulo}
                        onChange={(e) => handleModuloChange(index, 'titulo', e.target.value)}
                        style={styles.inputSmall}
                        placeholder="Ex: Introducao aos Smartphones"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.labelSmall}>Descricao</label>
                      <textarea
                        value={modulo.descricao}
                        onChange={(e) => handleModuloChange(index, 'descricao', e.target.value)}
                        style={styles.textareaSmall}
                        rows={2}
                        placeholder="Breve descricao do conteudo..."
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.labelSmall}>URL do Video (opcional)</label>
                        <input
                          type="url"
                          value={modulo.video_url}
                          onChange={(e) => handleModuloChange(index, 'video_url', e.target.value)}
                          style={styles.inputSmall}
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.labelSmall}>Duracao (min)</label>
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
                    Nenhum modulo adicionado. Clique em "Adicionar Modulo" para comecar.
                  </p>
                )}
              </div>

              {/* BOTOES */}
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingTreinamento ? ' Salvar Alteracoes' : ' Criar Treinamento'}
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
  return segmento ? segmento.nome : 'Nao definido';
};

const getNivelLabel = (nivel) => {
  const labels = {
    basico: 'Basico',
    intermediario: 'Intermediario',
    avancado: 'Avancado'
  };
  return labels[nivel] || nivel;
};

const getNivelStyle = (nivel) => {
  const styles = {
    basico: { backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    intermediario: { backgroundColor: '#ffc107', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    avancado: { backgroundColor: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }
  };
  return styles[nivel] || styles.basico;
};

// ======= MOCK DATA =======
const mockSegmentos = [
  { id: 'eletronicos', nome: 'Eletr´nicos' },
  { id: 'smartphones', nome: 'Smartphones' },
  { id: 'informatica', nome: 'Informatica' },
  { id: 'eletrodomesticos', nome: 'Eletrodomesticos' },
  { id: 'moveis', nome: 'Moveis' },
  { id: 'moda', nome: 'Moda e Vestuario' },
  { id: 'cosmeticos', nome: 'Cosmeticos e Beleza' },
  { id: 'esportes', nome: 'Esportes e Lazer' },
  { id: 'livros', nome: 'Livros e Papelaria' },
  { id: 'alimentos', nome: 'Alimentos e Bebidas' },
];

const mockTreinamentos = [
  {
    id: 1,
    titulo: 'Conhecendo Smartphones Samsung',
    descricao: 'Aprenda sobre os principais modelos e caracteristicas da linha Galaxy',
    segmento: 'smartphones',
    categoria: 'produto',
    nivel: 'basico',
    duracao_estimada: 45,
    obrigatorio: true,
    ativo: true,
    conteudo: {
      modulos: [
        { titulo: 'Introducao   Samsung', descricao: 'Historia e posicionamento', video_url: '', duracao: 10 },
        { titulo: 'Linha Galaxy S', descricao: 'Modelos premium', video_url: '', duracao: 20 },
        { titulo: 'Linha Galaxy A', descricao: 'Modelos intermediarios', video_url: '', duracao: 15 },
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
    titulo: 'Tecnicas Avancadas - TVs 4K e 8K',
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
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
  
  // Modal
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
    backgroundColor: '#007bff',
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
