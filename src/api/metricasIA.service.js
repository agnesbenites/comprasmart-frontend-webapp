import { supabase } from "../supabaseClient"; // caminho igual ao que você usa no relatorioIA.service.js

// Registrar cada uso da IA
export async function registrarUsoIA({ lojistaId, funcaoIA, resultado, periodo, fonte }) {
  const { data, error } = await supabase
    .from('metricas_ia')
    .insert([{
      id_lojista: lojistaId,
      funcao_ia: funcaoIA,
      resultado: resultado || '',
      periodo: periodo || 'mensal',
      fonte: fonte || 'novo'
    }]);

  if (error) console.error("Erro ao registrar uso IA:", error);
  return data;
}

// Atualizar a experiência do usuário (feedback)
export async function atualizarExperienciaIA({ id, experiencia }) {
  const { data, error } = await supabase
    .from('metricas_ia')
    .update({ experiencia })
    .eq('id', id);

  if (error) console.error("Erro ao atualizar experiência IA:", error);
  return data;
}

// Obter métricas de uso da IA para o lojista
export async function obterMetricasIA(lojistaId, funcaoIA) {
  const { data, error } = await supabase
    .from('metricas_ia')
    .select('*')
    .eq('id_lojista', lojistaId)
    .eq('funcao_ia', funcaoIA)
    .order('criado_em', { ascending: false });

  if (error) console.error("Erro ao obter métricas IA:", error);
  return data || [];
}
