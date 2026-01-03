// src/pages/LojistaDashboard/components/MenuLateral.jsx
// EXEMPLO DE MENU COM CONDIÇÃO ENTERPRISE

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlano } from '../../../contexts/PlanoContext'; // ← IMPORTAR

const MenuLateral = () => {
  const location = useLocation();
  const { plano } = usePlano(); // ← USAR O HOOK

  const menuItems = [
    {
      path: '/lojista/dashboard',
      label: '🏠 Início',
      icon: '🏠',
      requiredPlan: null, // null = todos os planos
    },
    {
      path: '/lojista/dashboard/vendedores',
      label: '👥 Vendedores',
      icon: '👥',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/produtos',
      label: '📦 Produtos',
      icon: '📦',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/relatorios',
      label: '📊 Relatórios',
      icon: '📊',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/enterprise',
      label: '💎 Dashboard Enterprise',
      icon: '💎',
      requiredPlan: 'enterprise', // ← SÓ APARECE PARA ENTERPRISE
      badge: 'ENTERPRISE',
    },
  ];

  const canAccessItem = (item) => {
    if (!item.requiredPlan) return true; // Todos podem acessar
    return plano.tipo === item.requiredPlan; // Só se for o plano certo
  };

  return (
    <nav style={styles.nav}>
      {menuItems.map((item) => {
        // Se não pode acessar, não mostra
        if (!canAccessItem(item)) return null;

        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              ...(isActive && styles.linkActive),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
            {item.badge && (
              <span style={styles.badge}>{item.badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '20px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#333',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  linkActive: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  icon: {
    fontSize: '1.2rem',
  },
  label: {
    flex: 1,
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#ffd700',
    color: '#333',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '700',
  },
};

export default MenuLateral;