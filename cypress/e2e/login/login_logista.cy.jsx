describe('Fluxo E2E do Consultor: Login e Dashboard', () => {

    it('Deve navegar para o login, autenticar como Consultor e acessar o Dashboard', () => {
        
        const emailValido = 'comprasmartconsult@gmail.com';
        const senhaValida = '@Agnes4398'; // Usando a senha que apareceu no log

        // 1. Visita a Landing Page
        cy.visit('http://localhost:5173'); 
        
        // 2. NAVEGAÇÃO E LOGIN
        cy.contains('button', 'Login').click(); 
        cy.contains('Acessar como Consultor').click(); 
        cy.url().should('include', '/consultor/login'); 

        // 3. Preenche as Credenciais
        cy.get('input[type="email"]').type(emailValido); 
        cy.get('input[type="password"]').type(senhaValida); 
        cy.contains('button', 'Entrar').click(); 

        // 4. VERIFICAÇÃO PÓS-LOGIN
        
        // 🛑 CORRIGIDO: Asserção com a rota minúscula real
        cy.url().should('include', '/consultor/dashboard'); 
        
        // 5. Verifica se o Dashboard carregou
        // 🛑 NOVO CHECK: Procura por um elemento-chave que só aparece DEPOIS que o JS/dados são carregados.
        // Se a busca por 'Painel do Consultor' falhar, tente um texto mais genérico ou um ID.
        cy.contains('h1', 'Painel do Consultor', { timeout: 10000 }).should('be.visible'); 
    });
});