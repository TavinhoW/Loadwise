const currentIP = window.location.hostname;
const API_URL = `http://${currentIP}:8080`;

export async function fetchBackendStatus() {
  const start = performance.now();
  try {
    const response = await fetch(API_URL);
    const text = await response.text();
    const latency = performance.now() - start;

    return {
      message: text,
      latency: latency.toFixed(2),
      timestamp: new Date().toLocaleTimeString(),
      status: "Online"
    };
  } catch (error) {
    return {
      message: "Erro na ligação",
      latency: "0.00",
      timestamp: new Date().toLocaleTimeString(),
      status: "Offline"
    };
  }
}
