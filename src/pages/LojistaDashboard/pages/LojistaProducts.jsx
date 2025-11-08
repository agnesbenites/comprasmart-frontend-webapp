// src/pages/LojistaProdutos.jsx (Versão Final com Supabase CRUD)

import React, { useState, useEffect } from "react";
// 🆕 Importe o cliente Supabase do frontend
// import { supabase } from "./supabaseClient";

// ⚠️ URL BASE DO SEU BACKEND (MUDE PARA O ENDPOINT DO RENDER EM PRODUÇÃO!)
const API_BASE_URL = "http://localhost:5000";
// Você pode substituir por seu Render URL:
// const API_BASE_URL = "https://plataforma-consultoria-mvp.onrender.com";

// =========================================================================
// SIMULAÇÃO DO CLIENTE SUPABASE (REMOVA ESTE BLOCO SE USAR O ARQUIVO REAL)
const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null, order: () => ({ data: [] }) }),
    insert: () => ({ data: [{ id: Date.now() }], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null }),
  }),
};
// =========================================================================

const LojistaProdutos = () => {
  // Estado Principal
  const [showForm, setShowForm] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null); // Novo Estado para o Modo de Cadastro/Integração
  const [modoCadastro, setModoCadastro] = useState("lista"); // 'lista', 'manual', 'csv', 'erp'
  const [csvFile, setCsvFile] = useState(null); // Para o arquivo CSV

  // 🆕 ESTADOS DE INTEGRAÇÃO
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({
    text: "",
    isError: false,
  });

  const [categorias, setCategorias] = useState([
    { id: 1, nome: "📱 Eletrônicos & Tecnologia", cor: "#007bff" },
    { id: 2, nome: "🛋️ Móveis & Decoração", cor: "#28a745" },
    { id: 3, nome: "📚 Livros & Papelaria", cor: "#ffc107" },
    { id: 4, nome: "👗 Moda & Acessórios", cor: "#e83e8c" },
    { id: 5, nome: "🏠 Casa, Mesa e Banho", cor: "#6f42c1" },
    { id: 6, nome: "🎮 Games & Consoles", cor: "#dc3545" },
    { id: 7, nome: "🛠️ Ferramentas & Construção", cor: "#fd7e14" },
    { id: 8, nome: "🚗 Automotivo", cor: "#17a2b8" },
    { id: 9, nome: "👶 Bebê & Infantil", cor: "#e91e63" },
    { id: 10, nome: "💪 Esportes & Fitness", cor: "#00bcd4" },
    { id: 11, nome: "💄 Perfumaria & Cosméticos", cor: "#673ab7" },
    { id: 12, nome: "🥕 Alimentos & Bebidas", cor: "#8bc34a" },
  ]);
  const [produtos, setProdutos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [busca, setBusca] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    preco: "",
    precoCusto: "",
    estoque: "",
    estoqueMinimo: "5",
    comissao: "10",
    tamanho: "",
    cor: "",
    peso: "",
    imagem: null,
    sku: "",
    status: "ativo",
  }); // 🆕 C: FETCH/READ - LER DADOS

  // -------------------------------------------------------------------------
  // 🆕 FUNÇÕES DE INTEGRAÇÃO SUPABASE
  // -------------------------------------------------------------------------

  const fetchProdutos = async () => {
    setLoading(true);
    setApiError(null);

    // Mapeia os campos de snake_case para camelCase (opcional, mas recomendado para JS)
    const columns = `
            id, nome, sku, categoria, descricao, 
            preco, preco_custo:precoCusto, estoque, 
            estoque_minimo:estoqueMinimo, comissao, 
            tamanho, cor, peso, status, imagem_url:imagemUrl, 
            data_cadastro:dataCadastro
        `;

    const { data, error } = await supabase
      .from("produtos")
      .select(columns)
      .order("data_cadastro", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      setApiError(
        "Não foi possível carregar os produtos. Verifique a conexão com o DB e RLS."
      );
      setProdutos([]);
    } else {
      setProdutos(data);
    }
    setLoading(false);
  };

  // Chama a busca ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []);

  // 🆕 C: CREATE / U: UPDATE - CRIAR/EDITAR PRODUTO MANUALMENTE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isEditing = !!editingProduto;

    // Prepara os dados para o Supabase (usa snake_case para o DB)
    const produtoPayload = {
      nome: formData.nome,
      sku: formData.sku || null,
      categoria: parseInt(formData.categoria),
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      preco_custo: parseFloat(formData.precoCusto || 0), // snake_case
      estoque: parseInt(formData.estoque),
      estoque_minimo: parseInt(formData.estoqueMinimo), // snake_case
      comissao: parseFloat(formData.comissao),
      tamanho: formData.tamanho,
      cor: formData.cor,
      peso: parseFloat(formData.peso || 0),
      status: formData.status,
      // Simulação de URL de imagem, em produção usaria o Supabase Storage
      imagem_url:
        formData.imagemUrl ||
        "https://placehold.co/300x300/007bff/ffffff?text=Produto",
    };

    let dbOperation;
    if (isEditing) {
      dbOperation = supabase
        .from("produtos")
        .update(produtoPayload)
        .eq("id", editingProduto.id)
        .select();
    } else {
      dbOperation = supabase.from("produtos").insert([produtoPayload]).select();
    }

    const { error } = await dbOperation;

    if (error) {
      alert(
        `Falha ao ${isEditing ? "atualizar" : "cadastrar"} produto: ${
          error.message
        }`
      );
      console.error(error);
    } else {
      alert(`Produto ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`);
      handleCancel();
      fetchProdutos(); // Recarrega a lista
    }
    setLoading(false);
  };

  // 🆕 D: DELETE - EXCLUIR PRODUTO
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("produtos").delete().eq("id", id);

    if (error) {
      alert(`Falha ao excluir produto: ${error.message}`);
      console.error(error);
    } else {
      alert("Produto excluído com sucesso!");
      fetchProdutos(); // Recarrega a lista
    }
    setLoading(false);
  }; // Funções de UI (handleInputChange, handleEdit, handleCancel, etc. permanecem as mesmas)

  // -------------------------------------------------------------------------
  // LÓGICA DE UPLOAD CSV
  // -------------------------------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEdit = (produto) => {
    setFormData({
      ...produto,
      precoCusto: produto.precoCusto || "", // Garante que seja string para o input
      estoqueMinimo: produto.estoqueMinimo || "5",
    });
    setEditingProduto(produto);
    setShowForm(true);
    setModoCadastro("manual");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduto(null);
    setFormData({
      nome: "",
      categoria: "",
      descricao: "",
      preco: "",
      precoCusto: "",
      estoque: "",
      estoqueMinimo: "5",
      comissao: "10",
      tamanho: "",
      cor: "",
      peso: "",
      imagem: null,
      sku: "",
      status: "ativo",
    });
    setModoCadastro("lista");
    setCsvFile(null);
    setUploadMessage({ text: "", isError: false });
  }; // 🆕 Lógica do Upload CSV (Conecta-se ao backend Node.js)

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setUploadMessage({ text: "", isError: false });
    } else if (file) {
      setCsvFile(null);
      setUploadMessage({
        text: "Por favor, selecione um arquivo CSV (.csv) válido.",
        isError: true,
      });
    }
  };

  const handleImportarCsv = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setUploadMessage({
        text: "Nenhum arquivo CSV selecionado.",
        isError: true,
      });
      return;
    }

    setIsUploading(true);
    setUploadMessage({
      text: "Enviando e processando arquivo no servidor...",
      isError: false,
    });

    const formData = new FormData();
    formData.append("csvFile", csvFile);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/lojistas/produtos/importar-csv`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.details ||
            "Erro desconhecido ao processar CSV no servidor."
        );
      }

      // Sucesso
      setUploadMessage({
        text: `Importação concluída! ${data.totalInseridoOuAtualizado} produtos foram inseridos/atualizados.`,
        isError: false,
      });
      setCsvFile(null);
      fetchProdutos(); // 🎯 Chamar a função real para recarregar do Supabase
    } catch (error) {
      console.error("Erro na Importação:", error);
      setUploadMessage({
        text: `Falha na importação: ${error.message}`,
        isError: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------------------------
  // LÓGICA DE FILTROS E AJUDAS (PERMANECE IGUAL)
  // -------------------------------------------------------------------------

  const produtosFiltrados = produtos.filter((produto) => {
    const matchCategoria =
      filtroCategoria === "todas" || produto.categoria === filtroCategoria;
    const matchBusca =
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const getCategoriaInfo = (categoriaId) => {
    return (
      categorias.find((c) => c.id.toString() === categoriaId) || {
        nome: "Sem Categoria",
        cor: "#6c757d",
      }
    );
  };

  const getStatusBadge = (status, estoque, estoqueMinimo) => {
    if (status === "inativo") {
      return <span style={styles.badgeInativo}>❌ Inativo</span>;
    }

    if (parseInt(estoque) === 0) {
      return <span style={styles.badgeEsgotado}>🚫 Esgotado</span>;
    }

    if (parseInt(estoque) <= parseInt(estoqueMinimo)) {
      return <span style={styles.badgeEstoqueBaixo}>⚠️ Estoque Baixo</span>;
    }

    return <span style={styles.badgeAtivo}>✅ Ativo</span>;
  };

  const calcularComissao = (preco, percentual) => {
    return ((parseFloat(preco) * parseFloat(percentual)) / 100).toFixed(2);
  };

  // 🆕 Componente de Mensagem de Upload
  const UploadMessageComponent = () =>
    uploadMessage.text && (
      <div style={styles.message(uploadMessage.isError)}>
        {uploadMessage.text}
      </div>
    );

  // -------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // -------------------------------------------------------------------------

  return (
    <div style={styles.container}>
                  {/* Header */}           {" "}
      <div style={styles.header}>
                               {" "}
        <div>
                             {" "}
          <h1 style={styles.title}>📦 Gestão de Produtos</h1>                   {" "}
          <p style={styles.subtitle}>
                                    Cadastre e gerencie seu catálogo de produtos
                               {" "}
          </p>
                                   {" "}
        </div>
                               {" "}
        <div style={styles.stats}>
                                       {" "}
          <div style={styles.statCard}>
                                   {" "}
            <span style={styles.statNumber}>{produtos.length}</span>           
                        <span style={styles.statLabel}>Total</span>             
                 {" "}
          </div>
                                       {" "}
          <div style={styles.statCard}>
                                               {" "}
            <span style={styles.statNumber}>
                                                       {" "}
              {
                produtos.filter(
                  (p) => p.status === "ativo" && parseInt(p.estoque) > 0
                ).length
              }
                                                   {" "}
            </span>
                                    <span style={styles.statLabel}>Ativos</span>
                               {" "}
          </div>
                                       {" "}
          <div style={styles.statCard}>
                                               {" "}
            <span style={styles.statNumber}>
                                                       {" "}
              {
                produtos.filter(
                  (p) => parseInt(p.estoque) <= parseInt(p.estoqueMinimo)
                ).length
              }
                                                   {" "}
            </span>
                                   {" "}
            <span style={styles.statLabel}>Estoque Baixo</span>                 
                         {" "}
          </div>
                                   {" "}
        </div>
                           {" "}
      </div>
            <hr style={styles.hr} />     {" "}
      {/* Opções de Modo / Filtros e Busca */}                 {" "}
      <div style={styles.filters}>
                               {" "}
        <div style={styles.searchBox}>
                                       {" "}
          <input
            type="text"
            placeholder="🔍 Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
                                   {" "}
        </div>
                               {" "}
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={styles.filterSelect}
        >
                             {" "}
          <option value="todas">📂 Todas as categorias</option>                 
                     {" "}
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
                                          {cat.nome}                       {" "}
            </option>
          ))}
                                   {" "}
        </select>
                               {" "}
        <button
          style={styles.addButton}
          onClick={() => {
            setShowForm(true);
            setModoCadastro("manual");
          }}
        >
                              ➕ Novo Produto                {" "}
        </button>
               {" "}
        <button
          style={{ ...styles.addButton, backgroundColor: "#17a2b8" }}
          onClick={() => {
            setShowForm(false);
            setModoCadastro("csv");
          }}
        >
                    ⬆️ Importar CSV        {" "}
        </button>
               {" "}
        <button
          style={{ ...styles.addButton, backgroundColor: "#6f42c1" }}
          onClick={() => {
            setShowForm(false);
            setModoCadastro("erp");
          }}
        >
                    🔗 Integração ERP/Odoo        {" "}
        </button>
                           {" "}
      </div>
            <hr style={styles.hr} />      {/* Formulário de Cadastro Manual */} 
               {" "}
      {showForm && modoCadastro === "manual" && (
        <div style={styles.formContainer}>
                                       {" "}
          <h2 style={styles.formTitle}>
                                               {" "}
            {editingProduto
              ? "✏️ Editar Produto (Manual)"
              : "📦 Novo Produto (Manual)"}
                                           {" "}
          </h2>
                                       {" "}
          <form onSubmit={handleSubmit} style={styles.form}>
                                               {" "}
            <div style={styles.formGrid}>
                                          {/* Informações Básicas */}           
                             {" "}
              <div style={styles.formSection}>
                                                               {" "}
                <h3 style={styles.sectionTitle}>Informações Básicas</h3>       
                                                       {" "}
                <div style={styles.formGroup}>
                                                                       {" "}
                  <label style={styles.label}>Nome do Produto *</label>
                                                                       {" "}
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formRow}>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Categoria *</label>             
                                                                 {" "}
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      style={styles.select}
                      required
                    >
                                                                               
                              <option value="">Selecione uma categoria</option> 
                                                                               
                           {" "}
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                                                                             {" "}
                          {cat.nome}                                           
                                                       {" "}
                        </option>
                      ))}
                                                                               
                         {" "}
                    </select>
                                                                           {" "}
                  </div>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                           {" "}
                    <label style={styles.label}>SKU</label>
                                                                               {" "}
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Código único"
                    />
                                                                           {" "}
                  </div>
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formGroup}>
                                                                       {" "}
                  <label style={styles.label}>Descrição</label>
                                                                       {" "}
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Descreva o produto..."
                  />
                                                                   {" "}
                </div>
                                                           {" "}
              </div>
                                          {/* Preços e Comissão */}             
                           {" "}
              <div style={styles.formSection}>
                                                               {" "}
                <h3 style={styles.sectionTitle}>Preços e Comissão</h3>         
                                                     {" "}
                <div style={styles.formRow}>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Preço de Venda (R$) *</label>
                                                                               {" "}
                    <input
                      type="number"
                      step="0.01"
                      name="preco"
                      value={formData.preco}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                                                                           {" "}
                  </div>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Preço de Custo (R$)</label>
                                                                               {" "}
                    <input
                      type="number"
                      step="0.01"
                      name="precoCusto"
                      value={formData.precoCusto}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                                                                           {" "}
                  </div>
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formGroup}>
                                                                       {" "}
                  <label style={styles.label}>
                                                            Comissão para
                    Consultores (%) *                                          
                                     {" "}
                    <span style={styles.helpText}>
                                                                               
                              Percentual                       sobre o preço de
                      venda                                        {" "}
                    </span>
                                                                           {" "}
                  </label>
                                                                       {" "}
                  <input
                    type="number"
                    step="0.1"
                    name="comissao"
                    value={formData.comissao}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                                                                       {" "}
                  {formData.preco && (
                    <div style={styles.comissaoPreview}>
                                                                  💰 Comissão
                      por venda:                                                
                                       {" "}
                      <strong>
                                                                        R$      
                                         {" "}
                        {calcularComissao(formData.preco, formData.comissao)}   
                                                                               
                               {" "}
                      </strong>
                                                                               
                         {" "}
                    </div>
                  )}
                                                                   {" "}
                </div>
                                                           {" "}
              </div>
                                          {/* Estoque e Detalhes */}           
                             {" "}
              <div style={styles.formSection}>
                                                               {" "}
                <h3 style={styles.sectionTitle}>Estoque e Detalhes</h3>         
                                                     {" "}
                <div style={styles.formRow}>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Estoque Disponível *</label>
                                                                               {" "}
                    <input
                      type="number"
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                                                                           {" "}
                  </div>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Estoque Mínimo</label>
                                                                               {" "}
                    <input
                      type="number"
                      name="estoqueMinimo"
                      value={formData.estoqueMinimo}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                                                                           {" "}
                  </div>
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formRow}>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                                               {" "}
                    <label style={styles.label}>Tamanho</label>
                                                                               {" "}
                    <input
                      type="text"
                      name="tamanho"
                      value={formData.tamanho}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="P, M, G, 42, etc."
                    />
                                                                           {" "}
                  </div>
                                                                       {" "}
                  <div style={styles.formGroup}>
                                                           {" "}
                    <label style={styles.label}>Cor</label>
                                                                               {" "}
                    <input
                      type="text"
                      name="cor"
                      value={formData.cor}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Vermelho, Azul, etc."
                    />
                                                                           {" "}
                  </div>
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formGroup}>
                                                                       {" "}
                  <label style={styles.label}>Peso (kg)</label>
                                                                       {" "}
                  <input
                    type="number"
                    step="0.01"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                                                                   {" "}
                </div>
                                                               {" "}
                <div style={styles.formGroup}>
                                                     {" "}
                  <label style={styles.label}>Status</label>                   
                                                   {" "}
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                                                           {" "}
                    <option value="ativo">✅ Ativo</option>                     
                                                         {" "}
                    <option value="inativo">❌ Inativo</option>                 
                                     {" "}
                  </select>
                                                                   {" "}
                </div>
                                                           {" "}
              </div>
                                          {/* Imagem */}                       
                 {" "}
              <div style={styles.formSection}>
                                                               {" "}
                <h3 style={styles.sectionTitle}>Imagem do Produto</h3>         
                                                     {" "}
                <div style={styles.formGroup}>
                                                                       {" "}
                  <label style={styles.label}>
                                                            Upload da Imagem    
                                                       {" "}
                    <span style={styles.helpText}>
                                                                               
                              (JPEG, PNG -                       máximo 5MB)    
                                                         {" "}
                    </span>
                                                                           {" "}
                  </label>
                                                                       {" "}
                  <input
                    type="file"
                    name="imagem"
                    onChange={handleInputChange}
                    style={styles.fileInput}
                    accept=".jpg,.jpeg,.png"
                  />
                                                                   {" "}
                </div>
                                                               {" "}
                {formData.imagem && (
                  <div style={styles.imagePreview}>
                                                                               {" "}
                    <img
                      src={URL.createObjectURL(formData.imagem)}
                      alt="Preview"
                      style={styles.previewImage}
                    />
                                                                           {" "}
                  </div>
                )}
                                                           {" "}
              </div>
                                                   {" "}
            </div>
                                               {" "}
            <div style={styles.formActions}>
                                                       {" "}
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                                                Cancelar                        
                   {" "}
              </button>
                                                       {" "}
              <button type="submit" style={styles.submitButton}>
                                                               {" "}
                {editingProduto ? "Atualizar Produto" : "Cadastrar Produto"}   
                                                       {" "}
              </button>
                                                   {" "}
            </div>
                                           {" "}
          </form>
                                   {" "}
        </div>
      )}
            {/* Opção de Importação CSV */}     {" "}
      {modoCadastro === "csv" && (
        <div
          style={{
            ...styles.formContainer,
            border: "2px solid #17a2b8",
            backgroundColor: "#e8f7f9",
          }}
        >
                   {" "}
          <h2 style={styles.formTitle}>⬆️ Importar Produtos por CSV</h2>       
           {" "}
          <p style={styles.subtitle}>
                        Use o seu arquivo **`planilha-produtos-modelo.csv`**
            para             importação.          {" "}
          </p>
                   {" "}
          <p style={styles.helpText}>
                        **Recomendação:** Baixe o modelo e preencha as colunas.
            Os dados             serão mapeados para o cadastro manual (nome,
            categoria, preco,             estoque, sku, etc.).          {" "}
          </p>
                   {" "}
          <a
            href="[LINK PÚBLICO DO SEU CSV NO SUPABASE]"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.helpText,
              color: "#007bff",
              display: "block",
              marginBottom: "15px",
            }}
          >
                        📥 Baixar Modelo CSV (Link do Supabase Storage)        
             {" "}
          </a>
                   {" "}
          <form
            onSubmit={handleImportarCsv}
            style={{ ...styles.form, maxWidth: "100%", padding: 0 }}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Selecionar Arquivo CSV *
                <span style={styles.helpText}>
                  (O arquivo não deve exceder 5MB)
                </span>
              </label>
              <input
                type="file"
                onChange={handleCsvUpload}
                style={styles.fileInput}
                accept=".csv"
                required
              />
              {csvFile && (
                <p
                  style={{
                    ...styles.helpText,
                    margin: "5px 0 0 0",
                    color: "#17a2b8",
                  }}
                >
                  Arquivo selecionado: **{csvFile.name}**
                </p>
              )}
            </div>

            <div style={styles.formActions}>
              {/* Exibe a mensagem de upload (sucesso ou erro) */}
              {uploadMessage.text && (
                <div
                  style={{
                    ...styles.message(uploadMessage.isError),
                    marginRight: "auto",
                    textAlign: "left",
                    minWidth: "200px",
                  }}
                >
                  {uploadMessage.text}
                </div>
              )}
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={isUploading}
              >
                Voltar
              </button>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  backgroundColor: isUploading ? "#6c757d" : "#17a2b8",
                }}
                disabled={!csvFile || isUploading}
              >
                {isUploading ? "🔄 Processando..." : "Processar e Importar CSV"}
              </button>
            </div>
          </form>
                 {" "}
        </div>
      )}
            {/* Opção de Integração ERP/Odoo */}     {" "}
      {modoCadastro === "erp" && (
        <div
          style={{
            ...styles.formContainer,
            border: "2px solid #6f42c1",
            backgroundColor: "#f5f0fb",
          }}
        >
                    <h2 style={styles.formTitle}>🔗 Integração com Odoo/ERP</h2>
                   {" "}
          <p style={styles.subtitle}>
                        Configure a conexão para sincronizar automaticamente
            seus produtos e             estoque.          {" "}
          </p>
                   {" "}
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "20px",
              backgroundColor: "white",
            }}
          >
                       {" "}
            <h3 style={styles.sectionTitle}>
                            Chaves de Sincronização Necessárias            {" "}
            </h3>
                       {" "}
            <p style={styles.helpText}>
                            **Os dados buscados do ERP (Odoo, etc.) devem mapear
              para os               campos existentes no cadastro manual:**    
                     {" "}
            </p>
                       {" "}
            <ul
              style={{
                listStyleType: "disc",
                marginLeft: "20px",
                fontSize: "0.95rem",
                color: "#555",
              }}
            >
                           {" "}
              <li>**SKU/Código do Produto (Identificador Único)**</li>         
                 {" "}
              <li>
                                **Nome, Descrição, ID da Categoria (Baseado nos
                IDs 1-12)**              {" "}
              </li>
                           {" "}
              <li>**Preço de Venda, Preço de Custo, Comissão (%)**</li>         
                 {" "}
              <li>
                                **Estoque Disponível (Fundamental para Gestão
                Integrada)**              {" "}
              </li>
                           {" "}
              <li>**Estoque Mínimo, Tamanho, Cor, Peso, Status**</li>           
                <li>**URL da Imagem do Produto**</li>           {" "}
            </ul>
                       {" "}
            <p
              style={{
                marginTop: "15px",
                color: "#dc3545",
                fontWeight: "bold",
              }}
            >
                            ⚠️ Atenção: Esta funcionalidade exige a
              implementação de um               **backend** para consumir a
              API/Webhook do seu ERP (Odoo, Bling,               etc.) e
              garantir a sincronização de estoque em tempo real.            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div style={styles.formActions}>
                       {" "}
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
                            Voltar à Lista            {" "}
            </button>
                       {" "}
            <button
              type="button"
              style={{ ...styles.submitButton, backgroundColor: "#6f42c1" }}
              disabled
            >
                            Configurar Conexão (Desenvolvimento de API)        
                 {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
                  {/* Lista de Produtos */}           {" "}
      {modoCadastro === "lista" && (
        <div style={styles.listaContainer}>
                                       {" "}
          <h2 style={styles.listaTitle}>
                                    Catálogo de Produtos (
            {produtosFiltrados.length})                                {" "}
          </h2>
          {loading && (
            <p style={styles.loadingText}>🔄 Carregando produtos...</p>
          )}
          {apiError && <p style={styles.apiError}>{apiError}</p>}               
                       {" "}
          {!loading && produtos.length === 0 ? (
            <div style={styles.emptyState}>
                                          <div style={styles.emptyIcon}>📦</div>
                                         {" "}
              <h3 style={styles.emptyTitle}>Nenhum produto cadastrado</h3>     
                                                 {" "}
              <p style={styles.emptyText}>
                                                Comece cadastrando seus
                primeiros produtos para                 vender.                
                           {" "}
              </p>
                                                       {" "}
              <button
                style={styles.addButton}
                onClick={() => {
                  setShowForm(true);
                  setModoCadastro("manual");
                }}
              >
                                                ➕ Adicionar Primeiro Produto  
                                         {" "}
              </button>
                                                   {" "}
            </div>
          ) : (
            <div style={styles.produtosGrid}>
                                                       {" "}
              {produtosFiltrados.map((produto) => {
                const categoriaInfo = getCategoriaInfo(produto.categoria);
                return (
                  <div key={produto.id} style={styles.produtoCard}>
                                                                               {" "}
                    <div style={styles.produtoImage}>
                                                                               
                             {" "}
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        style={styles.produtoImg}
                      />
                                                                               
                         {" "}
                    </div>
                                                                               {" "}
                    <div style={styles.produtoInfo}>
                                                                               
                             {" "}
                      <div style={styles.produtoHeader}>
                                                                               
                                       {" "}
                        <h3 style={styles.produtoNome}>{produto.nome}</h3>     
                                                                               
                                 {" "}
                        <div style={styles.produtoBadges}>
                                                                               
                                                 {" "}
                          <span
                            style={{
                              ...styles.categoriaBadge,
                              backgroundColor: categoriaInfo.cor + "20",
                              color: categoriaInfo.cor,
                              borderColor: categoriaInfo.cor,
                            }}
                          >
                                                                               
                                {categoriaInfo.nome}                           
                                                                               {" "}
                          </span>
                                                                               
                                                 {" "}
                          {getStatusBadge(
                            produto.status,
                            produto.estoque,
                            produto.estoqueMinimo
                          )}
                                                                               
                                             {" "}
                        </div>
                                                                               
                                   {" "}
                      </div>
                                                                               
                             {" "}
                      {produto.descricao && (
                        <p style={styles.produtoDescricao}>
                                                                             {" "}
                          {produto.descricao}                                   
                                                               {" "}
                        </p>
                      )}
                                                                               
                             {" "}
                      <div style={styles.produtoDetalhes}>
                                                                               
                                       {" "}
                        <div style={styles.detalheItem}>
                                                                             {" "}
                          <strong>Preço:</strong> R$                            
                                                                           {" "}
                          {parseFloat(produto.preco).toFixed(2)}               
                                                                               
                             {" "}
                        </div>
                                                                               
                                       {" "}
                        <div style={styles.detalheItem}>
                                                                             {" "}
                          <strong>Comissão:</strong>                          {" "}
                          {produto.comissao}% (R$                              
                                               {" "}
                          {calcularComissao(produto.preco, produto.comissao)})  
                                                                               
                                           {" "}
                        </div>
                                                                               
                                       {" "}
                        <div style={styles.detalheItem}>
                                                                             {" "}
                          <strong>Estoque:</strong>                          {" "}
                          {produto.estoque} unidades                            
                                             {" "}
                        </div>
                                                                               
                                       {" "}
                        {produto.tamanho && (
                          <div style={styles.detalheItem}>
                                                                               
                                                           {" "}
                            <strong>Tamanho:</strong> {produto.tamanho}         
                                                                               
                                             {" "}
                          </div>
                        )}
                                                                               
                                       {" "}
                        {produto.cor && (
                          <div style={styles.detalheItem}>
                                                                               
                                <strong>Cor:</strong>                          
                              {produto.cor}                                     
                                         {" "}
                          </div>
                        )}
                                                                               
                                   {" "}
                      </div>
                                                                               
                             {" "}
                      <div style={styles.produtoActions}>
                                                                               
                                       {" "}
                        <button
                          onClick={() => handleEdit(produto)}
                          style={styles.editButton}
                        >
                                                                              ✏️
                          Editar                                                
                                                   {" "}
                        </button>
                                                                               
                                       {" "}
                        <button
                          onClick={() => handleDelete(produto.id)}
                          style={styles.deleteButton}
                        >
                                                                              🗑️
                          Excluir                                              
                                                     {" "}
                        </button>
                                                                               
                                   {" "}
                      </div>
                                                                               
                         {" "}
                    </div>
                                                                           {" "}
                  </div>
                );
              })}
                                                   {" "}
            </div>
          )}
                                   {" "}
        </div>
      )}
                   {" "}
    </div>
  );
};

// Estilos (Adicionando os estilos de erro e carregamento)
const styles = {
  // ... (Seus estilos anteriores)
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
    marginBottom: "10px",
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
    gap: "10px",
    marginBottom: "30px",
    alignItems: "center",
    flexWrap: "wrap",
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
    padding: "12px 18px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background-color 0.2s",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e0e0e0",
    margin: "15px 0 30px 0",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },
  formTitle: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  formSection: {
    padding: "15px",
    border: "1px solid #f0f0f0",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "15px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "5px",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "15px",
  },
  formRow: {
    display: "flex",
    gap: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    color: "#333",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    backgroundColor: "white",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box",
    resize: "vertical",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "12px 25px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  submitButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
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
  badgeEsgotado: {
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid #dee2e6",
  },
  badgeEstoqueBaixo: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid #ffeaa7",
  },
  categoriaBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid",
  },
  helpText: {
    fontSize: "0.8rem",
    color: "#666",
    fontWeight: "normal",
    marginLeft: "5px",
  },
  comissaoPreview: {
    backgroundColor: "#e7f3ff",
    padding: "8px 12px",
    borderRadius: "6px",
    marginTop: "8px",
    fontSize: "0.9rem",
    border: "1px solid #b8daff",
  },
  fileInput: {
    width: "100%",
    padding: "12px 16px",
    border: "2px dashed #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  },
  imagePreview: {
    textAlign: "center",
    marginTop: "15px",
  },
  previewImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
  },
  produtosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  produtoCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.2s ease",
  },
  produtoImage: {
    height: "200px",
    overflow: "hidden",
  },
  produtoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  produtoInfo: {
    padding: "20px",
  },
  produtoHeader: {
    marginBottom: "15px",
  },
  produtoNome: {
    fontSize: "1.2rem",
    color: "#333",
    margin: "0 0 10px 0",
    fontWeight: "600",
  },
  produtoBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  produtoDescricao: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "15px",
    lineHeight: "1.4",
  },
  produtoDetalhes: {
    marginBottom: "20px",
  },
  detalheItem: {
    margin: "5px 0",
    fontSize: "0.9rem",
    color: "#555",
  },
  produtoActions: {
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
  emptyState: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginTop: "20px",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  emptyText: {
    color: "#666",
    marginBottom: "20px",
  },
  listaContainer: {
    marginBottom: "30px",
  },
  listaTitle: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "20px",
  },
  message: (isError) => ({
    padding: "10px 15px",
    borderRadius: "8px",
    marginTop: "15px",
    textAlign: "left",
    fontSize: "0.9rem",
    fontWeight: "500",
    backgroundColor: isError ? "#f8d7da" : "#d4edda",
    color: isError ? "#721c24" : "#155724",
    border: isError ? "1px solid #f5c6cb" : "1px solid #c3e6cb",
  }),
  loadingText: {
    textAlign: "center",
    padding: "20px",
    fontSize: "1.2rem",
    color: "#007bff",
  },
  apiError: {
    textAlign: "center",
    padding: "20px",
    fontSize: "1rem",
    color: "#dc3545",
    border: "1px solid #dc3545",
    borderRadius: "8px",
    backgroundColor: "#f8d7da",
  },
};

export default LojistaProdutos;
