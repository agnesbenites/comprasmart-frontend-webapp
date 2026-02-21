import React, { useState } from "react";
import styles from "./produtos.styles";

/**
 * Tabela de Produtos - SEM SKU NO DISPLAY
 * SKU é salvo no banco mas NÃO aparece na interface
 */
const ProdutosTable = ({ produtos, onEdit, onDelete, getStatusEstoque }) => {
  const [expandido, setExpandido] = useState(null);

  const toggleDescricao = (produtoId) => {
    setExpandido(expandido === produtoId ? null : produtoId);
  };

  return (
    <div style={styles.card} data-cy="produtos-table">
      <h3 style={styles.cardTitle}>
        Produtos Cadastrados ({produtos.length})
      </h3>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Categoria</th>
              <th style={styles.th}>Preço</th>
              <th style={styles.th}>Estoque</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
                  Nenhum produto cadastrado
                </td>
              </tr>
            )}

            {produtos.map((produto) => {
              const isExpandido = expandido === produto.id;
              const status = getStatusEstoque ? getStatusEstoque(produto.estoque, 5) : { texto: "OK", cor: "#bb25a6" };

              return (
                <React.Fragment key={produto.id}>
                  <tr>
                    {/* NOME */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        {/* Botão expandir se tiver descrição */}
                        {produto.descricao && (
                          <button
                            onClick={() => toggleDescricao(produto.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '16px',
                              padding: '0',
                              marginTop: '2px'
                            }}
                            title={isExpandido ? "Ocultar descrição" : "Ver descrição"}
                          >
                            {isExpandido ? '🔽' : '▶️'}
                          </button>
                        )}
                        
                        <div>
                          <strong style={{ fontSize: '15px' }}>{produto.nome}</strong>
                          
                          {/* Badge IA para produtos com descrição */}
                          {produto.descricao && (
                            <>
                              <br />
                              <small style={{ 
                                backgroundColor: '#6f42c1',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginTop: '4px'
                              }}>
                                 IA
                              </small>
                            </>
                          )}

                          {/* Badge fotos */}
                          {produto.fotos && produto.fotos.length > 0 && (
                            <>
                              <br />
                              <small style={{ 
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginTop: '4px'
                              }}>
                                📸 {produto.fotos.length} foto{produto.fotos.length > 1 ? 's' : ''}
                              </small>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORIA */}
                    <td style={styles.td}>
                      <small style={{ color: '#666' }}>{produto.categoria}</small>
                      {produto.subcategoria_moda && (
                        <>
                          <br />
                          <small style={{ 
                            backgroundColor: '#f0f0f0',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '11px'
                          }}>
                            {produto.subcategoria_moda} • {produto.genero} • {produto.tamanho}
                          </small>
                        </>
                      )}
                    </td>

                    {/* PREÇO */}
                    <td style={styles.td}>
                      <strong>R$ {Number(produto.preco || 0).toFixed(2)}</strong>
                      <br />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Comissão: {produto.commission_rate || 0}%
                      </small>
                    </td>

                    {/* ESTOQUE */}
                    <td style={styles.td}>
                      <strong style={{ fontSize: '16px' }}>{produto.estoque}</strong>
                    </td>

                    {/* STATUS */}
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor:
                            status.cor === "#dc3545"
                              ? "#f8d7da"
                              : status.cor === "#ffc107"
                              ? "#fff3cd"
                              : "#d4edda",
                          color: status.cor,
                        }}
                      >
                        {status.texto}
                      </span>
                    </td>

                    {/* AÇÕES */}
                    <td style={styles.td}>
                      <button
                        onClick={() => onEdit(produto)}
                        style={styles.smallButton}
                        data-cy={`edit-product-${produto.id}`}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => onDelete(produto.id)}
                        style={styles.smallButtonDanger}
                        data-cy={`delete-product-${produto.id}`}
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>

                  {/* Linha de descrição expandida */}
                  {isExpandido && produto.descricao && (
                    <tr>
                      <td colSpan="6" style={{
                        ...styles.td,
                        backgroundColor: '#f8f9fa',
                        borderTop: 'none',
                        paddingTop: '0'
                      }}>
                        <div style={{
                          padding: '15px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e3f2fd',
                          margin: '10px 0'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px'
                          }}>
                            <span style={{
                              backgroundColor: '#6f42c1',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                               IA
                            </span>
                            <strong style={{ color: '#333' }}>Descrição:</strong>
                          </div>
                          <p style={{
                            margin: 0,
                            color: '#495057',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {produto.descricao}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProdutosTable;