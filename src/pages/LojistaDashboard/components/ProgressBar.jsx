import React from "react";

const ProgressBar = ({ percentual, cor = "#bb25a6", altura = 10, label }) => {
  const getCor = (percent) => {
    if (percent >= 100) return "#bb25a6";
    if (percent >= 70) return "#ffc107";
    if (percent >= 50) return "#fd7e14";
    return "#dc3545";
  };

  return (
    <div style={styles.container}>
      {label && (
        <div style={styles.labelContainer}>
          <span style={styles.label}>{label}</span>
          <span style={styles.percent}>{percentual}%</span>
        </div>
      )}
      <div style={styles.barContainer(altura)}>
        <div
          style={styles.barFill(percentual, getCor(percentual))}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    fontWeight: "600",
  },
  label: {
    color: "#333",
  },
  percent: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
  },
  barContainer: (altura) => ({
    width: "100%",
    height: `${altura}px`,
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
    overflow: "hidden",
  }),
  barFill: (percentual, cor) => ({
    height: "100%",
    width: `${percentual}%`,
    backgroundColor: cor,
    borderRadius: "5px",
    transition: "width 0.5s ease, background-color 0.3s ease",
  }),
};

export default ProgressBar;