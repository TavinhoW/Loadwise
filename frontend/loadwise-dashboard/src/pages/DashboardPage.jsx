/**
 * DashboardPage.jsx
 * Página principal - Visão geral do sistema
 */

import React from 'react';
import PropTypes from 'prop-types';
import MetricsCard from '../components/MetricsCard';
import LatencyChart from '../components/LatencyChart';

export default function DashboardPage({ stats, history, currentResponse }) {
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
        Visão Geral do Sistema
      </h2>

      {/* Métricas principais em cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <MetricsCard
          title="Total Requisições"
          value={stats.totalRequests}
          unit="requisições processadas"
          color="#8b5cf6"
        />
        <MetricsCard
          title="Latência Média"
          value={stats.averageLatency}
          unit="milissegundos"
          color="#3b82f6"
        />
        <MetricsCard
          title="Taxa de Sucesso"
          value={stats.successRate}
          unit="percentagem"
          color="#10b981"
        />
        <MetricsCard
          title="Balanceamento"
          value={stats.serviceACount + stats.serviceBCount > 0
            ? `${((stats.serviceACount / (stats.serviceACount + stats.serviceBCount)) * 100).toFixed(0)}% / ${((stats.serviceBCount / (stats.serviceACount + stats.serviceBCount)) * 100).toFixed(0)}%`
            : '0% / 0%'
          }
          unit="Service A / Service B"
          color="#f59e0b"
        />
        <MetricsCard
          title="Débito"
          value={stats.throughput}
          unit="requisições / segundo"
          color="#22d3ee"
        />
      </div>

      {/* Última resposta recebida */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#22d3ee'
        }}>
          Última Resposta do Sistema
        </h3>
        
        {currentResponse ? (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                Servidor que Respondeu
              </div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: currentResponse.serverName === 'Service A' ? '#3b82f6' : '#10b981'
              }}>
                {currentResponse.serverName}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                Mensagem
              </div>
              <div style={{ fontSize: '14px', color: '#f8fafc' }}>
                {currentResponse.message}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                Latência
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
                {currentResponse.latency} ms
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                Timestamp
              </div>
              <div style={{ fontSize: '14px', color: '#f8fafc' }}>
                {currentResponse.timestamp}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af',
            padding: '20px'
          }}>
            A aguardar a primeira resposta do sistema...
          </div>
        )}
      </div>

      {/* Gráfico de latência */}
      <LatencyChart history={history} />
    </div>
  );
}

const statsShape = PropTypes.shape({
  totalRequests: PropTypes.number.isRequired,
  averageLatency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  serviceACount: PropTypes.number.isRequired,
  serviceBCount: PropTypes.number.isRequired,
  successRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  throughput: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  p95Latency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
});

DashboardPage.propTypes = {
  stats: statsShape.isRequired,
  history: PropTypes.array.isRequired,
  currentResponse: PropTypes.shape({
    serverName: PropTypes.string,
    message: PropTypes.string,
    latency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    timestamp: PropTypes.string,
    status: PropTypes.string,
  }),
};
