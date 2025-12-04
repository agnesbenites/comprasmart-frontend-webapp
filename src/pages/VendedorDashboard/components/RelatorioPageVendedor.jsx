import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../../components/Layout";
import { formatarMoeda, formatarData } from '../../../shared/utils/formatters';
import { API_CONFIG, apiGet } from '../../../shared/utils/api';
import { supabase } from '../../../shared/utils/supabase'; // se estiver usando

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

        // 2. Buscar perfil do vendedor
        const { data: perfilVendedor, error: perfilError } = await supabase
          .from('vendedores')
          .select('nome, setores, loja_id, meta_mensal')
          .eq('user_id', user.id)
          .single();

        if (perfilError) throw perfilError;

        // 3. Buscar dados da loja
        const { data: loja, error: lojaError } = await supabase
          .from('lojas')
          .select('nome, endereco')
          .eq('id', perfilVendedor.loja_id)
          .single();

        if (lojaError) throw lojaError;

        // 4. Buscar vendas do período
        const { data: vendas, error: vendasError } = await supabase
          .from('vendas')
          .select(`
            *,
            cliente:clientes(nome),
            produto:produtos(nome, categoria, preco)
          `)
          .eq('vendedor_id', user.id)
          .gte('data_venda', periodo.inicio.toISOString())
          .lte('data_venda', periodo.fim.toISOString())
          .order('data_venda', { ascending: true });

        if (vendasError) throw vendasError;

        // 5. Buscar clientes
        const { data: clientes, error: clientesError } = await supabase
          .from('clientes')
          .select('id, tipo_cliente')
          .eq('vendedor_responsavel', user.id);

        if (clientesError) throw clientesError;

        // 6. Processar os dados
        const totalVendas = vendas.length;
        const valorTotal = vendas.reduce((sum, venda) => sum + (venda.produto?.preco || 0), 0);
        const clientesNovos = clientes.filter(c => c.tipo_cliente === 'novo').length;
        const clientesFregueses = clientes.filter(c => c.tipo_cliente === 'fregues').length;
        const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

        // 7. Agrupar por setor
        const vendasPorSetor = {};
        vendas.forEach(venda => {
          const setor = venda.produto?.categoria || 'Outros';
          if (!vendasPorSetor[setor]) {
            vendasPorSetor[setor] = {
              vendas: 0,
              valor: 0,
              meta: perfilVendedor.meta_mensal || 0
            };
          }
          vendasPorSetor[setor].vendas += 1;
          vendasPorSetor[setor].valor += venda.produto?.preco || 0;
        });

        const setoresDetalhados = Object.entries(vendasPorSetor).map(([nome, dados]) => ({
          nome,
          vendas: dados.vendas,
          valor: dados.valor,
          meta: dados.meta
        }));

        // 8. Agrupar por dia
        const vendasPorDiaMap = {};
        vendas.forEach(venda => {
          const data = new Date(venda.data_venda).toLocaleDateString('pt-BR');
          if (!vendasPorDiaMap[data]) {
            vendasPorDiaMap[data] = 0;
          }
          vendasPorDiaMap[data] += 1;
        });

        const vendasPorDia = Object.entries(vendasPorDiaMap).map(([dia, vendas]) => ({
          dia,
          vendas
        })).sort((a, b) => new Date(a.dia) - new Date(b.dia));

        // 9. Calcular performance
        const performance = perfilVendedor.meta_mensal > 0 
          ? Math.min((totalVendas / perfilVendedor.meta_mensal) * 100, 100)
          : 0;

        // 10. Montar objeto final
        const dadosProcessados = {
          vendedor: perfilVendedor.nome,
          setores: perfilVendedor.setores || [],
          loja: `${loja.nome} - ${loja.endereco}`,
          totalVendas,
          metaMensal: perfilVendedor.meta_mensal || 0,
          valorTotal,
          clientesNovos,
          clientesFregueses,
          performance: Math.round(performance),
          setoresDetalhados,
          vendasPorDia,
          ticketMedio,
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
  const BarChart = ({ data, title, color = "#2c5aa0" }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
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
        <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "200px" }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  height: `${maxValue > 0 ? (item.vendas / maxValue) * 150 : 0}px`,
                  backgroundColor: color,
                  width: "30px",
                  borderRadius: "5px 5px 0 0",
                  transition: "height 0.3s ease"
                }}
              />
              <span style={{ marginTop: "8px", fontSize: "12px", color: "#666", textAlign: "center" }}>
                {item.dia}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2c5aa0" }}>
                {item.vendas}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente de gráfico de setores
  const SetoresChart = ({ data, title }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
          <p style={{ color: "#666", textAlign: "center" }}>Sem dados disponíveis</p>
        </div>
      );
    }

    const colors = ["#2c5aa0", "#28a745", "#fd7e14", "#dc3545", "#6f42c1"];
    
    return (
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#2c5aa0", marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {data.map((setor, index) => {
            const percentual = setor.meta > 0 ? (setor.vendas / setor.meta) * 100 : 0;
            return (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "500" }}>
                    <div
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        backgroundColor: colors[index % colors.length],
                        borderRadius: "50%",
                        marginRight: "8px"
                      }}
                    />
                    {setor.nome}
                  </span>
                  <span style={{ fontWeight: "bold", color: "#2c5aa0" }}>
                    {setor.vendas}/{setor.meta} ({percentual.toFixed(0)}%)
                  </span>
                </div>
                <div style={{ 
                  height: "8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div 
                    style={{
                      height: "100%",
                      backgroundColor: percentual >= 100 ? "#28a745" : colors[index % colors.length],
                      width: `${Math.min(percentual, 100)}%`,
                      borderRadius: "4px",
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {formatarMoeda(setor.valor)}
                  </span>
                  <span style={{ 
                    fontSize: "12px", 
                    color: percentual >= 100 ? "#28a745" : "#dc3545",
                    fontWeight: "bold"
                  }}>
                    {percentual >= 100 ? "✅ Meta batida!" : `⚠️ Faltam ${setor.meta - setor.vendas}`}
                  </span>
                </div>
              </div>
            );
          })}
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
      <h4 style={{ color: "#2c5aa0", marginBottom: "10px" }}>📅 Selecione o Período</h4>
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
            backgroundColor: "#2c5aa0",
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
              backgroundColor: "#2c5aa0",
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
            <h1 style={{ color: "#2c5aa0", margin: "0 0 10px 0" }}>
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
                backgroundColor: "#2c5aa0",
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
                // Função para exportar dados
                const csv = [
                  ['Relatório de Vendas', dadosVendas.vendedor],
                  ['Período', `${formatarData(dadosVendas.periodo.inicio)} - ${formatarData(dadosVendas.periodo.fim)}`],
                  [''],
                  ['Métrica', 'Valor'],
                  ['Total de Vendas', dadosVendas.totalVendas],
                  ['Meta Mensal', dadosVendas.metaMensal],
                  ['Valor Total', formatarMoeda(dadosVendas.valorTotal)],
                  ['Clientes Novos', dadosVendas.clientesNovos],
                  ['Clientes Fregueses', dadosVendas.clientesFregueses],
                  ['Performance', `${dadosVendas.performance}%`],
                  ['Ticket Médio', formatarMoeda(dadosVendas.ticketMedio)]
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
                backgroundColor: "#28a745",
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
            borderLeft: "4px solid #2c5aa0"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#2c5aa0", fontSize: "16px" }}>💰 Vendas do Período</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#2c5aa0", margin: "0 0 5px 0" }}>
              {dadosVendas.totalVendas}/{dadosVendas.metaMensal}
            </p>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
              {formatarMoeda(dadosVendas.valorTotal)}
            </p>
            <div style={{ 
              marginTop: "10px",
              height: "6px",
              backgroundColor: "#e9ecef",
              borderRadius: "3px",
              overflow: "hidden"
            }}>
              <div 
                style={{
                  height: "100%",
                  backgroundColor: "#2c5aa0",
                  width: `${dadosVendas.metaMensal > 0 ? Math.min((dadosVendas.totalVendas / dadosVendas.metaMensal) * 100, 100) : 0}%`,
                  borderRadius: "3px"
                }}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #28a745"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#28a745", fontSize: "16px" }}>👥 Perfil de Clientes</h3>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "15px 0" }}>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", margin: "0" }}>
                  {dadosVendas.clientesNovos}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>🆕 Novos</p>
              </div>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#fd7e14", margin: "0" }}>
                  {dadosVendas.clientesFregueses}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>🔁 Fregueses</p>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#666", margin: "10px 0 0 0" }}>
              Total: {dadosVendas.clientesNovos + dadosVendas.clientesFregueses} clientes
            </p>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            borderLeft: "4px solid #fd7e14"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#fd7e14", fontSize: "16px" }}>📈 Performance</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#fd7e14", margin: "0 0 5px 0" }}>
              {dadosVendas.performance}%
            </p>
            <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>
              Ticket Médio
            </p>
            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#2c5aa0", margin: "0" }}>
              {formatarMoeda(dadosVendas.ticketMedio)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <BarChart 
            data={dadosVendas.vendasPorDia} 
            title="📈 Vendas por Dia" 
            color="#2c5aa0"
          />

          <SetoresChart 
            data={dadosVendas.setoresDetalhados} 
            title="🎯 Performance por Setor"
          />
        </div>

        {/* Resumo Executivo */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h3 style={{ color: "#2c5aa0", marginBottom: "15px" }}>📋 Resumo Executivo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <strong>🎯 Situação da Meta:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.totalVendas >= dadosVendas.metaMensal ? 
                  "✅ Meta batida com sucesso!" : 
                  `⚠️ Faltam ${dadosVendas.metaMensal - dadosVendas.totalVendas} vendas para a meta`
                }
              </p>
            </div>
            <div>
              <strong>📊 Melhor Setor:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.setoresDetalhados.length > 0 ? 
                  dadosVendas.setoresDetalhados.reduce((prev, current) => 
                    (prev.vendas > current.vendas) ? prev : current
                  ).nome : "N/A"}
              </p>
            </div>
            <div>
              <strong>👥 Foco de Clientes:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {dadosVendas.clientesNovos > dadosVendas.clientesFregueses ? 
                  "🆕 Captação de novos clientes" : 
                  "🔁 Fidelização de clientes"
                }
              </p>
            </div>
            <div>
              <strong>💰 Receita Total:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {formatarMoeda(dadosVendas.valorTotal)}
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
            ← Voltar para Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default RelatorioPageVendedor;