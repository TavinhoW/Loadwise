/**
 * LogsPage.jsx
 * Página de logs e histórico de requisições com Scroll Fixo
 */

import React from 'react';

export default function LogsPage({ history }) {
  // Inverter histórico para mostrar os mais recentes primeiro
  const reversedHistory = [...history].reverse();

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
        Histórico de Requisições
      </h2>

      {/* Informação do histórico */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '15px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #334155'
      }}>
        <div>
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>
            Total de registos:
          </span>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#22d3ee', // Cyan para destaque
            marginLeft: '10px'
          }}>
            {history.length}
          </span>
        </div>
      </div>

      {/* Tabela de logs com Contentor de Scroll */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        border: '1px solid #334155',
        overflow: 'hidden', // Garante que as bordas arredondadas cortam o conteúdo
        maxHeight: '650px', // Altura fixa para não crescer para baixo
        display: 'flex',
        flexDirection: 'column'
      }}>
        {history.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
            <div style={{ fontSize: '16px' }}>Nenhuma requisição registada ainda</div>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1, position: 'relative' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              tableLayout: 'fixed' // Ajuda a manter as colunas alinhadas
            }}>
              <thead style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 10,
                backgroundColor: '#1e293b' 
              }}>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white'
                }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', width: '80px' }}>#</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>Servidor</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>Latência</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>Estado</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {reversedHistory.map((log, index) => (
                  <tr 
                    key={index}
                    style={{
                      borderBottom: '1px solid #334155',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0f172a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '15px', fontSize: '14px', color: '#94a3b8' }}>
                      {/* A contagem real continua a subir: 21, 22, 23... */}
                      {history.length - index}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: log.server === 'Service A' 
                          ? 'rgba(59, 130, 246, 0.2)' 
                          : 'rgba(16, 185, 129, 0.2)',
                        color: log.server === 'Service A' ? '#60a5fa' : '#34d399'
                      }}>
                        {log.server}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      color: log.latency < 50 ? '#34d399' : log.latency < 100 ? '#fbbf24' : '#f87171'
                    }}>
                      {log.latency.toFixed(2)} ms
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: log.status === 'success' ? '#34d399' : '#f87171'
                      }}>
                        {log.status === 'success' ? '✅' : '❌'}
                        {log.status === 'success' ? 'Sucesso' : 'Erro'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#94a3b8' }}>
                      {new Date(log.timestamp).toLocaleTimeString('pt-PT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legenda */}
      {history.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#94a3b8',
          border: '1px solid #1e293b'
        }}>
          <strong>💡 Legenda de cores (Latência):</strong>
          <div style={{ marginTop: '8px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} />
              <span>Excelente (&lt; 50ms)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }} />
              <span>Boa (50-100ms)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px' }} />
              <span>Elevada (&gt; 100ms)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}