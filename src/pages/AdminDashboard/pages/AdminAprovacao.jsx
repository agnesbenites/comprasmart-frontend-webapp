import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import api from "../../../api/axiosConfig";

// --- DADOS MOCKADOS INICIAIS (Mantidos) ---
const initialMockData = {
  consultores: [
    {
      id: 1,
      name: "Joao Silva",
      email: "joao@email.com",
      type: "consultor",
      cpfValidado: "approved",
      documentoValidado: "approved",
      selfieValidada: "pending",
      emailVerificado: "approved",
      telefoneVerificado: "approved",
      curriculoAnalisado: "approved",
      enderecoCompleto: "approved",
      dadosBancarios: "approved",
      status: "pending",
      dataCadastro: "2024-01-15",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      type: "consultor",
      cpfValidado: "approved",
      documentoValidado: "pending",
      selfieValidada: "rejected",
      emailVerificado: "approved",
      telefoneVerificado: "pending",
      curriculoAnalisado: "approved",
      enderecoCompleto: "approved",
      dadosBancarios: "pending",
      status: "pending",
      dataCadastro: "2024-01-18",
    },
    {
      id: 3,
      name: "Pedro Alvares",
      email: "pedro@email.com",
      type: "consultor",
      cpfValidado: "approved",
      documentoValidado: "approved",
      selfieValidada: "approved",
      emailVerificado: "approved",
      telefoneVerificado: "approved",
      curriculoAnalisado: "approved",
      enderecoCompleto: "approved",
      dadosBancarios: "approved",
      status: "approved",
      dataCadastro: "2024-01-18",
    },
  ],
  lojistas: [
    {
      id: 1,
      name: "Loja Central LTDA",
      email: "contato@lojacentral.com",
      type: "lojista",
      cnpjValidado: "approved",
      contratoSocial: "approved",
      comprovanteEndereco: "pending",
      emailCorporativo: "approved",
      telefoneComercial: "approved",
      segmentoDefinido: "approved",
      responsavelLegal: "approved",
      status: "pending",
      dataCadastro: "2024-01-10",
    },
  ],
  vendedores: [
    { id: 1, name: "Carlos Vendedor", loja: "Loja Central", status: "active" },
    { id: 2, name: "Ana Vendedora", loja: "Loja Norte", status: "active" },
    { id: 3, name: "Pedro Vendedor", loja: "Loja Centro", status: "inactive" },
  ],
};
const initialAnalyticsData = {
  totalAssinaturas: 450,
  assinaturasPremium: 120,
  assinaturasBasic: 330,
  maisVendida: "Premium",
  taxaConversao: "12.5%",
  loginsUltimaSemana: 8500,
  acessosApp: 5200,
  acessosSite: 3300,
  lojaMaisAtiva: "Loja Central (1200 logins)",
};

// ----------------------------------------
// 1. ESTILOS CONVERTIDOS PARA STYLED COMPONENTS (Otimizados para Desktop)
// ----------------------------------------

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30px; /* Mais espaco em desktop */
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px; /* Definindo largura maxima ideal para desktop */
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const HeaderTitle = styled.h1`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 42px; /* Fonte maior para desktop */
  font-weight: bold;
`;

const HeaderSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 20px;
`;

const CommunicationSection = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Sombra mais destacada */
  margin-bottom: 60px;
`;

const CommunicationTitle = styled.h2`
  color: #dc3545;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: left;
`;

const CommsForm = styled.form`
  display: grid;
  grid-template-columns: 300px 1fr 200px; /* Colunas bem definidas para desktop */
  gap: 20px;
  align-items: flex-start;
`;

const CommsSelect = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  height: 45px;
  grid-column: 1;
`;

const CommsTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 120px;
  resize: vertical;
  grid-column: 2;
  font-size: 16px;
`;

const CommsButton = styled.button`
  padding: 10px 20px;
  background-color: #1b3670;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  grid-column: 3;
  transition: background-color 0.3s;
  height: 45px;
  align-self: end; /* Alinha o botao com o fundo */

  &:hover {
    background-color: #0d214f;
  }
`;

const MetricsSection = styled.div`
  margin-bottom: 60px;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
`;

const MetricsTitle = styled.h2`
  color: #1b3670;
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 30px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 colunas em desktop */
  grid-template-rows: auto 1fr; /* Para permitir cards $spanTwo */
  gap: 20px;
`;

