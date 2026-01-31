/* =====================================================
   STRIPE LINKS - VERSÃO CORRIGIDA
===================================================== */
export const STRIPE_LINKS = {
  BASIC: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
  PRO: "https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02",
  ENTERPRISE: "https://buy.stripe.com/3cI3cv2z6fqQaBM8SJgQE03",

  ADICIONAL_BASIC: "https://buy.stripe.com/aFa28rehOdiIfW60mdgQE04",
  ADICIONAL_VENDEDOR: "https://buy.stripe.com/6oU4gz6Pm1A0cJUed3gQE05",
  ADICIONAL_FILIAL: "https://buy.stripe.com/7sY28r6PmguUcJUglbgQE06",
  ADICIONAL_PRODUTOS: "https://buy.stripe.com/eVqeVd2z66Uk5hs9WNgQE09", // ✅ CORRIGIDO!
  ADICIONAL_ERP: "https://buy.stripe.com/3cI9ATc9G7YodNYfh7gQE08",
};

/* =====================================================
   DETALHES DOS PLANOS
===================================================== */
export const PLANS_DETAILS = {
  "Plano Basico": {
    nome: "Plano Básico",
    valor: 99.90,
    recursos: [
      "Limite de 1 Filial (comprável)",
      "Limite de 10 Vendedores (comprável)",
      "5 Consultores Ativos",
      "Relatórios Padrão Incluídos",
      "Suporte por Email (SLA 48h)",
    ],
    upgradeUrl: STRIPE_LINKS.PRO,
  },

  "Plano Pro": {
    nome: "Plano Pro",
    valor: 199.90,
    recursos: [
      "Limite de 5 Filiais",
      "Limite de 50 Vendedores",
      "Consultores Ilimitados",
      "Relatórios Avançados e BI",
      "Suporte Prioritário (SLA 4h)",
      "Gerenciamento de Fluxo de Caixa",
    ],
    upgradeUrl: STRIPE_LINKS.ENTERPRISE,
  },

  "Plano Enterprise": {
    nome: "Plano Enterprise",
    valor: 499.90, // ✅ CORRIGIDO DE 360 PARA 499.90
    recursos: [
      "Filiais Ilimitadas",
      "Vendedores Ilimitados",
      "Consultores Ilimitados",
      "Relatórios Avançados e BI",
      "Suporte 24/7 Dedicado",
      "Múltiplas Contas Stripe Conectadas",
      "Integração de Sistemas Legados",
    ],
    upgradeUrl: null,
  },
};

/* =====================================================
   ADD-ONS DISPONÍVEIS
===================================================== */
export const ADDONS_DETAILS = [
  {
    nome: "Basic Adicional",
    preco: 49.90,
    link: STRIPE_LINKS.ADICIONAL_BASIC,
    descricao: "Recursos básicos adicionais para complementar seu plano.",
    emBreve: false,
  },
  {
    nome: "Vendedor Adicional",
    preco: 15.00,
    link: STRIPE_LINKS.ADICIONAL_VENDEDOR,
    descricao: "Contrate mais vagas para sua equipe de vendas.",
    emBreve: false,
  },
  {
    nome: "Filial Adicional",
    preco: 25.00,
    link: STRIPE_LINKS.ADICIONAL_FILIAL,
    descricao: "Permite cadastrar uma nova filial.",
    emBreve: false,
  },
  {
    nome: "20 Produtos Adicionais",
    preco: 10.00,
    link: STRIPE_LINKS.ADICIONAL_PRODUTOS,
    descricao: "Adicione mais 20 produtos ao catálogo.",
    emBreve: false,
  },
  {
    nome: "Módulo ERP",
    preco: 59.90,
    link: STRIPE_LINKS.ADICIONAL_ERP,
    descricao: "Gestão completa de pedidos e estoque.",
    emBreve: false,
  },
];

/* =====================================================
   UPGRADES DISPONÍVEIS
===================================================== */
export const AVAILABLE_UPGRADES = [
  "Plano Pro",
  "Plano Enterprise",
];