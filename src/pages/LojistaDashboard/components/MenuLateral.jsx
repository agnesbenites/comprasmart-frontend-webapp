// src/pages/LojistaDashboard/components/MenuLateral.jsx - VERSÃO FINAL
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlano } from '../../../contexts/PlanoContext';

const MenuLateral = () => {
  const location = useLocation();
  const { plano } = usePlano();

  const menuItems = [
    {
      path: '/lojista/dashboard',
      label: 'Início',
      icon: '🏠',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/produtos',
      label: 'Produtos',
      icon: '📦',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/pedidos',
      label: 'Pedidos',
      icon: '🛒',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/usuarios',
      label: 'Equipe',
      icon: '👥',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/vendedores',
      label: 'Vendedores',
      icon: '🛍️',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/consultores',
      label: 'Consultores',
      icon: '🤝',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/filiais',
      label: 'Filiais',
      icon: '🏢',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/qrcode',
      label: 'QR Codes',
      icon: '📱',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/notificacoes',
      label: 'Notificações',
      icon: '🔔',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/relatorios',
      label: 'Relatórios',
      icon: '📊',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/treinamentos',
      label: 'Treinamentos',
      icon: '🎓',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/pagamentos',
      label: 'Planos e Pagamentos',
      icon: '💳',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/cupom',
      label: 'Cupom de Desconto',
      icon: '🎫',
      requiredPlan: null,
      badge: 'EM BREVE',
      badgeColor: '#f59e0b',
    },
    {
      path: '/lojista/dashboard/live',
      label: 'Live',
      icon: '📹',
      requiredPlan: null,
      badge: 'EM BREVE',
      badgeColor: '#f59e0b',
    },
    {
      path: '/lojista/dashboard/cadastro',
      label: 'Configurações',
      icon: '⚙️',
      requiredPlan: null,
    },
    {
      path: '/lojista/dashboard/meu-perfil',
      label: 'Meu Perfil',
      icon: '👤',
      requiredPlan: null,
    },
    // ENTERPRISE - Separador visual
    {
      separator: true,
      requiredPlan: 'enterprise',
    },
    {
      path: '/lojista/dashboard/enterprise',
      label: 'Dashboard Enterprise',
      icon: '💎',
      requiredPlan: 'enterprise',
      badge: 'ENTERPRISE',
      badgeColor: '#f59e0b',
    },
  ];

  const canAccessItem = (item) => {
    if (!item.requiredPlan) return true;
    const planoNormalizado = plano?.toLowerCase().replace('plano ', '');
    return planoNormalizado === item.requiredPlan?.toLowerCase();
  };

  return (
    <nav style={styles.nav}>
      {menuItems.map((item, index) => {
        if (!canAccessItem(item)) return null;

        // Separador
        if (item.separator) {
          return (
            <div key={`separator-${index}`} style={styles.separator}>
              <span style={styles.separatorText}>ENTERPRISE</span>
            </div>
          );
        }

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
              <span style={{
                ...styles.badge,
                backgroundColor: item.badgeColor || '#bb25a6'
              }}>
                {item.badge}
              </span>
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
    gap: '4px',
    padding: '20px 10px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 100px)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '8px',
    color: '#475569',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    fontSize: '0.9rem',
  },
  linkActive: {
    backgroundColor: '#bb25a6',
    color: 'white',
    fontWeight: '600',
  },
  icon: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontSize: '0.9rem',
  },
  badge: {
    color: 'white',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  separator: {
    margin: '15px 0 10px 0',
    paddingTop: '15px',
    borderTop: '2px solid #e2e8f0',
  },
  separatorText: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    paddingLeft: '16px',
  },
};

export default MenuLateral;