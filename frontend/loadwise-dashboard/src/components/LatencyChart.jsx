/**
 * LatencyChart.jsx
 * Gráfico simples de latência ao longo do tempo
 */

import React from 'react';

export default function LatencyChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        Sem dados disponíveis
      </div>
    );
  }

  // Calcular valores para o gráfico
  const maxLatency = Math.max(...history.map(h => h.latency), 100);
  const chartHeight = 200;

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#22d3ee'
      }}>
        📊 Latência das Últimas Requisições
      </h3>

      {/* Gráfico de barras simples */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        height: `${chartHeight}px`,
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px'
      }}>
        {history.map((item, index) => {
          const heightPercent = (item.latency / maxLatency) * 100;
          const color = item.server === 'Service A' ? '#3b82f6' : '#10b981';
          
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${heightPercent}%`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                minWidth: '8px',
                position: 'relative',
                transition: 'height 0.3s ease',
                opacity: item.status === 'error' ? 0.3 : 1
              }}
              title={`${item.server}: ${item.latency}ms`}
            />
          );
        })}
      </div>

      {/* Legenda */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '15px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#3b82f6',
            borderRadius: '3px'
          }} />
          <span>Service A</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#10b981',
            borderRadius: '3px'
          }} />
          <span>Service B</span>
        </div>
      </div>

      {/* Info max latency */}
      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Máx: {maxLatency.toFixed(2)}ms
      </div>
    </div>
  );
}
