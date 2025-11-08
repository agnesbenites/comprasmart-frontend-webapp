import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- CONSTANTES DE ESTILO COMPARTILHADAS ---
const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const LIGHT_GREY = "#f8f9fa";

// Mock data - substitua pelos dados reais do seu backend
const mockProfile = {
  name: "João Consultor",
  email: "joao@consultor.com",
  profilePhoto: "/images/profile.jpg",
  stores: ["Magazine X (Eletrônicos)", "Loja Y (Decoração)"],
  segments: ["Eletrodomésticos", "Móveis"],
  bankData: "Banco 341 - Ag. 1234 - C/C 56789-0",
  cvStatus: "Completo",
};

const ProfilePanel = () => {
  const navigate = useNavigate();
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [password, setPassword] = useState("");
  const userName = localStorage.getItem("userName") || mockProfile.name;

  const handleBankUpdate = (e) => {
    e.preventDefault();
    // Lógica para atualizar dados bancários
    console.log("Atualizando dados bancários com senha:", password);
    setShowBankModal(false);
    setPassword("");
  };

  const handleCVUpdate = (e) => {
    e.preventDefault();
    // Lógica para atualizar currículo
    console.log("Atualizando currículo com senha:", password);
    setShowCVModal(false);
    setPassword("");
  };

  return (
    <div style={styles.appContainer}>
      {/* Menu Lateral */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>🏠</span>
            <span style={styles.sidebarText}>Home</span>
          </button>

          <button
            onClick={() => navigate("/chat")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>💬</span>
            <span style={styles.sidebarText}>Chat</span>
          </button>

          <button
            onClick={() => navigate("/analytics")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>📊</span>
            <span style={styles.sidebarText}>Analítico</span>
          </button>

          <div style={{ ...styles.sidebarButton, backgroundColor: "#0056b3" }}>
            <span style={styles.sidebarIcon}>👤</span>
            <span style={styles.sidebarText}>Perfil</span>
          </div>
        </div>
      </nav>

      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Meu Perfil</h1>
          <div style={styles.profileLink}>
            <span style={styles.profileName}>{userName}</span>
            <img
              src="https://placehold.co/40x40/007bff/ffffff?text=C"
              alt="Foto do Consultor"
              style={styles.profilePic}
            />
          </div>
        </header>

        <div style={styles.container}>
          {/* Cabeçalho com foto de perfil */}
          <div style={styles.profileHeader}>
            <div style={styles.profilePhotoContainer}>
              <img
                src={mockProfile.profilePhoto}
                alt="Foto do perfil"
                style={styles.profilePhoto}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/120x120/007bff/ffffff?text=U";
                }}
              />
            </div>
            <div style={styles.profileInfo}>
              <h1 style={styles.name}>{mockProfile.name}</h1>
              <p style={styles.email}>{mockProfile.email}</p>
            </div>
          </div>

          {/* Lojas e Segmentos */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Lojas e Segmentos Associados</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <strong>Lojas:</strong>
                <div style={styles.tags}>
                  {mockProfile.stores.map((store, index) => (
                    <span key={index} style={styles.tag}>
                      {store}
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.infoItem}>
                <strong>Segmentos:</strong>
                <div style={styles.tags}>
                  {mockProfile.segments.map((segment, index) => (
                    <span key={index} style={styles.tag}>
                      {segment}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Dados Bancários</h3>
            <div style={styles.secureInfo}>
              <span style={styles.secureText}>•••• •••• •••• ••••</span>
              <button
                style={styles.editButton}
                onClick={() => setShowBankModal(true)}
              >
                Visualizar/Atualizar
              </button>
            </div>
          </div>

          {/* Currículo */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Currículo</h3>
            <div style={styles.secureInfo}>
              <span>
                Status: <strong>{mockProfile.cvStatus}</strong>
              </span>
              <button
                style={styles.editButton}
                onClick={() => setShowCVModal(true)}
              >
                Visualizar/Atualizar
              </button>
            </div>
          </div>

          {/* Modal para Dados Bancários */}
          {showBankModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h3>Atualizar Dados Bancários</h3>
                <form onSubmit={handleBankUpdate}>
                  <div style={styles.formGroup}>
                    <label>Confirme sua senha para continuar:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.input}
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => {
                        setShowBankModal(false);
                        setPassword("");
                      }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" style={styles.confirmButton}>
                      Confirmar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para Currículo */}
          {showCVModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h3>Atualizar Currículo</h3>
                <form onSubmit={handleCVUpdate}>
                  <div style={styles.formGroup}>
                    <label>Confirme sua senha para continuar:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.input}
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => {
                        setShowCVModal(false);
                        setPassword("");
                      }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" style={styles.confirmButton}>
                      Confirmar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  // LAYOUT ESTRUTURAL PADRÃO
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: LIGHT_GREY,
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: "80px",
    backgroundColor: SECONDARY_COLOR,
    padding: "20px 0",
    flexShrink: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  sidebarContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  sidebarButton: {
    background: "none",
    border: "none",
    color: "white",
    padding: "12px 0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  sidebarIcon: { fontSize: "20px" },
  sidebarText: { fontSize: "11px" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "white",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: "1.5rem",
    color: SECONDARY_COLOR,
    margin: 0,
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: SECONDARY_COLOR,
    gap: "10px",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: `2px solid ${PRIMARY_COLOR}`,
  },
  container: {
    padding: "30px",
    backgroundColor: "white",
    flex: 1,
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "2px solid #eee",
  },
  profilePhotoContainer: {
    marginRight: "20px",
  },
  profilePhoto: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `4px solid ${PRIMARY_COLOR}`,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: "28px",
    margin: "0 0 5px 0",
    color: "#343a40",
  },
  email: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    color: PRIMARY_COLOR,
    fontSize: "18px",
    fontWeight: "600",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  secureInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secureText: {
    fontSize: "18px",
    letterSpacing: "2px",
    color: "#666",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    marginTop: "8px",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  confirmButton: {
    padding: "10px 20px",
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProfilePanel;
