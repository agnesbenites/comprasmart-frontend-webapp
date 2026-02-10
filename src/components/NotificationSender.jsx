// src/components/NotificationSender.jsx
import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationSender = ({ show, onClose }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    destinatarios: ['lojistas'],
    tipo: 'info'
  });

  const handleSend = () => {
    if (!formData.titulo || !formData.mensagem) {
      alert('Preencha titulo e mensagem');
      return;
    }

    // Enviar notificacao para cada grupo selecionado
    formData.destinatarios.forEach(grupo => {
      addNotification({
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        tipo: formData.tipo,
        destinatario: grupo,
        categoria: 'comunicado_admin'
      });
    });

    // Feedback para o admin
    addNotification({
      titulo: ' Mensagem Enviada',
      mensagem: `Comunicado enviado para ${formData.destinatarios.join(', ')}`,
      tipo: 'success'
    });

    onClose();
    setFormData({
      titulo: '',
      mensagem: '',
      destinatarios: ['lojistas'],
      tipo: 'info'
    });
  };

  if (!show) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={modalStyles.title}> Enviar Comunicado Interno</h3>
        
        <div style={modalStyles.form}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Titulo</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              placeholder="Titulo da notificacao..."
              style={modalStyles.input}
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Mensagem</label>
            <textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
              placeholder="Digite sua mensagem..."
              rows="4"
              style={modalStyles.textarea}
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Enviar para:</label>
            <div style={modalStyles.checkboxGroup}>
              {['lojistas', 'consultores', 'clientes'].map(grupo => (
                <label key={grupo} style={modalStyles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.destinatarios.includes(grupo)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.destinatarios, grupo]
                        : formData.destinatarios.filter(g => g !== grupo);
                      setFormData({...formData, destinatarios: updated});
                    }}
                    style={modalStyles.checkbox}
                  />
                  <span>
                    {grupo === 'lojistas' && ' Lojistas'}
                    {grupo === 'consultores' && ' Consultores'}
                    {grupo === 'clientes' && ' Clientes'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Tipo:</label>
            <select 
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              style={modalStyles.select}
            >
              <option value="info"> Informativo</option>
              <option value="success"> Sucesso</option>
              <option value="warning"> Alerta</option>
              <option value="error"> Urgente</option>
            </select>
          </div>

          <div style={modalStyles.buttons}>
            <button onClick={onClose} style={modalStyles.cancelButton}>
              Cancelar
            </button>
            <button onClick={handleSend} style={modalStyles.sendButton}>
               Enviar Notificacao
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    margin: 0,
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default NotificationSender;
