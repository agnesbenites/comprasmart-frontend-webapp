// src/main.jsx - VERIFIQUE SE EST ASSIM:
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; //  CORRETO
import App from "./App.jsx";
import "./index.css";
import "./responsive.css";

// Importa o cliente Supabase
import { supabase } from "./supabaseClient.js";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const root = ReactDOM.createRoot(document.getElementById("root"));

if (!apiUrl || !supabase) {
  console.error(" Variaveis de ambiente ausentes!");
  root.render(
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ color: "#dc2626" }}>Erro de Configuracao</h1>
      <p>Verifique o .env.local</p>
    </div>
  );
} else {
  root.render(
    <BrowserRouter>
      <AuthProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AuthProvider>
    </BrowserRouter>
  );
}