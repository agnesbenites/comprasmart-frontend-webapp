import React from "react";

const ModalBase = ({ 
  aberto, 
  onFechar, 
  titulo, 
  children, 
  acoes = [],
  tamanho = "medio" 
}) => {
  if (!aberto) return null;

  const tamanhos = {
    pequeno: "400px",
    medio: "600px", 
    grande: "800px",
    full: "95vw"
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal(tamanhos[tamanho])}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>{titulo}</h2>
          <button style={styles.fechar} onClick={onFechar}>—</button>
        </div>
        
        <div style={styles.conteudo}>
          {children}
        </div>

        {acoes.length > 0 && (
          <div style={styles.footer}>
            {acoes.map((acao, index) => (
              <button
                key={index}
                onClick={acao.onClick}
                style={{
                  ...styles.botao,
                  backgroundColor: acao.primaria ? "#007bff" : "#6c757d",
                }}
                disabled={acao.desabilitado}
              >
                {acao.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: (largura) => ({
    backgroundColor: "white",
    borderRadius: "12px",
    width: largura,
    maxWidth: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  }),
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 25px",
    borderBottom: "1px solid #e9ecef",
  },
  titulo: {
    margin: 0,
    fontSize: "1.3rem",
    color: "#333",
    fontWeight: "600",
  },
  fechar: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#666",
    padding: "0",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    padding: "20px 25px",
    borderTop: "1px solid #e9ecef",
    backgroundColor: "#f8f9fa",
  },
  botao: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "opacity 0.3s ease",
  },
};

export default ModalBase;
