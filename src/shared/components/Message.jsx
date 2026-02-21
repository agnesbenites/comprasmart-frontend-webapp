// shared/components/Message.jsx

import React from 'react';

const Message = ({ sender, text, timestamp, isConsultor = false }) => {
  const styles = {
    messageContainer: {
      display: 'flex',
      justifyContent: isConsultor ? 'flex-end' : 'flex-start',
      marginBottom: '15px',
      padding: '0 10px',
    },
    messageBubble: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '12px',
      backgroundColor: isConsultor ? '#2f0d51' : '#f1f3f5',
      color: isConsultor ? '#ffffff' : '#333',
      wordWrap: 'break-word',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    messageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
      fontSize: '0.75rem',
      opacity: 0.8,
    },
    sender: {
      fontWeight: '600',
      color: isConsultor ? '#ffffff' : '#2f0d51',
    },
    timestamp: {
      fontSize: '0.7rem',
      marginLeft: '8px',
      color: isConsultor ? 'rgba(255,255,255,0.8)' : '#999',
    },
    messageText: {
      fontSize: '0.95rem',
      lineHeight: '1.4',
      margin: 0,
    },
  };

  return (
    <div style={styles.messageContainer}>
      <div style={styles.messageBubble}>
        <div style={styles.messageHeader}>
          <span style={styles.sender}>{sender}</span>
          {timestamp && (
            <span style={styles.timestamp}>
              {new Date(timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
        <p style={styles.messageText}>{text}</p>
      </div>
    </div>
  );
};

export default Message;