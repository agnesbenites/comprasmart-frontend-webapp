// src/pages/LojistaDashboard/pages/planos/hooks/usePlanos.js
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { PLANS_DETAILS, ADDONS_DETAILS, STRIPE_LINKS, AVAILABLE_UPGRADES } from "../planos.constants";

/**
 * Hook central de Planos
 * Busca dados do lojista logado e gerencia planos/pagamentos
 */
export const usePlanos = () => {
  const { user, profile } = useAuth();
  
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
     CARREGAR DADOS
  ========================== */
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca o plano do usuário (por enquanto usa dados locais/mock)
      // TODO: Quando tiver backend, buscar de /api/lojista/{id}/plano
      
      const planoNome = profile?.plano || localStorage.getItem("lojistaPlano") || "Plano Basico";
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

      // Carrega add-ons disponíveis
      setAddons(ADDONS_DETAILS.map((addon, index) => ({
        id: index + 1,
        ...addon,
        ativo: false,
      })));

      // Faturas (mock por enquanto)
      // TODO: Buscar de /api/stripe/lojista/{id}/faturas
      setFaturas([]);

    } catch (err) {
      console.error("Erro ao carregar dados de planos:", err);
      setError("Não foi possível carregar as informações do plano.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

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
      // Salva informações para quando voltar do Stripe
      localStorage.setItem("stripe_redirect_pending", JSON.stringify({
        itemId: item.id,
        itemNome: item.nome,
        timestamp: Date.now(),
      }));
      
      // Redireciona para o Stripe
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
      
      // TODO: Chamar API para criar sessão do portal
      // const response = await api.post("/api/stripe/portal-session", {
      //   customerId: profile.stripeCustomerId,
      //   returnUrl: window.location.href,
      // });
      // window.location.href = response.data.url;
      
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
      
      // TODO: Chamar API para criar conta Stripe Connect
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
    // TODO: Implementar download
  };

  const visualizarFatura = (faturaId) => {
    console.log("Visualizar fatura:", faturaId);
    // TODO: Implementar visualização
  };

  const enviarFaturaPorEmail = async (faturaId) => {
    try {
      // TODO: Chamar API
      setSuccess("Fatura enviada por e-mail!");
    } catch (err) {
      setError("Erro ao enviar fatura.");
    }
  };

  /* =========================
     VERIFICAR RETORNO DO STRIPE
  ========================== */
  useEffect(() => {
    // Verifica se está voltando do Stripe (success ou cancel)
    const urlParams = new URLSearchParams(window.location.search);
    const stripeStatus = urlParams.get("stripe_status") || urlParams.get("success");
    
    if (stripeStatus === "success" || stripeStatus === "true") {
      setSuccess("🎉 Pagamento realizado com sucesso! Seu plano foi atualizado.");
      
      // Limpa o localStorage
      localStorage.removeItem("stripe_redirect_pending");
      
      // Remove query params da URL
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