// src/pages/LojistaQRCode.jsx
import React, { useState } from "react";

const LojistaQRCode = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [showGerador, setShowGerador] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [qrEditando, setQrEditando] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "produto",
    produtoId: "",
    categoriaId: "",
    filialId: "",
    descricao: "",
    urlPersonalizada: "",
    corPrincipal: "#007bff",
    corSecundaria: "#ffffff",
    tamanho: "200",
    formato: "png",
  });

  // Dados mockados - depois virão do backend
  const produtos = [
    { id: 1, nome: "Smartphone XYZ", categoria: "Eletrônicos" },
    { id: 2, nome: "Mesa de Escritório", categoria: "Móveis" },
    { id: 3, nome: "Caderno Universitário", categoria: "Papelaria" },
  ];

  const categorias = [
    { id: 1, nome: "📱 Eletrônicos" },
    { id: 2, nome: "🛋️ Móveis" },
    { id: 3, nome: "📚 Papelaria" },
    { id: 4, nome: "👗 Roupas" },
  ];

  const filiais = [
    { id: 1, nome: "Matriz - Centro" },
    { id: 2, nome: "Filial - Shopping" },
    { id: 3, nome: "Loja Online" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const gerarQRCode = (e) => {
    e.preventDefault();

    // Gerar URL única baseada no tipo
    let urlBase = "https://f6plnr-5173.csb.app/consultor/scan/";
    let identificador = "";

    switch (formData.tipo) {
      case "produto":
        identificador = `produto-${formData.produtoId}`;
        break;
      case "categoria":
        identificador = `categoria-${formData.categoriaId}`;
        break;
      case "filial":
        identificador = `filial-${formData.filialId}`;
        break;
      case "personalizado":
        identificador = `custom-${Date.now()}`;
        break;
      default:
        identificador = `geral-${Date.now()}`;
    }

    const qrData = {
      id: qrEditando ? qrEditando.id : Date.now(),
      ...formData,
      url:
        formData.tipo === "personalizado"
          ? formData.urlPersonalizada
          : `${urlBase}${identificador}`,
      codigo: identificador,
      dataCriacao: qrEditando
        ? qrEditando.dataCriacao
        : new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      scans: qrEditando ? qrEditando.scans : 0,
      // Mock do QR Code - na prática seria gerado por uma lib
      qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=${
        formData.tamanho
      }x${formData.tamanho}&data=${
        formData.tipo === "personalizado"
          ? encodeURIComponent(formData.urlPersonalizada)
          : encodeURIComponent(urlBase + identificador)
      }&color=${formData.corPrincipal.replace(
        "#",
        ""
      )}&bgcolor=${formData.corSecundaria.replace("#", "")}`,
    };

    if (qrEditando) {
      setQrCodes((prev) =>
        prev.map((q) => (q.id === qrEditando.id ? qrData : q))
      );
    } else {
      setQrCodes((prev) => [...prev, qrData]);
    }

    // Reset form
    setFormData({
      nome: "",
      tipo: "produto",
      produtoId: "",
      categoriaId: "",
      filialId: "",
      descricao: "",
      urlPersonalizada: "",
      corPrincipal: "#007bff",
      corSecundaria: "#ffffff",
      tamanho: "200",
      formato: "png",
    });

    setShowGerador(false);
    setQrEditando(null);
    alert(
      qrEditando
        ? "QR Code atualizado com sucesso!"
        : "QR Code gerado com sucesso!"
    );
  };

  const handleEditar = (qr) => {
    setFormData(qr);
    setQrEditando(qr);
    setShowGerador(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este QR Code?")) {
      setQrCodes((prev) => prev.filter((q) => q.id !== id));
      alert("QR Code excluído com sucesso!");
    }
  };

  const handleCancelar = () => {
    setShowGerador(false);
    setQrEditando(null);
    setFormData({
      nome: "",
      tipo: "produto",
      produtoId: "",
      categoriaId: "",
      filialId: "",
      descricao: "",
      urlPersonalizada: "",
      corPrincipal: "#007bff",
      corSecundaria: "#ffffff",
      tamanho: "200",
      formato: "png",
    });
  };

  const handleDownload = (qr, formato) => {
    // Simular download
    const link = document.createElement("a");
    link.href = qr.qrImage;
    link.download = `qrcode-${qr.nome}.${formato}`;
    link.click();
    alert(`QR Code "${qr.nome}" baixado em formato ${formato.toUpperCase()}!`);
  };

  const getNomeDestino = (qr) => {
    switch (qr.tipo) {
      case "produto":
        const produto = produtos.find((p) => p.id.toString() === qr.produtoId);
        return produto ? produto.nome : "Produto não encontrado";
      case "categoria":
        const categoria = categorias.find(
          (c) => c.id.toString() === qr.categoriaId
        );
        return categoria ? categoria.nome : "Categoria não encontrada";
      case "filial":
        const filial = filiais.find((f) => f.id.toString() === qr.filialId);
        return filial ? filial.nome : "Filial não encontrada";
      case "personalizado":
        return "URL Personalizada";
      default:
        return "Geral";
    }
  };

  const getTipoBadge = (tipo) => {
    const tipos = {
      produto: { label: "📦 Produto", cor: "#007bff" },
      categoria: { label: "📂 Categoria", cor: "#28a745" },
      filial: { label: "🏪 Filial", cor: "#ffc107" },
      personalizado: { label: "🔗 Personalizado", cor: "#6f42c1" },
      geral: { label: "🌐 Geral", cor: "#6c757d" },
    };

    const tipoInfo = tipos[tipo] || tipos.geral;

    return (
      <span
        style={{
          backgroundColor: tipoInfo.cor + "20",
          color: tipoInfo.cor,
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: "600",
          border: `1px solid ${tipoInfo.cor}`,
        }}
      >
        {tipoInfo.label}
      </span>
    );
  };

  const qrCodesFiltrados = qrCodes.filter(
    (qr) => filtroTipo === "todos" || qr.tipo === filtroTipo
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔳 Gerador de QR Codes</h1>
          <p style={styles.subtitle}>
            Crie QR Codes para seus consultores scanearem
          </p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{qrCodes.length}</span>
            <span style={styles.statLabel}>QR Codes</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {qrCodes.reduce((total, qr) => total + qr.scans, 0)}
            </span>
            <span style={styles.statLabel}>Scans Totais</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {qrCodes.filter((qr) => qr.scans > 0).length}
            </span>
            <span style={styles.statLabel}>Com Scans</span>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div style={styles.filters}>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="todos">🔳 Todos os tipos</option>
          <option value="produto">📦 Produtos</option>
          <option value="categoria">📂 Categorias</option>
          <option value="filial">🏪 Filiais</option>
          <option value="personalizado">🔗 Personalizados</option>
        </select>

        <button style={styles.addButton} onClick={() => setShowGerador(true)}>
          ➕ Novo QR Code
        </button>
      </div>

      {/* Gerador de QR Code */}
      {showGerador && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {qrEditando ? "✏️ Editar QR Code" : "🔳 Novo QR Code"}
          </h2>

          <form onSubmit={gerarQRCode} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Informações Básicas */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Informações Básicas</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome do QR Code *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Ex: QR Code Promocional Verão"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de QR Code *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                  >
                    <option value="produto">📦 Produto Específico</option>
                    <option value="categoria">📂 Categoria de Produtos</option>
                    <option value="filial">🏪 Filial Específica</option>
                    <option value="personalizado">🔗 URL Personalizada</option>
                  </select>
                </div>

                {formData.tipo === "produto" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Selecionar Produto *</label>
                    <select
                      name="produtoId"
                      value={formData.produtoId}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} ({produto.categoria})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.tipo === "categoria" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Selecionar Categoria *</label>
                    <select
                      name="categoriaId"
                      value={formData.categoriaId}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.tipo === "filial" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Selecionar Filial *</label>
                    <select
                      name="filialId"
                      value={formData.filialId}
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
                )}

                {formData.tipo === "personalizado" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>URL Personalizada *</label>
                    <input
                      type="url"
                      name="urlPersonalizada"
                      value={formData.urlPersonalizada}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="https://exemplo.com/promocao"
                      required
                    />
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Descreva para que serve este QR Code..."
                  />
                </div>
              </div>

              {/* Personalização do QR Code */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Personalização</h3>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cor Principal</label>
                    <div style={styles.colorInputContainer}>
                      <input
                        type="color"
                        name="corPrincipal"
                        value={formData.corPrincipal}
                        onChange={handleInputChange}
                        style={styles.colorInput}
                      />
                      <span style={styles.colorValue}>
                        {formData.corPrincipal}
                      </span>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cor de Fundo</label>
                    <div style={styles.colorInputContainer}>
                      <input
                        type="color"
                        name="corSecundaria"
                        value={formData.corSecundaria}
                        onChange={handleInputChange}
                        style={styles.colorInput}
                      />
                      <span style={styles.colorValue}>
                        {formData.corSecundaria}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tamanho (pixels)</label>
                  <select
                    name="tamanho"
                    value={formData.tamanho}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="150">150x150 (Pequeno)</option>
                    <option value="200">200x200 (Médio)</option>
                    <option value="250">250x250 (Grande)</option>
                    <option value="300">300x300 (Extra Grande)</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Formato de Download</label>
                  <select
                    name="formato"
                    value={formData.formato}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="png">PNG (Recomendado)</option>
                    <option value="jpg">JPG</option>
                    <option value="svg">SVG (Vetorial)</option>
                  </select>
                </div>

                {/* Preview do QR Code */}
                {formData.nome && (
                  <div style={styles.previewSection}>
                    <h4 style={styles.previewTitle}>Pré-visualização</h4>
                    <div style={styles.qrPreview}>
                      <div style={styles.qrImageContainer}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=preview&color=${formData.corPrincipal.replace(
                            "#",
                            ""
                          )}&bgcolor=${formData.corSecundaria.replace(
                            "#",
                            ""
                          )}`}
                          alt="Preview QR Code"
                          style={styles.qrImage}
                        />
                      </div>
                      <div style={styles.previewInfo}>
                        <p>
                          <strong>Nome:</strong> {formData.nome}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {formData.tipo}
                        </p>
                        <p>
                          <strong>Tamanho:</strong> {formData.tamanho}px
                        </p>
                        <p>
                          <strong>Cores:</strong> {formData.corPrincipal} /{" "}
                          {formData.corSecundaria}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                {qrEditando ? "Atualizar QR Code" : "Gerar QR Code"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de QR Codes */}
      {!showGerador && (
        <div style={styles.listaContainer}>
          <h2 style={styles.listaTitle}>
            Meus QR Codes ({qrCodesFiltrados.length})
          </h2>

          {qrCodes.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔳</div>
              <h3 style={styles.emptyTitle}>Nenhum QR Code gerado</h3>
              <p style={styles.emptyText}>
                Crie seu primeiro QR Code para consultores scanearem.
              </p>
              <button
                style={styles.addButton}
                onClick={() => setShowGerador(true)}
              >
                ➕ Criar Primeiro QR Code
              </button>
            </div>
          ) : (
            <div style={styles.qrCodesGrid}>
              {qrCodesFiltrados.map((qr) => (
                <div key={qr.id} style={styles.qrCard}>
                  <div style={styles.qrHeader}>
                    <h3 style={styles.qrNome}>{qr.nome}</h3>
                    <div style={styles.qrBadges}>
                      {getTipoBadge(qr.tipo)}
                      <span style={styles.scansBadge}>👁️ {qr.scans} scans</span>
                    </div>
                  </div>

                  {qr.descricao && (
                    <p style={styles.qrDescricao}>{qr.descricao}</p>
                  )}

                  <div style={styles.qrContent}>
                    <div style={styles.qrImageSide}>
                      <img
                        src={qr.qrImage}
                        alt={`QR Code ${qr.nome}`}
                        style={styles.qrImageDisplay}
                      />
                    </div>

                    <div style={styles.qrInfoSide}>
                      <div style={styles.qrInfo}>
                        <p>
                          <strong>Destino:</strong> {getNomeDestino(qr)}
                        </p>
                        <p>
                          <strong>URL:</strong>
                          <span style={styles.urlText}>{qr.url}</span>
                        </p>
                        <p>
                          <strong>Criado em:</strong>{" "}
                          {new Date(qr.dataCriacao).toLocaleDateString("pt-BR")}
                        </p>
                        <p>
                          <strong>Código:</strong> <code>{qr.codigo}</code>
                        </p>
                      </div>

                      <div style={styles.downloadButtons}>
                        <button
                          onClick={() => handleDownload(qr, "png")}
                          style={styles.downloadButton}
                        >
                          📥 PNG
                        </button>
                        <button
                          onClick={() => handleDownload(qr, "jpg")}
                          style={styles.downloadButton}
                        >
                          📥 JPG
                        </button>
                        <button
                          onClick={() => handleDownload(qr, "svg")}
                          style={styles.downloadButton}
                        >
                          📥 SVG
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={styles.qrActions}>
                    <button
                      onClick={() => handleEditar(qr)}
                      style={styles.editButton}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(qr.id)}
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

// Estilos (mantendo padrão profissional)
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
    gridTemplateColumns: "1fr 1fr",
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
  colorInputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  colorInput: {
    width: "50px",
    height: "40px",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    cursor: "pointer",
  },
  colorValue: {
    fontSize: "0.9rem",
    color: "#666",
    fontWeight: "500",
  },
  previewSection: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "2px dashed #e0e0e0",
  },
  previewTitle: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "15px",
    fontWeight: "600",
  },
  qrPreview: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  qrImageContainer: {
    flexShrink: 0,
  },
  qrImage: {
    width: "150px",
    height: "150px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
  },
  previewInfo: {
    flex: 1,
  },
  previewInfoP: {
    // Adicionada a vírgula e renomeado para evitar conflito com o React Native style
    margin: "5px 0",
    fontSize: "0.9rem",
    color: "#555",
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
  qrCodesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
    gap: "20px",
  },
  qrCard: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
    transition: "transform 0.2s ease",
  },
  qrHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "10px",
  },
  qrNome: {
    fontSize: "1.3rem",
    color: "#333",
    margin: 0,
    fontWeight: "600",
    flex: 1,
  },
  qrBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  scansBadge: {
    backgroundColor: "#6f42c1",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  qrDescricao: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "20px",
    lineHeight: "1.4",
  },
  qrContent: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  qrImageSide: {
    textAlign: "center",
  },
  qrImageDisplay: {
    width: "150px",
    height: "150px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
  },
  qrInfoSide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  qrInfo: {
    marginBottom: "15px",
  },
  qrInfoP: {
    // Adicionada a vírgula e renomeado para evitar conflito com o React Native style
    margin: "5px 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  urlText: {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    backgroundColor: "#e9ecef",
    padding: "2px 6px",
    borderRadius: "4px",
    wordBreak: "break-all",
  },
  downloadButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  downloadButton: {
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  qrActions: {
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

export default LojistaQRCode;
