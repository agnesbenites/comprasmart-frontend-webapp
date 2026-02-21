// src/pages/ConsultorDashboard/components/AnalyticsPanel.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const CONSULTOR_PRIMARY = "#2f0d51";
const CONSULTOR_LIGHT_BG = "#f3e8ff";

const AnalyticsPanel = () => {
  const [analytics, setAnalytics] = useState({
    totalComissao: 0,
    vendasMes: 0,
    ticketMedio: 0,
    atendimentosHoje: 0,
    lojas: []
  });
  const [loading, setLoading] = useState(true);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const consultorId = localStorage.getItem('userId');

  useEffect(() => {
    carregarAnalytics();
  }, []);

  const carregarAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar vendas do mês atual
      const primeiroDiaMes = new Date();
      primeiroDiaMes.setDate(1);
      primeiroDiaMes.setHours(0, 0, 0, 0);

      const { data: vendas, error: erroVendas } = await supabase
        .from('pedidos')
        .select('valor_total, valor_comissao, created_at, loja:lojas(nome_fantasia)')
        .eq('consultor_id', consultorId)
        .gte('created_at', primeiroDiaMes.toISOString());

      if (erroVendas) throw erroVendas;

      // Buscar atendimentos de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const { data: atendimentos, error: erroAtendimentos } = await supabase
        .from('pedidos')
        .select('id')
        .eq('consultor_id', consultorId)
        .gte('created_at', hoje.toISOString());

      if (erroAtendimentos) throw erroAtendimentos;

      // Buscar lojas associadas
      const { data: lojas, error: erroLojas } = await supabase
        .from('aprovacoes_consultores')
        .select('loja:lojas(id, nome_fantasia, cidade, estado, segmento)')
        .eq('consultor_id', consultorId)
        .eq('status', 'aprovado');

      if (erroLojas) throw erroLojas;

      // Calcular métricas
      const totalComissao = vendas?.reduce((acc, v) => acc + (v.valor_comissao || 0), 0) || 0;
      const vendasMes = vendas?.length || 0;
      const ticketMedio = vendasMes > 0 
        ? vendas.reduce((acc, v) => acc + v.valor_total, 0) / vendasMes 
        : 0;

      setAnalytics({
        totalComissao,
        vendasMes,
        ticketMedio,
        atendimentosHoje: atendimentos?.length || 0,
        lojas: lojas?.map(l => l.loja) || []
      });

    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarProduto = async () => {
    if (!buscaProduto.trim()) {
      alert('Digite o nome ou SKU do produto');
      return;
    }

    try {
      setBuscando(true);
      setResultadosBusca([]);

      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          sku,
          preco,
          estoque,
          loja:lojas(
            id,
            nome_fantasia,
            cidade,
            estado
          )
        `)
        .or(`nome.ilike.%${buscaProduto}%,sku.ilike.%${buscaProduto}%`)
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        setResultadosBusca(data);
      } else {
        alert('Nenhum produto encontrado');
      }

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      alert('Erro ao buscar produto. Tente novamente.');
    } finally {
      setBuscando(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY, marginBottom: '0.5rem' }}>
             Analítico de Comissões
          </h1>
          <p style={{ color: '#64748b' }}>
            Acompanhe suas métricas de desempenho e vendas
          </p>
        </div>

        {/* Cards de Métricas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Comissão Total */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #cccc0c'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
               Comissão do Mês
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#cccc0c' }}>
              R$ {analytics.totalComissao.toFixed(2)}
            </div>
          </div>

          {/* Vendas do Mês */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid ' + CONSULTOR_PRIMARY
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
               Vendas do Mês
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY }}>
              {analytics.vendasMes}
            </div>
          </div>

          {/* Ticket Médio */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #f59e0b'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
               Ticket Médio
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              R$ {analytics.ticketMedio.toFixed(2)}
            </div>
          </div>

          {/* Atendimentos Hoje */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #8b5cf6'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
               Atendimentos Hoje
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {analytics.atendimentosHoje}
            </div>
          </div>
        </div>

        {/* Busca de Produtos */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY, marginBottom: '1rem' }}>
             Buscar Produto
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={buscaProduto}
              onChange={(e) => setBuscaProduto(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarProduto()}
              placeholder="Digite o nome ou SKU do produto..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={buscarProduto}
              disabled={buscando}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: CONSULTOR_PRIMARY,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: buscando ? 'not-allowed' : 'pointer',
                opacity: buscando ? 0.6 : 1
              }}
            >
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {/* Resultados da Busca */}
          {resultadosBusca.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>
                Resultados ({resultadosBusca.length}):
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resultadosBusca.map((produto) => (
                  <div 
                    key={produto.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                          {produto.nome}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          SKU: {produto.sku} | Estoque: {produto.estoque} unidades
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
                           {produto.loja.nome_fantasia} - {produto.loja.cidade}/{produto.loja.estado}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#cccc0c',
                        whiteSpace: 'nowrap'
                      }}>
                        R$ {produto.preco.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lojas Associadas */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: CONSULTOR_PRIMARY, marginBottom: '1rem' }}>
             Lojas Associadas ({analytics.lojas.length})
          </h2>
          {analytics.lojas.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              Você ainda não está associado a nenhuma loja
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {analytics.lojas.map((loja) => (
                <div 
                  key={loja.id}
                  style={{
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = CONSULTOR_PRIMARY;
                    e.currentTarget.style.backgroundColor = CONSULTOR_LIGHT_BG;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {loja.nome_fantasia}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                     {loja.cidade}/{loja.estado}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    🏷️ {loja.segmento}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPanel;