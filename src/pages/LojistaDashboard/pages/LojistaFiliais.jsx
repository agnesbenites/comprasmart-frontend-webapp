// src/pages/LojistaFiliais.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LojistaFiliais = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingFilial, setEditingFilial] = useState(null);
  const [filiais, setFiliais] = useState([]);

  // Dados mockados - depois virão do backend
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "fisica",
    cnpj: "",
    responsavel: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    status: "ativa",
  });

  // Limites por plano (exemplo)
  const limitesPlano = {
    "app-only": 1,
    "complete-online": 3,
    offline: 999, // ilimitado
  };

  const planoAtual = "complete-online"; // Isso virá do perfil do usuário
  const limiteAtual = limitesPlano[planoAtual];
  const filiaisCadastradas = filiais.length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filiaisCadastradas >= limiteAtual && !editingFilial) {
      alert(
        `Seu plano permite apenas ${limiteAtual} filial(is). Faça upgrade para adicionar mais.`
      );
      return;
    }

    const filialData = {
      id: editingFilial ? editingFilial.id : Date.now(),
      ...formData,
      dataCadastro: editingFilial
        ? editingFilial.dataCadastro
        : new Date().toISOString(),
    };

    if (editingFilial) {
      // Editar filial existente
      setFiliais((prev) =>
        prev.map((f) => (f.id === editingFilial.id ? filialData : f))
      );
    } else {
      // Adicionar nova filial
      setFiliais((prev) => [...prev, filialData]);
    }

    // Reset form
    setFormData({
      nome: "",
      tipo: "fisica",
      cnpj: "",
      responsavel: "",
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      status: "ativa",
    });

    setShowForm(false);
    setEditingFilial(null);
    alert(
      editingFilial
        ? "Filial atualizada com sucesso!"
        : "Filial cadastrada com sucesso!"
    );
  };

  const handleEdit = (filial) => {
    setFormData(filial);
    setEditingFilial(filial);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta filial?")) {
      setFiliais((prev) => prev.filter((f) => f.id !== id));
      alert("Filial excluída com sucesso!");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFilial(null);
    setFormData({
      nome: "",
      tipo: "fisica",
      cnpj: "",
      responsavel: "",
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      status: "ativa",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      ativa: {
        backgroundColor: "#d4edda",
        color: "#155724",
        borderColor: "#c3e6cb",
      },
      inativa: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        borderColor: "#f5c6cb",
      },
    };

    return (
      <span
        style={{
          ...styles[status],
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          border: "1px solid",
        }}
      >
        {status === "ativa" ? "✅ Ativa" : "❌ Inativa"}
      </span>
    );
  };

  const getTipoBadge = (tipo) => {
    return (
      <span
        style={{
          backgroundColor: tipo === "fisica" ? "#e7f3ff" : "#fff3cd",
          color: tipo === "fisica" ? "#004085" : "#856404",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          border: `1px solid ${tipo === "fisica" ? "#b8daff" : "#ffeaa7"}`,
        }}
      >
        {tipo === "fisica" ? "🏪 Física" : "🌐 Virtual"}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏪 Gestão de Filiais</h1>
          <p style={styles.subtitle}>
            Gerencie todas as suas lojas físicas e virtuais
          </p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{filiaisCadastradas}</span>
            <span style={styles.statLabel}>Cadastradas</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{limiteAtual}</span>
            <span style={styles.statLabel}>Limite do Plano</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {limiteAtual === 999 ? "∞" : limiteAtual - filiaisCadastradas}
            </span>
            <span style={styles.statLabel}>Disponíveis</span>
          </div>
        </div>
      </div>

      {/* Alertas de Limite */}
      {filiaisCadastradas >= limiteAtual && limiteAtual !== 999 && (
        <div style={styles.alert}>
          ⚠️ Você atingiu o limite do seu plano.
          <button
            style={styles.upgradeButton}
            onClick={() => navigate("/para-lojistas")}
          >
            Fazer Upgrade
          </button>
        </div>
      )}

      {/* Botão Adicionar */}
      {!showForm && filiaisCadastradas < limiteAtual && (
        <button style={styles.addButton} onClick={() => setShowForm(true)}>
          ➕ Adicionar Nova Filial
        </button>
      )}

      {/* Formulário */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {editingFilial ? "✏️ Editar Filial" : "🏪 Nova Filial"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Dados Básicos */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Dados Básicos</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome da Filial *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tipo *</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      <option value="fisica">🏪 Loja Física</option>
                      <option value="virtual">🌐 Loja Virtual</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      <option value="ativa">✅ Ativa</option>
                      <option value="inativa">❌ Inativa</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              {/* Contato */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Contato</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Responsável *</label>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Telefone *</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço (apenas para físicas) */}
              {formData.tipo === "fisica" && (
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>Endereço</h3>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="00000-000"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Número</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Complemento</label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Estado</label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="SP"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                Cancelar
              </button>
              <button type="submit" style={styles.submitButton}>
                {editingFilial ? "Atualizar Filial" : "Cadastrar Filial"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Filiais */}
      {!showForm && (
        <div style={styles.listaContainer}>
          <h2 style={styles.listaTitle}>
            Minhas Filiais ({filiaisCadastradas})
          </h2>

          {filiais.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏪</div>
              <h3 style={styles.emptyTitle}>Nenhuma filial cadastrada</h3>
              <p style={styles.emptyText}>
                Comece cadastrando sua primeira filial para gerenciar suas
                lojas.
              </p>
              <button
                style={styles.addButton}
                onClick={() => setShowForm(true)}
              >
                ➕ Adicionar Primeira Filial
              </button>
            </div>
          ) : (
            <div style={styles.filiaisGrid}>
              {filiais.map((filial) => (
                <div key={filial.id} style={styles.filialCard}>
                  <div style={styles.filialHeader}>
                    <h3 style={styles.filialNome}>{filial.nome}</h3>
                    <div style={styles.filialBadges}>
                      {getTipoBadge(filial.tipo)}
                      {getStatusBadge(filial.status)}
                    </div>
                  </div>

                  <div style={styles.filialInfo}>
                    <p style={styles.filialResponsavel}>
                      <strong>Responsável:</strong> {filial.responsavel}
                    </p>
                    <p style={styles.filialContato}>
                      <strong>Contato:</strong> {filial.telefone}
                      {filial.email && ` • ${filial.email}`}
                    </p>

                    {filial.tipo === "fisica" && filial.endereco && (
                      <p style={styles.filialEndereco}>
                        <strong>Endereço:</strong> {filial.endereco},{" "}
                        {filial.numero}
                        {filial.complemento && ` - ${filial.complemento}`}
                        {filial.cidade && `, ${filial.cidade}-${filial.estado}`}
                      </p>
                    )}

                    <p style={styles.filialData}>
                      <strong>Cadastrada em:</strong>{" "}
                      {new Date(filial.dataCadastro).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>

                  <div style={styles.filialActions}>
                    <button
                      onClick={() => handleEdit(filial)}
                      style={styles.editButton}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(filial.id)}
                      style={styles.deleteButton}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Estilos profissionais
const styles = {
  container: {
    padding: "30px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#333",
    marginBottom: "8px",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    margin: 0,
  },
  stats: {
    display: "flex",
    gap: "15px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "100px",
  },
  statNumber: {
    display: "block",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#666",
    fontWeight: "500",
  },
  alert: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeaa7",
    color: "#856404",
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },
  upgradeButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "background-color 0.3s ease",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  formTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  formGrid: {
    display: "grid",
    gap: "30px",
  },
  formSection: {
    padding: "25px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  formActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e9ecef",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  listaContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  listaTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "25px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  emptyText: {
    color: "#666",
    fontSize: "1.1rem",
    marginBottom: "30px",
  },
  filiaisGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
  },
  filialCard: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  filialHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "10px",
  },
  filialNome: {
    fontSize: "1.3rem",
    color: "#333",
    margin: 0,
    fontWeight: "600",
  },
  filialBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filialInfo: {
    marginBottom: "20px",
  },
  filialResponsavel: {
    margin: "8px 0",
    color: "#555",
    fontSize: "0.95rem",
  },
  filialContato: {
    margin: "8px 0",
    color: "#555",
    fontSize: "0.95rem",
  },
  filialEndereco: {
    margin: "8px 0",
    color: "#555",
    fontSize: "0.95rem",
  },
  filialData: {
    margin: "8px 0",
    color: "#666",
    fontSize: "0.9rem",
  },
  filialActions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
};

export default LojistaFiliais;
