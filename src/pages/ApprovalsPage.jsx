// frontend/src/pages/ApprovalsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://plataforma-consultoria-mvp.onrender.com/api";

export default function ApprovalsPage() {
  const [consultores, setConsultores] = useState([]);
  const [lojistas, setLojistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("consultores");
  const [error, setError] = useState(null);

  // --- BUSCA INICIAL ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [consultoresRes, lojistasRes] = await Promise.all([
        axios.get(`${API_BASE}/aprovacoes/consultores`),
        axios.get(`${API_BASE}/aprovacoes/lojistas`),
      ]);
      setConsultores(consultoresRes.data || []);
      setLojistas(lojistasRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- ACAO DE APROVAR / REPROVAR ---
  const handleApproval = async (type, id, aprovado) => {
    const motivo_rejeicao =
      aprovado === false
        ? prompt("Motivo da reprovacao:") || "Sem justificativa"
        : null;

    try {
      await axios.patch(`${API_BASE}/aprovacoes/${type}/${id}`, {
        aprovado,
        motivo_rejeicao,
      });
      alert(aprovado ? "Aprovado com sucesso!" : "Reprovado com sucesso!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status.");
    }
  };

  const renderTable = (type, data) => (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white shadow-md rounded-2xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Nome</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Cidade</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-center">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 transition ${
                  item.aprovado
                    ? "bg-green-50"
                    : item.motivo_rejeicao
                    ? "bg-red-50"
                    : ""
                }`}
              >
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4 font-medium">
                  {item.nome || item.nome_fantasia}
                </td>
                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.cidade}</td>
                <td className="py-3 px-4 text-center">
                  {item.aprovado
                    ? " Aprovado"
                    : item.motivo_rejeicao
                    ? " Reprovado"
                    : "o Pendente"}
                </td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button
                    onClick={() => handleApproval(type, item.id, true)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleApproval(type, item.id, false)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Reprovar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Carregando dados...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-medium">{error}</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Painel de Aprovacoes
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("consultores")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "consultores"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Consultores
        </button>
        <button
          onClick={() => setActiveTab("lojistas")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "lojistas"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Lojistas
        </button>
      </div>

      {/* Tabela */}
      {activeTab === "consultores"
        ? renderTable("consultores", consultores)
        : renderTable("lojistas", lojistas)}
    </div>
  );
}

