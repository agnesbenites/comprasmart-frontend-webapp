// src/pages/TermsPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    navigate("/register");
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* HEADER */}
        <header style={styles.header}>
          <img 
            src="/img/logo_compra_smart.png" 
            alt="Kaslee" 
            style={styles.logo}
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1 style={styles.title}>
             Termos e Condições de Uso
          </h1>
          <p style={styles.subtitle}>Kaslee</p>
          <div style={styles.versionBox}>
            <span>Versão 1.0.0</span>
            <span>•</span>
            <span>Vigente desde 21/12/2024</span>
          </div>
        </header>

        {/* INTRODUÇÃO */}
        <section style={styles.introSection}>
          <p style={styles.introParagraph}>
            <strong>Leia atentamente antes de prosseguir.</strong> Estes Termos e Condições de Uso regem o acesso e uso da plataforma Kaslee. Ao criar uma conta, acessar ou utilizar nossa Plataforma, você concorda em cumprir e estar vinculado a estes Termos.
          </p>
        </section>

        {/* 1. ACEITAÇÃO DOS TERMOS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             1. Aceitação dos Termos
          </h2>
          <p style={styles.paragraph}>
            Ao clicar em "Aceito os Termos", você concorda integralmente com todas as condições estabelecidas neste documento, de acordo com a <strong>Lei nº 12.965/2014 (Marco Civil da Internet)</strong> e o <strong>Código Civil Brasileiro</strong>.
          </p>
          <div style={styles.alertBox}>
            <p style={styles.alertText}>
              ⚠️ <strong>Atenção:</strong> Usuários específicos (Lojistas, Consultores, Vendedores) também estão sujeitos ao <strong>Termo de Adesão e Contratação de Serviços</strong>, que regula aspectos comerciais e financeiros.
            </p>
          </div>
        </section>

        {/* 2. DESCRIÇÃO DO SERVIÇO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             2. O que é a Kaslee
          </h2>
          <p style={styles.paragraph}>
            A Kaslee é uma plataforma digital que conecta <strong>Lojistas</strong>, <strong>Consultores</strong> e <strong>Clientes</strong> para facilitar vendas com atendimento personalizado.
          </p>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}> Principais funcionalidades:</h3>
            <ul style={styles.list}>
              <li>Sistema de matching entre Clientes e Consultores</li>
              <li>Chat em tempo real</li>
              <li>Processamento de comissões via Stripe</li>
              <li>QR Code para identificação de produtos</li>
              <li>Sistema de avaliações e feedbacks</li>
              <li>Notificações em tempo real</li>
            </ul>
          </div>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>⚠️ A Kaslee NÃO é:</h3>
            <ul style={styles.list}>
              <li>Loja virtual ou e-commerce próprio</li>
              <li>Empregadora de Consultores (são profissionais autônomos)</li>
              <li>Responsável pela qualidade dos produtos dos Lojistas</li>
              <li>Intermediadora de conflitos (atua apenas como facilitadora tecnológica)</li>
            </ul>
          </div>
        </section>

        {/* 3. CADASTRO E CONTA */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             3. Cadastro e Conta de Usuário
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}> Requisitos para Cadastro:</h3>
            <ul style={styles.list}>
              <li>Ter no mínimo <strong>18 anos de idade</strong></li>
              <li>Fornecer informações <strong>verdadeiras e completas</strong></li>
              <li>Manter seus dados cadastrais <strong>atualizados</strong></li>
              <li>Não ter sido previamente banido da Plataforma</li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            <strong>Você é responsável por:</strong> Manter a confidencialidade de suas credenciais, todas as atividades realizadas em sua conta e notificar imediatamente sobre uso não autorizado.
          </p>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>🚫 Proibição de Múltiplas Contas</h3>
            <p>É proibido criar múltiplas contas para burlar sistemas de avaliação, obter vantagens indevidas ou contornar bloqueios.</p>
            <p><strong>Penalidade:</strong> Suspensão ou exclusão permanente de todas as contas.</p>
          </div>
        </section>

        {/* 4. CONDUTAS PROIBIDAS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            🚫 4. Condutas Proibidas
          </h2>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>É expressamente proibido:</h3>
            <ul style={styles.list}>
              <li><strong>Atividades Fraudulentas:</strong> Fornecer informações falsas, realizar transações fraudulentas, burlar sistemas de segurança</li>
              <li><strong>Práticas Comerciais Inadequadas:</strong> Oferecer produtos ilegais, praticar preços abusivos, propaganda enganosa</li>
              <li><strong>Violação de Direitos:</strong> Violar propriedade intelectual, divulgar dados pessoais sem autorização, assediar ou discriminar</li>
              <li><strong>Uso Indevido:</strong> Utilizar robôs/scripts não autorizados, fazer engenharia reversa, sobrecarregar a infraestrutura</li>
              <li><strong>Comunicação Inadequada:</strong> Enviar spam, conteúdo ofensivo, fazer proselitismo, promover esquemas de pirâmide</li>
            </ul>
            <p style={styles.alertText}>
              <strong>Penalidades:</strong> Advertência, suspensão temporária ou exclusão permanente, conforme gravidade.
            </p>
          </div>
        </section>

        {/* 5. PROPRIEDADE INTELECTUAL */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            © 5. Propriedade Intelectual
          </h2>
          <p style={styles.paragraph}>
            Todos os direitos sobre a Plataforma pertencem à Kaslee, incluindo código-fonte, marca, logotipos, design, textos e algoritmos.
          </p>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}>📤 Conteúdo Enviado por Você:</h3>
            <p>Ao enviar conteúdo (fotos, textos, avaliações), você:</p>
            <ul style={styles.list}>
              <li>Concede licença mundial e gratuita para a Kaslee usar e exibir</li>
              <li>Garante que é titular dos direitos ou possui autorização</li>
              <li>Responsabiliza-se por violações de direitos de terceiros</li>
            </ul>
          </div>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>⚖️ Produtos de Marcas de Terceiros (Lojistas)</h3>
            <p>Ao cadastrar produtos de marcas de terceiros, o LOJISTA declara que é revendedor autorizado e possui autorização expressa ou implícita do titular da marca.</p>
            <p>A Kaslee <strong>NÃO verifica</strong> autorizações de revenda e poderá remover produtos mediante notificação de titulares.</p>
          </div>
        </section>

        {/* 6. PAGAMENTOS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             6. Pagamentos e Taxas
          </h2>
          <p style={styles.paragraph}>
            Pagamentos são processados através do <strong>Stripe</strong>, sob responsabilidade do gateway de pagamento.
          </p>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}>A Kaslee NÃO:</h3>
            <ul style={styles.list}>
              <li>Armazena dados de cartão de crédito</li>
              <li>Processa pagamentos diretamente</li>
              <li>É responsável por falhas do gateway</li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            <strong>Reembolsos:</strong> A Kaslee atua como facilitadora e não intermediará disputas. Reembolsos seguem políticas do Lojista e legislação consumerista (CDC).
          </p>
        </section>

        {/* 7. PRIVACIDADE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             7. Privacidade e Proteção de Dados
          </h2>
          <p style={styles.paragraph}>
            O tratamento de dados pessoais é regido por nossa <strong>Política de Privacidade</strong>, em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
          </p>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}>🛡️ Destaques:</h3>
            <ul style={styles.list}>
              <li>Coletamos apenas dados necessários ao serviço</li>
              <li>Não vendemos ou compartilhamos dados com terceiros não autorizados</li>
              <li>Você pode solicitar exclusão de seus dados (direito ao esquecimento)</li>
              <li>Utilizamos criptografia e medidas de segurança</li>
            </ul>
          </div>
        </section>

        {/* 8. LIMITAÇÃO DE RESPONSABILIDADE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            ⚠️ 8. Limitação de Responsabilidade
          </h2>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>A Kaslee NÃO se responsabiliza por:</h3>
            <ul style={styles.list}>
              <li>Funcionamento ininterrupto da Plataforma</li>
              <li>Qualidade, segurança ou legalidade dos produtos dos Lojistas</li>
              <li>Conduta de Consultores, Lojistas ou Clientes</li>
              <li>Transações realizadas fora da Plataforma</li>
              <li>Lucros cessantes ou danos indiretos</li>
              <li>Perda de dados ou oportunidades</li>
            </ul>
            <p style={styles.alertText}>
              <strong>Limite de Indenização:</strong> Em caso de responsabilidade comprovada, o valor máximo será limitado ao valor pago nos últimos 12 meses.
            </p>
          </div>
        </section>

        {/* 9. SUSPENSÃO E EXCLUSÃO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             9. Suspensão e Exclusão de Conta
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}>Suspensão Temporária (até 30 dias)</h3>
            <p>A conta pode ser suspensa em caso de:</p>
            <ul style={styles.list}>
              <li>Suspeita de fraude ou uso indevido</li>
              <li>Inadimplência (para Lojistas)</li>
              <li>Violação dos Termos</li>
              <li>Investigação de denúncias</li>
            </ul>
          </div>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>Exclusão Permanente</h3>
            <p>A conta pode ser excluída permanentemente em caso de:</p>
            <ul style={styles.list}>
              <li>Violações graves ou reincidentes</li>
              <li>Atividades ilegais</li>
              <li>Tentativa de burlar suspensões</li>
              <li>Atendimentos inadequados ou inapropriados</li>
              <li>Reclamações reiteradas</li>
            </ul>
            <p><strong>Consequências:</strong> Perda de acesso, cancelamento de transações e bloqueio de CPF/CNPJ.</p>
          </div>
        </section>

        {/* 10. MODIFICAÇÕES */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             10. Modificações dos Termos
          </h2>
          <p style={styles.paragraph}>
            A Kaslee pode modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas por e-mail e/ou notificação na Plataforma.
          </p>
          <p style={styles.paragraph}>
            <strong>Novas versões entram em vigor 5 dias após a publicação.</strong> O uso continuado da Plataforma após as alterações constitui aceitação.
          </p>
        </section>

        {/* 11. LEI APLICÁVEL */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            ⚖️ 11. Lei Aplicável e Foro
          </h2>
          <p style={styles.paragraph}>
            Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>.
          </p>
          <p style={styles.paragraph}>
            Fica eleito o foro da comarca de <strong>São Paulo/SP</strong> para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro.
          </p>
        </section>

        {/* 12. CONTATO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📧 12. Contato
          </h2>
          <div style={styles.contactBox}>
            <p><strong>E-mail:</strong> suporte@suacomprasmart.com.br</p>
            <p><strong>Encarregado de Dados (DPO):</strong> dpo@suacomprasmart.com.br</p>
          </div>
        </section>

        {/* LINKS PARA OUTROS DOCUMENTOS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
             Documentos Relacionados
          </h2>
          <div style={styles.linksBox}>
            <a 
              href="https://www.notion.so/TERMO-DE-ADES-O-E-CONTRATA-O-DE-SERVI-OS-2cfcb8e9243180a08bbbf914d582e8bf" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.documentLink}
            >
               Termo de Adesão e Contratação de Serviços
            </a>
            <a 
              href="https://www.notion.so/Pol-tica-de-Privacidade-2d1cb8e924318015a8b0dea48170d820" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.documentLink}
            >
               Política de Privacidade
            </a>
          </div>
        </section>

        {/* RODAPÉ COM ACEITAÇÃO */}
        <footer style={styles.footer}>
          <div style={styles.acceptanceBox}>
            <h3 style={styles.acceptanceTitle}> Confirmação de Aceitação</h3>
            <p style={styles.acceptanceText}>
              Ao clicar em "Aceito os Termos", você declara que:
            </p>
            <ul style={styles.acceptanceList}>
              <li>Leu e compreendeu integralmente estes Termos</li>
              <li>Concorda em cumprir todas as disposições</li>
              <li>Tem capacidade legal para contratar</li>
              <li>Aceita estar vinculado a estes Termos</li>
            </ul>
          </div>

          <div style={styles.buttonsContainer}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              ← Voltar
            </button>
            <button onClick={handleAccept} style={styles.acceptButton}>
               Aceito os Termos e Quero Continuar
            </button>
          </div>

          <p style={styles.footerText}>
            Versão 1.0.0 - Vigente desde 21/12/2024<br />
            Kaslee © 2024 - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    minHeight: "100vh",
    padding: "20px",
  },
  content: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "900px",
    margin: "30px auto",
  },
  header: {
    textAlign: "center",
    borderBottom: "3px solid #bb25a6",
    paddingBottom: "25px",
    marginBottom: "30px",
  },
  logo: {
    maxWidth: "150px",
    marginBottom: "15px",
  },
  title: {
    color: "#bb25a6",
    fontSize: "32px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "10px",
  },
  versionBox: {
    display: "inline-flex",
    gap: "10px",
    backgroundColor: "#e7f3ff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    color: "#bb25a6",
    fontWeight: "600",
  },
  introSection: {
    backgroundColor: "#fff3cd",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    border: "2px solid #ffc107",
  },
  introParagraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#856404",
    margin: 0,
    textAlign: "center",
  },
  section: {
    marginBottom: "30px",
    padding: "25px",
    border: "1px solid #e9ecef",
    borderRadius: "12px",
    backgroundColor: "#fafbfc",
  },
  sectionTitle: {
    color: "#1e3a8a",
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "0",
    marginBottom: "15px",
  },
  paragraph: {
    lineHeight: "1.7",
    color: "#333",
    marginBottom: "15px",
    fontSize: "15px",
  },
  list: {
    color: "#333",
    marginBottom: "15px",
    paddingLeft: "25px",
    lineHeight: "1.8",
  },
  highlightBox: {
    backgroundColor: "#e7f3ff",
    padding: "18px",
    borderRadius: "10px",
    margin: "15px 0",
    borderLeft: "4px solid #bb25a6",
  },
  highlightTitle: {
    color: "#1e3a8a",
    marginTop: "0",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "600",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: "18px",
    borderRadius: "10px",
    margin: "15px 0",
    borderLeft: "4px solid #ffc107",
  },
  warningTitle: {
    color: "#856404",
    marginTop: "0",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "600",
  },
  alertBox: {
    backgroundColor: "#f8d7da",
    padding: "15px",
    borderRadius: "8px",
    margin: "15px 0",
    border: "1px solid #dc3545",
  },
  alertText: {
    color: "#721c24",
    margin: 0,
    fontSize: "14px",
  },
  contactBox: {
    backgroundColor: "#e7f3ff",
    padding: "15px",
    borderRadius: "8px",
    lineHeight: "1.8",
  },
  linksBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  documentLink: {
    display: "block",
    padding: "12px 18px",
    backgroundColor: "#bb25a6",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    textAlign: "center",
    transition: "background-color 0.3s",
  },
  footer: {
    borderTop: "3px solid #bb25a6",
    paddingTop: "30px",
    marginTop: "40px",
  },
  acceptanceBox: {
    backgroundColor: "#d4edda",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    border: "2px solid #bb25a6",
  },
  acceptanceTitle: {
    color: "#155724",
    marginTop: "0",
    marginBottom: "12px",
    fontSize: "20px",
    fontWeight: "700",
  },
  acceptanceText: {
    color: "#155724",
    margin: "0 0 10px 0",
    fontSize: "15px",
    fontWeight: "600",
  },
  acceptanceList: {
    color: "#155724",
    paddingLeft: "25px",
    lineHeight: "1.8",
    margin: 0,
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  backButton: {
    padding: "15px 30px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s",
    flex: "1",
    minWidth: "150px",
  },
  acceptButton: {
    padding: "15px 30px",
    backgroundColor: "#bb25a6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    transition: "background-color 0.3s",
    flex: "2",
    minWidth: "200px",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0",
  },
};

export default TermsPage;