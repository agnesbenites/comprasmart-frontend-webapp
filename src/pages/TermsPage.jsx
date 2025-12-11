// web-consultor/src/pages/TermsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    navigate("/register");
  };

  // cones para cada secao
  const icons = {
    contract: "",
    payment: "",
    data: "",
    recording: "",
    curriculum: "",
    security: "",
    obligations: "–",
    intellectual: "",
    termination: "",
    changes: "",
    jurisdiction: "",
    relationship: "",
    manual: "",
    service: "",
    responsibility: " ",
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            {icons.contract} Termos e Condicoes de Uso - Compra Smart
          </h1>
          <p style={styles.paragraphIntro}>
            <strong>
              Leia atentamente antes de prosseguir com seu cadastro como
              consultor.
            </strong>
            Este contrato rege sua relacao com a plataforma Compra Smart e
            estabelece direitos, obrigacoes e condicoes comerciais.
          </p>
        </header>

        {/* 1. ACEITACAO DOS TERMOS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.contract} 1. Aceitacao dos Termos
          </h2>
          <p style={styles.paragraph}>
            Ao clicar em "Aceito os Termos", voca concorda integralmente com
            todas as condicoes aqui estabelecidas, nos termos do{" "}
            <strong>artigo 421 do Codigo Civil Brasileiro</strong> e da{" "}
            <strong>Lei nu 12.965/2014 (Marco Civil da Internet)</strong>.
          </p>
        </section>

        {/* 2. RELACIONAMENTO CONTRATUAL */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.relationship} 2. Relacionamento Contratual e Vinculo
            Trabalhista
          </h2>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>
               Ausancia de Vinculo Empregaticio
            </h3>
            <ul style={styles.list}>
              <li>
                <strong>Consultores cadastrados diretamente:</strong> Nao
                possuem vinculo trabalhista com a plataforma ou com as lojas
              </li>
              <li>
                <strong>Vendedores cadastrados por lojistas:</strong> Devem
                possuir vinculo trabalhista proprio com a loja (CLT, contrato,
                etc.)
              </li>
              <li>
                <strong>Desobrigacao da plataforma:</strong> A Compra Smart esta
                totalmente desobrigada de qualquer reclamacao na esfera
                trabalhista
              </li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            Este contrato caracteriza-se como{" "}
            <strong>prestacao de servicos aut´noma</strong>, nos termos do
            artigo 593 do Codigo Civil Brasileiro.
          </p>
        </section>

        {/* 3. MODELO DE REMUNERACAO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.payment} 3. Modelo de Remuneracao e Comissoes
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}> Como funciona seu ganho:</h3>
            <ul style={styles.list}>
              <li>
                <strong>Percentual minimo:</strong> 3% do valor do produto
                (percentual base estabelecido)
              </li>
              <li>
                <strong>Percentual por venda:</strong> Voca recebera um
                percentual sobre o valor de cada venda concretizada
              </li>
              <li>
                <strong>Definicao pelo lojista:</strong> Cada loja parceira
                define seus proprios percentuais por produto/categoria
              </li>
              <li>
                <strong>Transparancia:</strong> Os percentuais serao claramente
                informados antes de cada atendimento
              </li>
              <li>
                <strong>Pagamento:</strong> Repasses realizados mensalmente, ate
                o 5u dia util do mas subsequente
              </li>
            </ul>
          </div>
        </section>

        {/* 4. LIMITACOES DE RESPONSABILIDADE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.responsibility} 4. Limitacoes de Responsabilidade da
            Plataforma
          </h2>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}>
                A plataforma NAO se responsabiliza por:
            </h3>
            <ul style={styles.list}>
              <li>
                <strong>Alteracoes nos percentuais de comissao</strong>{" "}
                realizadas pelas lojas
              </li>
              <li>
                <strong>Alteracoes de valores dos produtos</strong> realizadas
                pela loja
              </li>
              <li>
                <strong>Campanhas promocionais</strong> como datas comemorativas
                ou datas comerciais
              </li>
              <li>
                <strong>Disponibilidade de produtos</strong> em estoque das
                lojas
              </li>
              <li>
                <strong>Problemas de entrega</strong> ou logistica dos produtos
              </li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            O consultor deve sempre verificar as condicoes atualizadas
            diretamente com cada loja antes dos atendimentos.
          </p>
        </section>

        {/* 5. MANUAL DE BOAS PRTICAS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.manual} 5. Manual de Boas Praticas de Atendimento
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}>
               Compromisso com a Qualidade:
            </h3>
            <ul style={styles.list}>
              <li>
                <strong>Leitura obrigatoria:</strong> Apos aprovacao, o
                consultor devera realizar a leitura completa do manual
                disponivel em sua home
              </li>
              <li>
                <strong>Atualizacoes:</strong> O manual podera ser atualizado
                periodicamente
              </li>
              <li>
                <strong>Conformidade:</strong> O nao cumprimento podera resultar
                em suspensao da plataforma
              </li>
            </ul>
          </div>
        </section>

        {/* 6. PADRAO DE ATENDIMENTO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.service} 6. Padrao de Atendimento ao Cliente
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}> Compromissos do Consultor:</h3>
            <ul style={styles.list}>
              <li>
                <strong>Atender  s necessidades principais</strong> do cliente
                de maneira respeitosa e formal
              </li>
              <li>
                <strong>Nao realizar inducao de vendas</strong> ou praticas
                comerciais agressivas
              </li>
              <li>
                <strong>Garantir que o cliente faca a melhor escolha</strong>{" "}
                baseada em suas reais necessidades
              </li>
              <li>
                <strong>
                  Fornecer informacoes claras, precisas e honestas
                </strong>{" "}
                sobre os produtos
              </li>
              <li>
                <strong>Manter postura profissional</strong> em todos os
                atendimentos
              </li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            O consultor atua como <strong>facilitador da melhor escolha</strong>
            , nao como vendedor tradicional.
          </p>
        </section>

        {/* 7. PROTECAO DE DADOS PESSOAIS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.data} 7. Protecao de Dados Pessoais - LGPD
          </h2>
          <p style={styles.paragraph}>
            Conforme a{" "}
            <strong>Lei Geral de Protecao de Dados (Lei nu 13.709/2018)</strong>
            , seus dados serao utilizados para:
          </p>
          <ul style={styles.list}>
            <li>Verificacao de identidade e analise cadastral</li>
            <li>Processamento de pagamentos e repasse de comissoes</li>
            <li>Comunicacao sobre servicos e atualizacoes da plataforma</li>
            <li>Melhoria da experiancia do usuario</li>
          </ul>
          <p style={styles.paragraph}>
            Voca tem direito   <strong>revogacao do consentimento</strong> a
            qualquer momento, nos termos do artigo 8u da LGPD.
          </p>
        </section>

        {/* 8. DIREITO DE USO DE IMAGEM E GRAVACOES */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.recording} 8. Direito de Uso de Imagem e Gravacoes
          </h2>
          <div style={styles.highlightBox}>
            <h3 style={styles.highlightTitle}> Autorizacoes concedidas:</h3>
            <ul style={styles.list}>
              <li>
                <strong>Gravacao de atendimentos:</strong> Autoriza a gravacao
                de video e audio durante os atendimentos
              </li>
              <li>
                <strong>Finalidade:</strong> Garantir qualidade do servico,
                treinamento e resolucao de conflitos
              </li>
              <li>
                <strong>Uso da imagem:</strong> Autoriza o uso de sua imagem
                para fins promocionais da plataforma
              </li>
              <li>
                <strong>Armazenamento:</strong> Gravacoes armazenadas por ate
                180 dias, conforme necessidade legal
              </li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            Base legal: <strong>Lei nu 9.610/98 (Direito Autoral)</strong> e{" "}
            <strong>Art. 20 do Codigo Civil</strong> sobre uso de imagem.
          </p>
        </section>

        {/* 9. ANLISE DE CURRCULO POR IA */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.curriculum} 9. Analise de Curriculo por Inteligancia
            Artificial
          </h2>
          <p style={styles.paragraph}>
            Voca autoriza expressamente a analise automatizada de seu curriculo
            por sistemas de IA para:
          </p>
          <ul style={styles.list}>
            <li>Identificacao de areas de atuacao e especialidades</li>
            <li>Compatibilizacao com lojas e segmentos parceiros</li>
            <li>Sugestao de capacitacoes e melhorias</li>
            <li>Otimizacao do matching com oportunidades</li>
          </ul>
          <p style={styles.paragraph}>
            <strong>Garantia de veracidade:</strong> Voca declara sob as penas
            da lei que todas as informacoes sao verdadeiras.
          </p>
        </section>

        {/* 10. SEGURANCA E CONTRATO DE CONFIDENCIALIDADE */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.security} 10. Seguranca e Confidencialidade
          </h2>
          <div style={styles.warningBox}>
            <h3 style={styles.warningTitle}> Obrigacoes do Consultor:</h3>
            <ul style={styles.list}>
              <li>
                <strong>Sigilo absoluto</strong> sobre informacoes de clientes e
                lojas
              </li>
              <li>
                <strong>Proibicao</strong> de compartilhamento de dados fora da
                plataforma
              </li>
              <li>
                <strong>Nao utilizacao</strong> de informacoes para fins
                pessoais
              </li>
              <li>
                <strong>Comunicacao imediata</strong> em caso de violacao de
                seguranca
              </li>
            </ul>
          </div>
          <p style={styles.paragraph}>
            O descumprimento resultara em <strong>suspensao imediata</strong> e{" "}
            <strong>medidas legais cabiveis</strong>.
          </p>
        </section>

        {/* 11. OBRIGACOES DO CONSULTOR */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.obligations} 11. Obrigacoes do Consultor
          </h2>
          <ul style={styles.list}>
            <li>
              Manter conduta etica e profissional em todos os atendimentos
            </li>
            <li>Cumprir prazos e compromissos assumidos com clientes</li>
            <li>Atualizar informacoes cadastrais quando necessario</li>
            <li>Respeitar a politica de cancelamento e reagendamento</li>
            <li>Zelar pela imagem e reputacao da plataforma</li>
            <li>Seguir o manual de boas praticas de atendimento</li>
            <li>Nao praticar inducao de vendas agressiva</li>
          </ul>
        </section>

        {/* 12. PROPRIEDADE INTELECTUAL */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.intellectual} 12. Propriedade Intelectual
          </h2>
          <p style={styles.paragraph}>
            Todo o conteudo, marcas, software e metodologias da plataforma sao
            de propriedade exclusiva da Compra Smart, protegidos pela{" "}
            <strong>Lei nu 9.279/96 (Lei de Propriedade Industrial)</strong> e{" "}
            <strong>Lei nu 9.609/98 (Software)</strong>.
          </p>
        </section>

        {/* 13. RESCISAO DO CONTRATO */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.termination} 13. Rescisao do Contrato
          </h2>
          <p style={styles.paragraph}>
            O contrato podera ser rescindido por qualquer das partes, mediante
            aviso previo de 30 dias, ou imediatamente em caso de descumprimento
            grave das obrigacoes aqui estabelecidas.
          </p>
        </section>

        {/* 14. ALTERACOES DOS TERMOS */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.changes} 14. Alteracoes dos Termos
          </h2>
          <p style={styles.paragraph}>
            A Compra Smart podera alterar estes termos a qualquer momento,
            mediante comunicacao com 30 dias de antecedancia. O uso continuado
            da plataforma apos as alteracoes constitui aceitacao dos novos
            termos.
          </p>
        </section>

        {/* 15. FORO E LEGISLACAO APLICVEL */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {icons.jurisdiction} 15. Foro e Legislacao Aplicavel
          </h2>
          <p style={styles.paragraph}>
            Fica eleito o Foro da Comarca de Sao Paulo/SP para dirimir quaisquer
            questoes decorrentes deste contrato, renunciando expressamente a
            qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        {/* RODAP‰ COM ACEITACAO */}
        <footer style={styles.footer}>
          <div style={styles.acceptanceBox}>
            <h3 style={styles.acceptanceTitle}> Confirmacao de Aceitacao</h3>
            <p style={styles.acceptanceText}>
              Ao clicar em "Aceito os Termos", voca declara ter lido,
              compreendido e concordado com todas as condicoes acima, incluindo
              especialmente a <strong>ausancia de vinculo trabalhista</strong>,
              o <strong>percentual minimo de 3%</strong>, a{" "}
              <strong>leitura obrigatoria do manual de boas praticas</strong> e
              as <strong>limitacoes de responsabilidade da plataforma</strong>.
            </p>
          </div>

          <div style={styles.buttonsContainer}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
               Voltar
            </button>
            <button onClick={handleAccept} style={styles.acceptButton}>
               Aceito os Termos e Quero Continuar
            </button>
          </div>
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
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    lineHeight: "1.6",
  },
  content: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "900px",
    margin: "30px 0",
  },
  header: {
    borderBottom: "2px solid #364fab",
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  title: {
    color: "#364fab",
    fontSize: "28px",
    marginBottom: "15px",
    textAlign: "center",
  },
  paragraphIntro: {
    lineHeight: "1.6",
    color: "#333",
    fontSize: "16px",
    textAlign: "center",
    borderLeft: "none",
    paddingLeft: "0",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #e9ecef",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    color: "#1b3670",
    marginTop: "0",
    marginBottom: "15px",
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  paragraph: {
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "15px",
    fontSize: "14px",
  },
  list: {
    color: "#555",
    marginBottom: "15px",
    paddingLeft: "20px",
  },
  highlightBox: {
    backgroundColor: "#e7f3ff",
    padding: "15px",
    borderRadius: "8px",
    margin: "15px 0",
    borderLeft: "4px solid #364fab",
  },
  highlightTitle: {
    color: "#1b3670",
    marginTop: "0",
    marginBottom: "10px",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: "15px",
    borderRadius: "8px",
    margin: "15px 0",
    borderLeft: "4px solid #ffc107",
  },
  warningTitle: {
    color: "#856404",
    marginTop: "0",
    marginBottom: "10px",
  },
  acceptanceBox: {
    backgroundColor: "#d4edda",
    padding: "20px",
    borderRadius: "8px",
    margin: "30px 0",
    border: "1px solid #c3e6cb",
  },
  acceptanceTitle: {
    color: "#155724",
    marginTop: "0",
    marginBottom: "10px",
  },
  acceptanceText: {
    color: "#155724",
    margin: "0",
    fontSize: "14px",
  },
  footer: {
    borderTop: "2px solid #364fab",
    paddingTop: "30px",
    marginTop: "30px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: "15px 25px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  acceptButton: {
    padding: "15px 25px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default TermsPage;

