import { useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const styles = {
    success: {
      backgroundColor: 'rgba(0, 255, 159, 0.15)',
      borderColor: '#00FF9F',
      color: '#FFFFFF',
      boxShadow: '0 0 30px rgba(0, 255, 159, 0.6), 8px 8px 0px 0px rgba(0, 255, 159, 0.3)',
      textShadow: '0 0 10px rgba(0, 255, 159, 0.8)'
    },
    error: {
      backgroundColor: 'rgba(255, 0, 128, 0.15)',
      borderColor: '#FF0080',
      color: '#FFFFFF',
      boxShadow: '0 0 30px rgba(255, 0, 128, 0.6), 8px 8px 0px 0px rgba(255, 0, 128, 0.3)',
      textShadow: '0 0 10px rgba(255, 0, 128, 0.8)'
    },
    info: {
      backgroundColor: 'rgba(0, 217, 255, 0.15)',
      borderColor: '#00D9FF',
      color: '#FFFFFF',
      boxShadow: '0 0 30px rgba(0, 217, 255, 0.6), 8px 8px 0px 0px rgba(0, 217, 255, 0.3)',
      textShadow: '0 0 10px rgba(0, 217, 255, 0.8)'
    }
  };

  return (
    <div className="fixed top-8 right-8 px-6 py-4 font-bold text-lg z-50 animate-slide-in" style={{
      ...styles[type],
      border: `3px solid ${styles[type].borderColor}`,
      backdropFilter: 'blur(10px)'
    }}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="text-2xl leading-none transition-transform hover:scale-125"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#FFFFFF' }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
