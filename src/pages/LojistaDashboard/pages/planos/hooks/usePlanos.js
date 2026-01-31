// src/pages/LojistaDashboard/pages/planos/hooks/usePlanos.js - CORRIGIDO
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { usePlano } from "../../../../../contexts/PlanoContext";
import { PLANS_DETAILS, ADDONS_DETAILS, STRIPE_LINKS, AVAILABLE_UPGRADES } from "../planos.constants";

/**
 * Hook central de Planos
 * Busca dados do lojista logado e gerencia planos/pagamentos
 */
export const usePlanos = () => {
  const { user, profile } = useAuth();
  const { plano: planoAtualTipo } = usePlano(); // ✅ USAR O PLANOCONTEXT
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [planoAtual, setPlanoAtual] = useState(null);
  const [faturas, setFaturas] = useState([]);
  const [addons, setAddons] = useState([]);
  const [availableUpgrades, setAvailableUpgrades] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    content: null,
  });

  /* =========================
     MAPEAR PLANO DO BANCO PARA NOME DISPLAY
  ========================== */
  const mapearPlano = (planoDb) => {
    const mapa = {
      'basic': 'Plano Basico',
      'basico': 'Plano Basico',
      'pro': 'Plano Pro',
      'enterprise': 'Plano Enterprise',
    };
    return mapa[planoDb?.toLowerCase()] || 'Plano Basico';
  };

  /* =========================
     FILTRAR ADDONS POR PLANO ✅ NOVO
  ========================== */
  const filtrarAddonsPorPlano = (todosAddons, planoNome) => {
    if (!todosAddons || !planoNome) return [];

    return todosAddons.filter(addon => {
      const nomeAddon = addon.nome?.toLowerCase() || '';
      
      // PLANO BÁSICO - só pode comprar "Basic Adicional"
      if (planoNome === 'Plano Basico') {
        return nomeAddon.includes('basic') || nomeAddon.includes('básico');
      }

      // PLANO PRO - pode comprar: vendedor, produtos, filial, ERP
      if (planoNome === 'Plano Pro') {
        return (
          nomeAddon.includes('vendedor') ||
          nomeAddon.includes('produtos') ||
          nomeAddon.includes('filial') ||
          nomeAddon.includes('erp')
        );
      }

      // PLANO ENTERPRISE - pode comprar: vendedor, produtos, filial (NÃO ERP)
      if (planoNome === 'Plano Enterprise') {
        return (
          nomeAddon.includes('vendedor') ||
          nomeAddon.includes('produtos') ||
          nomeAddon.includes('filial')
        ) && !nomeAddon.includes('erp');
      }

      return false;
    });
  };

  /* =========================
     CARREGAR DADOS
  ========================== */
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ USAR O PLANO DO PLANOCONTEXT
      const planoNome = mapearPlano(planoAtualTipo);
      const planoInfo = PLANS_DETAILS[planoNome] || PLANS_DETAILS["Plano Basico"];
      
      setPlanoAtual({
        id: planoNome,
        nome: planoInfo.nome,
        valor: planoInfo.valor,
        recursos: planoInfo.recursos,
        upgradeUrl: planoInfo.upgradeUrl,
        status: "ativo",
      });

      // Define upgrades disponíveis baseado no plano atual
      const upgradesDisponiveis = [];
      if (planoNome === "Plano Basico") {
        upgradesDisponiveis.push(
          { ...PLANS_DETAILS["Plano Pro"], id: "pro", stripeLink: STRIPE_LINKS.PRO },
          { ...PLANS_DETAILS["Plano Enterprise"], id: "enterprise", stripeLink: STRIPE_LINKS.ENTERPRISE }
        );
      } else if (planoNome === "Plano Pro") {
        upgradesDisponiveis.push(
          { ...PLANS_DETAILS["Plano Enterprise"], id: "enterprise", stripeLink: STRIPE_LINKS.ENTERPRISE }
        );
      }
      setAvailableUpgrades(upgradesDisponiveis);

      // ✅ FILTRAR add-ons disponíveis baseado no plano
      const todosAddons = ADDONS_DETAILS.map((addon, index) => ({
        id: index + 1,
        ...addon,
        ativo: false,
      }));

      const addonsFiltrados = filtrarAddonsPorPlano(todosAddons, planoNome);
      setAddons(addonsFiltrados);

      // Faturas (mock por enquanto)
      setFaturas([]);

    } catch (err) {
      console.error("Erro ao carregar dados de planos:", err);
      setError("Não foi possível carregar as informações do plano.");
    } finally {
      setLoading(false);
    }
  }, [planoAtualTipo]);

  /* =========================
     MODAL
  ========================== */
  const abrirModalUpgrade = (plano) => {
    setModal({ open: true, content: plano });
  };

  const fecharModal = () => {
    setModal({ open: false, content: null });
  };

  /* =========================
     REDIRECIONAR PARA STRIPE
  ========================== */
  const redirecionarParaLinkDeVenda = (item) => {
    const link = item?.stripeLink || item?.link;
    
    if (link) {
      localStorage.setItem("stripe_redirect_pending", JSON.stringify({
        itemId: item.id,
        itemNome: item.nome,
        timestamp: Date.now(),
      }));
      
      window.location.href = link;
    } else {
      setError("Link de pagamento não encontrado.");
    }
    
    fecharModal();
  };

  /* =========================
     PORTAL DO STRIPE
  ========================== */
  const abrirPortalStripe = async () => {
    try {
      setLoading(true);
      setError("Portal do Stripe ainda não configurado. Entre em contato com o suporte.");
    } catch (err) {
      setError("Erro ao abrir portal do Stripe.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CRIAR CONTA STRIPE
  ========================== */
  const criarContaStripe = async () => {
    try {
      setLoading(true);
      setSuccess("Conta Stripe será configurada em breve!");
    } catch (err) {
      setError("Erro ao criar conta Stripe.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AÇÕES DE FATURAS
  ========================== */
  const baixarFatura = (faturaId) => {
    console.log("Baixar fatura:", faturaId);
  };

  const visualizarFatura = (faturaId) => {
    console.log("Visualizar fatura:", faturaId);
  };

  const enviarFaturaPorEmail = async (faturaId) => {
    try {
      setSuccess("Fatura enviada por e-mail!");
    } catch (err) {
      setError("Erro ao enviar fatura.");
    }
  };

  /* =========================
     VERIFICAR RETORNO DO STRIPE
  ========================== */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stripeStatus = urlParams.get("stripe_status") || urlParams.get("success");
    
    if (stripeStatus === "success" || stripeStatus === "true") {
      setSuccess("🎉 Pagamento realizado com sucesso! Seu plano foi atualizado.");
      localStorage.removeItem("stripe_redirect_pending");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (stripeStatus === "cancel" || stripeStatus === "false") {
      setError("Pagamento cancelado. Você pode tentar novamente.");
      localStorage.removeItem("stripe_redirect_pending");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  /* =========================
     EFFECT: Carregar dados
  ========================== */
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    loading,
    error,
    success,

    planoAtual,
    faturas,
    addons,
    availableUpgrades,

    modal,
    abrirModalUpgrade,
    fecharModal,

    abrirPortalStripe,
    criarContaStripe,

    redirecionarParaLinkDeVenda,

    baixarFatura,
    visualizarFatura,
    enviarFaturaPorEmail,

    reload: carregarDados,
  };
};

export default usePlanos;