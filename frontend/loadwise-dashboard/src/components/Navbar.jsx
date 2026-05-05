/**
 * Navbar.jsx
 * Componente de navegação adaptável para layout vertical/sidebar
 */

import React from 'react';

const Navbar = ({ currentPage, onNavigate, layout = 'vertical' }) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'servers', label: 'Servers', icon: '🖥️' },
    { id: 'metrics', label: 'Metrics', icon: '📈' },
    { id: 'logs', label: 'Logs', icon: '📜' },
  ];

  // Estilos base para os botões
  const getBtnStyle = (isActive) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400',
    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
    color: isActive ? '#22d3ee' : '#94a3b8',
    borderLeft: isActive ? '3px solid #22d3ee' : '3px solid transparent',
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      marginTop: '20px' 
    }}>
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={getBtnStyle(isActive)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#f8fafc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <span style={{ 
              marginRight: '12px', 
              fontSize: '18px',
              filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' 
            }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;