const MetricCard = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Estilos para cards que ocupam 2 linhas (Graficos) */
  ${(props) =>
    props.$spanTwo &&
    css`
      grid-row: span 2;
    `}
`;

const MetricIcon = styled.span`
  font-size: 30px;
  display: block;
  margin-bottom: 10px;
`;

const MetricLabel = styled.h4`
  color: #666;
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: normal;
`;

const MetricValue = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  display: block;
  margin-bottom: 5px;
`;

const MetricSubDetail = styled.small`
  color: #888;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

// Estilos de Graficos (serao usados nos subcomponentes)
const ChartContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  padding: 10px 0;
  border-top: 1px dashed #eee;
`;
const ChartTitle = styled.h5`
  font-size: 12px;
  color: #999;
  margin: 0 0 10px 0;
`;
const BarChartWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100px;
  padding: 0 10px;
`;
const Bar = styled.div`
  width: 30%;
  border-radius: 5px 5px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-height: 10px;
  background-color: ${(props) => props.$bgColor};
  height: ${(props) => props.$height};
`;

// Estilos para Pie Chart
const PieChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
`;
const PieChartElement = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 5px solid #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.$background};
`;
const Legend = styled.div`
  text-align: left;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
`;
const LegendColor = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${(props) => props.$bgColor};
`;

// Estilos para Status e Estatisticas
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colunas fixas em desktop */
  gap: 30px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StatCardTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 20px;
`;

const StatNumbers = styled.div`
  text-align: center;
`;

const StatValue = styled.span`
  font-size: 42px;
  font-weight: bold;
  color: #007bff;
  display: block;
`;

const StatDetail = styled.span`
  color: #666;
  font-size: 14px;
`;

// Estilos para Tabs
const TabsWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  justify-content: flex-start; /* Alinhamento   esquerda em desktop */
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  min-width: 180px; /* Botoes mais largos em desktop */
  color: #333;

  /* Estilo ativo */
  ${(props) =>
    props.$active &&
    css`
      background-color: #007bff;
      color: white;
      border: none;
      font-weight: bold;
    `}
`;

// Estilos para Grid de Usuarios e Cards de Aprovacao
const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(400px, 1fr)
  ); /* Cards maiores */
  gap: 30px;
  margin-bottom: 50px;
`;

const ApprovalCardWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

const UserName = styled.h4`
  margin: 0 0 5px 0;
  color: #333;
  font-weight: bold;
`;

const UserEmail = styled.p`
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
`;

const UserType = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: bold;
`;

const ApprovalStatus = styled.div`
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
`;

const ProgressFill = styled.div`
  height: 100%;
  transition: width 0.3s ease;
  background-color: ${(props) => props.$bgColor};
  width: ${(props) => props.$width};
`;

const Percentage = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #333;
`;

const ChecklistSection = styled.div`
  margin-bottom: 20px;
`;

const ChecklistTitle = styled.h5`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
`;

const ChecklistItemWrapper = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ChecklistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusIcon = styled.span`
  font-size: 16px;
  color: ${(props) => props.$color};
`;

const ChecklistLabel = styled.span`
  font-size: 14px;
  color: #333;
