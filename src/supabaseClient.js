import { createClient } from '@supabase/supabase-js';

// 1️⃣ CONFIGURAÇÃO DO CLIENTE (O coração do arquivo)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criamos a instância única aqui
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2️⃣ SUAS FUNÇÕES DE LÓGICA (Restauradas e corrigidas)

// Função para buscar dados de vários lojistas
export async function buscarDadosLojistas(idsLojistas) {
  if (!idsLojistas || idsLojistas.length === 0) return [];

  // Note que aqui NÃO usamos import, usamos a variável 'supabase' declarada acima
  const { data, error } = await supabase
    .from('saldos_lojista')
    .select('id_lojista, dias_restantes, desconto_base_percentual, vendas_totais, comissao_percentual') 
    .in('id_lojista', idsLojistas);

  if (error) {
    console.error('Erro ao buscar dados dos lojistas:', error);
    return [];
  }
  return data;
}

// Função para gerar resumo usando a IA (Claude)
export async function gerarResumoClaude(dadoLojista, contextoComparativo) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const endpoint = 'https://api.anthropic.com/v1/messages'; 

  const prompt = `Você é um assistente especialista em análise de desempenho de lojistas. Analise: ${JSON.stringify(dadoLojista)}. Contexto médio: ${JSON.stringify(contextoComparativo)}. Resuma em 4 frases.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const result = await response.json();
    return result.content[0].text || 'Resumo indisponível no momento.';
  } catch (e) {
    console.error("Erro Claude:", e);
    return 'Erro ao processar análise com IA.';
  }
}

// Função para processar os relatórios em lote
export async function gerarRelatorios(idsLojistas) {
  const dadosLojistas = await buscarDadosLojistas(idsLojistas);
  if (!dadosLojistas.length) return [];

  const contextoComparativo = {
    comissaoMedia: `${Math.round(dadosLojistas.reduce((acc, l) => acc + l.comissao_percentual, 0) / dadosLojistas.length)}%`,
    vendasTotaisMedias: Math.round(dadosLojistas.reduce((acc, l) => acc + l.vendas_totais, 0) / dadosLojistas.length)
  };

  const relatorios = [];
  for (const lojista of dadosLojistas) {
    const resumo = await gerarResumoClaude(lojista, contextoComparativo);
    relatorios.push({ id_lojista: lojista.id_lojista, resumo });
  }
  return relatorios;
}