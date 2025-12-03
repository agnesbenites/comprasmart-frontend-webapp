import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

// Carregar variáveis de ambiente
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const frontendUrl = window.location.origin; // O domínio base para o redirect

// Debug
console.log('=== AUTH0 CONFIG ===');
console.log('Domain:', domain);
console.log('Client ID:', clientId?.substring(0, 8) + '...' || 'MISSING!');
console.log('Audience:', audience);
console.log('API URL:', apiUrl);
console.log('Frontend URL (redirect_uri):', frontendUrl);
console.log('====================');

// Componente wrapper para o Auth0Provider
const Auth0ProviderWithNavigate = ({ children }) => {
    const navigate = useNavigate();

    // Função que lida com o redirecionamento de volta do Auth0
    const onRedirectCallback = (appState, user) => {
        // Redireciona para onde o usuário estava tentando ir, ou para a rota padrão
        const targetPath = appState?.returnTo || '/';
        
        console.log('Auth0 redirect callback. Target:', targetPath, 'AppState:', appState);
        
        // Removemos a verificação manual de erro na URL para confiar no tratamento interno do Auth0Provider
        // e evitar conflito de roteamento.
        
        // Usamos replace: true para substituir a URL de callback no histórico
        navigate(targetPath, { replace: true });
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                // O redirect_uri DEVE ser a URL de onde o Auth0 enviará o usuário de volta
                redirect_uri: frontendUrl, 
                audience: audience, // Identificador da API
                scope: 'openid profile email'
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

// Renderização principal
const root = ReactDOM.createRoot(document.getElementById('root'));

if (!domain || !clientId || !audience || !apiUrl) {
    console.error('❌ Missing environment variables!');
    root.render(
        <div style={{ 
            padding: '40px', 
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center' 
        }}>
            <h1 style={{ color: '#dc2626' }}>Configuration Error</h1>
            <p>Please check your .env.local file in the root folder.</p>
            <p>Required variables:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>VITE_AUTH0_DOMAIN: {domain || '❌ MISSING'}</li>
                <li>VITE_AUTH0_CLIENT_ID: {clientId ? '✓ Set' : '❌ MISSING'}</li>
                <li>VITE_AUTH0_AUDIENCE: {audience || '❌ MISSING'}</li>
                <li>VITE_API_BASE_URL: {apiUrl || '❌ MISSING'}</li>
            </ul>
            <button 
                onClick={() => window.location.reload()}
                style={{ 
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Reload
            </button>
        </div>
    );
} else {
    // ⚠️ CORREÇÃO: Movendo o StrictMode para fora do Auth0ProviderWithNavigate/BrowserRouter
    // Isso evita o problema de renderização dupla que causa falhas no callback do Auth0.
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