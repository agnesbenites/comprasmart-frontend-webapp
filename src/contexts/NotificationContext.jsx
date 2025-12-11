// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carregar notificacoes do localStorage ou API
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('app-notifications') || '[]');
    setNotifications(savedNotifications);
    updateUnreadCount(savedNotifications);
  }, []);

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter(n => !n.lida).length;
    setUnreadCount(unread);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      lida: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50); // Limitar a 50
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('app-notifications', JSON.stringify(updatedNotifications));
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, lida: true } : notif
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('app-notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, lida: true }));
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('app-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('app-notifications', '[]');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
