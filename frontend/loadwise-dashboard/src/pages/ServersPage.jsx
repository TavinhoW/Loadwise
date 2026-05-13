/**
 * ServersPage.jsx
 * Página de detalhes individuais dos servidores
 */

import React from 'react';
import PropTypes from 'prop-types';
import ServerStatus from '../components/ServerStatus';

export default function ServersPage({ stats, history }) {
  const now = Date.now();
  const OFFLINE_AFTER_MS = 10000; // 10s sem resposta bem-sucedida → OFFLINE
  const lastServiceASuccess = [...history].reverse().find(h => h.server === 'Service A');
  const lastServiceBSuccess = [...history].reverse().find(h => h.server === 'Service B');
  const hasEnoughHistory = history.length >= 5;
  const isServiceAActive = !hasEnoughHistory || (!!lastServiceASuccess && (now - lastServiceASuccess.timestamp) < OFFLINE_AFTER_MS);
  const isServiceBActive = !hasEnoughHistory || (!!lastServiceBSuccess && (now - lastServiceBSuccess.timestamp) < OFFLINE_AFTER_MS);

  // Calcular latência média por servidor
  const serviceALatency = history
    .filter(h => h.server === 'Service A' && h.status === 'success')
    .reduce((sum, h, _, arr) => sum + h.latency / arr.length, 0)
    .toFixed(2);

  const serviceBLatency = history
    .filter(h => h.server === 'Service B' && h.status === 'success')
    .reduce((sum, h, _, arr) => sum + h.latency / arr.length, 0)
    .toFixed(2);

  // Calcular última resposta de cada servidor
  const lastServiceA = history.filter(h => h.server === 'Service A').slice(-1)[0];
  const lastServiceB = history.filter(h => h.server === 'Service B').slice(-1)[0];

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
        Estado dos Servidores
      </h2>

      {/* Cards dos servidores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <ServerStatus
          serverName="Service A"
          requestCount={stats.serviceACount}
          averageLatency={serviceALatency}
          isActive={isServiceAActive}
          color="#3b82f6"
        />
        <ServerStatus
          serverName="Service B"
          requestCount={stats.serviceBCount}
          averageLatency={serviceBLatency}
          isActive={isServiceBActive}
          color="#10b981"
        />
      </div>

      {/* Detalhes adicionais dos servidores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {/* Service A - Detalhes */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#3b82f6'
          }}>
            Detalhes - Service A
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#3b82f6',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Total de Requisições:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{stats.serviceACount}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#3b82f6',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Latência Média:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{serviceALatency} ms</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#3b82f6',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Percentagem de Carga:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>
                {stats.totalRequests > 0 
                  ? `${((stats.serviceACount / stats.totalRequests) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#3b82f6',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Última Resposta:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>
                {lastServiceA ? new Date(lastServiceA.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#3b82f6',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Estado:</span>
              <span style={{
                fontWeight: 'bold',
                color: isServiceAActive ? '#10b981' : '#ef4444'
              }}>
                {isServiceAActive ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Service B - Detalhes */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #10b981'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#10b981'
          }}>
            Detalhes - Service B
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#10b981',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Total de Requisições:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{stats.serviceBCount}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#10b981',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Latência Média:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{serviceBLatency} ms</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#10b981',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Percentagem de Carga:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>
                {stats.totalRequests > 0 
                  ? `${((stats.serviceBCount / stats.totalRequests) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#10b981',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Última Resposta:</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>
                {lastServiceB ? new Date(lastServiceB.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: '#1e293b',
              borderRadius: '8px',
              borderColor: '#10b981',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Estado:</span>
              <span style={{
                fontWeight: 'bold',
                color: isServiceBActive ? '#10b981' : '#ef4444'
              }}>
                {isServiceBActive ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ServersPage.propTypes = {
  stats: PropTypes.shape({
    totalRequests: PropTypes.number.isRequired,
    serviceACount: PropTypes.number.isRequired,
    serviceBCount: PropTypes.number.isRequired,
    averageLatency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    successRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  history: PropTypes.array.isRequired,
};
