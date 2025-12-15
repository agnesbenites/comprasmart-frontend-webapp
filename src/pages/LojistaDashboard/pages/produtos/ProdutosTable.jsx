import React from "react";
import styles from "./produtos.styles";

/**
 * Tabela de produtos
 */
const ProdutosTable = ({
    produtos = [],
    onEdit,
    onDelete,
    getStatusEstoque,
}) => {
    return (
        <div style={styles.card} data-cy="produtos-table-card">
            <h3 style={styles.cardTitle}>
                Lista de Produtos ({produtos.length})
                <span style={styles.badge} data-cy="estoque-baixo-count">
                    {produtos.filter(p => p.estoque <= 5).length} com estoque baixo
                </span>
            </h3>

            <div style={styles.tableContainer}>
                <table style={styles.table} data-cy="produtos-table">
                    <thead>
                        <tr>
                            <th style={styles.th}>Produto</th>
                            <th style={styles.th}>Categoria</th>
                            <th style={styles.th}>Preço</th>
                            <th style={styles.th}>Comissão</th>
                            <th style={styles.th}>Estoque</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {produtos.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ ...styles.td, textAlign: "center" }}>
                                    Nenhum produto cadastrado
                                </td>
                            </tr>
                        )}

                        {produtos.map((p) => {
                            const status = getStatusEstoque ? getStatusEstoque(p.estoque, 5) : { texto: "OK", cor: "#28a745" };
                            let detalhesModa = "";

                            // Monta detalhes de moda se aplicável
                            if (p.categoria?.toLowerCase().includes("moda") && p.subcategoria_moda) {
                                detalhesModa += `${p.subcategoria_moda.charAt(0).toUpperCase()}${p.subcategoria_moda.slice(1)}`;
                                if (p.genero) detalhesModa += ` - ${p.genero.charAt(0).toUpperCase()}${p.genero.slice(1)}`;
                                if (p.tipo_peca) detalhesModa += ` (${p.tipo_peca})`;
                                if (p.tamanho) detalhesModa += ` - Tam: ${p.tamanho}`;
                                if (p.forma_ajustada === "forma-maior") detalhesModa += " (Forma MAIOR)";
                                if (p.forma_ajustada === "forma-menor") detalhesModa += " (Forma MENOR)";
                            }

                            // Pega comissão do campo correto (commission_rate do banco)
                            const comissao = p.commission_rate ?? p.comissao ?? 0;

                            return (
                                <tr key={p.id} data-cy={`produto-row-${p.id}`}>
                                    <td style={styles.td}>
                                        <strong>{p.nome}</strong>
                                        {p.sku && (
                                            <>
                                                <br />
                                                <small style={styles.sku}>SKU: {p.sku}</small>
                                            </>
                                        )}
                                        {detalhesModa && (
                                            <>
                                                <br />
                                                <small style={{ ...styles.sku, color: "#6f42c1" }}>
                                                    {detalhesModa}
                                                </small>
                                            </>
                                        )}
                                    </td>

                                    <td style={styles.td}>{p.categoria}</td>

                                    <td style={styles.td}>
                                        R$ {Number(p.preco || 0).toFixed(2)}
                                    </td>

                                    <td style={styles.td}>
                                        {Number(comissao).toFixed(1)}%
                                    </td>

                                    <td style={styles.td}>
                                        {p.estoque || 0}
                                    </td>

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

                                    <td style={styles.td}>
                                        <button
                                            onClick={() => onEdit(p)}
                                            style={styles.smallButton}
                                            data-cy="editar-produto"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => onDelete(p.id)}
                                            style={styles.smallButtonDanger}
                                            data-cy="excluir-produto"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdutosTable;