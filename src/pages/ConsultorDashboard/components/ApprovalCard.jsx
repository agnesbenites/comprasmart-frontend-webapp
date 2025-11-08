import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const ChecklistItem = ({ label, status }) => {
  const icons = {
    approved: <CheckCircle className="text-green-500 w-5 h-5" />,
    pending: <Clock className="text-yellow-500 w-5 h-5" />,
    rejected: <XCircle className="text-red-500 w-5 h-5" />,
  };

  const statusLabels = {
    approved: "Aprovado",
    pending: "Pendente",
    rejected: "Rejeitado",
  };

  return (
    <div className="flex items-center justify-between p-2 border-b last:border-none">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {icons[status]}
        <span className="text-sm text-gray-500">{statusLabels[status]}</span>
      </div>
    </div>
  );
};

const ApprovalCard = ({ user, type }) => {
  // --- função segura que retorna sempre um array ---
  const getChecklistItems = () => {
    if (!user) return [];

    if (type === "consultor") {
      return [
        {
          key: "cpf",
          label: "CPF Validado",
          status: user.cpfValidado ? "approved" : "pending",
        },
        {
          key: "documento",
          label: "Documento Validado",
          status: user.documentoValidado ? "approved" : "pending",
        },
        {
          key: "endereco",
          label: "Comprovante de Endereço",
          status: user.enderecoValidado ? "approved" : "pending",
        },
        {
          key: "banco",
          label: "Dados Bancários",
          status: user.bancoValidado ? "approved" : "pending",
        },
      ];
    }

    if (type === "lojista") {
      return [
        {
          key: "cnpj",
          label: "CNPJ Validado",
          status: user.cnpjValidado ? "approved" : "pending",
        },
        {
          key: "contrato",
          label: "Contrato Social",
          status: user.contratoSocial ? "approved" : "pending",
        },
        {
          key: "endereco",
          label: "Endereço Comercial",
          status: user.enderecoValidado ? "approved" : "pending",
        },
        {
          key: "responsavel",
          label: "Responsável Legal",
          status: user.responsavelValidado ? "approved" : "pending",
        },
      ];
    }

    return []; // fallback seguro
  };

  return (
    <div className="border rounded-2xl shadow-md p-4 bg-white max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">
        {type === "consultor"
          ? "Checklist do Consultor"
          : "Checklist do Lojista"}
      </h2>

      {(getChecklistItems() || []).map((item) => (
        <ChecklistItem key={item.key} label={item.label} status={item.status} />
      ))}
    </div>
  );
};

export default ApprovalCard;
