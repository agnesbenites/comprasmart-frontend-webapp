import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { criarProduto } from "./produtos.service";

/* =========================
   OPÇÕES FIXAS (para Moda)
========================= */
const opcoesTipoModa = [
  { valor: "", label: "Selecione o tipo" },
  { valor: "roupas", label: "Roupas" },
  { valor: "sapatos", label: "Sapatos" },
];

const opcoesGenero = [
  { valor: "", label: "Selecione o gênero" },
  { valor: "feminino", label: "Feminino" },
  { valor: "masculino", label: "Masculino" },
  { valor: "sem-genero", label: "Sem Gênero" },
];

const opcoesFormaAjustada = [
  { valor: "", label: "Tamanho Padrão (Sem ajuste)" },
  { valor: "forma-maior", label: "Forma Maior que o Padrão" },
  { valor: "forma-menor", label: "Forma Menor que o Padrão" },
];

const opcoesRoupas = [
  "blusa", "camisa", "camiseta", "regata", "calca", "short", "saia",
  "vestido", "casaco", "jaqueta", "moletom", "bermuda",
  "lingerie", "roupa-intima", "pijama"
];

const opcoesSapatos = [
  "tenis", "sapato-social", "sandalia", "chinelo", "bota",
  "sapatilha", "rasteirinha", "scarpin", "tenis-corrida", "tenis-casual"
];

const tamanhosRoupas = ["PP", "P", "M", "G", "GG", "XG", "U"];
const tamanhosSapatos = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

/* =========================
   GERADOR DE SKU
========================= */
const gerarSKU = (produto) => {
  const categoriaLimpa = produto.categoria
    .replace(/[^\w\s]/gi, '')
    .trim()
    .substring(0, 3)
    .toUpperCase();
  
  const nomeLimpo = produto.nome
    .replace(/[^\w\s]/gi, '')
    .trim()
    .substring(0, 3)
    .toUpperCase();
  
  const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  
  return `${categoriaLimpa}-${nomeLimpo}-${codigo}${timestamp}`.substring(0, 20);
};

