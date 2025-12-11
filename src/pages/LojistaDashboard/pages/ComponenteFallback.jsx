import React from 'react';
import { useLocation } from 'react-router-dom';

const ComponenteFallback = () => {
  const location = useLocation();
  const pagina = location.pathname.split('/').pop();
  
  const nomesPaginas = {
    'usuarios': ' Gestao de Usuarios',
    'vendedores': ' Gestao de Vendedores', 
    'filiais': ' Gestao de Filiais',
    'pagamentos': ' Pagamentos',
    'cadastro': ' Cadastro',
    'relatorios': ' Relatorios',
    'qrcode': ' QR Codes'
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>{nomesPaginas[pagina] || `Pagina ${pagina}`}</h1>
      <p>Pagina em desenvolvimento - Funcionalidade chegando em breve!</p>
    </div>
  );
};

export default ComponenteFallback;
