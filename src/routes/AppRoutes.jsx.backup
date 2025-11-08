// web-consultor/src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// 🚨 CORREÇÃO AQUI: Importamos HomePanel e o renomeamos como Dashboard
import HomePanel from "../components/HomePanel"; // Importa HomePanel.jsx
import ChatPanel from "../components/ChatPanel";
import TermsPage from "../pages/TermsPage";
import ConsultantRegisterPage from "../pages/ConsultantRegisterPage";
import ProfilePanel from "../components/ProfilePanel";

// Componentes temporários para as páginas que vamos criar

const AlertsPage = () => (
  <div style={{ padding: "50px", textAlign: "center" }}>
    <h1>🔔 Alertas</h1>
    <p>Página de alertas em desenvolvimento</p>
  </div>
);

const AnalyticsPage = () => (
  <div style={{ padding: "50px", textAlign: "center" }}>
    <h1>📊 Análise Geral</h1>
    <p>Página de métricas em desenvolvimento</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🚨 CORREÇÃO: Removida a rota /dashboard duplicada */}
      <Route path="/" element={<HomePanel />} />
      <Route path="/chat" element={<ChatPanel />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/register" element={<ConsultantRegisterPage />} />
      <Route path="/profile" element={<ProfilePanel />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route
        path="/referral"
        element={
          <div style={{ padding: "50px", textAlign: "center" }}>
            Página de Indicação - Em desenvolvimento
          </div>
        }
      />

      {/* Rota 404 - Página não encontrada */}
      <Route
        path="*"
        element={
          <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>404 - Página Não Encontrada</h1>
            <p>A página que você está procurando não existe.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
