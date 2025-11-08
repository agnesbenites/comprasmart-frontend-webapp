import React from "react";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🏠 Dashboard do Consultor</h1>
      <p>Bem-vindo ao sistema de consultoria de compras</p>
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>📊 Resumo</h3>
        <p>Esta é a área principal do consultor.</p>
      </div>
    </div>
  );
};

export default Dashboard;
