import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

const AttendanceSummaryPanel = () => {
  const { vendaId } = useParams(); // Pega o ID da venda da URL
  const location = useLocation(); // Pega dados passados via 'state'
  const navigate = useNavigate();

  const [resumoData, setResumoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dados passados do ChatPanel (opcional, mas útil)
  const { saleStatus, cart, clienteData } = location.state || {};

  useEffect(() => {
    // Busca dados detalhados da venda se o ID for válido e for um sucesso
    if (vendaId && vendaId !== 'novo' && saleStatus === 'success') {
      const fetchSaleDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/api/vendas/detalhes/${vendaId}`);
          if (!response.ok) {
            throw new Error('Falha ao buscar detalhes da venda.');
          }
          const data = await response.json();
          setResumoData(data);
        } catch (err) {
          console.error(err);
          setError('Não foi possível carregar os detalhes da venda.');
        } finally {
          setLoading(false);
        }
      };
      fetchSaleDetails();
    } else {
        // Se não houve venda ou a venda falhou, mostra os dados do atendimento
        setLoading(false);
        setResumoData({
            cliente: clienteData,
            statusVenda: saleStatus,
            mensagem: saleStatus === 'success' ? `Venda ${vendaId} concluída.` : 'Atendimento encerrado sem venda.',
            carrinho: cart,
            // Adicionar mais dados do atendimento (tempo, motivo de encerramento, etc.)
        });
    }
  }, [vendaId, saleStatus, cart, clienteData]);


  const handleFinalizeAttendance = () => {
    // 1. Lógica para encerrar o atendimento no servidor (limpar a fila, etc.)
    // Ex: await api.post('/api/atendimento/encerrar', { clienteId: clienteData.id });

    // 2. Redirecionar para a Home ou Fila de Atendimento
    navigate('/consultor/home'); 
  };

  if (loading) return <div>Carregando resumo...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="summary-panel-container">
      <h1>Resumo do Atendimento</h1>
      
      <div className="cliente-summary">
        <h2>Cliente: {resumoData?.cliente?.nome || 'N/A'}</h2>
      </div>

      <div className={`sale-status-box ${resumoData?.statusVenda}`}>
        <h3>Status da Venda: {resumoData?.statusVenda === 'success' ? 'Venda Concluída' : 'Venda Não Concluída'}</h3>
        {resumoData?.statusVenda === 'stock_error' && (
             <p className="warning">A venda falhou devido a esgotamento de estoque no último momento.</p>
        )}
      </div>

      {/* Detalhes do atendimento e outras informações */}
      {/* ... */}
      
      <button 
        onClick={handleFinalizeAttendance} 
        className="end-attendance-button"
      >
        Finalizar Atendimento e Voltar para Home
      </button>
    </div>
  );
};

export default AttendanceSummaryPanel;