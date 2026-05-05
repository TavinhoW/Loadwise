/**
 * ServerStatus.jsx
 * Componente para exibir estado individual de cada servidor
 */

import React from 'react';

export default function ServerStatus({ 
  serverName, 
  requestCount, 
  averageLatency, 
  isActive,
  color 
}) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `2px solid ${isActive ? color : '#d1d5db'}`,
      opacity: isActive ? 1 : 0.6,
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          {serverName}
        </h3>
        
        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isActive ? '#10b981' : '#ef4444',
            animation: isActive ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ 
            fontSize: '12px',
            fontWeight: '600',
            color: isActive ? '#10b981' : '#ef4444'
          }}>
            {isActive ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      }}>
        <div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            marginBottom: '5px'
          }}>
            Requisições
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: color
          }}>
            {requestCount}
          </div>
        </div>

        <div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            marginBottom: '5px'
          }}>
            Latência Média
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: color
          }}>
            {averageLatency || '0'} <span style={{ fontSize: '14px' }}>ms</span>
          </div>
        </div>
      </div>

      {/* Barra de progresso (distribuição de carga) */}
      <div style={{ marginTop: '15px' }}>
        <div style={{
          height: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: isActive ? '100%' : '0%',
            backgroundColor: color,
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
