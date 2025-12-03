import React from 'react';
import { useLocation } from 'react-router-dom';

const ComponenteFallback = () => {
  const location = useLocation();
  const pagina = location.pathname.split('/').pop();
  
  const nomesPaginas = {
    'usuarios': '👥 Gestão de Usuários',
    'vendedores': '💼 Gestão de Vendedores', 
    'filiais': '🏪 Gestão de Filiais',
    'pagamentos': '💳 Pagamentos',
    'cadastro': '⚙️ Cadastro',
    'relatorios': '📊 Relatórios',
    'qrcode': '🔳 QR Codes'
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>{nomesPaginas[pagina] || `Página ${pagina}`}</h1>
      <p>Página em desenvolvimento - Funcionalidade chegando em breve!</p>
    </div>
  );
};

export default ComponenteFallback;