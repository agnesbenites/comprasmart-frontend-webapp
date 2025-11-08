// src/pages/LojistaVendedores.jsx
import React, { useState } from "react";

const LojistaVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vendedorEditando, setVendedorEditando] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",

    // Dados Profissionais
    matricula: "",
    dataAdmissao: "",
    cargo: "vendedor",
    filial: "",
    departamento: "Vendas",
    comissao: "5",
    metaMensal: "",

    // Endereço
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",

    // Status
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
    "Atendimento",
    "Telemarketing",
    "E-commerce",
    "Field Sales",
  ];

  const cargos = [
    { id: "vendedor", nome: "💼 Vendedor", cor: "#007bff" },
    { id: "supervisor", nome: "👨‍💼 Supervisor", cor: "#28a745" },
    { id: "coordenador", nome: "🎯 Coordenador", cor: "#ffc107" },
    { id: "gerente", nome: "📊 Gerente", cor: "#dc3545" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const gerarMatricula = () => {
    const timestamp = new Date().getTime();
    return `VEND${timestamp.toString().slice(-6)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vendedorData = {
      id: vendedorEditando ? vendedorEditando.id : Date.now(),
      ...formData,
      // Gerar matrícula automaticamente se for novo vendedor
      matricula: vendedorEditando ? formData.matricula : gerarMatricula(),
      dataCriacao: vendedorEditando
        ? vendedorEditando.dataCriacao
        : new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      // Mock de dados de performance
      vendasMes: 0,
      comissaoAcumulada: 0,
      metaAtingida: false,
      // Avatar
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formData.nome
      )}&background=17a2b8&color=fff&size=100`,
    };

    if (vendedorEditando) {
      setVendedores((prev) =>
        prev.map((v) => (v.id === vendedorEditando.id ? vendedorData : v))
      );
    } else {
      setVendedores((prev) => [...prev, vendedorData]);
    }

    // Reset form
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      matricula: "",
      dataAdmissao: "",
      cargo: "vendedor",
      filial: "",
      departamento: "Vendas",
      comissao: "5",
      metaMensal: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      status: "ativo",
      observacoes: "",
    });

    setShowForm(false);
    setVendedorEditando(null);
    alert(
      vendedorEditando
        ? "Vendedor atualizado com sucesso!"
        : "Vendedor cadastrado com sucesso!"
    );
  };

  const handleEditar = (vendedor) => {
    setFormData(vendedor);
    setVendedorEditando(vendedor);
    setShowForm(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este vendedor?")) {
      setVendedores((prev) => prev.filter((v) => v.id !== id));
      alert("Vendedor excluído com sucesso!");
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setVendedorEditando(null);
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      matricula: "",
      dataAdmissao: "",
      cargo: "vendedor",
      filial: "",
      departamento: "Vendas",
      comissao: "5",
      metaMensal: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      status: "ativo",
      observacoes: "",
    });
  };

  const handleToggleStatus = (id) => {
    setVendedores((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "ativo" ? "inativo" : "ativo" }
          : v
      )
    );
  };

  const getCargoInfo = (cargoId) => {
    return cargos.find((c) => c.id === cargoId) || cargos[0];
  };

  const getStatusBadge = (status) => {
    return status === "ativo" ? (
      <span style={styles.badgeAtivo}>✅ Ativo</span>
    ) : (
      <span style={styles.badgeInativo}>❌ Inativo</span>
    );
  };

  const getFilialNome = (filialId) => {
    const filial = filiais.find((f) => f.id.toString() === filialId);
    return filial ? filial.nome : "Não definida";
  };

  const calcularPerformance = (vendas, meta) => {
    if (!meta || meta === 0) return 0;
    return Math.min((vendas / meta) * 100, 100);
  };

  // Filtros
  const vendedoresFiltrados = vendedores.filter((vendedor) => {
    const matchStatus =
      filtroStatus === "todos" || vendedor.status === filtroStatus;
    const matchBusca =
      vendedor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(busca.toLowerCase()) ||
      vendedor.matricula.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const estatisticas = {
    total: vendedores.length,
    ativos: vendedores.filter((v) => v.status === "ativo").length,
    metaAtingida: vendedores.filter((v) => v.metaAtingida).length,
    comissaoTotal: vendedores.reduce(
      (total, v) => total + parseFloat(v.comissaoAcumulada || 0),
      0
    ),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💼 Vendedores Próprios</h1>
          <p style={styles.subtitle}>Gerencie sua equipe de vendas interna</p>
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
            <span style={styles.statNumber}>{estatisticas.metaAtingida}</span>
            <span style={styles.statLabel}>Meta Atingida</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              R$ {estatisticas.comissaoTotal.toFixed(2)}
            </span>
            <span style={styles.statLabel}>Comissão Total</span>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Buscar por nome, email ou matrícula..."
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
          <option value="todos">👥 Todos os status</option>
          <option value="ativo">✅ Ativos</option>
          <option value="inativo">❌ Inativos</option>
        </select>

        <button style={styles.addButton} onClick={() => setShowForm(true)}>
          ➕ Novo Vendedor
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {vendedorEditando ? "✏️ Editar Vendedor" : "💼 Novo Vendedor"}
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

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Data de Nascimento</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                {vendedorEditando && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Matrícula</label>
                    <input
                      type="text"
                      value={formData.matricula}
                      style={{ ...styles.input, backgroundColor: "#f8f9fa" }}
                      readOnly
                    />
                    <small style={styles.helpText}>
                      Matrícula gerada automaticamente
                    </small>
                  </div>
                )}
              </div>

              {/* Dados Profissionais */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Dados Profissionais</h3>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Data de Admissão *</label>
                    <input
                      type="date"
                      name="dataAdmissao"
                      value={formData.dataAdmissao}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cargo *</label>
                    <select
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      {cargos.map((cargo) => (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Filial *</label>
                    <select
                      name="filial"
                      value={formData.filial}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Selecione uma filial</option>
                      {filiais.map((filial) => (
                        <option key={filial.id} value={filial.id}>
                          {filial.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Departamento</label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      {departamentos.map((depto) => (
                        <option key={depto} value={depto}>
                          {depto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Comissão (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      name="comissao"
                      value={formData.comissao}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Meta Mensal (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="metaMensal"
                      value={formData.metaMensal}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
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

              {/* Status e Observações */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Status e Observações</h3>

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

                <div style={styles.formGroup}>
                  <label style={styles.label}>Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Observações adicionais sobre o vendedor..."
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
                {vendedorEditando ? "Atualizar Vendedor" : "Cadastrar Vendedor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Vendedores */}
      {!showForm && (
        <div style={styles.listaContainer}>
          <h2 style={styles.listaTitle}>
            Equipe de Vendas ({vendedoresFiltrados.length})
          </h2>

          {vendedores.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💼</div>
              <h3 style={styles.emptyTitle}>Nenhum vendedor cadastrado</h3>
              <p style={styles.emptyText}>
                Comece cadastrando sua equipe de vendas interna.
              </p>
              <button
                style={styles.addButton}
                onClick={() => setShowForm(true)}
              >
                ➕ Adicionar Primeiro Vendedor
              </button>
            </div>
          ) : (
            <div style={styles.vendedoresGrid}>
              {vendedoresFiltrados.map((vendedor) => {
                const cargoInfo = getCargoInfo(vendedor.cargo);
                const performance = calcularPerformance(
                  vendedor.vendasMes,
                  vendedor.metaMensal
                );

                return (
                  <div key={vendedor.id} style={styles.vendedorCard}>
                    <div style={styles.vendedorHeader}>
                      <div style={styles.vendedorAvatar}>
                        <img
                          src={vendedor.avatar}
                          alt={vendedor.nome}
                          style={styles.avatarImage}
                        />
                      </div>
                      <div style={styles.vendedorInfo}>
                        <h3 style={styles.vendedorNome}>{vendedor.nome}</h3>
                        <p style={styles.vendedorEmail}>{vendedor.email}</p>
                        <p style={styles.vendedorMatricula}>
                          #{vendedor.matricula}
                        </p>
                      </div>
                      <div style={styles.vendedorBadges}>
                        <span
                          style={{
                            ...styles.cargoBadge,
                            backgroundColor: cargoInfo.cor + "20",
                            color: cargoInfo.cor,
                            borderColor: cargoInfo.cor,
                          }}
                        >
                          {cargoInfo.nome}
                        </span>
                        {getStatusBadge(vendedor.status)}
                      </div>
                    </div>

                    <div style={styles.vendedorDetalhes}>
                      <div style={styles.detalheItem}>
                        <strong>Filial:</strong>{" "}
                        {getFilialNome(vendedor.filial)}
                      </div>
                      <div style={styles.detalheItem}>
                        <strong>Departamento:</strong> {vendedor.departamento}
                      </div>
                      <div style={styles.detalheItem}>
                        <strong>Comissão:</strong> {vendedor.comissao}%
                      </div>
                      <div style={styles.detalheItem}>
                        <strong>Admissão:</strong>{" "}
                        {new Date(vendedor.dataAdmissao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </div>

                    {/* Performance */}
                    {vendedor.metaMensal && (
                      <div style={styles.performanceSection}>
                        <div style={styles.performanceHeader}>
                          <span>🎯 Performance do Mês</span>
                          <span style={styles.performancePercent}>
                            {performance.toFixed(1)}%
                          </span>
                        </div>
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${performance}%`,
                              backgroundColor:
                                performance >= 100
                                  ? "#28a745"
                                  : performance >= 70
                                  ? "#ffc107"
                                  : "#dc3545",
                            }}
                          />
                        </div>
                        <div style={styles.performanceNumbers}>
                          <span>
                            Vendas: R${" "}
                            {vendedor.vendasMes?.toFixed(2) || "0.00"}
                          </span>
                          <span>Meta: R$ {vendedor.metaMensal}</span>
                          <span>
                            Comissão: R${" "}
                            {vendedor.comissaoAcumulada?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={styles.vendedorActions}>
                      <button
                        onClick={() => handleToggleStatus(vendedor.id)}
                        style={
                          vendedor.status === "ativo"
                            ? styles.desativarButton
                            : styles.ativarButton
                        }
                      >
                        {vendedor.status === "ativo"
                          ? "❌ Desativar"
                          : "✅ Ativar"}
                      </button>
                      <button
                        onClick={() => handleEditar(vendedor)}
                        style={styles.editButton}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(vendedor.id)}
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
    flexWrap: "wrap",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "120px",
  },
  statNumber: {
    display: "block",
    fontSize: "1.8rem",
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
  helpText: {
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "5px",
    display: "block",
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
  vendedoresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
  },
  vendedorCard: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
    transition: "transform 0.2s ease",
  },
  vendedorHeader: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  vendedorAvatar: {
    flexShrink: 0,
  },
  avatarImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "2px solid #e0e0e0",
  },
  vendedorInfo: {
    flex: 1,
  },
  vendedorNome: {
    fontSize: "1.2rem",
    color: "#333",
    margin: "0 0 5px 0",
    fontWeight: "600",
  },
  vendedorEmail: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0 0 5px 0",
  },
  vendedorMatricula: {
    color: "#17a2b8",
    fontSize: "0.85rem",
    margin: 0,
    fontWeight: "500",
  },
  vendedorBadges: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-end",
  },
  cargoBadge: {
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
  vendedorDetalhes: {
    marginBottom: "20px",
  },
  detalheItem: {
    margin: "5px 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  performanceSection: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #e9ecef",
  },
  performanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  performancePercent: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  performanceNumbers: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
    color: "#666",
  },
  vendedorActions: {
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

export default LojistaVendedores;
