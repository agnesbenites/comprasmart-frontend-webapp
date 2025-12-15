Cypress.Commands.add("loginLojista", () => {
  cy.visit("/lojista/login");

  cy.get('input[placeholder="00.000.000/0000-00"]')
    .should("be.visible")
    .type(Cypress.env("CNPJ_TESTE"));

  cy.contains("Continuar").click();

  cy.get('input[placeholder="seu@email.com"]')
    .should("be.visible")
    .type(Cypress.env("ADMIN_EMAIL"));

  cy.get('input[placeholder="XXXXX"]')
    .type(Cypress.env("ADMIN_PASSWORD"), { log: false });

  cy.contains(/Entrar|🔐/).click();

  cy.url({ timeout: 20000 })
    .should("include", "/lojista/dashboard");
});
