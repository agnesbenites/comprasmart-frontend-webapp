// src/services/lojista.service.js
import { supabase } from "@/supabaseClient";

/* =====================================================
   📤 UPLOAD DE DOCUMENTO
===================================================== */
export async function uploadDocumento(userId, arquivo, tipoDocumento) {
  if (!arquivo || !userId) {
    throw new Error("Arquivo e userId são obrigatórios");
  }

  // Gera nome único para o arquivo
  const extensao = arquivo.name.split('.').pop();
  const nomeArquivo = `${userId}/${tipoDocumento}_${Date.now()}.${extensao}`;

  console.log("[lojista.service] Fazendo upload:", nomeArquivo);

  const { data, error } = await supabase.storage
    .from("documentos-lojistas")
    .upload(nomeArquivo, arquivo, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[lojista.service] Erro no upload:", error);
    throw error;
  }

  // Retorna a URL do arquivo
  const { data: urlData } = supabase.storage
    .from("documentos-lojistas")
    .getPublicUrl(nomeArquivo);

  console.log("[lojista.service] Upload concluído:", data.path);
  
  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

/* =====================================================
   🏪 CRIAR LOJA
===================================================== */
export async function criarLoja(dadosLoja, userId) {
  console.log("[lojista.service] Criando loja para usuário:", userId);
  console.log("[lojista.service] Dados:", dadosLoja);

  const payload = {
    user_id: userId,
    tipo_pessoa: dadosLoja.tipoPessoa,
    cnpj: dadosLoja.cnpj || null,
    cpf: dadosLoja.cpf || null,
    nome: dadosLoja.nomeFantasia || dadosLoja.nomeLoja,
    nome_fantasia: dadosLoja.nomeFantasia || null,
    razao_social: dadosLoja.razaoSocial || null,
    tipo: "matriz",
    segmento: dadosLoja.segmento || null,
    email: dadosLoja.email || dadosLoja.emailRepresentante,
    telefone: dadosLoja.telefone || dadosLoja.telefoneRepresentante,
    endereco: dadosLoja.endereco ? JSON.stringify(dadosLoja.endereco) : null,
    representante_nome: dadosLoja.nomeRepresentante || null,
    representante_cpf: dadosLoja.cpfRepresentante || null,
    representante_email: dadosLoja.emailRepresentante || null,
    representante_telefone: dadosLoja.telefoneRepresentante || null,
    cartao_cnpj_url: dadosLoja.cartaoCnpjUrl || null,
    contrato_social_url: dadosLoja.contratoSocialUrl || null,
    doc_representante_url: dadosLoja.docRepresentanteUrl || null,
    validacao_biometrica: dadosLoja.validacaoBiometrica || null,
    validacao_score: dadosLoja.validacaoScore || null,
    validacao_aprovada: dadosLoja.validacaoAprovada || false,
    plano: dadosLoja.plano || "basic",
    status: "pendente",
  };

  const { data, error } = await supabase
    .from("lojas_corrigida")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[lojista.service] Erro ao criar loja:", error);
    throw error;
  }

  console.log("[lojista.service] ✅ Loja criada:", data);
  return data;
}

/* =====================================================
   🏢 CRIAR FILIAIS
===================================================== */
export async function criarFiliais(lojaId, filiais) {
  if (!filiais || filiais.length === 0) {
    return [];
  }

  console.log("[lojista.service] Criando filiais para loja:", lojaId);

  const payloads = filiais.map((filial) => ({
    loja_id: lojaId,
    nome: filial.nome,
    cnpj: filial.cnpj || null,
    cidade: filial.cidade,
    estado: filial.estado || null,
    endereco: filial.endereco || null,
    is_matriz: false,
    ativa: true,
  }));

  const { data, error } = await supabase
    .from("filiais")
    .insert(payloads)
    .select();

  if (error) {
    console.error("[lojista.service] Erro ao criar filiais:", error);
    throw error;
  }

  console.log("[lojista.service] ✅ Filiais criadas:", data.length);
  return data;
}

/* =====================================================
   👥 CRIAR VENDEDORES
===================================================== */
export async function criarVendedores(lojaId, vendedores) {
  if (!vendedores || vendedores.length === 0) {
    return [];
  }

  console.log("[lojista.service] Criando vendedores para loja:", lojaId);

  const payloads = vendedores.map((vendedor) => ({
    loja_id: lojaId,
    nome: vendedor.nome,
    email: vendedor.email,
    telefone: vendedor.telefone || null,
    cpf: vendedor.cpf || null,
    status: "pendente",
  }));

  const { data, error } = await supabase
    .from("vendedores")
    .insert(payloads)
    .select();

  if (error) {
    console.error("[lojista.service] Erro ao criar vendedores:", error);
    throw error;
  }

  console.log("[lojista.service] ✅ Vendedores criados:", data.length);
  return data;
}

