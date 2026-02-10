import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../../components/Layout";
import { formatarMoeda, formatarData } from '../../../shared/utils/formatters';
import { supabase } from "@/supabaseClient";

const RelatorioPageVendedor = () => {
  const navigate = useNavigate();
  const [dadosVendas, setDadosVendas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState({
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    fim: new Date()
  });

  // Fetch dados do Supabase
  useEffect(() => {
    const fetchDadosVendas = async () => {
      try {
        setLoading(true);
        
        // 1. Buscar dados do vendedor logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        // 2. Buscar perfil do vendedor (SEM 'setores' que não existe!)
        const { data: perfilVendedor, error: perfilError } = await supabase
          .from('vendedores')
          .select('id, nome, loja_id, email')  // ← CORRIGIDO: removido 'setores' e 'meta_mensal'
          .eq('user_id', user.id)
          .maybeSingle();  // ← CORRIGIDO: permite múltiplos ou nenhum resultado

        console.log('[DEBUG] User ID:', user.id);
        console.log('[DEBUG] Vendedor encontrado:', perfilVendedor);
        console.log('[DEBUG] Erro ao buscar vendedor:', perfilError);

        if (perfilError) throw perfilError;

        if (!perfilVendedor) {
          throw new Error('Vendedor não encontrado. Verifique se você está cadastrado como vendedor.');
        }

        if (!perfilVendedor.loja_id) {
          throw new Error('Vendedor não está associado a nenhuma loja.');
        }

        // 3. Buscar dados da loja
        const { data: loja, error: lojaError } = await supabase
          .from('lojas_corrigida')  // ← Nome correto da tabela
          .select('nome, endereco')
          .eq('id', perfilVendedor.loja_id)
          .maybeSingle();  // ← CORRIGIDO

        if (lojaError) throw lojaError;

        // 4. Buscar vendas do periodo (vendedor_id é BIGINT agora!)
        const { data: vendas, error: vendasError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('vendedor_id', perfilVendedor.id)  // ← Vendedor ID (INTEGER)
          .gte('data_pedido', periodo.inicio.toISOString())
          .lte('data_pedido', periodo.fim.toISOString())
          .order('data_pedido', { ascending: true });

        if (vendasError) throw vendasError;

        // 5. Processar os dados
        const totalVendas = vendas?.length || 0;
        const valorTotal = vendas?.reduce((sum, venda) => sum + parseFloat(venda.valor_total || 0), 0) || 0;
        const comissaoTotal = 0; // ← VENDEDOR NÃO TEM COMISSÃO
        const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

        // 6. Agrupar por dia
        const vendasPorDiaMap = {};
        vendas?.forEach(venda => {
          const data = new Date(venda.data_pedido).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          });
          if (!vendasPorDiaMap[data]) {
            vendasPorDiaMap[data] = 0;
          }
          vendasPorDiaMap[data] += 1;
        });

        const vendasPorDia = Object.entries(vendasPorDiaMap).map(([dia, vendas]) => ({
          dia,
          vendas
        }));

        // 7. Comparar com período anterior
        const diasPeriodo = Math.ceil((periodo.fim - periodo.inicio) / (1000 * 60 * 60 * 24));
        const inicioAnterior = new Date(periodo.inicio);
        inicioAnterior.setDate(inicioAnterior.getDate() - diasPeriodo);
        const fimAnterior = new Date(periodo.inicio);
        fimAnterior.setDate(fimAnterior.getDate() - 1);

        const { data: vendasAnteriores } = await supabase
          .from('pedidos')
          .select('id')
          .eq('vendedor_id', perfilVendedor.id)
          .gte('data_pedido', inicioAnterior.toISOString())
          .lte('data_pedido', fimAnterior.toISOString());

        const totalVendasAnteriores = vendasAnteriores?.length || 0;
        const crescimento = totalVendasAnteriores > 0 
          ? ((totalVendas - totalVendasAnteriores) / totalVendasAnteriores) * 100 
          : 0;

        // 8. Montar objeto final
        const dadosProcessados = {
          vendedor: perfilVendedor.nome,
          loja: `${loja.nome} - ${loja.endereco}`,
          totalVendas,
          valorTotal,
          comissaoTotal,
          ticketMedio,
          vendasPorDia,
          crescimento: Math.round(crescimento),
          performance: 0, // Vendedor não tem meta
          periodo: {
            inicio: periodo.inicio,
            fim: periodo.fim
          }
        };

        setDadosVendas(dadosProcessados);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados do relatório');
      } finally {
        setLoading(false);
      }
    };

    fetchDadosVendas();
  }, [periodo]);

  // Componente de gráfico de barras
  const BarChart = ({ data, title, color = "#bb25a6" }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#bb25a6", marginBottom: "20px" }}>{title}</h3>
          <p style={{ color: "#666", textAlign: "center" }}>Sem dados disponíveis</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => item.vendas));
    
    return (
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#bb25a6", marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "200px", overflowX: "auto" }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
              <div
                style={{
                  height: `${maxValue > 0 ? (item.vendas / maxValue) * 150 : 0}px`,
                  backgroundColor: color,
                  width: "40px",
                  borderRadius: "5px 5px 0 0",
                  transition: "height 0.3s ease"
                }}
              />
              <span style={{ marginTop: "8px", fontSize: "11px", color: "#666", textAlign: "center" }}>
                {item.dia}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#bb25a6" }}>
                {item.vendas}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente de seletor de período
  const SeletorPeriodo = () => (
    <div style={{
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    }}>
      <h4 style={{ color: "#bb25a6", marginBottom: "10px" }}>📅 Selecione o Período</h4>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="date"
          value={periodo.inicio.toISOString().split('T')[0]}
          onChange={(e) => setPeriodo({...periodo, inicio: new Date(e.target.value)})}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
        />
        <input
          type="date"
          value={periodo.fim.toISOString().split('T')[0]}
          onChange={(e) => setPeriodo({...periodo, fim: new Date(e.target.value)})}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
        />
        <button
          onClick={() => {
            const hoje = new Date();
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            setPeriodo({ inicio: inicioMes, fim: hoje });
          }}
          style={{
            padding: "8px 15px",
            backgroundColor: "#bb25a6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Mês Atual
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <Layout title="Relatório do Vendedor" showHeader={true}>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h3>Carregando relatório...</h3>
          <p>Por favor, aguarde enquanto buscamos seus dados.</p>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout title="Relatório do Vendedor" showHeader={true}>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h3 style={{ color: "#dc3545" }}>Erro ao carregar relatório</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#bb25a6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </Layout>
    );
  }

  // No data state
  if (!dadosVendas) {
    return (
      <Layout title="Relatório do Vendedor" showHeader={true}>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h3>Nenhum dado disponível</h3>
          <p>Não encontramos dados de vendas para o período selecionado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Relatório do Vendedor" showHeader={true}>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Seletor de Período */}
        <SeletorPeriodo />
        
        {/* Cabeçalho do Relatório */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{ color: "#bb25a6", margin: "0 0 10px 0" }}>
              📊 Relatório do Vendedor
            </h1>
            <p style={{ color: "#666", margin: "0 0 5px 0", fontSize: "18px", fontWeight: "500" }}>
              {dadosVendas.vendedor}
            </p>
            <p style={{ color: "#666", margin: "0 0 5px 0" }}>
              {dadosVendas.loja}
            </p>
            <p style={{ color: "#666", margin: 0 }}>
              Período: {formatarData(dadosVendas.periodo.inicio)} até {formatarData(dadosVendas.periodo.fim)}
            </p>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#bb25a6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "10px",
                marginRight: "10px"
              }}
            >
              🖨️ Imprimir Relatório
            </button>
            <button
              onClick={() => {
                const csv = [
                  ['Relatório de Vendas', dadosVendas.vendedor],
                  ['Período', `${formatarData(dadosVendas.periodo.inicio)} - ${formatarData(dadosVendas.periodo.fim)}`],
                  [''],
                  ['Métrica', 'Valor'],
                  ['Total de Vendas', dadosVendas.totalVendas],
                  ['Valor Total', formatarMoeda(dadosVendas.valorTotal)],
                  ['Ticket Médio', formatarMoeda(dadosVendas.ticketMedio)],
                  ['Comissão', 'R$ 0,00 (salário fixo)']
                ];
                
                const csvContent = csv.map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-vendedor-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#bb25a6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "10px"
              }}
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #bb25a6"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#bb25a6", fontSize: "16px" }}>🛒 Vendas do Período</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#bb25a6", margin: "0 0 5px 0" }}>
              {dadosVendas.totalVendas}
            </p>
            {dadosVendas.crescimento !== 0 && (
              <p style={{ 
                color: dadosVendas.crescimento > 0 ? "#bb25a6" : "#dc3545", 
                margin: "5px 0 0 0", 
                fontSize: "14px" 
              }}>
                {dadosVendas.crescimento > 0 ? '↑' : '↓'} {Math.abs(dadosVendas.crescimento)}% vs período anterior
              </p>
            )}
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #bb25a6"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#bb25a6", fontSize: "16px" }}>💰 Valor Total</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#bb25a6", margin: "0" }}>
              {formatarMoeda(dadosVendas.valorTotal)}
            </p>
            <p style={{ color: "#666", margin: "5px 0 0 0", fontSize: "12px" }}>
              Sem comissão (salário fixo)
            </p>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #ffc107"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#ffc107", fontSize: "16px" }}>📈 Ticket Médio</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#ffc107", margin: "0" }}>
              {formatarMoeda(dadosVendas.ticketMedio)}
            </p>
            <p style={{ color: "#666", margin: "5px 0 0 0", fontSize: "12px" }}>
              Por venda realizada
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <BarChart 
          data={dadosVendas.vendasPorDia} 
          title="📅 Vendas por Dia" 
          color="#bb25a6"
        />

        {/* Resumo Executivo */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h3 style={{ color: "#bb25a6", marginBottom: "15px" }}>📋 Resumo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <strong>✅ Status:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.totalVendas > 0 ? 
                  "Vendas realizadas" : 
                  "Sem vendas no período"
                }
              </p>
            </div>
            <div>
              <strong>📊 Média Diária:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {(dadosVendas.totalVendas / dadosVendas.vendasPorDia.length).toFixed(1)} vendas/dia
              </p>
            </div>
            <div>
              <strong>🎯 Tipo de Venda:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                Vendedor (100% para lojista)
              </p>
            </div>
            <div>
              <strong>💵 Comissão:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                R$ 0,00 (salário fixo)
              </p>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/vendedor/dashboard")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            &#8592; Voltar para Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RelatorioPageVendedor;