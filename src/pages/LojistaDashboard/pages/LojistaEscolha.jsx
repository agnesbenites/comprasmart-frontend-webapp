import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; // Importa a biblioteca

// ----------------------------------------
// ESTILOS CONVERTIDOS PARA STYLED COMPONENTS
// ----------------------------------------

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const LogoImage = styled.img`
  width: 70px;
  height: 70px;
  margin: 0 auto 15px auto;
  display: block;
`;

const LogoText = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #2c5aa0;
  margin: 0 0 5px 0;
`;

const LogoSubtitle = styled.p`
  font-size: 18px;
  color: #666;
`;

const MainContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const WelcomeTitle = styled.h2`
  font-size: 32px;
  color: #333;
  font-weight: bold;
`;

const WelcomeText = styled.p`
  font-size: 18px;
  color: #666;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
`;

// O uso de '&:hover' substitui todo o seu código 'useEffect'
const Card = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 480px;

  /* Estilo hover nativo e eficiente */
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border-color: #2c5aa0;
  }
`;

const CardIcon = styled.div`
  font-size: 60px;
  margin-bottom: 25px;
  text-align: center;
`;

const CardContent = styled.div`
  /* Estilo do conteúdo (se houver) */
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  text-align: center;
`;

const CardDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 25px 0;
  color: #333;
  text-align: left;
`;

const FeatureListItem = styled.li`
  margin-bottom: 10px;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const CardAction = styled.div`
  margin-top: auto;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #2c5aa0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  /* Estilo hover nativo e eficiente */
  &:hover {
    background-color: #1b3670;
  }
`;

const Footer = styled.div`
  text-align: center;
`;

const BackButton = styled.button`
  padding: 12px 30px;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;

  /* Estilo hover nativo e eficiente */
  &:hover {
    background-color: #f8f9fa;
    border-color: #999;
  }
`;

// ----------------------------------------
// COMPONENTE PRINCIPAL COM JSX LIMPO
// ----------------------------------------

const LojistaEscolha = () => {
  const navigate = useNavigate();

  // Removemos o useEffect para hover, pois o Styled Components lida com isso.

  return (
    <Container>
      <Content>
        {/* Header */}
        <Header>
          <LogoWrapper>
            <LogoImage
              src="/img/logo_compra_smart.png"
              alt="Logo Compra Smart"
            />
            <LogoText>Compra Smart</LogoText>
            <LogoSubtitle>Área do Lojista</LogoSubtitle>
          </LogoWrapper>
        </Header>

        {/* Conteúdo Principal */}
        <MainContent>
          <WelcomeSection>
            <WelcomeTitle>Selecione o Tipo de Acesso</WelcomeTitle>
            <WelcomeText>
              Escolha abaixo o tipo de acesso que deseja para gerenciar seu
              estabelecimento.
            </WelcomeText>
          </WelcomeSection>

          <CardsContainer>
            {/* Card Admin */}
            <Card onClick={() => navigate("/lojista/login")}>
              <CardIcon>👑</CardIcon>
              <CardContent>
                <CardTitle>Administrador</CardTitle>
                <CardDescription>
                  Acesso completo ao painel administrativo com gestão de lojas,
                  vendedores, relatórios e configurações do sistema.
                </CardDescription>
                <FeaturesList>
                  <FeatureListItem>
                    ✅ Gestão de múltiplas lojas
                  </FeatureListItem>
                  <FeatureListItem>✅ Cadastro de vendedores</FeatureListItem>
                  <FeatureListItem>✅ Relatórios detalhados</FeatureListItem>
                  <FeatureListItem>✅ Configurações do sistema</FeatureListItem>
                </FeaturesList>
              </CardContent>
              <CardAction>
                <CardButton>Acessar Painel Admin</CardButton>
              </CardAction>
            </Card>

            {/* Card Vendedor */}
            <Card onClick={() => navigate("/vendedor/login")}>
              <CardIcon>💼</CardIcon>
              <CardContent>
                <CardTitle>Vendedor</CardTitle>
                <CardDescription>
                  Acesso ao sistema de vendas com ferramentas para atendimento,
                  gestão de pedidos e comunicação integrada.
                </CardDescription>
                <FeaturesList>
                  <FeatureListItem>✅ Atendimento ao cliente</FeatureListItem>
                  <FeatureListItem>
                    ✅ Sistema de chamadas/vídeo
                  </FeatureListItem>
                  <FeatureListItem>✅ Gestão de pedidos</FeatureListItem>
                  <FeatureListItem>✅ Mensagens integradas</FeatureListItem>
                </FeaturesList>
              </CardContent>
              <CardAction>
                <CardButton>Acessar Sistema</CardButton>
              </CardAction>
            </Card>
          </CardsContainer>

          {/* Botão Voltar */}
          <Footer>
            <BackButton onClick={() => navigate("/")}>
              ← Voltar para a página inicial
            </BackButton>
          </Footer>
        </MainContent>
      </Content>
    </Container>
  );
};

export default LojistaEscolha;