/* =========================
   GERADOR DE DESCRIÇÃO COM IA (GROQ - LLAMA)
========================= */
const gerarDescricaoIA = async (produto) => {
  try {
    // Verificar se tem API key
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('❌ API key do Groq não configurada.\n\n📝 Solução:\n1. Ir em https://console.groq.com/keys\n2. Criar conta grátis\n3. Gerar API key\n4. Adicionar no arquivo .env:\nVITE_GROQ_API_KEY=gsk_sua-chave\n5. Reiniciar o servidor (npm run dev)');
    }
    
    console.log('[IA] Gerando descrição com Groq (LLaMA)...');

    const prompt = `Você é um especialista em e-commerce. Crie uma descrição profissional e atrativa para este produto:

Produto: ${produto.nome}
Categoria: ${produto.categoria}
${produto.subcategoriaModa ? `Tipo: ${produto.subcategoriaModa}` : ''}
${produto.genero ? `Gênero: ${produto.genero}` : ''}
${produto.tipoPeca ? `Peça: ${produto.tipoPeca}` : ''}
${produto.tamanho ? `Tamanho: ${produto.tamanho}` : ''}
Preço: R$ ${produto.preco}

IMPORTANTE: Esta descrição será usada por um consultor para vender o produto. Ela precisa ser CONVINCENTE e DETALHADA.

Crie uma descrição profissional (2-3 parágrafos) que:
1. Destaque características principais e benefícios
2. Seja VERDADEIRA e HONESTA (não invente especificações)
3. Ajude o consultor a CONVENCER o cliente a comprar
4. Use linguagem persuasiva mas realista

NÃO invente detalhes técnicos que não foram fornecidos.`;

    console.log('[IA] Gerando descrição com Groq (LLaMA)...');

    // Groq API (usa mesma interface que OpenAI)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modelo rápido e bom
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em descrições de produtos para e-commerce. Crie descrições profissionais, atrativas, honestas e convincentes que ajudem consultores a vender.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[IA] Erro na resposta:', errorData);
      console.error('[IA] Status:', response.status);
      console.error('[IA] StatusText:', response.statusText);
      
      // Mensagens específicas por erro
      if (response.status === 403 || response.status === 401) {
        throw new Error('❌ Erro de autenticação: API key inválida.\n\n📝 Solução:\n1. Verificar se a chave está correta\n2. Gerar nova chave em https://console.groq.com/keys\n3. Atualizar .env:\nVITE_GROQ_API_KEY=gsk_nova-chave\n4. Reiniciar servidor');
      }
      
      if (response.status === 429) {
        throw new Error('❌ Erro 429: Limite de requisições excedido.\n\nLimite grátis: 14,400 requests/dia (10/minuto).\nAguarde alguns segundos e tente novamente.');
      }
      
      throw new Error(errorData.error?.message || `Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[IA] Descrição gerada com sucesso!');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[IA] Erro ao gerar descrição:', error);
    throw error;
  }
};

/* =========================
   UPLOAD DE FOTOS
========================= */
const uploadFoto = async (file, lojaId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${lojaId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('produtos-fotos')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('produtos-fotos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('[Upload] Erro:', error);
    throw error;
  }
};

/* =========================
   LOCALSTORAGE KEY
========================= */
const STORAGE_KEY = 'produtos-form-draft';

/* =========================
   COMPONENTE
========================= */
const ProdutosForm = ({ lojaId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [uploadingFotos, setUploadingFotos] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [skuAutoGerado, setSkuAutoGerado] = useState(true);
  const [fotosPreviews, setFotosPreviews] = useState([]);

  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    subcategoriaModa: "",
    genero: "",
    tipoPeca: "",
    tamanho: "",
    formaAjustada: "",
    preco: "",
    estoque: "",
    comissao: "",
    sku: "",
    descricao: "",
    fotos: [],
  });

  /* =========================
     CARREGAR DO LOCALSTORAGE AO MONTAR
  ========================= */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📦 Dados recuperados do localStorage');
        setProduto(parsed.produto || produto);
        setFotosPreviews(parsed.fotosPreviews || []);
        setSkuAutoGerado(parsed.skuAutoGerado !== undefined ? parsed.skuAutoGerado : true);
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  }, []);

  /* =========================
     SALVAR NO LOCALSTORAGE A CADA MUDANÇA
  ========================= */
  useEffect(() => {
    try {
      const dataToSave = {
        produto,
        fotosPreviews,
        skuAutoGerado,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }, [produto, fotosPreviews, skuAutoGerado]);

  /* =========================
     LIMPAR LOCALSTORAGE
  ========================= */
  const limparRascunho = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Rascunho removido');
  };

  /* =========================
     BUSCAR CATEGORIAS DO SUPABASE
  ========================= */
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const { data, error } = await supabase
          .from("categorias")
          .select("*")
          .order("nome", { ascending: true });

        if (error) {
          console.error("Erro ao buscar categorias:", error);
          return;
        }

        setCategorias(data || []);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      } finally {
        setLoadingCategorias(false);
      }
    };

    buscarCategorias();
  }, []);

  /* =========================
     ATUALIZA SKU AUTOMÁTICO
  ========================= */
  useEffect(() => {
    if (skuAutoGerado && produto.nome && produto.categoria) {
      const novoSku = gerarSKU(produto);
      setProduto(prev => ({ ...prev, sku: novoSku }));
    }
  }, [produto.nome, produto.categoria, skuAutoGerado]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkuChange = (e) => {
    const { value } = e.target;
    if (value !== produto.sku) {
      setSkuAutoGerado(false);
    }
    setProduto((prev) => ({ ...prev, sku: value }));
  };

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    const isModa = categoria.toLowerCase().includes("moda");
    
    setProduto((prev) => ({
      ...prev,
      categoria,
      ...(!isModa && {
        subcategoriaModa: "",
        genero: "",
        tipoPeca: "",
        tamanho: "",
        formaAjustada: "",
      }),
    }));
  };

  const handleFotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 5) {
      alert('⚠️ Máximo 5 fotos por produto');
      return;
    }

    setUploadingFotos(true);

    try {
      // Upload das fotos
      const urls = [];
      for (const file of files) {
        const url = await uploadFoto(file, lojaId);
        urls.push(url);
      }

      setProduto(prev => ({ ...prev, fotos: [...prev.fotos, ...urls] }));
      
      // Criar previews
      const previews = files.map(file => URL.createObjectURL(file));
      setFotosPreviews(prev => [...prev, ...previews]);

      alert(`✅ ${files.length} foto(s) enviada(s) com sucesso!`);
    } catch (error) {
      console.error('[Upload] Erro:', error);
      alert('❌ Erro ao fazer upload das fotos');
    } finally {
      setUploadingFotos(false);
    }
  };

  const handleRemoverFoto = (index) => {
    setProduto(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
    setFotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGerarDescricaoIA = async () => {
    // Validações
    if (!produto.nome) {
      alert("⚠️ Preencha o nome do produto primeiro!");
      return;
    }
    if (!produto.categoria) {
      alert("⚠️ Selecione a categoria primeiro!");
      return;
    }
    if (!produto.preco) {
      alert("⚠️ Preencha o preço do produto!");
      return;
    }

    setLoadingIA(true);
    try {
      const descricao = await gerarDescricaoIA(produto);
      setProduto(prev => ({ ...prev, descricao }));
      alert('✅ Descrição gerada com sucesso!');
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação de fotos
    if (produto.fotos.length < 3) {
      if (!confirm('⚠️ É necessário adicionar pelo menos 3 fotos do produto! Produtos com fotos vendem muito mais. Deseja continuar sem fotos?')) {
        return;
      }
    }

    // Validação de descrição
    if (!produto.descricao || produto.descricao.trim().length < 50) {
      if (!confirm('⚠️ A descrição está muito curta ou vazia. Uma boa descrição ajuda o consultor a vender. Deseja continuar mesmo assim?')) {
        return;
      }
    }

    setLoading(true);

    try {
      const produtoParaSalvar = {
        ...produto,
        sku: produto.sku || gerarSKU(produto),
      };

      await criarProduto(produtoParaSalvar, lojaId);

      // Limpa o localStorage APÓS SUCESSO
      limparRascunho();

      // Limpa o formulário
      setProduto({
        nome: "",
        categoria: "",
        subcategoriaModa: "",
        genero: "",
        tipoPeca: "",
        tamanho: "",
        formaAjustada: "",
        preco: "",
        estoque: "",
        comissao: "",
        sku: "",
        descricao: "",
        fotos: [],
      });
      
      setFotosPreviews([]);
      setSkuAutoGerado(true);
      onSuccess?.();
      
      alert('✅ Produto cadastrado com sucesso!');
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  const isCategoriaModa = produto.categoria.toLowerCase().includes("moda");

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        📦 Cadastrar Novo Produto
      </h3>

      {/* ALERTA SOBRE IMPORTÂNCIA DA DESCRIÇÃO */}
      <div style={{
        backgroundColor: '#e3f2fd',
        border: '2px solid #2196f3',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <div>
            <strong style={{ display: 'block', color: '#1976d2', marginBottom: '8px' }}>
              Importância da Descrição e Fotos:
            </strong>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#0d47a1', fontSize: '14px', lineHeight: '1.6' }}>
              <li><strong>Fotos:</strong> Produtos com fotos vendem até 5x mais. Adicione pelo menos 3 fotos!</li>
              <li><strong>Descrição:</strong> O consultor usa a descrição para convencer o cliente. Seja detalhado e verdadeiro!</li>
              <li><strong>Dica:</strong> Descreva benefícios, características e para quem é indicado.</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} data-cy="produto-form">
        <div style={styles.formGrid}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nome *</label>
            <input
              data-cy="produto-nome"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
              placeholder="Ex: Camiseta Básica Preta"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Categoria *</label>
            <select
              data-cy="produto-categoria"
              name="categoria"
              value={produto.categoria}
              onChange={handleCategoriaChange}
              required
              disabled={loadingCategorias}
              style={styles.input}
            >
              <option value="">
                {loadingCategorias ? "Carregando..." : "Selecione"}
              </option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Campos específicos de Moda */}
          {isCategoriaModa && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Moda *</label>
                <select
                  data-cy="produto-subcategoria"
                  name="subcategoriaModa"
                  value={produto.subcategoriaModa}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  {opcoesTipoModa.map(o => (
                    <option key={o.valor} value={o.valor}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Gênero *</label>
                <select
                  data-cy="produto-genero"
                  name="genero"
                  value={produto.genero}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  {opcoesGenero.map(o => (
                    <option key={o.valor} value={o.valor}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Peça *</label>
                <select
                  data-cy="produto-tipo"
                  name="tipoPeca"
                  value={produto.tipoPeca}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Selecione</option>
                  {(produto.subcategoriaModa === "roupas" ? opcoesRoupas : opcoesSapatos).map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tamanho *</label>
                <select
                  data-cy="produto-tamanho"
                  name="tamanho"
                  value={produto.tamanho}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Selecione</option>
                  {(produto.subcategoriaModa === "roupas" ? tamanhosRoupas : tamanhosSapatos).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Forma Ajustada</label>
                <select
                  data-cy="produto-forma"
                  name="formaAjustada"
                  value={produto.formaAjustada}
                  onChange={handleChange}
                  style={styles.input}
                >
                  {opcoesFormaAjustada.map(o => (
                    <option key={o.valor} value={o.valor}>{o.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Preço *</label>
            <input
              data-cy="produto-preco"
              type="number"
              step="0.01"
              min="0"
              name="preco"
              value={produto.preco}
              onChange={handleChange}
              placeholder="0.00"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Comissão (%) *</label>
            <input
              data-cy="produto-comissao"
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="comissao"
              value={produto.comissao}
              onChange={handleChange}
              placeholder="Ex: 5"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Estoque *</label>
            <input
              data-cy="produto-estoque"
              type="number"
              min="0"
              name="estoque"
              value={produto.estoque}
              onChange={handleChange}
              placeholder="0"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              SKU 
              <small style={{ marginLeft: "8px", color: "#666", fontWeight: "normal" }}>
                {skuAutoGerado ? "(gerado automaticamente)" : "(personalizado)"}
              </small>
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                data-cy="produto-sku"
                name="sku"
                value={produto.sku}
                onChange={handleSkuChange}
                placeholder="Será gerado automaticamente"
                style={{ ...styles.input, flex: 1 }}
              />
              {!skuAutoGerado && (
                <button
                  type="button"
                  onClick={() => {
                    setSkuAutoGerado(true);
                    if (produto.nome && produto.categoria) {
                      setProduto(prev => ({ ...prev, sku: gerarSKU(prev) }));
                    }
                  }}
                  style={styles.secondaryButton}
                >
                  🔄 Auto
                </button>
              )}
            </div>
          </div>

        </div>

        {/* UPLOAD DE FOTOS */}
        <div style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <label style={{ ...styles.label, fontSize: '1.1rem', marginBottom: '12px' }}>
            📸 Fotos do Produto
            <span style={{
              marginLeft: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '600'
            }}>
              IMPORTANTE
            </span>
          </label>
          
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFotosChange}
            disabled={uploadingFotos}
            style={styles.fileInput}
          />
          
          <small style={{ display: 'block', color: '#dc3545', marginTop: '8px', fontWeight: '600' }}>
            ⚠️ Produtos com fotos vendem até 5x mais! Adicione pelo menos 3 fotos.
          </small>
          <small style={{ display: 'block', color: '#666', marginTop: '4px' }}>
            💡 Máximo 5 fotos por produto. Formatos: JPG, PNG, WEBP
          </small>

          {/* Previews das fotos */}
          {produto.fotos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '10px',
              marginTop: '15px'
            }}>
              {produto.fotos.map((url, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={fotosPreviews[index] || url}
                    alt={`Foto ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #dee2e6'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoverFoto(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadingFotos && (
            <div style={{ marginTop: '10px', color: '#6f42c1', fontWeight: '600' }}>
              ⏳ Fazendo upload das fotos...
            </div>
          )}
        </div>

        {/* DESCRIÇÃO COM IA */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px solid #e3f2fd'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label style={styles.label}>
              🤖 Descrição do Produto
              <span style={styles.iaBadge}>IA</span>
              <span style={{
                marginLeft: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                IMPORTANTE
              </span>
            </label>
            <button
              type="button"
              onClick={handleGerarDescricaoIA}
              disabled={loadingIA || !produto.nome || !produto.categoria || !produto.preco}
              style={{
                backgroundColor: loadingIA ? '#6c757d' : '#6f42c1',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: loadingIA || !produto.nome || !produto.categoria || !produto.preco ? 'not-allowed' : 'pointer',
                opacity: loadingIA || !produto.nome || !produto.categoria || !produto.preco ? 0.6 : 1
              }}
            >
              {loadingIA ? '⏳ Gerando...' : '✨ Gerar com IA'}
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px'
          }}>
            <strong style={{ color: '#856404', fontSize: '13px' }}>
              ⚠️ Por que a descrição é importante?
            </strong>
            <p style={{ margin: '8px 0 0 0', color: '#856404', fontSize: '12px', lineHeight: '1.5' }}>
              • O consultor usa a descrição para <strong>convencer o cliente</strong> a comprar<br/>
              • Descrições detalhadas aumentam as vendas em até <strong>40%</strong><br/>
              • Seja <strong>verdadeiro</strong> e <strong>específico</strong> sobre o produto
            </p>
          </div>
          
          <textarea
            data-cy="produto-descricao"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            placeholder="Clique em 'Gerar com IA' para criar uma descrição profissional automaticamente, ou digite manualmente..."
            rows="6"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          
          <small style={{ 
            display: 'block', 
            marginTop: '8px', 
            color: '#6f42c1', 
            fontSize: '0.85rem' 
          }}>
            💡 A IA cria descrições profissionais e convincentes. Você pode editar após gerar!
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || loadingCategorias || uploadingFotos}
          data-cy="produto-submit"
          style={{
            marginTop: '25px',
            backgroundColor: loading ? '#6c757d' : '#bb25a6',
            color: 'white',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? "Salvando..." : "📦 Cadastrar Produto"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    marginBottom: '25px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#495057',
    marginBottom: '20px',
    fontWeight: '600',
  },
  iaBadge: {
    backgroundColor: '#6f42c1',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
    marginLeft: '10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default ProdutosForm;