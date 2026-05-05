/**
 * MetricsPage.jsx
 * Página de métricas e análises detalhadas
 */

import React from 'react';
import LatencyChart from '../components/LatencyChart';

export default function MetricsPage({ stats, history }) {
  // Calcular métricas adicionais
  const avgLatencyA = history
    .filter(h => h.server === 'Service A' && h.status === 'success')
    .reduce((sum, h, _, arr) => arr.length > 0 ? sum + h.latency / arr.length : 0, 0);

  const avgLatencyB = history
    .filter(h => h.server === 'Service B' && h.status === 'success')
    .reduce((sum, h, _, arr) => arr.length > 0 ? sum + h.latency / arr.length : 0, 0);

  const minLatency = history.length > 0 
    ? Math.min(...history.map(h => h.latency)) 
    : 0;

  const maxLatency = history.length > 0 
    ? Math.max(...history.map(h => h.latency)) 
    : 0;

  return (
    <div>
      {/* Título da página */}
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        Métricas e Análises
      </h2>

      {/* Gráfico de latência */}
      <div style={{ marginBottom: '30px' }}>
        <LatencyChart history={history} />
      </div>

      {/* Estatísticas comparativas */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#22d3ee'
        }}>
          📊 Comparação entre Servidores
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Service A */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
              Service A
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {stats.serviceACount}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              requisições processadas
            </div>
            <div style={{ 
              marginTop: '15px', 
              paddingTop: '15px', 
              borderTop: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>
                Latência Média
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {avgLatencyA.toFixed(2)} ms
              </div>
            </div>
          </div>

          {/* Service B */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
              Service B
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {stats.serviceBCount}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              requisições processadas
            </div>
            <div style={{ 
              marginTop: '15px', 
              paddingTop: '15px', 
              borderTop: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>
                Latência Média
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {avgLatencyB.toFixed(2)} ms
              </div>
            </div>
          </div>

          {/* Global */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
              Sistema Global
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {stats.totalRequests}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              requisições totais
            </div>
            <div style={{ 
              marginTop: '15px', 
              paddingTop: '15px', 
              borderTop: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>
                Taxa de Sucesso
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats.successRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de latência */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#22d3ee'
        }}>
          ⚡ Análise de Latência
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '15px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Latência Mínima
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              {minLatency.toFixed(2)} ms
            </div>
          </div>

          <div style={{
            padding: '15px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Latência Média
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.averageLatency} ms
            </div>
          </div>

          <div style={{
            padding: '15px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Latência Máxima
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
              {maxLatency.toFixed(2)} ms
            </div>
          </div>

          <div style={{
            padding: '15px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Variação (Max - Min)
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              {(maxLatency - minLatency).toFixed(2)} ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
