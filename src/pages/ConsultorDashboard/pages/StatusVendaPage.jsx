// src/pages/ConsultorDashboard/pages/StatusVendaPage.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import StatusVendaConsultor from '../components/StatusVendaConsultor';

const StatusVendaPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
         Status da Venda
      </h2>
      <StatusVendaConsultor consultorId={user?.id} />
    </div>
  );
};

export default StatusVendaPage;