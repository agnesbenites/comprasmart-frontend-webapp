// app-frontend/src/shared/components/Cart.jsx
// Usado por: CONSULTOR e VENDEDOR (com edição)

import React from 'react';

const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";

const Cart = ({ 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onFinalize,
  showFinalizeButton = true,
  readOnly = false  // Para cliente ver mas não editar
}) => {
  
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateCommission = () => {
    return calculateSubtotal() * 0.08; // 8% de comissão
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      border: '1px solid #dee2e6',
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: SECONDARY_COLOR,
      marginBottom: '15px',
      borderBottom: '2px solid #dee2e6',
      paddingBottom: '10px',
    },
    emptyCart: {
      textAlign: 'center',
      padding: '30px 20px',
      color: '#6c757d',
      fontSize: '0.95rem',
    },
    itemsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '15px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    item: {
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
    },
    itemInfo: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: SECONDARY_COLOR,
      marginBottom: '3px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    itemPrice: {
      fontSize: '0.85rem',
      color: '#6c757d',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    quantityButton: {
      width: '28px',
      height: '28px',
      borderRadius: '4px',
      border: '1px solid #dee2e6',
      backgroundColor: 'white',
      color: PRIMARY_COLOR,
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    quantity: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      minWidth: '30px',
      textAlign: 'center',
    },
    removeButton: {
      padding: '5px 10px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '600',
    },
    summary: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '6px',
      border: '1px solid #dee2e6',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '0.9rem',
    },
    summaryLabel: {
      color: '#6c757d',
    },
    summaryValue: {
      fontWeight: '600',
      color: SECONDARY_COLOR,
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '12px',
      borderTop: '2px solid #dee2e6',
      marginTop: '10px',
    },
    totalLabel: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: SECONDARY_COLOR,
    },
    totalValue: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#28a745',
    },
    finalizeButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: PRIMARY_COLOR,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'background-color 0.2s',
    },
    readOnlyBadge: {
      backgroundColor: '#ffc107',
      color: '#856404',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginBottom: '10px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        🛒 Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
      </h3>

      {readOnly && (
        <div style={styles.readOnlyBadge}>
          👁️ Modo Visualização (Apenas Leitura)
        </div>
      )}

      {items.length === 0 ? (
        <div style={styles.emptyCart}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>
            🛒
          </span>
          <p style={{ margin: 0 }}>Carrinho vazio</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>
            {readOnly 
              ? 'O consultor ainda não adicionou produtos'
              : 'Adicione produtos para começar'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Lista de Itens */}
          <div style={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemPrice}>
                    R$ {item.price.toFixed(2)} x {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {!readOnly && (
                  <div style={styles.controls}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                      disabled={readOnly}
                    >
                      -
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                      disabled={readOnly}
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={styles.removeButton}
                      disabled={readOnly}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div style={styles.summary}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal:</span>
              <span style={styles.summaryValue}>R$ {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Comissão (8%):</span>
              <span style={styles.summaryValue}>R$ {calculateCommission().toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total:</span>
              <span style={styles.totalValue}>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Botão Finalizar */}
          {showFinalizeButton && !readOnly && (
            <button
              onClick={onFinalize}
              style={styles.finalizeButton}
            >
              ✅ Finalizar Venda & Gerar QR Code
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;