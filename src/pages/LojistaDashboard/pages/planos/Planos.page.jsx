// src/pages/LojistaDashboard/pages/planos/Planos.page.jsx
import React from "react";

import { usePlanos } from "./hooks/usePlanos";

import PlanoAtual from "./components/PlanoAtual";
import UpgradePlans from "./components/UpgradePlans";
import Addons from "./components/Addons";
import FaturasTable from "./components/FaturasTable";
import ModalUpgrade from "./components/ModalUpgrade";

const styles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "1200px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  errorMessage: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  successMessage: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #bb25a6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
  },
};

// CSS para animação do spinner
const spinnerStyle = document.createElement("style");
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector("[data-planos-spinner]")) {
  spinnerStyle.setAttribute("data-planos-spinner", "true");
  document.head.appendChild(spinnerStyle);
}

const PlanosPage = () => {
  const {
    loading,
    error,
    success,

    planoAtual,
    faturas,
    addons,
    availableUpgrades,

    modal,
    fecharModal,

    abrirPortalStripe,
    criarContaStripe,

    abrirModalUpgrade,
    redirecionarParaLinkDeVenda,

    baixarFatura,
    visualizarFatura,
    enviarFaturaPorEmail,
  } = usePlanos();

  /* =========================
     LOADING
  ========================== */
  if (loading) {
    return (
      <div style={styles.container} data-cy="planos-loading">
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Carregando informações do plano...</p>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div style={styles.container} data-cy="planos-page">
      {/* MODAL DE UPGRADE */}
      <ModalUpgrade
        aberto={modal.open}
        planoSelecionado={modal.content}
        onConfirmar={redirecionarParaLinkDeVenda}
        onCancelar={fecharModal}
      />

      <h1 style={styles.title}>Planos e Assinaturas</h1>

      {error && (
        <div style={styles.errorMessage} data-cy="planos-error">
          {error}
        </div>
      )}

      {success && (
        <div style={styles.successMessage} data-cy="planos-success">
          {success}
        </div>
      )}

      {/* PLANO ATUAL */}
      <PlanoAtual
        plano={planoAtual}
        onUpgradeClick={() => abrirModalUpgrade(availableUpgrades[0])}
        onAbrirPortalStripe={abrirPortalStripe}
        onCriarContaStripe={criarContaStripe}
      />

      {/* UPGRADES DISPONÍVEIS */}
      {availableUpgrades.length > 0 && (
        <UpgradePlans
          planos={availableUpgrades}
          onSelectPlan={abrirModalUpgrade}
        />
      )}

      {/* ADD-ONS */}
      <Addons
        addons={addons}
        onComprarAddon={redirecionarParaLinkDeVenda}
      />

      {/* FATURAS */}
      <FaturasTable
        faturas={faturas}
        onDownload={baixarFatura}
        onVisualizar={visualizarFatura}
        onEnviarEmail={enviarFaturaPorEmail}
      />
    </div>
  );
};

export default PlanosPage;