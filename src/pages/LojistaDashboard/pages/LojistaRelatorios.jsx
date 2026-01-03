// LojistaRelatorios.jsx
// ROTEADOR - Seleciona componente baseado no plano

import React, { useContext } from 'react';
import { PlanoContext } from '../../../contexts/PlanoContext';
import LojistaRelatoriosBasic from './LojistaRelatoriosBasic';
import LojistaRelatoriosPro from './LojistaRelatoriosPro';
import LojistaRelatoriosEnterprise from './LojistaRelatoriosEnterprise';

const LojistaRelatorios = () => {
  const { plano } = useContext(PlanoContext);

  console.log('[LojistaRelatorios] Plano detectado:', plano);

  // Selecionar componente baseado no plano
  switch (plano) {
    case 'enterprise':
      return <LojistaRelatoriosEnterprise />;
    
    case 'pro':
      return <LojistaRelatoriosPro />;
    
    case 'basic':
    default:
      return <LojistaRelatoriosBasic />;
  }
};

export default LojistaRelatorios;