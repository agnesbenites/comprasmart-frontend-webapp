// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // Aqui voca pode adicionar navegacao para a pagina especifica
    setIsOpen(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now - time) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h atras`;
    return `${Math.floor(diffInHours / 24)}d atras`;
  };

  const getIconByType = (tipo) => {
    const icons = {
      info: '',
      success: '',
      warning: '',
      error: '',
      payment: '',
      user: '',
      system: ''
    };
    return icons[tipo] || '';
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Bell Icon com Badge */}
      <div 
        style={styles.bellContainer}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.bellIcon}></span>
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown de Notificacoes */}
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <h3 style={styles.dropdownTitle}>Notificacoes</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={styles.markAllButton}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}></span>
                <p>Nenhuma notificacao</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(notification => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    ...(notification.lida ? styles.read : styles.unread)
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div style={styles.notificationIcon}>
                    {getIconByType(notification.tipo)}
                  </div>
                  <div style={styles.notificationContent}>
                    <p style={styles.notificationTitle}>{notification.titulo}</p>
                    <p style={styles.notificationMessage}>{notification.mensagem}</p>
                    <span style={styles.notificationTime}>
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.lida && <div style={styles.unreadDot}></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div style={styles.dropdownFooter}>
              <button style={styles.viewAllButton}>
                Ver todas as notificacoes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  bellContainer: {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  bellIcon: {
    fontSize: '20px',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 'bold',
    minWidth: '16px',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    width: '380px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '500px',
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #eee',
  },
  dropdownTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  notificationsList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notificationItem: {
    display: 'flex',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
  },
  unread: {
    backgroundColor: '#f8f9fa',
  },
  read: {
    backgroundColor: 'white',
    opacity: 0.7,
  },
  notificationIcon: {
    fontSize: '18px',
    marginRight: '12px',
    marginTop: '2px',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    margin: '0 0 4px 0',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  notificationMessage: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.4',
  },
  notificationTime: {
    fontSize: '11px',
    color: '#999',
  },
  unreadDot: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  },
  dropdownFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  viewAllButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default NotificationBell;
