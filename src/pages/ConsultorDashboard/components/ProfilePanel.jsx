// app-frontend/src/pages/ConsultorDashboard/components/ProfilePanel.jsx

import React, { useState, useRef } from 'react';
import { FaUserCircle, FaUpload, FaFileAlt, FaSignOutAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CONSULTOR_PRIMARY = "#2c5aa0";
const CONSULTOR_LIGHT_BG = "#eaf2ff";

const ProfilePanel = ({ consultorId }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Estado do perfil
  const [perfil, setPerfil] = useState({
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    dataNascimento: '15/03/1990',
    cidade: 'Sao Paulo',
    estado: 'SP',
    bio: 'Consultor especializado em eletr´nicos e tecnologia. 5 anos de experiancia em vendas.',
    curriculoUrl: '/curriculos/carlos_mendes_cv.pdf',
    curriculoNome: 'carlos_mendes_cv.pdf',
    dataUploadCurriculo: '2024-01-10',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedPerfil, setEditedPerfil] = useState(perfil);
  const [uploadingCurriculo, setUploadingCurriculo] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      // Limpar dados de autenticacao
      localStorage.removeItem('consultorToken');
      localStorage.removeItem('consultorId');
      localStorage.removeItem('consultorData');
      
      // Redirecionar para login
      navigate('/login');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert(' Formato nao permitido. Envie apenas PDF ou DOC/DOCX');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(' Arquivo muito grande. Tamanho maximo: 5MB');
      return;
    }

    setUploadingCurriculo(true);

    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar upload real para API
      // const formData = new FormData();
      // formData.append('curriculo', file);
      // const response = await fetch(`${API_URL}/api/consultores/${consultorId}/curriculo`, {
      //   method: 'POST',
      //   body: formData
      // });

      setPerfil({
        ...perfil,
        curriculoUrl: URL.createObjectURL(file),
        curriculoNome: file.name,
        dataUploadCurriculo: new Date().toISOString().split('T')[0],
      });

      alert(' Curriculo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert(' Erro ao atualizar curriculo. Tente novamente.');
    } finally {
      setUploadingCurriculo(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPerfil(perfil);
  };

  const handleSave = async () => {
    try {
      // TODO: Salvar na API
      // await fetch(`${API_URL}/api/consultores/${consultorId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(editedPerfil)
      // });

      setPerfil(editedPerfil);
      setIsEditing(false);
      alert(' Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(' Erro ao salvar perfil');
    }
  };

  const handleCancel = () => {
    setEditedPerfil(perfil);
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <FaUserCircle size={60} color={CONSULTOR_PRIMARY} />
          <div>
            <h2 style={styles.nome}>{perfil.nome}</h2>
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
                <FaSignOutAlt /> Sair
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

      <div style={styles.content}>
        {/* Coluna Esquerda - Informacoes Pessoais */}
        <div style={styles.leftColumn}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}> Informacoes Pessoais</h3>
            
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
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, email: value})}
              />
              
              <InfoField 
                label="Telefone"
                value={isEditing ? editedPerfil.telefone : perfil.telefone}
                isEditing={isEditing}
                onChange={(value) => setEditedPerfil({...editedPerfil, telefone: value})}
              />
              
              <InfoField 
                label="CPF"
                value={perfil.cpf}
                isEditing={false}
              />
              
              <InfoField 
                label="Data de Nascimento"
                value={perfil.dataNascimento}
                isEditing={false}
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
            <h3 style={styles.sectionTitle}> Biografia</h3>
            {isEditing ? (
              <textarea
                value={editedPerfil.bio}
                onChange={(e) => setEditedPerfil({...editedPerfil, bio: e.target.value})}
                style={styles.bioTextarea}
                rows={4}
              />
            ) : (
              <p style={styles.bioText}>{perfil.bio}</p>
            )}
          </div>
        </div>

        {/* Coluna Direita - Curriculo e Documentos */}
        <div style={styles.rightColumn}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}> Curriculo</h3>
            
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
                   Baixar
                </a>
              </div>
            ) : (
              <div style={styles.noCurriculoCard}>
                <FaFileAlt size={40} color="#ccc" />
                <p style={styles.noCurriculoText}>Nenhum curriculo enviado</p>
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
              {uploadingCurriculo ? 'Enviando...' : 'Substituir Curriculo'}
            </button>

            <p style={styles.uploadHint}>
              Formatos aceitos: PDF, DOC, DOCX (max. 5MB)
            </p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}> Estatisticas Rapidas</h3>
            <div style={styles.statsGrid}>
              <StatCard icon="" label="Vendas no Mas" value="156" />
              <StatCard icon="" label="Comissao Acumulada" value="R$ 6.240" />
              <StatCard icon="i" label="Avaliacao Media" value="4.8" />
              <StatCard icon="" label="Lojas Ativas" value="3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para campos de informacao
const InfoField = ({ label, value, isEditing, onChange }) => (
  <div style={styles.infoField}>
    <label style={styles.infoLabel}>{label}</label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={styles.infoInput}
      />
    ) : (
      <p style={styles.infoValue}>{value}</p>
    )}
  </div>
);

// Componente auxiliar para cards de estatistica
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
  saveButton: {
    backgroundColor: '#28a745',
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
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
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  infoField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: '15px',
    color: '#333',
    margin: 0,
  },
  infoInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  bioText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
  },
  bioTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  curriculoCard: {
    backgroundColor: CONSULTOR_LIGHT_BG,
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  curriculoIcon: {
    flexShrink: 0,
  },
  curriculoInfo: {
    flex: 1,
  },
  curriculoNome: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  curriculoData: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  },
  downloadLink: {
    color: CONSULTOR_PRIMARY,
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  noCurriculoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  noCurriculoText: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    backgroundColor: CONSULTOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '15px',
    width: '100%',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
    marginTop: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 5px 0',
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: CONSULTOR_PRIMARY,
    margin: 0,
  },
};

export default ProfilePanel;
