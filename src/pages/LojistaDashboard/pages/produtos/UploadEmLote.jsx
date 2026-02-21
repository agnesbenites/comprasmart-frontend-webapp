import React, { useState } from 'react';
import { supabase } from '@/supabaseClient';
import * as XLSX from 'xlsx';
import InfoButton from './InfoButton';

/**
 * Upload em Lote - VERSÃO COMPLETA
 * Com InfoButton, avisos e validações
 */
const UploadEmLote = ({ lojaId, onSuccess }) => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ====================================
     GERAR TEMPLATE EXCEL
  ==================================== */
  const gerarTemplate = () => {
    const wb = XLSX.utils.book_new();

    // ===== SHEET 1: PRODUTOS =====
    const produtosData = [
      // Header
      ['nome', 'categoria', 'preco', 'estoque', 'comissao_percentual'],
      // Exemplos
      ['Camiseta Básica Preta M', 'Moda & Acessórios', '59.90', '50', '5.0'],
      ['Tênis Esportivo Azul 42', 'Moda & Acessórios', '199.90', '30', '8.0'],
      ['Fone Bluetooth Premium', 'Eletrônicos & Tecnologia', '89.90', '100', '10.0'],
    ];

    const wsProdutos = XLSX.utils.aoa_to_sheet(produtosData);
    
    // Larguras das colunas
    wsProdutos['!cols'] = [
      { wch: 30 }, // nome
      { wch: 25 }, // categoria
      { wch: 12 }, // preco
      { wch: 12 }, // estoque
      { wch: 20 }, // comissao_percentual
    ];

    XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos');

    // ===== SHEET 2: INSTRUÇÕES =====
    const instrucoesData = [
      ['INSTRUÇÕES DE PREENCHIMENTO'],
      [''],
      ['CAMPOS OBRIGATÓRIOS:'],
      ['- nome: Nome descritivo do produto'],
      ['- categoria: Uma das categorias disponíveis'],
      ['- preco: Preço de venda (formato: 59.90)'],
      ['- estoque: Quantidade disponível (número inteiro)'],
      ['- comissao_percentual: Comissão do consultor em % (ex: 5.0)'],
      [''],
      ['CATEGORIAS DISPONÍVEIS:'],
      ['- Moda & Acessórios'],
      ['- Eletrônicos & Tecnologia'],
      ['- Casa & Decoração'],
      ['- Beleza & Cuidados'],
      ['- Esportes & Lazer'],
      ['- Alimentos & Bebidas'],
      ['- Livros & Papelaria'],
      ['- Brinquedos & Jogos'],
      ['- Pets'],
      ['- Automotivo'],
      ['- Saúde & Bem-estar'],
      ['- Outros'],
      [''],
      ['VALIDAÇÕES:'],
      ['- Nome: Mínimo 3 caracteres'],
      ['- Preço: Maior que 0'],
      ['- Estoque: Número inteiro, maior ou igual a 0'],
      ['- Comissão: Entre 0 e 100%'],
      [''],
      ['IMPORTANTE:'],
      ['- Use ponto (.) como separador decimal'],
      ['- Não use vírgula (,) nos números'],
      ['- Categorias devem ser escritas exatamente como na lista'],
      ['- A planilha aceita apenas PRODUTOS, não promoções'],
      ['- Promoções devem ser criadas individualmente no sistema'],
    ];

    const wsInstrucoes = XLSX.utils.aoa_to_sheet(instrucoesData);
    wsInstrucoes['!cols'] = [{ wch: 70 }];
    XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Instruções');

    // Gerar arquivo
    XLSX.writeFile(wb, 'template_produtos.xlsx');
  };

  /* ====================================
     VALIDAÇÕES
  ==================================== */
  const validarProduto = (produto, linha) => {
    const erros = [];

    // Nome
    if (!produto.nome || produto.nome.trim().length < 3) {
      erros.push(`Linha ${linha}: Nome deve ter pelo menos 3 caracteres`);
    }

    // Categoria
    const categoriasValidas = [
      'Moda & Acessórios',
      'Eletrônicos & Tecnologia',
      'Casa & Decoração',
      'Beleza & Cuidados',
      'Esportes & Lazer',
      'Alimentos & Bebidas',
      'Livros & Papelaria',
      'Brinquedos & Jogos',
      'Pets',
      'Automotivo',
      'Saúde & Bem-estar',
      'Outros',
    ];

    if (!produto.categoria || !categoriasValidas.includes(produto.categoria)) {
      erros.push(`Linha ${linha}: Categoria inválida. Use uma da lista de instruções`);
    }

    // Preço
    const preco = Number(produto.preco);
    if (isNaN(preco) || preco <= 0) {
      erros.push(`Linha ${linha}: Preço deve ser um número maior que 0`);
    }

    // Estoque
    const estoque = Number(produto.estoque);
    if (isNaN(estoque) || estoque < 0 || !Number.isInteger(estoque)) {
      erros.push(`Linha ${linha}: Estoque deve ser um número inteiro maior ou igual a 0`);
    }

    // Comissão
    const comissao = Number(produto.comissao_percentual);
    if (isNaN(comissao) || comissao < 0 || comissao > 100) {
      erros.push(`Linha ${linha}: Comissão deve estar entre 0 e 100%`);
    }

    return erros;
  };

  /* ====================================
     PROCESSAR UPLOAD
  ==================================== */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!lojaId) {
      alert(' Nenhuma loja selecionada!');
      return;
    }

    try {
      setLoading(true);
      setResultado(null);

      // Ler arquivo
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // Pegar sheet de produtos
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert(' Planilha vazia!');
        return;
      }

      // Validar todos
      const erros = [];
      const produtosValidos = [];

      jsonData.forEach((row, index) => {
        const linha = index + 2; // +2 porque header é linha 1
        const errosLinha = validarProduto(row, linha);

        if (errosLinha.length > 0) {
          erros.push(...errosLinha);
        } else {
          produtosValidos.push({
            nome: row.nome.trim(),
            categoria: row.categoria,
            preco: Number(row.preco),
            estoque: Number(row.estoque),
            commission_rate: Number(row.comissao_percentual),
            loja_id: lojaId,
          });
        }
      });

      // Inserir produtos válidos
      let produtosInseridos = 0;

      if (produtosValidos.length > 0) {
        const { data: inserted, error } = await supabase
          .from('produtos')
          .insert(produtosValidos)
          .select();

        if (error) throw error;
        produtosInseridos = inserted?.length || 0;
      }

      // Mostrar resultado
      setResultado({
        produtosInseridos,
        erros,
      });

      if (produtosInseridos > 0) {
        onSuccess?.();
      }

      // Limpar input
      e.target.value = '';

    } catch (error) {
      console.error('[Upload] Erro:', error);
      alert(' Erro ao processar arquivo');
    } finally {
      setLoading(false);
    }
  };

  /* ====================================
     RENDER
  ==================================== */
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={styles.title}> Upload em Lote</h3>
          <InfoButton title="Como funciona o upload em lote?">
            <strong>Passo a passo:</strong>
            <ol style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '0.85rem' }}>
              <li>Clique em "Baixar Planilha Modelo"</li>
              <li>Preencha a planilha com seus produtos</li>
              <li>Salve o arquivo</li>
              <li>Clique em "Fazer Upload" e selecione o arquivo</li>
              <li>Aguarde o processamento</li>
            </ol>
            <p style={{ margin: '8px 0', fontSize: '0.85rem', color: '#ffc107' }}>
              ⚠️ <strong>Importante:</strong> A planilha aceita apenas PRODUTOS. 
              Promoções devem ser criadas individualmente na seção abaixo.
            </p>
          </InfoButton>
        </div>
      </div>

      {/* Aviso sobre promoções */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ffc107',
      }}>
        <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
          ⚠️ <strong>Atenção:</strong> O upload em lote funciona apenas para <strong>produtos</strong>. 
          Promoções devem ser criadas individualmente na seção "Promoções e Ofertas" abaixo.
        </p>
      </div>

      {/* Informação */}
      <div style={styles.content}>
        <p style={styles.text}>
          Cadastre múltiplos produtos de uma vez usando planilha Excel.
        </p>

        {/* Botões */}
        <div style={styles.buttons}>
          <button
            onClick={gerarTemplate}
            style={styles.downloadButton}
            type="button"
          >
            📥 Baixar Planilha Modelo
          </button>

          <label style={styles.uploadButton}>
            📤 Fazer Upload
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {loading && (
          <div style={styles.loading}>
             Processando arquivo...
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div style={styles.result}>
            <div style={styles.stats}>
              <div style={styles.statBox}>
                <strong style={{ fontSize: '2rem' }}>
                  {resultado.produtosInseridos}
                </strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                  Produtos inseridos
                </p>
              </div>

              {resultado.erros.length > 0 && (
                <div style={{ ...styles.statBox, borderColor: '#dc3545', backgroundColor: '#fff5f5' }}>
                  <strong style={{ fontSize: '2rem', color: '#dc3545' }}>
                    {resultado.erros.length}
                  </strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                    Erros encontrados
                  </p>
                </div>
              )}
            </div>

            {/* Lista de erros */}
            {resultado.erros.length > 0 && (
              <div style={styles.errorList}>
                <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>
                  ⚠️ Erros de Validação:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {resultado.erros.map((erro, index) => (
                    <li key={index} style={{ marginBottom: '5px', fontSize: '0.85rem' }}>
                      {erro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    marginBottom: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.3rem',
    color: '#495057',
    margin: 0,
    fontWeight: '700',
  },
  content: {
    marginTop: '15px',
  },
  text: {
    color: '#666',
    fontSize: '0.95rem',
    marginBottom: '15px',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  downloadButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  uploadButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-block',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#bb25a6',
    fontSize: '1rem',
    fontWeight: '600',
  },
  result: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statBox: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '2px solid #bb25a6',
  },
  errorList: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    borderRadius: '8px',
    border: '1px solid #f5c6cb',
    color: '#721c24',
  },
};

export default UploadEmLote;