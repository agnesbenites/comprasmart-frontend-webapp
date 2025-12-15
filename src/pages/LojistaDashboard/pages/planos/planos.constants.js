/* =====================================================
   STRIPE LINKS
===================================================== */
export const STRIPE_LINKS = {
  BASIC: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
  PRO: "https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02",
  ENTERPRISE: "https://buy.stripe.com/3cI3cv2z6fqQaBM8SJgQE03",

  ADICIONAL_BASIC: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
  ADICIONAL_VENDEDOR: "https://buy.stripe.com/6oU4gz6Pm1A0cJUed3gQE05",
  ADICIONAL_FILIAL: "https://buy.stripe.com/7sY28r6PmguUcJUglbgQE06",
  ADICIONAL_PRODUTOS: "https://buy.stripe.com/aFa3cv6Pm2E47pAglbgQE00",
  ADICIONAL_MARKETING: "https://buy.stripe.com/aFa28rehOdiIfW60mdgQE04",
  ADICIONAL_ERP: "https://buy.stripe.com/3cI9ATc9G7YodNYfh7gQE08",
};

/* =====================================================
   DETALHES DOS PLANOS
===================================================== */
export const PLANS_DETAILS = {
  "Plano Basico": {
    nome: "Plano Basico",
    valor: 99.9,
    recursos: [
      "Limite de 1 Filial (compravel)",
      "Limite de 10 Vendedores (compravel)",
      "5 Consultores Ativos",
      "Relatorios Padrao Incluidos",
      "Suporte por Email (SLA 48h)",
    ],
    upgradeUrl: STRIPE_LINKS.PRO,
  },

  "Plano Pro": {
    nome: "Plano Pro",
    valor: 199.9,
    recursos: [
      "Limite de 5 Filiais",
      "Limite de 50 Vendedores",
      "Consultores Ilimitados",
      "Relatorios Avancados e BI",
      "Suporte Prioritario (SLA 4h)",
      "Gerenciamento de Fluxo de Caixa",
    ],
    upgradeUrl: STRIPE_LINKS.ENTERPRISE,
  },

  "Plano Enterprise": {
    nome: "Plano Enterprise",
    valor: 360.0,
    recursos: [
      "Filiais Ilimitadas",
      "Vendedores Ilimitados",
      "Consultores Ilimitados",
      "Relatorios Avancados e BI",
      "Suporte 24/7 Dedicado",
      "Multiplas Contas Stripe Conectadas",
      "Integracao de Sistemas Legados",
    ],
    upgradeUrl: null,
  },
};

/* =====================================================
   ADD-ONS DISPONIVEIS
===================================================== */
export const ADDONS_DETAILS = [
  {
    nome: "Basic Adicional",
    preco: 49.9,
    link: STRIPE_LINKS.ADICIONAL_BASIC,
    descricao: "Recursos basicos adicionais para complementar seu plano.",
    emBreve: false,
  },
  {
    nome: "Vendedor Adicional",
    preco: 15.0,
    link: STRIPE_LINKS.ADICIONAL_VENDEDOR,
    descricao: "Contrate mais vagas para sua equipe de vendas.",
    emBreve: false,
  },
  {
    nome: "Filial Adicional",
    preco: 25.0,
    link: STRIPE_LINKS.ADICIONAL_FILIAL,
    descricao: "Permite cadastrar uma nova filial.",
    emBreve: false,
  },
  {
    nome: "20 Produtos Adicionais",
    preco: 10.0,
    link: STRIPE_LINKS.ADICIONAL_PRODUTOS,
    descricao: "Adicione mais 20 produtos ao catalogo.",
    emBreve: false,
  },
  {
    nome: "Campanha de Marketing",
    preco: 25.9,
    link: STRIPE_LINKS.ADICIONAL_MARKETING,
    descricao: "Campanhas automatizadas de engajamento.",
    emBreve: false,
  },
  {
    nome: "Modulo ERP",
    preco: 59.9,
    link: STRIPE_LINKS.ADICIONAL_ERP,
    descricao: "Gestao completa de pedidos e estoque.",
    emBreve: false,
  },
];

/* =====================================================
   UPGRADES DISPONIVEIS
===================================================== */
export const AVAILABLE_UPGRADES = [
  "Plano Pro",
  "Plano Enterprise",
];
