// src/routes/LojistaRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LojistaDashboardLayout from '../pages/LojistaDashboardLayout';
import LojistaProfile from '../pages/LojistaProfile';

// Importe todos os componentes que estao no mesmo arquivo
import { 
  LojistaFiliais, 
  LojistaVendedores, 
  LojistaCadastro, 
  LojistaPagamentos, 
  LojistaRelatorios, 
  LojistaQRCode, 
  LojistaUsuarios 
} from '../pages/LojistaDashboardLayout';

// Se voca tiver componentes em arquivos separados, importe assim:
// import LojistaProdutos from '../pages/LojistaProdutos';
// import LojistaConsultorConfig from '../pages/LojistaConsultorConfig';

const LojistaRoutes = () => {
  return (
    <Routes>
      <Route path="/lojista/dashboard" element={<LojistaDashboardLayout />}>
        <Route index element={<div style={{padding: "30px"}}>  Dashboard Principal - Conteudo aqui</div>} />
        <Route path="filiais" element={<LojistaFiliais />} />
        <Route path="vendedores" element={<LojistaVendedores />} />
        <Route path="cadastro" element={<LojistaCadastro />} />
        <Route path="pagamentos" element={<LojistaPagamentos />} />
        <Route path="relatorios" element={<LojistaRelatorios />} />
        <Route path="qrcode" element={<LojistaQRCode />} />
        <Route path="usuarios" element={<LojistaUsuarios />} />
        <Route path="profile" element={<LojistaProfile />} />
        {/* Adicione outras rotas conforme necessario */}
      </Route>
    </Routes>
  );
};

export default LojistaRoutes;
