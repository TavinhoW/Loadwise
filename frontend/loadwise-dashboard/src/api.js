const LOAD_BALANCER_URL =
  process.env.REACT_APP_LOAD_BALANCER_URL ||
  `http://${window.location.hostname}:8080`;

export async function fetchBackendStatus(endpoint = '/') {
  const start = performance.now();

  try {
    const response = await fetch(`${LOAD_BALANCER_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const latency = performance.now() - start;

    return {
      message: data.message,
      latency: parseFloat(latency.toFixed(2)),
      serverLatency: data.processingTime || 0,
      timestamp: new Date().toLocaleTimeString(),
      status: "success",
      serverName: data.service,
      endpoint,
    };
  } catch (error) {
    return {
      message: "Erro na ligação",
      latency: 0,
      serverLatency: 0,
      timestamp: new Date().toLocaleTimeString(),
      status: "error",
      serverName: "Unknown",
      endpoint,
    };
  }
}

export function computeStats(history, totalRequests) {
  if (history.length === 0) {
    return {
      totalRequests,
      averageLatency: 0,
      serviceACount: 0,
      serviceBCount: 0,
      successRate: 100,
      throughput: '0.0',
      p95Latency: '0.00',
    };
  }

  const successful = history.filter(r => r.status === "success");
  const totalLatency = successful.reduce((sum, r) => sum + r.latency, 0);

  // Throughput: requests in last 10 seconds
  const now = Date.now();
  const recentCount = history.filter(r => r.timestamp > now - 10000).length;

  // P95 latency
  const sortedLatencies = successful.map(r => r.latency).sort((a, b) => a - b);
  const p95Index = Math.max(0, Math.ceil(sortedLatencies.length * 0.95) - 1);

  return {
    totalRequests,
    averageLatency: (totalLatency / (successful.length || 1)).toFixed(2),
    serviceACount: history.filter(r => r.server === "Service A").length,
    serviceBCount: history.filter(r => r.server === "Service B").length,
    successRate: ((successful.length / history.length) * 100).toFixed(1),
    throughput: (recentCount / 10).toFixed(1),
    p95Latency: (sortedLatencies[p95Index] || 0).toFixed(2),
  };
}
