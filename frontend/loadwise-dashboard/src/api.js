/**
 * api.js
 * API melhorada com suporte a estatísticas individuais dos servidores
 */

const currentIP = window.location.hostname;
const LOAD_BALANCER_URL = `http://${currentIP}:8080`;

// Histórico de requisições (últimas 20)
let requestHistory = [];

/**
 * Fetch do load balancer (comportamento original)
 */
export async function fetchBackendStatus() {
  const start = performance.now();
  try {
    const response = await fetch(LOAD_BALANCER_URL);
    const text = await response.text();
    const latency = performance.now() - start;

    // Determinar qual servidor respondeu
    const serverName = text.includes('Service A') ? 'Service A' : 'Service B';

    // Adicionar ao histórico
    requestHistory.push({
      server: serverName,
      latency: parseFloat(latency.toFixed(2)),
      timestamp: Date.now(),
      status: 'success'
    });

    // Manter apenas últimas 20 requisições
    if (requestHistory.length > 20) {
      requestHistory.shift();
    }

    return {
      message: text,
      latency: latency.toFixed(2),
      timestamp: new Date().toLocaleTimeString(),
      status: 'Online',
      serverName: serverName
    };
  } catch (error) {
    requestHistory.push({
      server: 'Unknown',
      latency: 0,
      timestamp: Date.now(),
      status: 'error'
    });

    return {
      message: 'Erro na ligação',
      latency: '0.00',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Offline',
      serverName: 'Unknown'
    };
  }
}

/**
 * Obter histórico de requisições
 */
export function getRequestHistory() {
  return requestHistory;
}

/**
 * Calcular estatísticas agregadas
 */
export function getAggregatedStats() {
  if (requestHistory.length === 0) {
    return {
      totalRequests: 0,
      averageLatency: 0,
      serviceACount: 0,
      serviceBCount: 0,
      successRate: 100
    };
  }

  const successfulRequests = requestHistory.filter(r => r.status === 'success');
  const totalLatency = successfulRequests.reduce((sum, r) => sum + r.latency, 0);
  const serviceACount = requestHistory.filter(r => r.server === 'Service A').length;
  const serviceBCount = requestHistory.filter(r => r.server === 'Service B').length;

  return {
    totalRequests: requestHistory.length,
    averageLatency: (totalLatency / successfulRequests.length).toFixed(2),
    serviceACount,
    serviceBCount,
    successRate: ((successfulRequests.length / requestHistory.length) * 100).toFixed(1)
  };
}

/**
 * Limpar histórico
 */
export function clearHistory() {
  requestHistory = [];
}