`;

const Observations = styled.div`
  margin-top: 5px;
  padding-left: 26px;
  color: #666;
  font-size: 12px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DetailsButton = styled(ActionButton)`
  background-color: #6c757d;
  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const ApprovalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ApproveButton = styled(ActionButton)`
  background-color: #28a745;
  &:hover:not(:disabled) {
    background-color: #1e7e34;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #dc3545;
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 50px;
  margin-bottom: 20px;
`;

const CriteriaSection = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CriteriaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
`;

const CriteriaCard = styled.div`
  /* Estilos herdados do pai */
`;

const CriteriaCardTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
`;

const CriteriaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CriteriaListItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #555;
`;

// **CORRECAO:** Removido seletor aninhado que causava ReferenceError
const ChecklistActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

// ----------------------------------------
// 2. SUBCOMPONENTES (Com Correcao do ChecklistItem)
// ----------------------------------------

const BarChart = ({ data }) => {
  const total = data.app + data.site;
  const heightApp = `${(data.app / total) * 100}px`;
  const heightSite = `${(data.site / total) * 100}px`;

  return (
    <ChartContainer>
      <ChartTitle>Acessos App vs. Site (7 dias)</ChartTitle>
      <BarChartWrapper>
        <Bar $height={heightApp} $bgColor="#4c7cff">
          <small>App</small>
        </Bar>
        <Bar $height={heightSite} $bgColor="#ff9800">
          <small>Site</small>
        </Bar>
      </BarChartWrapper>
    </ChartContainer>
  );
};

const PieChart = ({ premium, basic }) => {
  const total = premium + basic;
  const pPremium = Math.round((premium / total) * 100);
  const pBasic = 100 - pPremium;
  const gradient = `conic-gradient(#28a745 0% ${pPremium}%, #007bff ${pPremium}% 100%)`;

  return (
    <ChartContainer>
      <ChartTitle>Distribuicao de Assinaturas</ChartTitle>
      <PieChartWrapper>
        <PieChartElement $background={gradient} />
        <Legend>
          <div>
            <LegendColor $bgColor="#28a745" /> Premium ({pPremium}%)
          </div>
          <div>
            <LegendColor $bgColor="#007bff" /> Basic ({pBasic}%)
          </div>
        </Legend>
      </PieChartWrapper>
    </ChartContainer>
  );
};

const ChecklistItem = ({
  label,
  status,
  observations,
  onToggleStatus,
  itemKey,
  userType,
  userId,
}) => {
  const handleToggle = (newStatus) => {
    onToggleStatus({ userType, userId, itemKey, newStatus });
  };

  const statusColor =
    status === "approved"
      ? "#28a745"
      : status === "pending"
      ? "#ffc107"
      : "#dc3545";
  const statusIcon =
    status === "approved" ? "" : status === "pending" ? "o" : "";

  return (
    <ChecklistItemWrapper>
      <ChecklistHeader>
        <StatusIcon $color={statusColor}>{statusIcon}</StatusIcon>
        <ChecklistLabel>{label}</ChecklistLabel>
        <ChecklistActions>
          {/* CORRECAO: Estilizando o ActionButton diretamente para evitar ReferenceError */}
          <ActionButton
            onClick={() => handleToggle("approved")}
            disabled={status === "approved"}
            style={{
              backgroundColor: status === "approved" ? "#28a745" : "white",
              border: "1px solid #28a745",
              color: status === "approved" ? "white" : "#28a745",
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            
          </ActionButton>
          <ActionButton
            onClick={() => handleToggle("rejected")}
            disabled={status === "rejected"}
            style={{
              backgroundColor: status === "rejected" ? "#dc3545" : "white",
              border: "1px solid #dc3545",
              color: status === "rejected" ? "white" : "#dc3545",
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            
          </ActionButton>
        </ChecklistActions>
      </ChecklistHeader>
      {observations && (
        <Observations>
          <small>{observations}</small>
        </Observations>
      )}
    </ChecklistItemWrapper>
  );
};

const ApprovalCard = ({
  user,
  type,
  onApprove,
  onReject,
  onViewDetails,
  onToggleStatus,
}) => {
  // Lista de criterios de aprovacao (baseado no mock)
  const approvalCriteria =
    type === "consultor"
      ? [
          { label: "CPF Validado", key: "cpfValidado" },
          { label: "Documento Validado", key: "documentoValidado" },
          { label: "Selfie Validada", key: "selfieValidada" },
          { label: "Email Verificado", key: "emailVerificado" },
          { label: "Telefone Verificado", key: "telefoneVerificado" },
          { label: "Curriculo Analisado", key: "curriculoAnalisado" },
          { label: "Endereco Completo", key: "enderecoCompleto" },
          { label: "Dados Bancarios", key: "dadosBancarios" },
        ]
      : [
          { label: "CNPJ Validado", key: "cnpjValidado" },
          { label: "Contrato Social", key: "contratoSocial" },
          { label: "Comprovante Endereco", key: "comprovanteEndereco" },
          { label: "Email Corporativo", key: "emailCorporativo" },
          { label: "Telefone Comercial", key: "telefoneComercial" },
          { label: "Segmento Definido", key: "segmentoDefinido" },
          { label: "Responsavel Legal", key: "responsavelLegal" },
        ];

  const getChecklistItems = () => {
    return approvalCriteria.map((item) => ({
      ...item,
      status: user[item.key], // Pega o status do usuario (approved, pending, rejected)
      observations:
        user[item.key] === "rejected" ? "Documento ilegivel/invalido" : "", // Exemplo de observacao
    }));
  };

  const calculateApprovalPercentage = () => {
    const items = getChecklistItems();
    if (items.length === 0) return 0;
    const approvedCount = items.filter(
      (item) => item.status === "approved"
    ).length;
    return Math.round((approvedCount / items.length) * 100);
  };

  const approvalPercentage = calculateApprovalPercentage();
  const progressBarColor =
    approvalPercentage >= 80
      ? "#28a745"
      : approvalPercentage >= 50
      ? "#ffc107"
      : "#dc3545";

  return (
    <ApprovalCardWrapper>
      <CardHeader>
        <UserInfo>
          <Avatar>{user.name.charAt(0)}</Avatar>
          <div>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <UserType>
              {type === "consultor" ? " Consultor" : " Lojista"} |
              Cadastrado em: {user.dataCadastro}
            </UserType>
          </div>
        </UserInfo>
        <ApprovalStatus>
          <ProgressBar>
            <ProgressFill
              $width={`${approvalPercentage}%`}
              $bgColor={progressBarColor}
            />
          </ProgressBar>
          <Percentage>{approvalPercentage}% Concluido</Percentage>
        </ApprovalStatus>
      </CardHeader>

      <ChecklistSection>
        <ChecklistTitle>Checklist de Aprovacao</ChecklistTitle>
        {getChecklistItems().map((item) => (
          <ChecklistItem
            key={`${user.id}-${item.key}`}
            userType={type}
            userId={user.id}
            itemKey={item.key}
            label={item.label}
            status={user[item.key]} // Usando o status real do usuario
            observations={item.observations}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </ChecklistSection>

      <CardActions>
        <DetailsButton onClick={() => onViewDetails(user)}>
           Ver Detalhes
        </DetailsButton>
        <ApprovalButtons>
          <RejectButton
            onClick={() => onReject(user)}
            disabled={user.status !== "pending"}
          >
             Reprovar
          </RejectButton>
          <ApproveButton
            onClick={() => onApprove(user)}
            disabled={approvalPercentage < 100 || user.status !== "pending"}
          >
             Aprovar
          </ApproveButton>
        </ApprovalButtons>
      </CardActions>
    </ApprovalCardWrapper>
  );
};

// ----------------------------------------
// 3. COMPONENTE PRINCIPAL (Com Logica Mockada Adicionada)
// ----------------------------------------

const AdminAprovacao = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [users, setUsers] = useState(initialMockData);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState(initialAnalyticsData);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");

  // Helper para calcular estatisticas
  const calculateStats = (data) => {
    const totalConsultores = data.consultores.length;
    const aprovadosConsultores = data.consultores.filter(
      (c) => c.status === "approved"
    ).length;
    const pendentesConsultores = data.consultores.filter(
      (c) => c.status === "pending"
    ).length;

    const totalLojistas = data.lojistas.length;
    const aprovadosLojistas = data.lojistas.filter(
      (l) => l.status === "approved"
    ).length;
    const pendentesLojistas = data.lojistas.filter(
      (l) => l.status === "pending"
    ).length;
    const reprovadosLojistas = data.lojistas.filter(
      (l) => l.status === "rejected"
    ).length;

    const totalVendedores = data.vendedores.length;

    return {
      totalConsultores,
      aprovadosConsultores,
      pendentesConsultores,
      totalLojistas,
      aprovadosLojistas,
      pendentesLojistas,
      reprovadosLojistas,
      totalVendedores,
    };
  };

  useEffect(() => {
    // Simula fetch
    setStats(calculateStats(initialMockData));
    setUsers(initialMockData); // Inicializa com mock
  }, []);

  // Atualiza um item do checklist de um usuario
  const handleToggleStatus = ({ userType, userId, itemKey, newStatus }) => {
    setUsers((prevUsers) => {
      const typeList = [...prevUsers[userType + "s"]]; // 'consultores' ou 'lojistas'
      const userIndex = typeList.findIndex((u) => u.id === userId);

      if (userIndex > -1) {
        typeList[userIndex] = {
          ...typeList[userIndex],
          [itemKey]: newStatus,
        };
      }

      return {
        ...prevUsers,
        [userType + "s"]: typeList,
      };
    });
  };

  // Aprova o usuario (muda o status geral)
  const handleApprove = (userToApprove) => {
    setUsers((prevUsers) => {
      const typeList = [...prevUsers[userToApprove.type + "s"]];
      const userIndex = typeList.findIndex((u) => u.id === userToApprove.id);
      if (userIndex > -1) {
        typeList[userIndex] = { ...typeList[userIndex], status: "approved" };
      }
      const newUsers = { ...prevUsers, [userToApprove.type + "s"]: typeList };
      setStats(calculateStats(newUsers)); // Recalcula stats
      return newUsers;
    });
  };

  // Reprova o usuario (muda o status geral)
  const handleReject = (userToReject) => {
    setUsers((prevUsers) => {
      const typeList = [...prevUsers[userToReject.type + "s"]];
      const userIndex = typeList.findIndex((u) => u.id === userToReject.id);
      if (userIndex > -1) {
        typeList[userIndex] = { ...typeList[userIndex], status: "rejected" };
      }
      const newUsers = { ...prevUsers, [userToReject.type + "s"]: typeList };
      setStats(calculateStats(newUsers)); // Recalcula stats
      return newUsers;
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log(`Enviando mensagem para: ${recipient}, Conteudo: ${message}`);
    // Simula envio   API
    alert(`Mensagem enviada para ${recipient}: "${message}"`);
    setMessage("");
  };

  const handleViewDetails = (user) => {
    console.log("Ver detalhes:", user);
    alert(`Visualizando detalhes de ${user.name}`);
  };

  const getUsersToShow = () => {
    const allUsers = [
      ...users.consultores.map((u) => ({ ...u, type: "consultor" })),
      ...users.lojistas.map((u) => ({ ...u, type: "lojista" })),
    ];
    return allUsers.filter((user) => user.status === activeTab);
  };

  const usersToShow = getUsersToShow();

  return (
    <Container>
      <ContentWrapper>
        {/* Header */}
        <Header>
          <HeaderTitle> Sistema de Aprovacao</HeaderTitle>
          <HeaderSubtitle>
            Gerencie aprovacoes de consultores e lojistas
          </HeaderSubtitle>
        </Header>

        {/* Comunicacao Admin-Usuario */}
        <CommunicationSection>
          <CommunicationTitle> Mensagem da Plataforma</CommunicationTitle>
          <CommsForm onSubmit={handleSendMessage}>
            <CommsSelect
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            >
              <option value="all">Para Todos (Consultores e Lojistas)</option>
              <option value="consultores">Apenas Consultores</option>
              <option value="lojistas">Apenas Lojistas</option>
            </CommsSelect>
            <CommsTextarea
              placeholder="Digite sua mensagem aqui (Sera disparada como notificacao/email)."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <CommsButton type="submit">Enviar Mensagem como Admin</CommsButton>
          </CommsForm>
        </CommunicationSection>

        {/* Dashboard de Metricas / Analytics */}
        <MetricsSection>
          <MetricsTitle> Metricas e Analytics</MetricsTitle>
          <MetricsGrid>
            {/* Metrica 1: Assinaturas Totais + Grafico de Pizza */}
            <MetricCard $spanTwo>
              <MetricIcon></MetricIcon>
              <MetricLabel>Total de Assinaturas</MetricLabel>
              <MetricValue>{analytics.totalAssinaturas}</MetricValue>
              <PieChart
                premium={analytics.assinaturasPremium}
                basic={analytics.assinaturasBasic}
              />
              <MetricSubDetail>
                Premium: {analytics.assinaturasPremium} | Basic:{" "}
                {analytics.assinaturasBasic}
              </MetricSubDetail>
            </MetricCard>

            {/* Metrica 2: Acesso ao App / Site + Grafico de Barras */}
            <MetricCard $spanTwo>
              <MetricIcon></MetricIcon>
              <MetricLabel>Acessos na Semana</MetricLabel>
              <MetricValue>
                {analytics.acessosApp + analytics.acessosSite}
              </MetricValue>
              <BarChart
                data={{
                  app: analytics.acessosApp,
                  site: analytics.acessosSite,
                }}
              />
              <MetricSubDetail>
                App: {analytics.acessosApp} | Site: {analytics.acessosSite}
              </MetricSubDetail>
            </MetricCard>

            {/* Metrica 3: Logins */}
            <MetricCard>
              <MetricIcon></MetricIcon>
              <MetricLabel>Logins (7 dias)</MetricLabel>
              <MetricValue>{analytics.loginsUltimaSemana}</MetricValue>
              <MetricSubDetail>
                Loja Mais Ativa: {analytics.lojaMaisAtiva}
              </MetricSubDetail>
            </MetricCard>

            {/* Metrica 4: Assinatura Mais Vendida */}
            <MetricCard>
              <MetricIcon>i</MetricIcon>
              <MetricLabel>Assinatura Lider</MetricLabel>
              <MetricValue>{analytics.maisVendida}</MetricValue>
              <MetricSubDetail>
                Taxa de Conversao: {analytics.taxaConversao}
              </MetricSubDetail>
            </MetricCard>
          </MetricsGrid>
        </MetricsSection>

        {/* Estatisticas de Aprovacao */}
        <StatsGrid>
          <StatCard>
            <StatCardTitle> Consultores</StatCardTitle>
            <StatNumbers>
              <StatValue>{stats.totalConsultores}</StatValue>
              <StatDetail>
                {stats.aprovadosConsultores} aprovados *{" "}
                {stats.pendentesConsultores} pendentes
              </StatDetail>
            </StatNumbers>
          </StatCard>
          <StatCard>
            <StatCardTitle> Lojistas</StatCardTitle>
            <StatNumbers>
              <StatValue>{stats.totalLojistas}</StatValue>
              <StatDetail>
                {stats.aprovadosLojistas} aprovados * {stats.pendentesLojistas}{" "}
                pendentes
              </StatDetail>
            </StatNumbers>
          </StatCard>
          <StatCard>
            <StatCardTitle> Vendedores</StatCardTitle>
            <StatNumbers>
              <StatValue>{stats.totalVendedores}</StatValue>
              <StatDetail>Cadastrados no sistema</StatDetail>
            </StatNumbers>
          </StatCard>
        </StatsGrid>

        {/* Tabs de Navegacao */}
        <TabsWrapper>
          <TabButton
            $active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            o Pendentes ({stats.pendentesConsultores + stats.pendentesLojistas}
            )
          </TabButton>
          <TabButton
            $active={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
          >
             Aprovados ({stats.aprovadosConsultores + stats.aprovadosLojistas}
            )
          </TabButton>
          <TabButton
            $active={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
          >
             Reprovados ({stats.reprovadosLojistas})
          </TabButton>
        </TabsWrapper>

        {/* Lista de Usuarios */}
        <UsersGrid>
          {usersToShow.map((user) => (
            <ApprovalCard
              key={`${user.type}-${user.id}`}
              user={user}
              type={user.type}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
            />
          ))}

          {usersToShow.length === 0 && (
            <EmptyState>
              <EmptyIcon></EmptyIcon>
              <h3>Nenhum usuario encontrado</h3>
              <p>Nao ha usuarios com status "{activeTab}" no momento.</p>
            </EmptyState>
          )}
        </UsersGrid>

        {/* Criterios de Aprovacao */}
        <CriteriaSection>
          <h3 style={{ color: "#333", margin: "0 0 20px 0" }}>
             Criterios de Aprovacao
          </h3>
          <CriteriaGrid>
            <CriteriaCard>
              <CriteriaCardTitle> Consultores (CPF)</CriteriaCardTitle>
              <CriteriaList>
                <CriteriaListItem> CPF valido e regular</CriteriaListItem>
                <CriteriaListItem>
                   Documento de identidade legivel
                </CriteriaListItem>
                <CriteriaListItem>
                   Selfie comprovando identidade
                </CriteriaListItem>
                <CriteriaListItem>
                   E-mail e telefone verificados
                </CriteriaListItem>
                <CriteriaListItem>
                   Curriculo analisado pela IA
                </CriteriaListItem>
                <CriteriaListItem> Endereco completo valido</CriteriaListItem>
                <CriteriaListItem>
                   Dados bancarios para pagamento
                </CriteriaListItem>
              </CriteriaList>
            </CriteriaCard>
            <CriteriaCard>
              <CriteriaCardTitle> Lojistas (CNPJ)</CriteriaCardTitle>
              <CriteriaList>
                <CriteriaListItem> CNPJ valido e ativo</CriteriaListItem>
                <CriteriaListItem>
                   Contrato social digitalizado
                </CriteriaListItem>
                <CriteriaListItem>
                   Comprovante de endereco comercial
                </CriteriaListItem>
                <CriteriaListItem>
                   E-mail corporativo verificado
                </CriteriaListItem>
                <CriteriaListItem>
                   Telefone comercial funcional
                </CriteriaListItem>
                <CriteriaListItem>
                   Segmento de atuacao definido
                </CriteriaListItem>
                <CriteriaListItem>
                   Responsavel legal identificado
                </CriteriaListItem>
              </CriteriaList>
            </CriteriaCard>
          </CriteriaGrid>
        </CriteriaSection>
      </ContentWrapper>
    </Container>
  );
};

export default AdminAprovacao;

