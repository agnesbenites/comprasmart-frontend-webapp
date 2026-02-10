// src/pages/ConsultorDashboard/components/ProfilePanel.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaUpload, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = '#2c5aa0';

// Segmentos disponíveis com ícones
const SEGMENTOS_DISPONIVEIS = [
  { id: 'Smartphones', nome: 'Smartphones', icon: '📱', cor: '#3498db' },
  { id: 'Notebooks', nome: 'Notebooks', icon: '💻', cor: '#9b59b6' },
  { id: 'TVs', nome: 'TVs', icon: '📺', cor: '#e74c3c' },
  { id: 'Informática', nome: 'Informática', icon: '🖥️', cor: '#2f0d51' },
  { id: 'Games', nome: 'Games', icon: '🎮', cor: '#e67e22' },
  { id: 'Áudio', nome: 'Áudio', icon: '🎧', cor: '#16a085' },
  { id: 'Móveis', nome: 'Móveis', icon: '🛋️', cor: '#8e44ad' },
  { id: 'Decoração', nome: 'Decoração', icon: '🪴', cor: '#bb25a6' },
  { id: 'Iluminação', nome: 'Iluminação', icon: '💡', cor: '#f39c12' },
  { id: 'Eletrodomésticos', nome: 'Eletrodomésticos', icon: '🏠', cor: '#2f0d51' },
  { id: 'Moda', nome: 'Moda', icon: '👔', cor: '#c0392b' },
  { id: 'Beleza', nome: 'Beleza', icon: '💄', cor: '#f53342' },
  { id: 'Esportes', nome: 'Esportes', icon: '⚽', cor: '#ff5722' },
  { id: 'Livros', nome: 'Livros', icon: '📚', cor: '#795548' },
];

