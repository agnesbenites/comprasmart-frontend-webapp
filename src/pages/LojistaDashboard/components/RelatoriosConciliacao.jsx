// src/pages/LojistaDashboard/components/RelatoriosConciliacao.jsx

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const RelatoriosConciliacao = ({ lojistaId, onClose }) => {
  const [tipoRelatorio, setTipoRelatorio] = useState('vendas'); // vendas, comissoes, resumo
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  // Buscar relatório no Supabase
  const buscarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      setErro('Por favor, selecione o período (data início e fim)');
      return;
    }

    setLoading(true);
    setErro('');
    setDados(null);

    try {
      let result;

      if (tipoRelatorio === 'vendas') {
        const { data, error } = await supabase.rpc('relatorio_vendas_periodo', {
          p_loja_id: lojistaId,
          p_data_inicio: dataInicio,
          p_data_fim: dataFim
        });
        
        if (error) throw error;
        result = data;
      } 
      else if (tipoRelatorio === 'comissoes') {
        const { data, error } = await supabase.rpc('relatorio_comissoes_consultor', {
          p_loja_id: lojistaId,
          p_data_inicio: dataInicio,
          p_data_fim: dataFim
        });
        
        if (error) throw error;
        result = data;
      }
      else if (tipoRelatorio === 'resumo') {
        const { data, error } = await supabase.rpc('relatorio_resumo_conciliacao', {
          p_loja_id: lojistaId,
          p_data_inicio: dataInicio,
          p_data_fim: dataFim
        });
        
        if (error) throw error;
        result = data;
      }

      setDados(result);
      
      if (!result || result.length === 0) {
        setErro('Nenhum dado encontrado para o período selecionado');
      }
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      setErro('Erro ao buscar relatório: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Exportar para Excel
  const exportarExcel = () => {
    if (!dados || dados.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    
    const nomeArquivo = `relatorio_${tipoRelatorio}_${dataInicio}_${dataFim}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
  };

  // Exportar para PDF (usando window.print)
  const exportarPDF = () => {
    window.print();
  };

  // Renderizar tabela baseado no tipo de relatório
  const renderizarTabela = () => {
    if (!dados || dados.length === 0) return null;

    if (tipoRelatorio === 'vendas') {
      return (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Consultor</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Produto</th>
                <th style={styles.th}>Qtd</th>
                <th style={styles.th}>Valor Unit.</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Comissão %</th>
                <th style={styles.th}>Valor Comissão</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((row, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                  <td style={styles.td}>{new Date(row.data_venda).toLocaleDateString('pt-BR')}</td>
                  <td style={styles.td}>{row.consultor_nome}</td>
                  <td style={styles.td}>{row.cliente_nome || '-'}</td>
                  <td style={styles.td}>{row.produto_nome}</td>
                  <td style={styles.td}>{row.quantidade}</td>
                  <td style={styles.td}>R$ {parseFloat(row.valor_unitario).toFixed(2)}</td>
                  <td style={styles.td}>R$ {parseFloat(row.valor_total).toFixed(2)}</td>
                  <td style={styles.td}>{parseFloat(row.comissao_percentual).toFixed(2)}%</td>
                  <td style={styles.td}>R$ {parseFloat(row.valor_comissao).toFixed(2)}</td>
                  <td style={styles.td}>{row.status_pedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (tipoRelatorio === 'comissoes') {
      const totalComissoes = dados.reduce((sum, row) => sum + parseFloat(row.total_comissoes || 0), 0);
      
      return (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Consultor</th>
                <th style={styles.th}>CPF</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Total Vendas</th>
                <th style={styles.th}>Total Comissões</th>
                <th style={styles.th}>Qtd Pedidos</th>
                <th style={styles.th}>Comissão Média %</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((row, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                  <td style={styles.td}>{row.consultor_nome}</td>
                  <td style={styles.td}>{row.consultor_cpf}</td>
                  <td style={styles.td}>{row.consultor_email}</td>
                  <td style={styles.td}>R$ {parseFloat(row.total_vendas).toFixed(2)}</td>
                  <td style={styles.td}>R$ {parseFloat(row.total_comissoes).toFixed(2)}</td>
                  <td style={styles.td}>{row.quantidade_pedidos}</td>
                  <td style={styles.td}>{parseFloat(row.comissao_media_percentual).toFixed(2)}%</td>
                </tr>
              ))}
              <tr style={styles.totalRow}>
                <td colSpan="4" style={{...styles.td, fontWeight: 'bold', textAlign: 'right'}}>
                  TOTAL A PAGAR:
                </td>
                <td style={{...styles.td, fontWeight: 'bold', fontSize: '1.1rem', color: '#d32f2f'}}>
                  R$ {totalComissoes.toFixed(2)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (tipoRelatorio === 'resumo') {
      const resumo = dados[0];
      if (!resumo) return null;

      return (
        <div style={styles.resumoContainer}>
          <div style={styles.resumoCard}>
            <h3 style={styles.resumoTitle}> Resumo Executivo</h3>
            <p><strong>Período:</strong> {resumo.periodo}</p>
          </div>

          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>R$ {parseFloat(resumo.total_vendas_bruto).toFixed(2)}</div>
              <div style={styles.metricLabel}>Total Vendas Bruto</div>
            </div>

            <div style={styles.metricCard}>
              <div style={{...styles.metricValue, color: '#d32f2f'}}>
                R$ {parseFloat(resumo.total_comissoes_pagar).toFixed(2)}
              </div>
              <div style={styles.metricLabel}>Total Comissões a Pagar</div>
            </div>

            <div style={styles.metricCard}>
              <div style={{...styles.metricValue, color: '#388e3c'}}>
                R$ {parseFloat(resumo.total_liquido_loja).toFixed(2)}
              </div>
              <div style={styles.metricLabel}>Líquido para Loja</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{resumo.total_pedidos}</div>
              <div style={styles.metricLabel}>Total de Pedidos</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricValue}>R$ {parseFloat(resumo.ticket_medio).toFixed(2)}</div>
              <div style={styles.metricLabel}>Ticket Médio</div>
            </div>
          </div>

          {resumo.produtos_mais_vendidos && (
            <div style={styles.subSection}>
              <h4> Top 5 Produtos Mais Vendidos</h4>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Produto</th>
                    <th style={styles.th}>Quantidade</th>
                    <th style={styles.th}>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {resumo.produtos_mais_vendidos.map((p, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.td}>{p.produto}</td>
                      <td style={styles.td}>{p.quantidade_vendida}</td>
                      <td style={styles.td}>R$ {parseFloat(p.valor_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resumo.consultores_top_vendas && (
            <div style={styles.subSection}>
              <h4> Top 5 Consultores por Vendas</h4>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Consultor</th>
                    <th style={styles.th}>Pedidos</th>
                    <th style={styles.th}>Total Vendas</th>
                    <th style={styles.th}>Total Comissões</th>
                  </tr>
                </thead>
                <tbody>
                  {resumo.consultores_top_vendas.map((c, idx) => (
                    <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.td}>{c.consultor}</td>
                      <td style={styles.td}>{c.pedidos}</td>
                      <td style={styles.td}>R$ {parseFloat(c.total_vendas).toFixed(2)}</td>
                      <td style={styles.td}>R$ {parseFloat(c.total_comissoes).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}> Relatórios de Conciliação</h2>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div style={styles.modalBody}>
          {/* Filtros */}
          <div style={styles.filtersSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Tipo de Relatório:</label>
              <select 
                value={tipoRelatorio} 
                onChange={(e) => setTipoRelatorio(e.target.value)}
                style={styles.select}
              >
                <option value="vendas"> Vendas Detalhadas</option>
                <option value="comissoes"> Comissões por Consultor</option>
                <option value="resumo"> Resumo Executivo</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Data Início:</label>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Data Fim:</label>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.input}
              />
            </div>

            <button 
              onClick={buscarRelatorio}
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? ' Carregando...' : ' Buscar Relatório'}
            </button>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div style={styles.errorBox}>
              ⚠️ {erro}
            </div>
          )}

          {/* Ações de exportação */}
          {dados && dados.length > 0 && (
            <div style={styles.actionsBar}>
              <button onClick={exportarExcel} style={styles.exportButton}>
                 Exportar Excel
              </button>
              <button onClick={exportarPDF} style={styles.exportButton}>
                 Exportar PDF
              </button>
            </div>
          )}

          {/* Renderizar tabela/resumo */}
          {renderizarTabela()}
        </div>
      </div>
    </div>
  );
};

// ========== ESTILOS ==========
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '95%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    borderBottom: '2px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#2c5aa0',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#666',
    padding: '5px 10px',
  },
  modalBody: {
    padding: '30px',
  },
  filtersSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#2c5aa0',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'end',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #ef5350',
  },
  actionsBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  exportButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#388e3c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  tableHeader: {
    backgroundColor: '#2c5aa0',
    color: '#fff',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #e0e0e0',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f5f5f5',
  },
  totalRow: {
    backgroundColor: '#fff3cd',
    borderTop: '2px solid #ffc107',
  },
  resumoContainer: {
    marginTop: '20px',
  },
  resumoCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  resumoTitle: {
    margin: '0 0 10px 0',
    color: '#1976d2',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
  },
  subSection: {
    marginTop: '30px',
  },
};

export default RelatoriosConciliacao;