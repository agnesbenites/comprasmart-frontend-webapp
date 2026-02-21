import { supabase } from "@/supabaseClient";

/* =====================================================
    BUSCAR LOJA DO USUÁRIO
===================================================== */
export async function buscarLojaPorUsuario(userId) {
  if (!userId) {
    console.error("[produtos.service] buscarLojaPorUsuario: userId não informado");
    return null;
  }

  console.log("[produtos.service] Buscando loja para usuário:", userId);

  const { data, error } = await supabase
    .from("lojas_corrigida")
    .select("id, nome, cnpj, status")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("[produtos.service] Erro ao buscar loja:", error);
    return null;
  }

  console.log("[produtos.service] Loja encontrada:", data);
  return data;
}

/* =====================================================
   🔎 BUSCAR PRODUTOS
===================================================== */
export async function buscarProdutos(lojaId) {
  if (!lojaId) {
    console.error("[produtos.service] buscarProdutos: lojaId não informado");
    throw new Error("lojaId não informado");
  }

  console.log("[produtos.service] Buscando produtos para loja:", lojaId);

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("loja_id", lojaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[produtos.service] Erro ao buscar produtos:", error);
    throw error;
  }

  console.log("[produtos.service] Produtos encontrados:", data?.length || 0);
  return data || [];
}

/* alias compatível */
export const buscarProdutosPorLoja = buscarProdutos;

/* =====================================================
   ➕ CRIAR PRODUTO
===================================================== */
export async function criarProduto(produto, lojaId) {
  console.log("[produtos.service] criarProduto chamado");
  console.log("[produtos.service] lojaId:", lojaId);
  console.log("[produtos.service] produto recebido:", produto);

  if (!lojaId) {
    console.error("[produtos.service] ERRO: lojaId não informado!");
    throw new Error("lojaId não informado");
  }

  // Monta o payload
  const payload = {
    loja_id: lojaId,
    nome: produto.nome,
    categoria: produto.categoria,
    preco: Number(produto.preco) || 0,
    estoque: Number(produto.estoque) || 0,
    descricao: produto.descricao || null,
    sku: produto.sku || null,
    fotos: produto.fotos || [],
  };

  // Campos de moda - só adiciona se categoria contiver "Moda"
  if (produto.categoria?.toLowerCase().includes("moda")) {
    payload.subcategoria_moda = produto.subcategoriaModa || null;
    payload.genero = produto.genero || null;
    payload.tipo_peca = produto.tipoPeca || null;
    payload.tamanho = produto.tamanho || null;
    payload.forma_ajustada = produto.formaAjustada || null;
  }

  // Campo de comissão
  if (produto.comissao) {
    payload.commission_rate = Number(produto.comissao);
  }

  console.log("[produtos.service] Payload a ser enviado:", payload);

  try {
    const { data, error } = await supabase
      .from("produtos")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[produtos.service] ERRO do Supabase:", error);
      console.error("[produtos.service] Código:", error.code);
      console.error("[produtos.service] Mensagem:", error.message);
      throw error;
    }

    console.log("[produtos.service]  Produto criado com sucesso:", data);
    return data;
  } catch (err) {
    console.error("[produtos.service] Exceção ao criar produto:", err);
    throw err;
  }
}

/* =====================================================
   ✏️ EDITAR PRODUTO - VERSÃO COMPLETA
   Suporta: nome, preço, comissão, estoque, descrição, fotos, sku
===================================================== */
export async function editarProduto(produtoId, updates) {
  console.log("[produtos.service] editarProduto:", produtoId, updates);

  if (!produtoId) {
    throw new Error("produtoId não informado");
  }

  // Converte campos do frontend para o banco
  const payload = {};
  
  // Campos simples
  if (updates.nome !== undefined) payload.nome = updates.nome;
  if (updates.preco !== undefined) payload.preco = Number(updates.preco);
  if (updates.estoque !== undefined) payload.estoque = Number(updates.estoque);
  if (updates.descricao !== undefined) payload.descricao = updates.descricao;
  if (updates.sku !== undefined) payload.sku = updates.sku;
  if (updates.fotos !== undefined) payload.fotos = updates.fotos;
  
  // Comissão (frontend usa 'comissao', banco usa 'commission_rate')
  if (updates.comissao !== undefined) {
    payload.commission_rate = Number(updates.comissao);
  }

  console.log("[produtos.service] Payload para atualização:", payload);

  const { data, error } = await supabase
    .from("produtos")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", produtoId)
    .select()
    .single();

  if (error) {
    console.error("[produtos.service] Erro ao editar:", error);
    throw error;
  }

  console.log("[produtos.service]  Produto editado com sucesso:", data);
  return data;
}

/* =====================================================
    ATUALIZAR ESTOQUE
===================================================== */
export async function atualizarEstoque(produtoId, estoque) {
  return editarProduto(produtoId, { estoque: Number(estoque) });
}

/* =====================================================
    EXCLUIR PRODUTO
===================================================== */
export async function excluirProduto(produtoId) {
  console.log("[produtos.service] excluirProduto:", produtoId);

  if (!produtoId) {
    throw new Error("produtoId não informado");
  }

  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", produtoId);

  if (error) {
    console.error("[produtos.service] Erro ao excluir:", error);
    throw error;
  }

  return true;
}