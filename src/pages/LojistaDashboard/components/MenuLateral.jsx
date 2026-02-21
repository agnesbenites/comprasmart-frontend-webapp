// src/pages/LojistaDashboard/components/MenuLateral.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlano } from '../../../contexts/PlanoContext';
import {
  House,
  Package,
  ClipboardText,
  Users,
  UserCircle,
  Handshake,
  Building,
  QrCode,
  Bell,
  ChartBar,
  GraduationCap,
  CreditCard,
  Tag,
  VideoCamera,
  Gear,
  User,
  Diamond
} from '@phosphor-icons/react';

const MenuLateral = ({ onNavigate }) => {
  const location = useLocation();
  const { plano } = usePlano();

  const menuItems = [
    { path: '/lojista/dashboard', label: 'Início', icon: House, requiredPlan: null },
    { path: '/lojista/dashboard/produtos', label: 'Produtos', icon: Package, requiredPlan: null },
    { path: '/lojista/dashboard/pedidos', label: 'Pedidos', icon: ClipboardText, requiredPlan: null },
    { path: '/lojista/dashboard/usuarios', label: 'Equipe', icon: Users, requiredPlan: null },
    { path: '/lojista/dashboard/vendedores', label: 'Vendedores', icon: UserCircle, requiredPlan: null },
    { path: '/lojista/dashboard/consultores', label: 'Consultores', icon: Handshake, requiredPlan: null },
    { path: '/lojista/dashboard/filiais', label: 'Filiais', icon: Building, requiredPlan: null },
    { path: '/lojista/dashboard/qrcode', label: 'QR Codes', icon: QrCode, requiredPlan: null },
    { path: '/lojista/dashboard/notificacoes', label: 'Notificações', icon: Bell, requiredPlan: null },
    { path: '/lojista/dashboard/relatorios', label: 'Relatórios', icon: ChartBar, requiredPlan: null },
    { path: '/lojista/dashboard/treinamentos', label: 'Treinamentos', icon: GraduationCap, requiredPlan: null },
    { path: '/lojista/dashboard/pagamentos', label: 'Planos e Pagamentos', icon: CreditCard, requiredPlan: null },
    { path: '/lojista/dashboard/cupom', label: 'Cupom de Desconto', icon: Tag, requiredPlan: null, badge: 'EM BREVE', badgeColor: '#f59e0b' },
    { path: '/lojista/dashboard/live', label: 'Live', icon: VideoCamera, requiredPlan: null, badge: 'EM BREVE', badgeColor: '#f59e0b' },
    { path: '/lojista/dashboard/cadastro', label: 'Configurações', icon: Gear, requiredPlan: null },
    { path: '/lojista/dashboard/meu-perfil', label: 'Meu Perfil', icon: User, requiredPlan: null },
    { separator: true, requiredPlan: 'enterprise' },
    { path: '/lojista/dashboard/enterprise', label: 'Dashboard Enterprise', icon: Diamond, requiredPlan: 'enterprise', badge: 'ENTERPRISE', badgeColor: '#f59e0b' },
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

        if (item.separator) {
          return (
            <div key={`separator-${index}`} style={styles.separator}>
              <span style={styles.separatorText}>ENTERPRISE</span>
            </div>
          );
        }

        const isActive = location.pathname === item.path;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            style={{ ...styles.link, ...(isActive && styles.linkActive) }}
            onClick={onNavigate}
          >
            <IconComponent
              size={20}
              weight="duotone"
              color={isActive ? 'white' : '#2f0d51'}
            />
            <span style={styles.label}>{item.label}</span>
            {item.badge && (
              <span style={{ ...styles.badge, backgroundColor: item.badgeColor || '#bb25a6' }}>
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