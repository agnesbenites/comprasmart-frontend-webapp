// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";
import "./index.css";

// Carregar variáveis de ambiente
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const frontendUrl = window.location.origin;

// Wrapper que usa useNavigate — deve ser renderizado dentro do BrowserRouter
const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    const targetPath = appState?.returnTo || "/";
    navigate(targetPath, { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: frontendUrl,
        audience: audience,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

// Renderização principal
const root = ReactDOM.createRoot(document.getElementById("root"));

// Se faltar alguma variável crítica, mostra mensagem de configuração
if (!domain || !clientId || !audience || !apiUrl) {
  console.error("❌ Missing environment variables!");
  root.render(
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#dc2626" }}>Configuration Error</h1>
      <p>Please check your .env.local (or .env) file in the project root.</p>
      <p>Required variables:</p>
      <ul style={{ textAlign: "left", display: "inline-block" }}>
        <li>VITE_AUTH0_DOMAIN: {domain || "❌ MISSING"}</li>
        <li>VITE_AUTH0_CLIENT_ID: {clientId ? "✓ Set" : "❌ MISSING"}</li>
        <li>VITE_AUTH0_AUDIENCE: {audience || "❌ MISSING"}</li>
        <li>VITE_API_BASE_URL: {apiUrl || "❌ MISSING"}</li>
      </ul>
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
} else {
  // BrowserRouter envolve tudo; Auth0ProviderWithNavigate usa useNavigate internamente
  root.render(
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
}
