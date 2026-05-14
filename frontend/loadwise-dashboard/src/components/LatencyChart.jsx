import React from 'react';
import PropTypes from 'prop-types';

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

  // Limita a janela visível a 60 entradas para manter o gráfico legível
  const visible = history.slice(-60);
  // Escala dinâmica: o valor máximo define a altura total das barras (mínimo 100ms)
  const maxLatency = Math.max(...visible.map(h => h.latency), 100);
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
        Latência das Últimas Requisições
        <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748b', marginLeft: '8px' }}>
          (últimas {visible.length})
        </span>
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px',
        height: `${chartHeight}px`,
        borderBottom: '2px solid #334155',
        paddingBottom: '2px',
        overflow: 'hidden'
      }}>
        {visible.map((item, index) => {
          const calculatedHeight = (item.latency / maxLatency) * 100;
          const heightPercent = Math.max(calculatedHeight, 3);
          const color = item.server === 'Service A' ? '#3b82f6' : '#10b981';

          return (
            <div
              key={index}
              style={{
                flex: '1 1 0',
                height: `${heightPercent}%`,
                backgroundColor: color,
                borderRadius: heightPercent > 5 ? '3px 3px 0 0' : '0',
                minWidth: 0,
                transition: 'height 0.3s ease',
                opacity: item.status === 'error' ? 0.3 : 1,
                boxShadow: `0 0 6px ${color}33`
              }}
              title={`${item.server}: ${item.latency.toFixed(2)}ms`}
            />
          );
        })}
      </div>

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

LatencyChart.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    server: PropTypes.string.isRequired,
    latency: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  })).isRequired,
};
