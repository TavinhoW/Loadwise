/**
 * api.js
 * API com suporte a estatísticas reais e histórico limitado
 */

const currentIP = window.location.hostname;
const LOAD_BALANCER_URL = `http://${currentIP}:8080`;

// Variáveis de estado interno
let requestHistory = [];
let totalRequestsCounter = 0; // Novo contador global que nunca para de subir

/**
 * Fetch do load balancer
 */
export async function fetchBackendStatus() {
  const start = performance.now();
  totalRequestsCounter++; // Incrementa o total real a cada chamada

  try {
    const response = await fetch(LOAD_BALANCER_URL);
    const text = await response.text();
    const latency = performance.now() - start;

    const serverName = text.includes("Service A") ? "Service A" : "Service B";

    // Adicionar ao histórico
    requestHistory.push({
      server: serverName,
      latency: parseFloat(latency.toFixed(2)),
      timestamp: Date.now(),
      status: "success",
    });

    // Limite de memória: Mantemos os últimos 200 para os gráficos/logs
    // Mas o contador totalRequestsCounter continua a subir!
    if (requestHistory.length > 200) {
      requestHistory.shift();
    }

    return {
      message: text,
      latency: latency.toFixed(2),
      timestamp: new Date().toLocaleTimeString(),
      status: "Online",
      serverName: serverName,
    };
  } catch (error) {
    requestHistory.push({
      server: "Unknown",
      latency: 0,
      timestamp: Date.now(),
      status: "error",
    });

    return {
      message: "Erro na ligação",
      latency: "0.00",
      timestamp: new Date().toLocaleTimeString(),
      status: "Offline",
      serverName: "Unknown",
    };
  }
}

export function getRequestHistory() {
  return requestHistory;
}

/**
 * Calcular estatísticas agregadas usando o contador real
 */
export function getAggregatedStats() {
  if (requestHistory.length === 0) {
    return {
      totalRequests: 0,
      averageLatency: 0,
      serviceACount: 0,
      serviceBCount: 0,
      successRate: 100,
    };
  }

  const successfulRequests = requestHistory.filter(
    (r) => r.status === "success",
  );
  const totalLatency = successfulRequests.reduce(
    (sum, r) => sum + r.latency,
    0,
  );

  // Para manter a precisão do balanceamento mesmo com histórico limitado,
  // usamos os dados do array atual (Service A vs Service B)
  const serviceACount = requestHistory.filter(
    (r) => r.server === "Service A",
  ).length;
  const serviceBCount = requestHistory.filter(
    (r) => r.server === "Service B",
  ).length;

  return {
    totalRequests: totalRequestsCounter, // USAMOS O CONTADOR REAL AQUI
    averageLatency: (totalLatency / (successfulRequests.length || 1)).toFixed(
      2,
    ),
    serviceACount,
    serviceBCount,
    successRate: (
      (successfulRequests.length / requestHistory.length) *
      100
    ).toFixed(1),
  };
}

export function clearHistory() {
  requestHistory = [];
  totalRequestsCounter = 0; // Reset total também
}
