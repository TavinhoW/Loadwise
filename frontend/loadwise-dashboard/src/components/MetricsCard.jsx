/**
 * MetricsCard.jsx
 * Componente para exibir métricas individuais
 */

import React from 'react';

export default function MetricsCard({ title, value, unit, color = '#3b82f6', icon }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `2px solid ${color}`,
      minWidth: '180px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {title}
        </span>
        {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
      </div>
      
      <div style={{ 
        fontSize: '32px', 
        fontWeight: 'bold',
        color: color,
        marginBottom: '5px'
      }}>
        {value}
      </div>
      
      {unit && (
        <div style={{ 
          fontSize: '12px', 
          color: '#9ca3af'
        }}>
          {unit}
        </div>
      )}
    </div>
  );
}
