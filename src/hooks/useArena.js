// src/hooks/useArena.js
// Gerencia estado da Arena de Vendas pra o consultor
// 🎯 ARENA INDEPENDENTE - SEM VÍNCULO COM LOJISTAS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useArena({ consultorId }) {
  const [fase, setFase]             = useState(1);       // Sempre fase 1 (produtos genéricos)
  const [produtos, setProdutos]     = useState([]);      // Apenas produtos genéricos
  const [cenarios, setCenarios]     = useState([]);
  const [sessaoAtual, setSessaoAtual] = useState(null);
  const [historico, setHistorico]   = useState([]);      // sessões anteriores
  const [loading, setLoading]       = useState(true);

  // ─── Busca produtos genéricos (sempre fase 1) ────────────
  const carregarProdutos = useCallback(async () => {
    if (!consultorId) return;
    
    try {
      const { data: genericos } = await supabase
        .from('produtos_genericos')
        .select('id, nome, descricao, preco, categoria, segmento')
        .eq('ativo', true);

      setProdutos((genericos || []).map(p => ({ ...p, generico: true })));
      setFase(1); // Sempre fase 1

    } catch (err) {
      console.error('[useArena] erro ao carregar produtos:', err);
    }
  }, [consultorId]);

  // ─── Busca cenários disponíveis ────────────
  const carregarCenarios = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('cenarios_simulacao')
        .select('*')
        .eq('ativo', true)
        .lte('fase_minima', 1) // Sempre fase 1
        .order('dificuldade');

      setCenarios(data || []);
    } catch (err) {
      console.error('[useArena] erro ao carregar cenários:', err);
    }
  }, []);

  // ─── Busca histórico de sessões ────────────────────
  const carregarHistorico = useCallback(async () => {
    if (!consultorId) return;
    
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
    if (!consultorId || !produto || !cenario) return;
    
    try {
      // Cria sessão (SEM loja_id)
      const { data: sessao } = await supabase
        .from('sessoes_simulacao')
        .insert({
          consultor_id:    consultorId,
          loja_id:         null, // Arena independente = sem loja
          produto_id:      produto.id,
          produto_generico: true, // Sempre genérico
          cenario_id:      cenario.id,
          fase:            1, // Sempre fase 1
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
  }, [consultorId]);

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
        carregarHistorico()
      ]);
      setLoading(false);
    };
    if (consultorId) init();
  }, [consultorId, carregarProdutos, carregarHistorico]);

  useEffect(() => {
    carregarCenarios();
  }, [carregarCenarios]);

  return {
    fase,          // Sempre 1
    produtos,      // Apenas genéricos
    cenarios,      // Todos disponíveis (fase_minima <= 1)
    sessaoAtual,
    historico,
    loading,
    iniciarSimulacao,
    adicionarMensagem,
    finalizarSessao,
    abandonarSessao,
    refetch: () => Promise.all([carregarProdutos(), carregarHistorico()])
  };
}