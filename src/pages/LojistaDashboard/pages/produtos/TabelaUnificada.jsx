import React, { useState } from "react";
import styles from "./produtos.styles";

/**
 * Tabela Unificada - Produtos E Promoções
 * Mostra produtos e promoções na mesma tabela com coluna TIPO
 */
const TabelaUnificada = ({
    produtos = [],
    promocoes = [],
    onEditProduto,
    onEditPromocao,
    onDeleteProduto,
    onDeletePromocao,
    getStatusEstoque,
}) => {
    const [itemExpandido, setItemExpandido] = useState(null);

    const toggleDescricao = (itemId) => {
        setItemExpandido(itemExpandido === itemId ? null : itemId);
    };

    // Combinar produtos e promoções em uma lista única
    const itens = [
        ...produtos.map(p => ({ ...p, _tipo: 'produto', _id: `prod-${p.id}` })),
        ...promocoes.map(p => ({ ...p, _tipo: 'promocao', _id: `promo-${p.id}` }))
    ];

    // Ordenar por data de criação
    itens.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const getTipoTexto = (tipo) => {
        return tipo === 'produto' ? ' Produto' : ' Promoção';
    };

    const getTipoCor = (tipo) => {
        return tipo === 'produto' ? '#bb25a6' : '#6f42c1';
    };

    const getNomeItem = (item) => {
        return item.nome;
    };

    const getDetalhesItem = (item) => {
        if (item._tipo === 'produto') {
            return item.categoria;
        } else {
            // Promoção
            const cfg = item.config;
            if (item.tipo_combo === 'produto_desconto') {
                return `${cfg.produto_principal_nome} + ${cfg.produto_desconto_nome} por R$ ${cfg.preco_combo?.toFixed(2)}`;
            } else if (item.tipo_combo === 'quantidade_preco') {
                return `${cfg.quantidade} ${cfg.produto_nome} por R$ ${cfg.preco_total?.toFixed(2)}`;
            } else if (item.tipo_combo === 'compre_leve') {
                return `Compre ${cfg.quantidade_compra} leve ${cfg.quantidade_leva}`;
            }
        }
        return '';
    };

    const getPrecoItem = (item) => {
        if (item._tipo === 'produto') {
            return `R$ ${Number(item.preco || 0).toFixed(2)}`;
        } else {
            const cfg = item.config;
            if (item.tipo_combo === 'produto_desconto') {
                return `R$ ${Number(cfg.preco_combo || 0).toFixed(2)}`;
            } else if (item.tipo_combo === 'quantidade_preco') {
                return `R$ ${Number(cfg.preco_total || 0).toFixed(2)}`;
            } else {
                return '-';
            }
        }
    };

    const getStatusItem = (item) => {
        if (item._tipo === 'produto') {
            const status = getStatusEstoque ? getStatusEstoque(item.estoque, 5) : { texto: "OK", cor: "#bb25a6" };
            return (
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
            );
        } else {
            return (
                <span
                    style={{
                        ...styles.status,
                        backgroundColor: item.ativo ? '#d4edda' : '#f8d7da',
                        color: item.ativo ? '#bb25a6' : '#dc3545',
                    }}
                >
                    {item.ativo ? ' Ativa' : '⏸️ Inativa'}
                </span>
            );
        }
    };

    return (
        <div style={styles.card} data-cy="tabela-unificada">
            <h3 style={styles.cardTitle}>
                Lista Completa ({itens.length})
                <span style={styles.badge}>
                    {produtos.length} produtos • {promocoes.length} promoções
                </span>
            </h3>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '120px'}}>Tipo</th>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>Detalhes</th>
                            <th style={styles.th}>Preço</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {itens.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
                                    Nenhum produto ou promoção cadastrado
                                </td>
                            </tr>
                        )}

                        {itens.map((item) => {
                            const isExpandido = itemExpandido === item._id;

                            return (
                                <React.Fragment key={item._id}>
                                    <tr>
                                        {/* TIPO */}
                                        <td style={styles.td}>
                                            <span style={{
                                                backgroundColor: getTipoCor(item._tipo),
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'inline-block',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {getTipoTexto(item._tipo)}
                                            </span>
                                        </td>

                                        {/* NOME */}
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                                                {/* Botão expandir se tiver descrição */}
                                                {item.descricao && (
                                                    <button
                                                        onClick={() => toggleDescricao(item._id)}
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
                                                    <strong style={{ fontSize: '15px' }}>{getNomeItem(item)}</strong>
                                                    
                                                    {/* Badge IA para produtos com descrição */}
                                                    {item._tipo === 'produto' && item.descricao && (
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

                                                    {/* Fotos para produtos */}
                                                    {item._tipo === 'produto' && item.fotos && item.fotos.length > 0 && (
                                                        <>
                                                            <br />
                                                            <small style={{ 
                                                                backgroundColor: '#bb25a6',
                                                                color: 'white',
                                                                padding: '2px 6px',
                                                                borderRadius: '10px',
                                                                fontSize: '10px',
                                                                fontWeight: '600',
                                                                display: 'inline-block',
                                                                marginTop: '4px'
                                                            }}>
                                                                📸 {item.fotos.length} foto{item.fotos.length > 1 ? 's' : ''}
                                                            </small>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* DETALHES */}
                                        <td style={styles.td}>
                                            <small style={{ color: '#666', fontSize: '13px' }}>
                                                {getDetalhesItem(item)}
                                            </small>
                                        </td>

                                        {/* PREÇO */}
                                        <td style={styles.td}>
                                            <strong>{getPrecoItem(item)}</strong>
                                        </td>

                                        {/* STATUS */}
                                        <td style={styles.td}>
                                            {getStatusItem(item)}
                                        </td>

                                        {/* AÇÕES */}
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => {
                                                    if (item._tipo === 'produto') {
                                                        onEditProduto(item);
                                                    } else {
                                                        onEditPromocao(item);
                                                    }
                                                }}
                                                style={styles.smallButton}
                                            >
                                                ✏️ Editar
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (item._tipo === 'produto') {
                                                        onDeleteProduto(item.id);
                                                    } else {
                                                        onDeletePromocao(item.id);
                                                    }
                                                }}
                                                style={styles.smallButtonDanger}
                                            >
                                                🗑️ Excluir
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Linha de descrição expandida */}
                                    {isExpandido && item.descricao && (
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
                                                            backgroundColor: item._tipo === 'produto' ? '#6f42c1' : '#bb25a6',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {item._tipo === 'produto' ? ' IA' : 'ℹ️'}
                                                        </span>
                                                        <strong style={{ color: '#333' }}>Descrição:</strong>
                                                    </div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#495057',
                                                        lineHeight: '1.6',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {item.descricao}
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

export default TabelaUnificada;
