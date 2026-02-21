import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Crown, Briefcase, Storefront, Users, ChartBar, Gear, Headset, ShoppingCart, Package, ChatCircle, Rocket, Notepad } from "@phosphor-icons/react";

// ----------------------------------------
// ESTILOS
// ----------------------------------------
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', Arial, sans-serif;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const LogoImage = styled.img`
  height: 90px;
  width: auto;
  margin: 0 auto 12px auto;
  display: block;
  object-fit: contain;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #2f0d51;
  margin: 0 0 4px 0;
  font-family: 'Poppins', sans-serif;
`;

const LogoSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const MainContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h2`
  font-size: 28px;
  color: #2f0d51;
  font-weight: 700;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(47,13,81,0.15);
    border-color: #bb25a6;
  }
`;

const CardIconWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3e8ff;
  align-items: center;
  margin: 0 auto 20px auto;
`;

const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #2f0d51;
  margin: 0 0 12px 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const CardDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

const FeatureListItem = styled.li`
  margin-bottom: 10px;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #bb25a6;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

const CardAction = styled.div`
  margin-top: auto;
  padding-top: 16px;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2f0d51, #bb25a6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Poppins', sans-serif;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

const RegisterSection = styled.div`
  text-align: center;
  padding: 28px 24px;
  background: linear-gradient(135deg, #f3e8ff, #fce7f3);
  border-radius: 14px;
  border: 2px dashed #bb25a6;
  margin-bottom: 30px;
`;

const RegisterText = styled.p`
  font-size: 16px;
  color: #2f0d51;
  margin-bottom: 16px;
  font-weight: 500;
`;

const RegisterButton = styled.button`
  padding: 14px 36px;
  background: #bb25a6;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Poppins', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #9e1e8e;
    transform: scale(1.02);
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const BackButton = styled.button`
  padding: 12px 28px;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 50px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s;

  &:hover {
    background-color: #f3e8ff;
    border-color: #bb25a6;
    color: #2f0d51;
  }
`;

// ----------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------
const LojistaEscolha = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Header>
          <LogoWrapper>
            <LogoImage
              src="/img/Logo Clara.png"
              alt="Kaslee"
              onError={e => { e.target.style.display = 'none'; }}
            />
            
            <LogoSubtitle>Área do Lojista</LogoSubtitle>
          </LogoWrapper>
        </Header>

        <MainContent>
          <WelcomeSection>
            <WelcomeTitle>Selecione o Tipo de Acesso</WelcomeTitle>
            <WelcomeText>
              Escolha abaixo o tipo de acesso que deseja para gerenciar seu estabelecimento.
            </WelcomeText>
          </WelcomeSection>

          <CardsContainer>
            {/* Card Lojista Admin */}
            <Card onClick={() => navigate("/lojista/login")}>
              <CardIconWrap>
                <Crown size={32} weight="duotone" color="#bb25a6" />
              </CardIconWrap>
              <CardTitle>Lojista (Admin)</CardTitle>
              <CardDescription>
                Acesso completo ao painel administrativo com gestão de lojas,
                vendedores, relatórios e configurações do sistema.
              </CardDescription>
              <FeaturesList>
                <FeatureListItem>Gestão de múltiplas lojas</FeatureListItem>
                <FeatureListItem>Cadastro de vendedores</FeatureListItem>
                <FeatureListItem>Relatórios detalhados</FeatureListItem>
                <FeatureListItem>Configurações do sistema</FeatureListItem>
              </FeaturesList>
              <CardAction>
                <CardButton>Acessar Painel Admin</CardButton>
              </CardAction>
            </Card>

            {/* Card Vendedor */}
            <Card onClick={() => navigate("/vendedor/login")}>
              <CardIconWrap style={{ background: '#ede9fe' }}>
                <Briefcase size={32} weight="duotone" color="#2f0d51" />
              </CardIconWrap>
              <CardTitle>Vendedor</CardTitle>
              <CardDescription>
                Acesso ao sistema de vendas com ferramentas para atendimento,
                gestão de pedidos e comunicação integrada.
              </CardDescription>
              <FeaturesList>
                <FeatureListItem>Atendimento ao cliente</FeatureListItem>
                <FeatureListItem>Sistema de chamadas/vídeo</FeatureListItem>
                <FeatureListItem>Gestão de pedidos</FeatureListItem>
                <FeatureListItem>Mensagens integradas</FeatureListItem>
              </FeaturesList>
              <CardAction>
                <CardButton>Acessar Sistema</CardButton>
              </CardAction>
            </Card>
          </CardsContainer>

          <RegisterSection>
            <RegisterText>
              <strong>Ainda não usa o Kaslee?</strong> Cadastre sua loja e comece a vender hoje mesmo!
            </RegisterText>
            <RegisterButton onClick={() => navigate("/lojista/cadastro")}>
              <Rocket size={18} weight="duotone" />
              Cadastre-se Grátis
            </RegisterButton>
          </RegisterSection>

          <Footer>
            <BackButton onClick={() => navigate("/entrar")}>
              ← Voltar para escolha de perfil
            </BackButton>
          </Footer>
        </MainContent>
      </Content>
    </Container>
  );
};

export default LojistaEscolha;