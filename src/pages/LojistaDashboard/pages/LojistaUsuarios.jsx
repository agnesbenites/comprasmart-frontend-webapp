// src/pages/LojistaUsuarios.jsx
import React, { useState } from "react";

const LojistaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [filtroPermissao, setFiltroPermissao] = useState("todos");
  const [busca, setBusca] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    permissao: "visualizador",
    filiais: [],
    departamento: "",
    cargo: "",
    dataAdmissao: "",
    status: "ativo",
    observacoes: "",
  });

  // Dados mockados
  const filiais = [
    { id: 1, nome: "Matriz - Centro" },
    { id: 2, nome: "Filial - Shopping" },
    { id: 3, nome: "Loja Online" },
  ];

  const departamentos = [
    "Vendas",
    "Marketing",
    "Financeiro",
    "RH",
    "TI",
    "Operações",
    "Administrativo",
  ];

  const permissoes = [
    {
      id: "visualizador",
      nome: "👀 Visualizador",
      descricao: "Pode apenas visualizar dados",
      nivel: 1,
      cor: "#6c757d",
    },
    {
      id: "operador",
      nome: "⚙️ Operador",
      descricao: "Pode operar o sistema com limitações",
      nivel: 2,
      cor: "#17a2b8",
    },
    {
      id: "gerente",
      nome: "👨‍💼 Gerente",
      descricao: "Pode gerenciar equipe e operações",
      nivel: 3,
      cor: "#28a745",
    },
    {
      id: "administrador",
      nome: "🔧 Administrador",
      descricao: "Acesso total ao sistema",
      nivel: 4,
      cor: "#dc3545",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Para checkboxes de filiais
      const updatedFiliais = checked
        ? [...formData.filiais, value]
        : formData.filiais.filter((id) => id !== value);

      setFormData((prev) => ({
        ...prev,
        filiais: updatedFiliais,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioData = {
      id: usuarioEditando ? usuarioEditando.id : Date.now(),
      ...formData,
      dataCriacao: usuarioEditando
        ? usuarioEditando.dataCriacao
        : new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      ultimoAcesso: usuarioEditando ? usuarioEditando.ultimoAcesso : null,
      // Mock de dados adicionais
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formData.nome
      )}&background=007bff&color=fff&size=100`,
    };

    if (usuarioEditando) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioEditando.id ? usuarioData : u))
      );
    } else {
      setUsuarios((prev) => [...prev, usuarioData]);
    }

    // Reset form
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      permissao: "visualizador",
      filiais: [],
      departamento: "",
      cargo: "",
      dataAdmissao: "",
      status: "ativo",
      observacoes: "",
    });

    setShowForm(false);
    setUsuarioEditando(null);
    alert(
      usuarioEditando
        ? "Usuário atualizado com sucesso!"
        : "Usuário cadastrado com sucesso!"
    );
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setUsuarioEditando(usuario);
    setShowForm(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuário excluído com sucesso!");
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setUsuarioEditando(null);
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      permissao: "visualizador",
      filiais: [],
      departamento: "",
      cargo: "",
      dataAdmissao: "",
      status: "ativo",
      observacoes: "",
    });
  };

  const handleToggleStatus = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" }
          : u
      )
    );
  };

  const getPermissaoInfo = (permissaoId) => {
    return permissoes.find((p) => p.id === permissaoId) || permissoes[0];
  };

  const getStatusBadge = (status) => {
    return status === "ativo" ? (
      <span style={styles.badgeAtivo}>✅ Ativo</span>
    ) : (
      <span style={styles.badgeInativo}>❌ Inativo</span>
    );
  };

  const getFiliaisNomes = (filiaisIds) => {
    return filiaisIds
      .map((id) => {
        const filial = filiais.find((f) => f.id.toString() === id);
        return filial ? filial.nome : "Filial não encontrada";
      })
      .join(", ");
  };

  // Filtros
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchPermissao =
      filtroPermissao === "todos" || usuario.permissao === filtroPermissao;
    const matchBusca =
      usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.cargo.toLowerCase().includes(busca.toLowerCase());
    return matchPermissao && matchBusca;
  });

  const estatisticas = {
    total: usuarios.length,
    ativos: usuarios.filter((u) => u.status === "ativo").length,
    administradores: usuarios.filter((u) => u.permissao === "administrador")
      .length,
    visualizadores: usuarios.filter((u) => u.permissao === "visualizador")
      .length,
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Gestão de Usuários</h1>
          <p style={styles.subtitle}>
            Controle o acesso da sua equipe ao sistema
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
            <span style={styles.statNumber}>
              {estatisticas.administradores}
            </span>
            <span style={styles.statLabel}>Administradores</span>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Buscar por nome, email ou cargo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={filtroPermissao}
          onChange={(e) => setFiltroPermissao(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="todos">👥 Todas as permissões</option>
          {permissoes.map((permissao) => (
            <option key={permissao.id} value={permissao.id}>
              {permissao.nome}
            </option>
          ))}
        </select>

        <button style={styles.addButton} onClick={() => setShowForm(true)}>
          ➕ Novo Usuário
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {usuarioEditando ? "✏️ Editar Usuário" : "👥 Novo Usuário"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Dados Pessoais */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Dados Pessoais</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome Completo *</label>
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
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              {/* Permissões e Acesso */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Permissões e Acesso</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nível de Permissão *</label>
                  <div style={styles.permissoesGrid}>
                    {permissoes.map((permissao) => (
                      <label key={permissao.id} style={styles.permissaoOption}>
                        <input
                          type="radio"
                          name="permissao"
                          value={permissao.id}
                          checked={formData.permissao === permissao.id}
                          onChange={handleInputChange}
                          style={styles.radioInput}
                        />
                        <div
                          style={{
                            ...styles.permissaoCard,
                            borderColor:
                              formData.permissao === permissao.id
                                ? permissao.cor
                                : "#e0e0e0",
                          }}
                        >
                          <div style={styles.permissaoHeader}>
                            <span style={styles.permissaoNome}>
                              {permissao.nome}
                            </span>
                            <span
                              style={{
                                ...styles.permissaoNivel,
                                backgroundColor: permissao.cor,
                              }}
                            >
                              Nível {permissao.nivel}
                            </span>
                          </div>
                          <p style={styles.permissaoDescricao}>
                            {permissao.descricao}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Filiais de Acesso</label>
                  <div style={styles.filiaisCheckbox}>
                    {filiais.map((filial) => (
                      <label key={filial.id} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          value={filial.id}
                          checked={formData.filiais.includes(
                            filial.id.toString()
                          )}
                          onChange={handleInputChange}
                          style={styles.checkboxInput}
                        />
                        <span style={styles.checkboxText}>{filial.nome}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="ativo">✅ Ativo</option>
                    <option value="inativo">❌ Inativo</option>
                  </select>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Dados Profissionais</h3>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Departamento</label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      <option value="">Selecione um departamento</option>
                      {departamentos.map((depto) => (
                        <option key={depto} value={depto}>
                          {depto}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cargo</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Ex: Gerente de Vendas"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Data de Admissão</label>
                  <input
                    type="date"
                    name="dataAdmissao"
                    value={formData.dataAdmissao}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Observações adicionais sobre o usuário..."
                  />
                </div>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={handleCancelar}
                style={styles.cancelButton}
              >
                Cancelar
              </button>
              <button type="submit" style={styles.submitButton}>
                {usuarioEditando ? "Atualizar Usuário" : "Cadastrar Usuário"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Usuários */}
      {!showForm && (
        <div style={styles.listaContainer}>
          <h2 style={styles.listaTitle}>
            Usuários do Sistema ({usuariosFiltrados.length})
          </h2>

          {usuarios.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👥</div>
              <h3 style={styles.emptyTitle}>Nenhum usuário cadastrado</h3>
              <p style={styles.emptyText}>
                Comece adicionando usuários para acessar o sistema.
              </p>
              <button
                style={styles.addButton}
                onClick={() => setShowForm(true)}
              >
                ➕ Adicionar Primeiro Usuário
              </button>
            </div>
          ) : (
            <div style={styles.usuariosGrid}>
              {usuariosFiltrados.map((usuario) => {
                const permissaoInfo = getPermissaoInfo(usuario.permissao);
                return (
                  <div key={usuario.id} style={styles.usuarioCard}>
                    <div style={styles.usuarioHeader}>
                      <div style={styles.usuarioAvatar}>
                        <img
                          src={usuario.avatar}
                          alt={usuario.nome}
                          style={styles.avatarImage}
                        />
                      </div>
                      <div style={styles.usuarioInfo}>
                        <h3 style={styles.usuarioNome}>{usuario.nome}</h3>
                        <p style={styles.usuarioEmail}>{usuario.email}</p>
                        {usuario.cargo && (
                          <p style={styles.usuarioCargo}>{usuario.cargo}</p>
                        )}
                      </div>
                      <div style={styles.usuarioBadges}>
                        <span
                          style={{
                            ...styles.permissaoBadge,
                            backgroundColor: permissaoInfo.cor + "20",
                            color: permissaoInfo.cor,
                            borderColor: permissaoInfo.cor,
                          }}
                        >
                          {permissaoInfo.nome}
                        </span>
                        {getStatusBadge(usuario.status)}
                      </div>
                    </div>

                    <div style={styles.usuarioDetalhes}>
                      {usuario.departamento && (
                        <div style={styles.detalheItem}>
                          <strong>Departamento:</strong> {usuario.departamento}
                        </div>
                      )}
                      {usuario.telefone && (
                        <div style={styles.detalheItem}>
                          <strong>Telefone:</strong> {usuario.telefone}
                        </div>
                      )}
                      {usuario.filiais.length > 0 && (
                        <div style={styles.detalheItem}>
                          <strong>Filiais:</strong>{" "}
                          {getFiliaisNomes(usuario.filiais)}
                        </div>
                      )}
                      <div style={styles.detalheItem}>
                        <strong>Cadastrado em:</strong>{" "}
                        {new Date(usuario.dataCriacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                      {usuario.ultimoAcesso && (
                        <div style={styles.detalheItem}>
                          <strong>Último acesso:</strong>{" "}
                          {new Date(usuario.ultimoAcesso).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      )}
                    </div>

                    <div style={styles.usuarioActions}>
                      <button
                        onClick={() => handleToggleStatus(usuario.id)}
                        style={
                          usuario.status === "ativo"
                            ? styles.desativarButton
                            : styles.ativarButton
                        }
                      >
                        {usuario.status === "ativo"
                          ? "❌ Desativar"
                          : "✅ Ativar"}
                      </button>
                      <button
                        onClick={() => handleEditar(usuario)}
                        style={styles.editButton}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(usuario.id)}
                        style={styles.deleteButton}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Estilos
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
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    minWidth: "200px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  filterSelect: {
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "white",
    minWidth: "200px",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
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
  textarea: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "80px",
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
  permissoesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  permissaoOption: {
    cursor: "pointer",
  },
  permissaoCard: {
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    transition: "all 0.3s ease",
    backgroundColor: "white",
  },
  permissaoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  permissaoNome: {
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  permissaoNivel: {
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  permissaoDescricao: {
    fontSize: "0.85rem",
    color: "#666",
    margin: 0,
    lineHeight: "1.4",
  },
  filiaisCheckbox: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  checkboxInput: {
    margin: 0,
  },
  checkboxText: {
    fontSize: "0.9rem",
  },
  radioInput: {
    display: "none",
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
  usuariosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
  },
  usuarioCard: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
    transition: "transform 0.2s ease",
  },
  usuarioHeader: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  usuarioAvatar: {
    flexShrink: 0,
  },
  avatarImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "2px solid #e0e0e0",
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: "1.2rem",
    color: "#333",
    margin: "0 0 5px 0",
    fontWeight: "600",
  },
  usuarioEmail: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0 0 5px 0",
  },
  usuarioCargo: {
    color: "#007bff",
    fontSize: "0.9rem",
    margin: 0,
    fontWeight: "500",
  },
  usuarioBadges: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-end",
  },
  permissaoBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid",
  },
  badgeAtivo: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid #c3e6cb",
  },
  badgeInativo: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid #f5c6cb",
  },
  usuarioDetalhes: {
    marginBottom: "20px",
  },
  detalheItem: {
    margin: "5px 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  usuarioActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  ativarButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  desativarButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
};

export default LojistaUsuarios;
