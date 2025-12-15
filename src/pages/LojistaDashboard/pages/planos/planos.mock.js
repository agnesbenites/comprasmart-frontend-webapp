import api from "../../../../api/adminToken";

/* =====================================================
   BUSCAR DADOS DE PAGAMENTO DO LOJISTA
===================================================== */
export const buscarDadosPagamentos = async (lojistaId) => {
  const response = await api.get(
    `/api/stripe/lojista/${lojistaId}/dados-pagamento`
  );

  return response.data;
};

/* =====================================================
   ABRIR PORTAL DO STRIPE (CUSTOMER PORTAL)
===================================================== */
export const abrirPortalStripeService = async ({
  customerId,
  returnUrl,
}) => {
  const response = await api.post("/api/stripe/portal-session", {
    customerId,
    returnUrl,
  });

  return response.data;
};

/* =====================================================
   ENVIAR FATURA POR EMAIL
===================================================== */
export const enviarFaturaPorEmailService = async (faturaId) => {
  // endpoint real pode variar, deixamos isolado
  const response = await api.post(
    `/api/stripe/faturas/${faturaId}/enviar-email`
  );

  return response.data;
};