const ProfilePanel = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingCurriculo, setUploadingCurriculo] = useState(false);
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    bio: '',
    curriculoUrl: null,
    curriculoNome: null,
    dataUploadCurriculo: null,
    segmentosAtendidos: [], // NOVO
  });

  const [editedPerfil, setEditedPerfil] = useState({...perfil});
  const [showAddSegmento, setShowAddSegmento] = useState(false);

  // Carregar dados do consultor
  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/consultor/login');
        return;
      }

      const { data: consultor, error } = await supabase
        .from('consultores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setPerfil({
        nome: consultor.nome || '',
        email: user.email || '',
        telefone: consultor.telefone || '',
        cpf: consultor.cpf || '',
        dataNascimento: consultor.data_nascimento || '',
        endereco: consultor.endereco || '',
        bairro: consultor.bairro || '',
        cidade: consultor.cidade || '',
        estado: consultor.estado || '',
        cep: consultor.cep || '',
        bio: consultor.bio || '',
        curriculoUrl: consultor.curriculo_url || null,
        curriculoNome: consultor.curriculo_nome || null,
        dataUploadCurriculo: consultor.curriculo_upload_data || null,
        segmentosAtendidos: consultor.segmentos_atendidos || [],
      });

      setEditedPerfil({
        nome: consultor.nome || '',
        email: user.email || '',
        telefone: consultor.telefone || '',
        cpf: consultor.cpf || '',
        dataNascimento: consultor.data_nascimento || '',
        endereco: consultor.endereco || '',
        bairro: consultor.bairro || '',
        cidade: consultor.cidade || '',
        estado: consultor.estado || '',
        cep: consultor.cep || '',
        bio: consultor.bio || '',
        curriculoUrl: consultor.curriculo_url || null,
        curriculoNome: consultor.curriculo_nome || null,
        dataUploadCurriculo: consultor.curriculo_upload_data || null,
        segmentosAtendidos: consultor.segmentos_atendidos || [],
      });

      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPerfil({...perfil});
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('consultores')
        .update({
          nome: editedPerfil.nome,
          telefone: editedPerfil.telefone,
          cpf: editedPerfil.cpf,
          data_nascimento: editedPerfil.dataNascimento,
          endereco: editedPerfil.endereco,
          bairro: editedPerfil.bairro,
          cidade: editedPerfil.cidade,
          estado: editedPerfil.estado,
          cep: editedPerfil.cep,
          bio: editedPerfil.bio,
          segmentos_atendidos: editedPerfil.segmentosAtendidos,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setPerfil({...editedPerfil});
      setIsEditing(false);
      alert('✅ Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('❌ Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPerfil({...perfil});
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/consultor/login');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Formato inválido. Use PDF, DOC ou DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setUploadingCurriculo(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload para Supabase Storage
      const fileName = `curriculos/${user.id}/${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName);

      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('consultores')
        .update({
          curriculo_url: urlData.publicUrl,
          curriculo_nome: file.name,
          curriculo_upload_data: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setPerfil({
        ...perfil,
        curriculoUrl: urlData.publicUrl,
        curriculoNome: file.name,
        dataUploadCurriculo: new Date().toISOString(),
      });

      alert('✅ Currículo enviado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao enviar currículo:', error);
      alert('❌ Erro ao enviar currículo. Tente novamente.');
    } finally {
      setUploadingCurriculo(false);
    }
  };

  // NOVO: Adicionar segmento
  const adicionarSegmento = (segmento) => {
    if (!editedPerfil.segmentosAtendidos.includes(segmento.id)) {
      setEditedPerfil({
        ...editedPerfil,
        segmentosAtendidos: [...editedPerfil.segmentosAtendidos, segmento.id],
      });
    }
    setShowAddSegmento(false);
  };

  // NOVO: Remover segmento
  const removerSegmento = (segmentoId) => {
    setEditedPerfil({
      ...editedPerfil,
      segmentosAtendidos: editedPerfil.segmentosAtendidos.filter(s => s !== segmentoId),
    });
  };

  // NOVO: Obter dados do segmento
  const getSegmentoData = (segmentoId) => {
    return SEGMENTOS_DISPONIVEIS.find(s => s.id === segmentoId) || 
      { id: segmentoId, nome: segmentoId, icon: '📦', cor: '#95a5a6' };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🔄</div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            {perfil.nome.charAt(0) || 'C'}
          </div>
          <div>
            <h1 style={styles.nome}>{perfil.nome || 'Consultor'}</h1>
            <p style={styles.email}>{perfil.email}</p>
          </div>
        </div>

        <div style={styles.headerActions}>
          {!isEditing ? (
            <>
              <button onClick={handleEdit} style={styles.editButton}>
                <FaEdit /> Editar Perfil
              </button>
              <button onClick={handleLogout} style={styles.logoutButton}>
                🚪 Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} style={styles.saveButton}>
                <FaSave /> Salvar
              </button>
              <button onClick={handleCancel} style={styles.cancelButton}>
                <FaTimes /> Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* NOVO: Card de Segmentos Atendidos - DESTAQUE */}
      <div style={styles.segmentosDestaque}>
        <div style={styles.segmentosHeader}>
          <h2 style={styles.segmentosTitle}>🎯 Segmentos Atendidos</h2>
          {isEditing && (
            <button 
              onClick={() => setShowAddSegmento(!showAddSegmento)}
              style={styles.addSegmentoBtn}
            >
              <FaPlus /> Adicionar
            </button>
          )}
        </div>

        {showAddSegmento && isEditing && (
          <div style={styles.segmentosDisponiveis}>
            <p style={styles.segmentosHelp}>Clique para adicionar:</p>
            <div style={styles.segmentosGrid}>
              {SEGMENTOS_DISPONIVEIS
                .filter(seg => !editedPerfil.segmentosAtendidos.includes(seg.id))
                .map(segmento => (
                  <button
                    key={segmento.id}
                    onClick={() => adicionarSegmento(segmento)}
                    style={{
                      ...styles.segmentoDisponivel,
                      borderColor: segmento.cor,
                    }}
                  >
                    <span style={styles.segmentoIcon}>{segmento.icon}</span>
                    <span>{segmento.nome}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div style={styles.segmentosList}>
          {(isEditing ? editedPerfil.segmentosAtendidos : perfil.segmentosAtendidos).length === 0 ? (
            <div style={styles.noSegmentos}>
              <p>Nenhum segmento selecionado</p>
              {isEditing && (
                <small>Clique em "Adicionar" para escolher seus segmentos</small>
              )}
            </div>
          ) : (
            (isEditing ? editedPerfil.segmentosAtendidos : perfil.segmentosAtendidos).map(segId => {
              const segData = getSegmentoData(segId);
              return (
                <div
                  key={segId}
                  style={{
                    ...styles.segmentoCard,
                    backgroundColor: segData.cor + '15',
                    borderColor: segData.cor,
                  }}
                >
                  <span style={styles.segmentoCardIcon}>{segData.icon}</span>
                  <span style={styles.segmentoCardNome}>{segData.nome}</span>
                  {isEditing && (
                    <button
                      onClick={() => removerSegmento(segId)}
                      style={styles.removeSegmentoBtn}
                      title="Remover segmento"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={styles.content}>
        {/* Coluna Esquerda - Dados Pessoais */}
        <div style={styles.leftColumn}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📋 Dados Pessoais</h3>
            <div style={styles.infoGrid}>
              <InfoField
                label="Nome Completo"
                value={isEditing ? editedPerfil.nome : perfil.nome}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, nome: value})}
              />
              <InfoField
                label="Email"
                value={isEditing ? editedPerfil.email : perfil.email}
                isEditing={false} // Email não editável
                onChange={() => {}}
              />
              <InfoField
                label="Telefone"
                value={isEditing ? editedPerfil.telefone : perfil.telefone}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, telefone: value})}
              />
              <InfoField
                label="CPF"
                value={isEditing ? editedPerfil.cpf : perfil.cpf}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, cpf: value})}
              />
              <InfoField
                label="Data de Nascimento"
                value={isEditing ? editedPerfil.dataNascimento : perfil.dataNascimento}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, dataNascimento: value})}
              />
              <InfoField
                label="CEP"
                value={isEditing ? editedPerfil.cep : perfil.cep}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, cep: value})}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Endereço</h3>
            <div style={styles.infoGrid}>
              <InfoField
                label="Rua"
                value={isEditing ? editedPerfil.endereco : perfil.endereco}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, endereco: value})}
              />
              <InfoField
                label="Bairro"
                value={isEditing ? editedPerfil.bairro : perfil.bairro}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, bairro: value})}
              />
              <InfoField
                label="Cidade"
                value={isEditing ? editedPerfil.cidade : perfil.cidade}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, cidade: value})}
              />
              <InfoField
                label="Estado"
                value={isEditing ? editedPerfil.estado : perfil.estado}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, estado: value})}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💬 Biografia</h3>
            {isEditing ? (
              <textarea
                value={editedPerfil.bio}
                onChange={(e) => setEditedPerfil({...editedPerfil, bio: e.target.value})}
                style={styles.bioTextarea}
                rows={4}
                placeholder="Conte um pouco sobre sua experiência como consultor..."
              />
            ) : (
              <p style={styles.bioText}>{perfil.bio || 'Nenhuma biografia adicionada ainda.'}</p>
            )}
          </div>
        </div>

        {/* Coluna Direita - Currículo e Estatísticas */}
        <div style={styles.rightColumn}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📄 Currículo</h3>
            
            {perfil.curriculoUrl ? (
              <div style={styles.curriculoCard}>
                <div style={styles.curriculoIcon}>
                  <FaFileAlt size={40} color={CONSULTOR_PRIMARY} />
                </div>
                <div style={styles.curriculoInfo}>
                  <p style={styles.curriculoNome}>{perfil.curriculoNome}</p>
                  <p style={styles.curriculoData}>
                    Enviado em: {new Date(perfil.dataUploadCurriculo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <a 
                  href={perfil.curriculoUrl} 
                  download 
                  style={styles.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 Baixar
                </a>
              </div>
            ) : (
              <div style={styles.noCurriculoCard}>
                <FaFileAlt size={40} color="#ccc" />
                <p style={styles.noCurriculoText}>Nenhum currículo enviado</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={styles.fileInput}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingCurriculo}
              style={styles.uploadButton}
            >
              <FaUpload />
              {uploadingCurriculo ? 'Enviando...' : 'Substituir Currículo'}
            </button>

            <p style={styles.uploadHint}>
              Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📊 Estatísticas Rápidas</h3>
            <div style={styles.statsGrid}>
              <StatCard icon="🛒" label="Vendas no Mês" value="156" />
              <StatCard icon="💰" label="Comissão Acumulada" value="R$ 6.240" />
              <StatCard icon="⭐" label="Avaliação Média" value="4.8" />
              <StatCard icon="🏪" label="Lojas Ativas" value={perfil.segmentosAtendidos.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para campos de informação
const InfoField = ({ label, value, isEditing, onChange }) => (
  <div style={styles.infoField}>
    <label style={styles.infoLabel}>{label}</label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.infoInput}
      />
    ) : (
      <p style={styles.infoValue}>{value || '-'}</p>
    )}
  </div>
);

// Componente auxiliar para cards de estatística
const StatCard = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <span style={styles.statIcon}>{icon}</span>
    <p style={styles.statLabel}>{label}</p>
    <p style={styles.statValue}>{value}</p>
  </div>
);

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
    minHeight: '100vh',
    gap: '15px',
  },
  loadingSpinner: {
    fontSize: '3rem',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  nome: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  email: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  saveButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  
  // NOVO: Estilos do Card de Segmentos Atendidos
  segmentosDestaque: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(44, 90, 160, 0.15)',
    border: '2px solid ' + CONSULTOR_PRIMARY,
  },
  segmentosHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  segmentosTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
  addSegmentoBtn: {
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
  },
  segmentosDisponiveis: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  segmentosHelp: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  segmentosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
  },
  segmentoDisponivel: {
    backgroundColor: 'white',
    border: '2px solid',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  segmentosList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    minHeight: '60px',
  },
  segmentoCard: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: '600',
    position: 'relative',
  },
  segmentoCardIcon: {
    fontSize: '1.5rem',
  },
  segmentoCardNome: {
    color: '#333',
  },
  removeSegmentoBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  noSegmentos: {
    textAlign: 'center',
    padding: '30px',
    color: '#999',
  },
  
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  infoField: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '5px',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#333',
    margin: 0,
  },
  infoInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  bioTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  bioText: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
    margin: 0,
  },
  curriculoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  curriculoIcon: {
    flexShrink: 0,
  },
  curriculoInfo: {
    flex: 1,
  },
  curriculoNome: {
    margin: '0 0 5px 0',
    fontWeight: '600',
    color: '#333',
  },
  curriculoData: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#666',
  },
  downloadLink: {
    padding: '8px 16px',
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  noCurriculoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  noCurriculoText: {
    marginTop: '15px',
    color: '#999',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  uploadHint: {
    fontSize: '0.85rem',
    color: '#666',
    textAlign: 'center',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
    display: 'block',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
};

// Adicionar animação de loading
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      styleSheet.insertRule(`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      // Ignora se já existir
    }
  }
}

export default ProfilePanel;