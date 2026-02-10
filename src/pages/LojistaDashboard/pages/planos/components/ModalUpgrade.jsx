// src/pages/LojistaDashboard/pages/planos/components/ModalUpgrade.jsx
import React from "react";

const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  modalText: {
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: "1.6",
    margin: 0,
  },
  planoInfo: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "10px",
    padding: "16px",
  },
  planoNome: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0369a1",
    marginBottom: "4px",
  },
  planoValor: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  cancelButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
  },
  confirmButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#bb25a6",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
};

const ModalUpgrade = ({
  aberto,
  planoSelecionado,
  onConfirmar,
  onCancelar,
}) => {
  if (!aberto || !planoSelecionado) return null;

  return (
    <div style={styles.modalOverlay} data-cy="modal-upgrade">
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>🚀 Confirmar Upgrade</h2>

        <p style={styles.modalText}>
          Você está prestes a fazer upgrade para um novo plano. 
          Você será redirecionado para a página de pagamento seguro.
        </p>

        <div style={styles.planoInfo}>
          <div style={styles.planoNome}>{planoSelecionado.nome}</div>
          <div style={styles.planoValor}>
            R$ {planoSelecionado.valor?.toFixed(2)}/mês
          </div>
        </div>

        <div style={styles.modalActions}>
          <button
            style={styles.cancelButton}
            onClick={onCancelar}
            data-cy="cancelar-upgrade"
          >
            Cancelar
          </button>

          <button
            style={styles.confirmButton}
            onClick={() => onConfirmar(planoSelecionado)}
            data-cy="confirmar-upgrade"
          >
            💳 Ir para Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpgrade;