import { supabase } from './supabaseClient'; // seu supabase client

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
  const endpoint = 'https://api.anthropic.com/v1/complete';

  // Prompt estruturado para não expor dados individuais de outros lojistas
  const prompt = `
Você é um assistente especialista em análise de desempenho de lojistas.
Com base nos dados do lojista: ${JSON.stringify(dadoLojista)}, gere um resumo curto e objetivo que:
- Informe se as vendas aumentaram ou caíram.
- Dê possíveis razões para o aumento ou queda.
- Sugira se precisa aumentar ou diminuir comissão comparando com outros lojistas, sem expor dados individuais.
- Dê dicas práticas para melhorar o desempenho.

Contexto comparativo (sem expor valores individuais): ${contextoComparativo}

Resuma em 4-5 frases.
Resumo:`;

  const body = {
    model: 'claude-3',
    prompt: prompt,
    max_tokens_to_sample: 250,
    temperature: 0.7,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  return result.completion || 'Não foi possível gerar o resumo.';
}

// 3️⃣ Função para gerar relatórios para vários lojistas
export async function gerarRelatorios(idsLojistas) {
  // Buscar dados de todos os lojistas
  const dadosLojistas = await buscarDadosLojistas(idsLojistas);
  if (!dadosLojistas.length) return [];

  // Criar contexto comparativo agregado (ex: percentuais médios, sem expor dados individuais)
  const contextoComparativo = {
    comissaoMedia: `${Math.round(dadosLojistas.reduce((acc, l) => acc + l.comissao_percentual, 0) / dadosLojistas.length)}%`,
    descontoMedio: `${Math.round(dadosLojistas.reduce((acc, l) => acc + l.desconto_base_percentual, 0) / dadosLojistas.length)}%`,
    vendasTotaisMedias: Math.round(dadosLojistas.reduce((acc, l) => acc + l.vendas_totais, 0) / dadosLojistas.length)
  };

  // Gerar resumo individual para cada lojista
  const relatorios = [];
  for (const lojista of dadosLojistas) {
    const resumo = await gerarResumoClaude(lojista, contextoComparativo);
    relatorios.push({
      id_lojista: lojista.id_lojista,
      resumo
    });
  }

  return relatorios;
}

// 4️⃣ Exemplo de uso
async function main() {
  const idsLojistas = [
    '016ddf8a-47fe-4c42-b96b-3827ef81ceb7',
    'outro-id-uuid',
    'mais-um-id-uuid'
  ];

  const relatorios = await gerarRelatorios(idsLojistas);
  console.log('Relatórios gerados:', relatorios);
}

main();
