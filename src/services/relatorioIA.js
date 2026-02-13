// src/services/relatorioIA.js
import { supabase } from '../supabaseClient'; // Importa do arquivo correto agora

// 1️⃣ Função para buscar dados de vários lojistas
export async function buscarDadosLojistas(idsLojistas) {
  if (!idsLojistas || idsLojistas.length === 0) return [];

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

// 2️⃣ Função para gerar resumo de relatório individual usando Claude
export async function gerarResumoClaude(dadoLojista, contextoComparativo) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const endpoint = 'https://api.anthropic.com/v1/messages'; // Endpoint atualizado para modelos Claude 3

  const prompt = `Você é um assistente especialista em análise de desempenho de lojistas. Com base nos dados do lojista: ${JSON.stringify(dadoLojista)}, gere um resumo curto e objetivo. Contexto comparativo: ${JSON.stringify(contextoComparativo)}. Resuma em 4-5 frases.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307', // Haiku é mais rápido e barato para resumos
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const result = await response.json();
  return result.content[0].text || 'Não foi possível gerar o resumo.';
}

// 3️⃣ Função para gerar relatórios para vários lojistas
export async function gerarRelatorios(idsLojistas) {
  const dadosLojistas = await buscarDadosLojistas(idsLojistas);
  if (!dadosLojistas.length) return [];

  const contextoComparativo = {
    comissaoMedia: `${Math.round(dadosLojistas.reduce((acc, l) => acc + l.comissao_percentual, 0) / dadosLojistas.length)}%`,
    descontoMedio: `${Math.round(dadosLojistas.reduce((acc, l) => acc + l.desconto_base_percentual, 0) / dadosLojistas.length)}%`,
    vendasTotaisMedias: Math.round(dadosLojistas.reduce((acc, l) => acc + l.vendas_totais, 0) / dadosLojistas.length)
  };

  const relatorios = [];
  for (const lojista of dadosLojistas) {
    const resumo = await gerarResumoClaude(lojista, contextoComparativo);
    relatorios.push({ id_lojista: lojista.id_lojista, resumo });
  }

  return relatorios;
}