// src/pages/VendedorDashboard/pages/VendedorProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

// Cores do Vendedor
const VENDOR_PRIMARY = "#4a6fa5";
const VENDOR_PRIMARY_DARK = "#2f0d51";
const VENDOR_LIGHT_BG = "#eaf2ff";

const VendedorProfile = () => {
  const navigate = useNavigate();
  
  // Estados dos dados do vendedor
  const [vendedor, setVendedor] = useState(null);
  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para edição
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  
  // Estados para mensagens
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [loadingAction, setLoadingAction] = useState(false);

  // Carregar dados do vendedor
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // 1. Buscar user logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // 2. Buscar dados do vendedor
      const { data: vendedorData, error: vendedorError } = await supabase
        .from('vendedores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (vendedorError) throw vendedorError;

      if (!vendedorData) {
        throw new Error('Vendedor não encontrado');
      }

      setVendedor(vendedorData);
      setNovoNome(vendedorData.nome);

      // 3. Buscar dados da loja
      if (vendedorData.loja_id) {
        const { data: lojaData, error: lojaError } = await supabase
          .from('lojas_corrigida')
          .select('nome, endereco, telefone, horario_funcionamento')
          .eq('id', vendedorData.loja_id)
          .maybeSingle();

        if (lojaError) throw lojaError;
        setLoja(lojaData);
      }

    } catch (error) {
      console.error('[Profile] Erro ao carregar dados:', error);
      mostrarMensagem('erro', 'Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  // Função para mostrar mensagem temporária
  const mostrarMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: "", texto: "" }), 5000);
  };

  // Função para salvar nome
  const salvarNome = async () => {
    if (!novoNome.trim()) {
      mostrarMensagem("erro", "O nome não pode estar vazio.");
      return;
    }
    
    setLoadingAction(true);
    try {
      const { error } = await supabase
        .from('vendedores')
        .update({ 
          nome: novoNome.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', vendedor.id);

      if (error) throw error;

      setVendedor({ ...vendedor, nome: novoNome.trim() });
      setEditandoNome(false);
      mostrarMensagem("sucesso", "Nome atualizado com sucesso!");
      
    } catch (error) {
      console.error('[Profile] Erro ao salvar nome:', error);
      mostrarMensagem("erro", "Erro ao atualizar nome.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Função para upload de foto (placeholder - implementar storage depois)
  const handleFotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      mostrarMensagem("erro", "A imagem deve ter no máximo 2MB.");
      return;
    }
    
    // Converter para base64 (temporário - depois implementar Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPerfil(reader.result);
      mostrarMensagem("sucesso", "Foto de perfil atualizada!");
    };
    reader.readAsDataURL(file);
  };

  // Função para enviar email de reset de senha
  const solicitarResetSenha = async () => {
    if (!vendedor?.email) {
      mostrarMensagem("erro", "Email não encontrado.");
      return;
    }

    setLoadingAction(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        vendedor.email,
        {
          redirectTo: `${window.location.origin}/vendedor/reset-senha`,
        }
      );

      if (error) throw error;

      mostrarMensagem(
        "sucesso", 
        `📧 Email enviado para ${vendedor.email}! Clique no link para alterar sua senha.`
      );
      
    } catch (error) {
      console.error('[Profile] Erro ao solicitar reset:', error);
      mostrarMensagem("erro", "Erro ao enviar email de reset de senha.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    if (!window.confirm("Tem certeza que deseja sair?")) return;

    try {
      await supabase.auth.signOut();
      navigate('/vendedor/login', { replace: true });
    } catch (error) {
      console.error('[Profile] Erro ao fazer logout:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#666' }}> Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!vendedor) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#dc3545' }}> Erro ao carregar perfil</p>
          <button onClick={() => navigate('/vendedor/dashboard')} style={styles.backButton}>
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER COM LOGOUT */}
      <div style={styles.header}>
        <h1 style={styles.title}> Meu Perfil</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
           Sair
        </button>
      </div>
      
      {/* Mensagem de feedback */}
      {mensagem.texto && (
        <div style={{
          ...styles.mensagem,
          backgroundColor: mensagem.tipo === "sucesso" ? "#d4edda" : "#f8d7da",
          color: mensagem.tipo === "sucesso" ? "#155724" : "#721c24",
          borderColor: mensagem.tipo === "sucesso" ? "#c3e6cb" : "#f5c6cb"
        }}>
          {mensagem.texto}
        </div>
      )}

      {/* Card de Foto de Perfil */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📸 Foto de Perfil</h2>
        
        <div style={styles.fotoContainer}>
          <div style={styles.fotoWrapper}>
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" style={styles.foto} />
            ) : (
              <div style={styles.fotoPlaceholder}>
                {vendedor.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div style={styles.fotoActions}>
            <label style={styles.uploadButton}>
               Alterar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
                style={{ display: "none" }}
              />
            </label>
            <p style={styles.fotoHint}>JPG, PNG ou GIF. Máximo 2MB.</p>
          </div>
        </div>
      </div>

      {/* Card de Informações Pessoais */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}> Informações Pessoais</h2>
        
        {/* Nome */}
        <div style={styles.infoGroup}>
          <label style={styles.label}>Nome</label>
          {editandoNome ? (
            <div style={styles.editContainer}>
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                style={styles.input}
                placeholder="Seu nome completo"
              />
              <div style={styles.buttonGroup}>
                <button
                  onClick={salvarNome}
                  disabled={loadingAction}
                  style={styles.saveButton}
                >
                  {loadingAction ? "Salvando..." : " Salvar"}
                </button>
                <button
                  onClick={() => {
                    setNovoNome(vendedor.nome);
                    setEditandoNome(false);
                  }}
                  style={styles.cancelButton}
                >
                   Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.viewContainer}>
              <span style={styles.value}>{vendedor.nome}</span>
              <button
                onClick={() => setEditandoNome(true)}
                style={styles.editButton}
              >
                ✏️ Editar
              </button>
            </div>
          )}
        </div>

        {/* Email (somente leitura) */}
        <div style={styles.infoGroup}>
          <label style={styles.label}>Email</label>
          <div style={styles.viewContainer}>
            <span style={styles.value}>{vendedor.email || 'Não informado'}</span>
            <span style={styles.badge}> Não editável</span>
          </div>
        </div>

        {/* Telefone (somente leitura) */}
        {vendedor.telefone && (
          <div style={styles.infoGroup}>
            <label style={styles.label}>Telefone</label>
            <span style={styles.value}>{vendedor.telefone}</span>
          </div>
        )}

        {/* CPF (somente leitura) */}
        {vendedor.cpf && (
          <div style={styles.infoGroup}>
            <label style={styles.label}>CPF</label>
            <span style={styles.value}>{vendedor.cpf}</span>
          </div>
        )}

        {/* Status */}
        <div style={styles.infoGroup}>
          <label style={styles.label}>Status</label>
          <span style={{
            ...styles.badge,
            backgroundColor: vendedor.ativo ? '#d4edda' : '#f8d7da',
            color: vendedor.ativo ? '#155724' : '#721c24'
          }}>
            {vendedor.ativo ? ' Ativo' : '⚠️ Inativo'}
          </span>
        </div>
      </div>

      {/* Card de Informações da Loja */}
      {loja && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}> Loja</h2>
          
          <div style={styles.infoGroup}>
            <label style={styles.label}>Nome da Loja</label>
            <span style={styles.value}>{loja.nome}</span>
          </div>

          {loja.endereco && (
            <div style={styles.infoGroup}>
              <label style={styles.label}>Endereço</label>
              <span style={styles.value}>{loja.endereco}</span>
            </div>
          )}

          {loja.telefone && (
            <div style={styles.infoGroup}>
              <label style={styles.label}>Telefone da Loja</label>
              <span style={styles.value}>{loja.telefone}</span>
            </div>
          )}

          {loja.horario_funcionamento && (
            <div style={styles.infoGroup}>
              <label style={styles.label}>Horário de Funcionamento</label>
              <span style={styles.value}>{loja.horario_funcionamento}</span>
            </div>
          )}
        </div>
      )}

      {/* Card de Senha */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}> Senha</h2>
        
        <div style={styles.alertBox}>
          <strong>⚠️ Senha Padrão Detectada!</strong>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
            Por segurança, você deve alterar sua senha padrão (@Senha123). 
            Clique no botão abaixo para receber um link de alteração por email.
          </p>
        </div>

        <div style={styles.viewContainer}>
          <span style={styles.value}>••••••••</span>
          <button
            onClick={solicitarResetSenha}
            disabled={loadingAction}
            style={styles.resetButton}
          >
            {loadingAction ? " Enviando..." : "📧 Alterar Senha"}
          </button>
        </div>

        <p style={styles.hint}>
          ℹ️ Você receberá um email com um link seguro para alterar sua senha.
        </p>
      </div>

      {/* Botão Voltar */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/vendedor/dashboard')}
          style={styles.backButton}
        >
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

// Estilos
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    color: VENDOR_PRIMARY,
    fontSize: "1.8rem",
    marginBottom: "0",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
  },
  mensagem: {
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid",
    fontWeight: "500",
    fontSize: "14px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "20px",
    border: "1px solid #e9ecef",
  },
  cardTitle: {
    color: VENDOR_PRIMARY_DARK,
    fontSize: "1.2rem",
    marginTop: 0,
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid " + VENDOR_LIGHT_BG,
  },
  infoGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#666",
    fontWeight: "600",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "1rem",
    color: "#333",
    display: "block",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  viewContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  editButton: {
    backgroundColor: VENDOR_LIGHT_BG,
    color: VENDOR_PRIMARY,
    border: "1px solid " + VENDOR_PRIMARY,
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  editContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "1rem",
    border: "2px solid #dee2e6",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  saveButton: {
    backgroundColor: VENDOR_PRIMARY,
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    color: "#666",
    border: "1px solid #ddd",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  backButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  hint: {
    fontSize: "12px",
    color: "#666",
    marginTop: "8px",
    fontStyle: "italic",
  },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
  fotoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
  },
  fotoWrapper: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid " + VENDOR_LIGHT_BG,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  foto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fotoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: VENDOR_PRIMARY,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "bold",
  },
  fotoActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  uploadButton: {
    backgroundColor: VENDOR_PRIMARY,
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    transition: "background-color 0.2s",
  },
  fotoHint: {
    fontSize: "12px",
    color: "#999",
    margin: 0,
  },
};

export default VendedorProfile;