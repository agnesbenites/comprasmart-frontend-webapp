import api from "../../../../api/adminToken";

/* =====================================================
   🔎 BUSCAR DADOS DE PAGAMENTO DO LOJISTA
===================================================== */
export const buscarDadosPagamentos = async (lojistaId) => {
  if (!lojistaId) throw new Error("lojistaId não informado");

  // endpoint real
  const response = await api.get(
    `/api/stripe/lojista/${lojistaId}/dados-pagamento`
  );

  return response.data;
};

/* =====================================================
   🔎 BUSCAR ADDONS DO LOJISTA
===================================================== */
export const buscarAddons = async (lojistaId) => {
  if (!lojistaId) throw new Error("lojistaId não informado");

  const response = await api.get(`/api/lojista/${lojistaId}/addons`);
  return response.data;
};

/* =====================================================
   🔎 BUSCAR FATURAS DO LOJISTA
===================================================== */
export const buscarFaturas = async (lojistaId) => {
  if (!lojistaId) throw new Error("lojistaId não informado");

  const response = await api.get(`/api/stripe/lojista/${lojistaId}/faturas`);
  return response.data;
};

/* =====================================================
   🔎 BUSCAR PLANO ATUAL DO LOJISTA
===================================================== */
export const buscarPlanoAtual = async (lojistaId) => {
  if (!lojistaId) throw new Error("lojistaId não informado");

  const response = await api.get(`/api/lojista/${lojistaId}/plano-atual`);
  return response.data;
};

/* =====================================================
   🔎 BUSCAR PLANOS DISPONIVEIS
===================================================== */
export const buscarPlanosDisponiveis = async () => {
  const response = await api.get(`/api/lojista/planos-disponiveis`);
  return response.data;
};

/* =====================================================
   ➕ SOLICITAR UPGRADE DE PLANO
===================================================== */
export const solicitarUpgradePlano = async ({ lojistaId, planoId }) => {
  if (!lojistaId || !planoId) throw new Error("lojistaId e planoId são obrigatórios");

  const response = await api.post(`/api/lojista/${lojistaId}/upgrade-plano`, {
    planoId,
  });

  return response.data;
};

/* =====================================================
   ➕ ABRIR PORTAL DO STRIPE (CUSTOMER PORTAL)
===================================================== */
export const abrirPortalStripeService = async ({ customerId, returnUrl }) => {
  if (!customerId || !returnUrl) throw new Error("customerId e returnUrl são obrigatórios");

  const response = await api.post("/api/stripe/portal-session", {
    customerId,
    returnUrl,
  });

  return response.data;
};

/* =====================================================
   ✉️ ENVIAR FATURA POR EMAIL
===================================================== */
export const enviarFaturaPorEmailService = async (faturaId) => {
  if (!faturaId) throw new Error("faturaId não informado");

  const response = await api.post(`/api/stripe/faturas/${faturaId}/enviar-email`);
  return response.data;
};
