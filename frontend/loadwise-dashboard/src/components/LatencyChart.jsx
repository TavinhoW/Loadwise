/**
 * LatencyChart.jsx - Versão Corrigida (Pixel-Perfect)
 */

import React from 'react';

export default function LatencyChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        color: '#9ca3af',
        border: '1px solid #334155'
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
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      border: '1px solid #334155'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#22d3ee'
      }}>
        📊 Latência das Últimas Requisições
      </h3>

      {/* Gráfico de barras com correção de visibilidade */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        height: `${chartHeight}px`,
        borderBottom: '2px solid #334155', // Linha de base mais escura
        paddingBottom: '2px' // Ajuste para a barra tocar na linha
      }}>
        {history.map((item, index) => {
          // CORREÇÃO: Força um mínimo de 3% para a barra nunca desaparecer ou "bugar"
          const calculatedHeight = (item.latency / maxLatency) * 100;
          const heightPercent = Math.max(calculatedHeight, 3); 
          
          const color = item.server === 'Service A' ? '#3b82f6' : '#10b981';
          
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${heightPercent}%`,
                backgroundColor: color,
                // CORREÇÃO: Se a barra for muito pequena, remove o border-radius para não bugar os pixeis
                borderRadius: heightPercent > 5 ? '4px 4px 0 0' : '0',
                minWidth: '4px',
                position: 'relative',
                transition: 'height 0.3s ease',
                opacity: item.status === 'error' ? 0.3 : 1,
                boxShadow: `0 0 10px ${color}33` // Brilho subtil
              }}
              title={`${item.server}: ${item.latency.toFixed(2)}ms`}
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
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
          <span>Service A</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }} />
          <span>Service B</span>
        </div>
      </div>

      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: '#64748b',
        textAlign: 'center'
      }}>
        Escala: 0ms - {maxLatency.toFixed(0)}ms
      </div>
    </div>
  );
}