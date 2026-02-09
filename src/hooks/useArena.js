// src/hooks/useArena.js
// Gerencia estado da Arena de Vendas pra o consultor
// Fase 1 (sem loja) e Fase 2 (com produtos da loja)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// Limites espelhados do banco (evita chamada extra)
export const ARENA_LIMITES = {
  basico:     { limite: 5,    consultores: false, dificil: false, ranking: false },
  pro:        { limite: 20,   consultores: true,  dificil: true,  ranking: false },
  enterprise: { limite: null, consultores: true,  dificil: true,  ranking: true  }
};

export function useArena({ consultorId, lojaId }) {
  const [fase, setFase]             = useState(1);       // 1 ou 2
  const [produtos, setProdutos]     = useState([]);      // genéricos ou da loja
  const [cenarios, setCenarios]     = useState([]);
  const [sessaoAtual, setSessaoAtual] = useState(null);
  const [historico, setHistorico]   = useState([]);      // sessões anteriores
  const [acesso, setAcesso]         = useState(null);    // retorno de pode_iniciar_sim
  const [loading, setLoading]       = useState(true);

  // ─── Determina fase e busca produtos ────────────
  const carregarProdutos = useCallback(async () => {
    try {
      if (lojaId) {
        // Fase 2: busca produtos reais da loja pelo segmento do consultor
        const { data: consultor } = await supabase
          .from('consultores')
          .select('segmentos')
          .eq('id', consultorId)
          .single();

        if (consultor?.segmentos?.length) {
          const { data: prodLoja } = await supabase
            .from('produtos')
            .select('id, nome, descricao, preco, categoria')
            .eq('loja_id', lojaId)
            .eq('ativo', true)
            .in('segmento', consultor.segmentos);

          if (prodLoja?.length) {
            setProdutos(prodLoja.map(p => ({ ...p, generico: false })));
            setFase(2);
            return;
          }
        }
      }

      // Fase 1: produtos genéricos
      const { data: genericos } = await supabase
        .from('produtos_genericos')
        .select('id, nome, descricao, preco, categoria, segmento')
        .eq('ativo', true);

      setProdutos((genericos || []).map(p => ({ ...p, generico: true })));
      setFase(1);

    } catch (err) {
      console.error('[useArena] erro ao carregar produtos:', err);
    }
  }, [consultorId, lojaId]);

  // ─── Busca cenários disponíveis pra a fase atual ─
  const carregarCenarios = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('cenarios_simulacao')
        .select('*')
        .eq('ativo', true)
        .lte('fase_minima', fase)
        .order('dificuldade');

      setCenarios(data || []);
    } catch (err) {
      console.error('[useArena] erro ao carregar cenários:', err);
    }
  }, [fase]);

  // ─── Verifica acesso (pode iniciar sim?) ──────────
  const verificarAcesso = useCallback(async () => {
    if (!lojaId) {
      // Fase 1 sem loja: sempre pode usar produtos genéricos
      setAcesso({ pode: true, limite: null, usadas: 0 });
      return;
    }
    try {
      const { data, error } = await supabase.rpc('pode_iniciar_sim', {
        p_loja_id: lojaId,
        p_tipo: 'consultor'
      });
      if (error) throw error;
      setAcesso(data);
    } catch (err) {
      console.error('[useArena] erro ao verificar acesso:', err);
    }
  }, [lojaId]);

  // ─── Busca histórico de sessões ────────────────────
  const carregarHistorico = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('sessoes_simulacao')
        .select('id, produto_id, produto_generico, cenario_id, fase, status, resultado_fechou, pontuacao, iniciada_em')
        .eq('consultor_id', consultorId)
        .order('iniciada_em', { ascending: false })
        .limit(20);
      setHistorico(data || []);
    } catch (err) {
      console.error('[useArena] erro ao carregar histórico:', err);
    }
  }, [consultorId]);

  // ─── Inicia nova simulação ─────────────────────────
  const iniciarSimulacao = useCallback(async (produto, cenario) => {
    try {
      // Incrementa contador na loja (se fase 2)
      if (lojaId) {
        await supabase.rpc('incrementar_sim', { p_loja_id: lojaId });
      }

      // Cria sessão
      const { data: sessao } = await supabase
        .from('sessoes_simulacao')
        .insert({
          consultor_id:    consultorId,
          loja_id:         lojaId || null,
          produto_id:      produto.id,
          produto_generico: produto.generico,
          cenario_id:      cenario.id,
          fase:            fase,
          historico_conversa: [],
          status:          'em_andamento'
        })
        .select()
        .single();

      setSessaoAtual(sessao);
      return sessao;

    } catch (err) {
      console.error('[useArena] erro ao iniciar simulação:', err);
      throw err;
    }
  }, [consultorId, lojaId, fase]);

  // ─── Adiciona mensagem ao histórico da sessão ─────
  const adicionarMensagem = useCallback(async (sessaoId, role, content) => {
    try {
      const { data: sessao } = await supabase
        .from('sessoes_simulacao')
        .select('historico_conversa, turnos_total')
        .eq('id', sessaoId)
        .single();

      const novo = [
        ...(sessao.historico_conversa || []),
        { role, content, timestamp: new Date().toISOString() }
      ];

      await supabase
        .from('sessoes_simulacao')
        .update({
          historico_conversa: novo,
          turnos_total: role === 'consultor' ? sessao.turnos_total + 1 : sessao.turnos_total
        })
        .eq('id', sessaoId);

      return novo;

    } catch (err) {
      console.error('[useArena] erro ao adicionar mensagem:', err);
      throw err;
    }
  }, []);

  // ─── Finaliza sessão com feedback ──────────────────
  const finalizarSessao = useCallback(async (sessaoId, fechou, feedback, pontuacao) => {
    try {
      await supabase
        .from('sessoes_simulacao')
        .update({
          status:          'finalizada',
          resultado_fechou: fechou,
          feedback_ia:     feedback,
          pontuacao:       pontuacao,
          finalizada_em:   new Date().toISOString()
        })
        .eq('id', sessaoId);

      setSessaoAtual(null);
      await carregarHistorico();

    } catch (err) {
      console.error('[useArena] erro ao finalizar sessão:', err);
      throw err;
    }
  }, [carregarHistorico]);

  // ─── Abandona sessão ──────────────────────────────
  const abandonarSessao = useCallback(async (sessaoId) => {
    try {
      await supabase
        .from('sessoes_simulacao')
        .update({ status: 'abandonada', finalizada_em: new Date().toISOString() })
        .eq('id', sessaoId);

      setSessaoAtual(null);
      await carregarHistorico();
    } catch (err) {
      console.error('[useArena] erro ao abandonar sessão:', err);
    }
  }, [carregarHistorico]);

  // ─── Effects ──────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        carregarProdutos(),
        verificarAcesso(),
        carregarHistorico()
      ]);
      setLoading(false);
    };
    if (consultorId) init();
  }, [consultorId, lojaId]);

  useEffect(() => {
    carregarCenarios();
  }, [fase]);

  return {
    fase,
    produtos,
    cenarios,
    sessaoAtual,
    historico,
    acesso,
    loading,
    iniciarSimulacao,
    adicionarMensagem,
    finalizarSessao,
    abandonarSessao,
    refetch: () => Promise.all([carregarProdutos(), verificarAcesso(), carregarHistorico()])
  };
}