/* =====================================================
   📝 CADASTRO COMPLETO DE LOJISTA
===================================================== */
export async function cadastrarLojista({
  tipoPessoa,
  dadosPJ,
  dadosPF,
  endereco,
  plano,
  vendedores,
  filiais,
  integracao,
  validacaoBiometrica,
  senha,
}) {
  console.log("[lojista.service] Iniciando cadastro completo de lojista");

  try {
    // 1. Criar usuário no Supabase Auth PRIMEIRO
    const email = tipoPessoa === "PJ" ? dadosPJ.emailRepresentante : dadosPF.email;
    
    console.log("[lojista.service] Criando usuário:", email);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          tipo: "lojista",
          nome: tipoPessoa === "PJ" ? dadosPJ.nomeFantasia : dadosPF.nomeLoja,
        },
      },
    });

    if (authError) {
      console.error("[lojista.service] Erro ao criar usuário:", authError);
      throw authError;
    }

    const userId = authData.user.id;
    console.log("[lojista.service] Usuário criado:", userId);

    // 2. Upload de documentos DEPOIS de criar o usuário (agora temos userId)
    let cartaoCnpjUrl = null;
    let contratoSocialUrl = null;
    let docRepresentanteUrl = null;

    if (tipoPessoa === "PJ") {
      try {
        if (dadosPJ.cartoeCNPJ) {
          const result = await uploadDocumento(userId, dadosPJ.cartoeCNPJ, "cartao_cnpj");
          cartaoCnpjUrl = result.path;
        }
        if (dadosPJ.contratoSocial) {
          const result = await uploadDocumento(userId, dadosPJ.contratoSocial, "contrato_social");
          contratoSocialUrl = result.path;
        }
        if (dadosPJ.docRepresentante) {
          const result = await uploadDocumento(userId, dadosPJ.docRepresentante, "doc_representante");
          docRepresentanteUrl = result.path;
        }
      } catch (uploadError) {
        console.warn("[lojista.service] Erro no upload de documentos (continuando sem eles):", uploadError);
        // Continua o cadastro mesmo sem os documentos
      }
    }

    // 3. Criar loja
    const dadosLoja = {
      tipoPessoa,
      ...(tipoPessoa === "PJ" ? {
        cnpj: dadosPJ.cnpj,
        nomeFantasia: dadosPJ.nomeFantasia,
        razaoSocial: dadosPJ.razaoSocial,
        nomeRepresentante: dadosPJ.nomeRepresentante,
        cpfRepresentante: dadosPJ.cpfRepresentante,
        emailRepresentante: dadosPJ.emailRepresentante,
        telefoneRepresentante: dadosPJ.telefoneRepresentante,
      } : {
        cpf: dadosPF.cpf,
        nomeLoja: dadosPF.nomeLoja,
        email: dadosPF.email,
        telefone: dadosPF.telefone,
      }),
      endereco,
      plano,
      cartaoCnpjUrl,
      contratoSocialUrl,
      docRepresentanteUrl,
      validacaoBiometrica: validacaoBiometrica || null,
      validacaoScore: validacaoBiometrica?.score || null,
      validacaoAprovada: validacaoBiometrica?.aprovado || false,
    };

    const loja = await criarLoja(dadosLoja, userId);

    // 4. Criar filiais (se houver)
    if (filiais && filiais.length > 0) {
      await criarFiliais(loja.id, filiais);
    }

    // 5. Criar vendedores (se houver)
    if (vendedores && vendedores.length > 0) {
      await criarVendedores(loja.id, vendedores);
      
      // TODO: Enviar email para vendedores configurarem senha
      vendedores.forEach((v) => {
        console.log(`[lojista.service] 📧 Email seria enviado para: ${v.email}`);
      });
    }

    // 6. Salvar integração ERP (se houver)
    if (integracao && integracao.erpSelecionado) {
      console.log("[lojista.service] Integração ERP:", integracao.erpSelecionado);
      // TODO: Salvar configuração de integração em tabela separada
    }

    console.log("[lojista.service] ✅ Cadastro completo finalizado!");

    return {
      success: true,
      user: authData.user,
      loja,
      plano,
    };

  } catch (error) {
    console.error("[lojista.service] ❌ Erro no cadastro:", error);
    throw error;
  }
}

/* =====================================================
   🔍 BUSCAR LOJA DO USUÁRIO
===================================================== */
export async function buscarLojaDoUsuario(userId) {
  const { data, error } = await supabase
    .from("lojas_corrigida")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("[lojista.service] Erro ao buscar loja:", error);
    return null;
  }

  return data;
}