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
  // Pega as primeiras letras da categoria (sem emojis)
  const categoriaLimpa = produto.categoria
    .replace(/[^\w\s]/gi, '') // Remove emojis e caracteres especiais
    .trim()
    .substring(0, 3)
    .toUpperCase();
  
  // Pega as primeiras letras do nome
  const nomeLimpo = produto.nome
    .replace(/[^\w\s]/gi, '')
    .trim()
    .substring(0, 3)
    .toUpperCase();
  
  // Gera um código aleatório
  const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // Timestamp curto
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  
  return `${categoriaLimpa}-${nomeLimpo}-${codigo}${timestamp}`.substring(0, 20);
};

/* =========================
   COMPONENTE
========================= */
const ProdutosForm = ({ lojaId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [skuAutoGerado, setSkuAutoGerado] = useState(true); // Controla se o SKU é automático

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
  });

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

        console.log("Categorias carregadas:", data);
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
    // Só gera SKU automático se estiver no modo automático e tiver nome e categoria
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
    // Se o usuário digitar algo, desativa o modo automático
    if (value !== produto.sku) {
      setSkuAutoGerado(false);
    }
    setProduto((prev) => ({ ...prev, sku: value }));
  };

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;

    // Limpa campos de moda se não for categoria de moda
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Se não tiver SKU, gera um
      const produtoParaSalvar = {
        ...produto,
        sku: produto.sku || gerarSKU(produto),
      };

      await criarProduto(produtoParaSalvar, lojaId);

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
      });
      
      // Volta para modo automático
      setSkuAutoGerado(true);

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se a categoria selecionada é de Moda
  const isCategoriaModa = produto.categoria.toLowerCase().includes("moda");

  /* =========================
     RENDER
  ========================= */
  return (
    <form onSubmit={handleSubmit} data-cy="produto-form">
      <div className="form-grid">

        <div className="form-group">
          <label>Nome *</label>
          <input
            data-cy="produto-nome"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            placeholder="Ex: Camiseta Básica Preta"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria *</label>
          <select
            data-cy="produto-categoria"
            name="categoria"
            value={produto.categoria}
            onChange={handleCategoriaChange}
            required
            disabled={loadingCategorias}
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
            <div className="form-group">
              <label>Tipo de Moda *</label>
              <select
                data-cy="produto-subcategoria"
                name="subcategoriaModa"
                value={produto.subcategoriaModa}
                onChange={handleChange}
                required
              >
                {opcoesTipoModa.map(o => (
                  <option key={o.valor} value={o.valor}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Gênero *</label>
              <select
                data-cy="produto-genero"
                name="genero"
                value={produto.genero}
                onChange={handleChange}
                required
              >
                {opcoesGenero.map(o => (
                  <option key={o.valor} value={o.valor}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Peça *</label>
              <select
                data-cy="produto-tipo"
                name="tipoPeca"
                value={produto.tipoPeca}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {(produto.subcategoriaModa === "roupas" ? opcoesRoupas : opcoesSapatos).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tamanho *</label>
              <select
                data-cy="produto-tamanho"
                name="tamanho"
                value={produto.tamanho}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {(produto.subcategoriaModa === "roupas" ? tamanhosRoupas : tamanhosSapatos).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Forma Ajustada</label>
              <select
                data-cy="produto-forma"
                name="formaAjustada"
                value={produto.formaAjustada}
                onChange={handleChange}
              >
                {opcoesFormaAjustada.map(o => (
                  <option key={o.valor} value={o.valor}>{o.label}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Preço *</label>
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
          />
        </div>

        <div className="form-group">
          <label>Comissão (%) *</label>
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
          />
        </div>

        <div className="form-group">
          <label>Estoque *</label>
          <input
            data-cy="produto-estoque"
            type="number"
            min="0"
            name="estoque"
            value={produto.estoque}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <div className="form-group">
          <label>
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
              style={{ flex: 1 }}
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
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                🔄 Auto
              </button>
            )}
          </div>
          <small style={{ color: "#888", fontSize: "12px", marginTop: "4px", display: "block" }}>
            💡 Se você já tem o SKU do produto, digite aqui. Caso contrário, será gerado automaticamente. 
            Guarde este código para reabastecer o estoque ou reativar o produto futuramente.
          </small>
        </div>

      </div>

      <button
        type="submit"
        disabled={loading || loadingCategorias}
        data-cy="produto-submit"
      >
        {loading ? "Salvando..." : "Cadastrar Produto"}
      </button>
    </form>
  );
};

export default ProdutosForm;