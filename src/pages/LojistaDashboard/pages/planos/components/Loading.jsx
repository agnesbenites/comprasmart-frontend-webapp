import React from "react";
import styles from "../planos.styles";

const Loading = ({ texto = "Carregando..." }) => {
  return (
    <div style={styles.loadingContainer} data-cy="loading-planos">
      <div style={styles.spinner} />
      <p style={styles.loadingText}>{texto}</p>
    </div>
  );
};

export default Loading;
