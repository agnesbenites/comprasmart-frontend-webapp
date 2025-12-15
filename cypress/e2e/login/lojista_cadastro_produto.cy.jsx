// cypress/e2e/login/lojista_cadastro_produto.cy.jsx
describe("Login Lojista e Cadastro de Produtos", () => {
  const CNPJ = "123.456.780/000-09";
  const EMAIL = "comprasmartconsult@gmail.com";
  const SENHA = "@Agnes4398";

  /* =========================
     PRODUTOS DE TESTE
  ========================= */
  const produtoRoupa = {
    nome: "Camiseta Básica Algodão",
    categoria: "Moda",
    subcategoriaModa: "roupas",
    genero: "masculino",
    tipoPeca: "camiseta",
    tamanho: "M",
    preco: "49.90",
    comissao: "5",
    estoque: "100",
    estoqueMinimo: "10",
    sku: "CAM-BAS-M-001",
  };

  const produtoSapato = {
    nome: "Tênis Esportivo Runner",
    categoria: "Moda",
    subcategoriaModa: "sapatos",
    genero: "feminino",
    tipoPeca: "tenis",
    tamanho: "38",
    formaAjustada: "forma-menor",
    preco: "199.90",
    comissao: "8",
    estoque: "50",
    estoqueMinimo: "5",
    sku: "TEN-RUN-38-001",
  };

  const produtoEletronico = {
    nome: "Fone Bluetooth Premium",
    categoria: "Eletroeletronicos",
    preco: "89.90",
    comissao: "10",
    estoque: "200",
    estoqueMinimo: "20",
    sku: "FON-BLT-001",
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  /* =========================
     HELPERS
  ========================= */
  const fazerLogin = () => {
    cy.visit("/lojista/login");

    cy.get('input[placeholder="00.000.000/0000-00"]', { timeout: 10000 })
      .should("be.visible")
      .type(CNPJ);

    cy.contains("Continuar →").click();

    cy.get('input[placeholder="seu@email.com"]').should("be.visible").type(EMAIL);
    cy.get('input[placeholder="XXXXX"]').should("be.visible").type(SENHA);

    cy.contains("🔐 Entrar").click();

    cy.url({ timeout: 15000 }).should("include", "/lojista/dashboard");
  };

  const irParaProdutos = () => {
    cy.get("aside", { timeout: 10000 }).should("be.visible");
    cy.get('[data-cy="menu-produtos"]').click();
    
    // Aguarda a URL mudar para /produtos
    cy.url({ timeout: 10000 }).should("include", "/produtos");
    
    // Aguarda o carregamento terminar - espera o formulário OU a mensagem de erro OU a tabela
    cy.get("body", { timeout: 15000 }).should(($body) => {
      const temForm = $body.find('[data-cy="produto-form"]').length > 0;
      const temTabela = $body.find('[data-cy="produtos-table"]').length > 0;
      const temErro = $body.find('[data-cy="produtos-error"]').length > 0;
      const temContainer = $body.find('[data-cy="produtos-container"]').length > 0;
      const aindaCarregando = $body.text().includes("Carregando produtos...");
      
      // Deve ter algum conteúdo final (não estar carregando)
      expect(temForm || temTabela || temErro || temContainer || !aindaCarregando).to.be.true;
    });
    
    // Se ainda estiver carregando, aguarda mais
    cy.get("body").then(($body) => {
      if ($body.text().includes("Carregando produtos...")) {
        // Aguarda até 20 segundos para o carregamento terminar
        cy.contains("Carregando produtos...", { timeout: 20000 }).should("not.exist");
      }
    });
  };

  const preencherCamposBase = (produto) => {
    cy.get('[data-cy="produto-nome"]').clear().type(produto.nome);
    cy.get('[data-cy="produto-categoria"]').select(produto.categoria);
    cy.get('[data-cy="produto-preco"]').clear().type(produto.preco);
    cy.get('[data-cy="produto-comissao"]').clear().type(produto.comissao);
    cy.get('[data-cy="produto-estoque"]').clear().type(produto.estoque);
    cy.get('[data-cy="produto-estoque-minimo"]').clear().type(produto.estoqueMinimo);
    if (produto.sku) {
      cy.get('[data-cy="produto-sku"]').clear().type(produto.sku);
    }
  };

  const preencherCamposModa = (produto) => {
    cy.get('[data-cy="produto-subcategoria"]', { timeout: 5000 }).should("be.visible").select(produto.subcategoriaModa);
    cy.get('[data-cy="produto-genero"]').select(produto.genero);
    cy.get('[data-cy="produto-tipo"]').select(produto.tipoPeca);
    cy.get('[data-cy="produto-tamanho"]').select(produto.tamanho);
    if (produto.formaAjustada) {
      cy.get('[data-cy="produto-forma"]').select(produto.formaAjustada);
    }
  };

  const submeterFormulario = () => {
    cy.get('[data-cy="produto-submit"]').click();
  };

  /* =========================
     TESTES
  ========================= */

  it("01 - Dashboard carrega corretamente", () => {
    fazerLogin();

    cy.get("aside", { timeout: 10000 }).should("be.visible");
    cy.get("h2").contains("CompraSmart").should("be.visible");
    cy.contains("Produtos e Estoque").should("be.visible");

    cy.screenshot("01-dashboard-ok");
  });

  it("02 - Navega para página de Produtos e aguarda carregamento", () => {
    fazerLogin();
    
    cy.get("aside", { timeout: 10000 }).should("be.visible");
    cy.get('[data-cy="menu-produtos"]').click();
    
    // Aguarda URL mudar
    cy.url({ timeout: 10000 }).should("include", "/produtos");
    
    // Tira screenshot para debug
    cy.screenshot("02-produtos-inicial");
    
    // Aguarda até 30 segundos para sair do estado de carregamento
    cy.get("body", { timeout: 30000 }).should("not.contain.text", "Carregando produtos...");
    
    cy.screenshot("02-produtos-carregado");
    
    // Verifica se o formulário apareceu
    cy.get('[data-cy="produto-form"]', { timeout: 5000 }).should("exist");
  });

  it("03 - Cadastra ROUPA com tamanho P/M/G", () => {
    fazerLogin();
    irParaProdutos();

    // Verifica se o formulário está visível
    cy.get('[data-cy="produto-form"]', { timeout: 10000 }).should("be.visible");

    preencherCamposBase(produtoRoupa);
    
    // Aguarda campos de moda aparecerem
    cy.get('[data-cy="produto-subcategoria"]', { timeout: 5000 }).should("be.visible");
    
    preencherCamposModa(produtoRoupa);

    cy.screenshot("03-roupa-preenchida");

    submeterFormulario();

    // Aguarda resposta
    cy.wait(2000);
    
    // Verifica se aparece na tabela
    cy.get('[data-cy="produtos-table"]').should("contain", produtoRoupa.nome);

    cy.screenshot("03-roupa-cadastrada");
  });

  it("04 - Cadastra SAPATO com tamanho numérico", () => {
    fazerLogin();
    irParaProdutos();

    cy.get('[data-cy="produto-form"]', { timeout: 10000 }).should("be.visible");

    preencherCamposBase(produtoSapato);
    preencherCamposModa(produtoSapato);

    cy.screenshot("04-sapato-preenchido");

    submeterFormulario();

    cy.wait(2000);
    
    cy.get('[data-cy="produtos-table"]').should("contain", produtoSapato.nome);

    cy.screenshot("04-sapato-cadastrado");
  });

  it("05 - Cadastra ELETRÔNICO (sem campos de tamanho)", () => {
    fazerLogin();
    irParaProdutos();

    cy.get('[data-cy="produto-form"]', { timeout: 10000 }).should("be.visible");

    preencherCamposBase(produtoEletronico);

    // Verifica que campos de moda NÃO aparecem
    cy.get('[data-cy="produto-subcategoria"]').should("not.exist");
    cy.get('[data-cy="produto-tamanho"]').should("not.exist");

    cy.screenshot("05-eletronico-preenchido");

    submeterFormulario();

    cy.wait(2000);
    
    cy.get('[data-cy="produtos-table"]').should("contain", produtoEletronico.nome);

    cy.screenshot("05-eletronico-cadastrado");
  });

  it("06 - Campos de Moda aparecem/desaparecem conforme categoria", () => {
    fazerLogin();
    irParaProdutos();

    cy.get('[data-cy="produto-form"]', { timeout: 10000 }).should("be.visible");

    // Inicialmente, campos de moda não existem
    cy.get('[data-cy="produto-subcategoria"]').should("not.exist");

    // Seleciona "Moda"
    cy.get('[data-cy="produto-categoria"]').select("Moda");

    // Campos de moda devem aparecer
    cy.get('[data-cy="produto-subcategoria"]').should("be.visible");
    cy.get('[data-cy="produto-genero"]').should("be.visible");

    // Muda para "Eletroeletronicos"
    cy.get('[data-cy="produto-categoria"]').select("Eletroeletronicos");

    // Campos de moda devem sumir
    cy.get('[data-cy="produto-subcategoria"]').should("not.exist");

    cy.screenshot("06-campos-dinamicos-ok");
  });

  it("07 - Tamanhos mudam entre Roupas e Sapatos", () => {
    fazerLogin();
    irParaProdutos();

    cy.get('[data-cy="produto-form"]', { timeout: 10000 }).should("be.visible");

    // Seleciona Moda
    cy.get('[data-cy="produto-categoria"]').select("Moda");

    // Seleciona "roupas"
    cy.get('[data-cy="produto-subcategoria"]').select("roupas");

    // Verifica tamanhos de roupa (PP, P, M, G, etc)
    cy.get('[data-cy="produto-tamanho"] option').should("contain", "M");
    cy.get('[data-cy="produto-tamanho"] option').should("contain", "G");

    cy.screenshot("07-tamanhos-roupa");

    // Muda para "sapatos"
    cy.get('[data-cy="produto-subcategoria"]').select("sapatos");

    // Verifica tamanhos de sapato (33-46)
    cy.get('[data-cy="produto-tamanho"] option').should("contain", "38");
    cy.get('[data-cy="produto-tamanho"] option').should("contain", "42");

    cy.screenshot("07-tamanhos-sapato");
  });

  it("08 - Tabela mostra produtos cadastrados", () => {
    fazerLogin();
    irParaProdutos();

    // Verifica se a tabela existe
    cy.get('[data-cy="produtos-table"]', { timeout: 10000 }).should("exist");
    
    // Verifica badge de estoque baixo
    cy.get('[data-cy="estoque-baixo-count"]').should("exist");

    cy.screenshot("08-tabela-produtos");
  });
});