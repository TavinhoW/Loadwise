const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "Service A";

function log(message) {
  console.log(`[${new Date().toISOString()}] [${SERVICE_NAME}] ${message}`);
}

// Sieve of Eratosthenes — simulates CPU-intensive work
function computePrimes(limit) {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) sieve[j] = false;
    }
  }
  return sieve.slice(2).filter(Boolean).length;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const start = Date.now();
  const url = new URL(req.url, `http://localhost:${PORT}`);
  log(`${req.method} ${url.pathname}`);

  if (url.pathname === "/health") {
    sendJson(res, 200, { status: "ok", service: SERVICE_NAME });
    return;
  }

  if (url.pathname === "/cpu") {
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50000", 10), 200000);
    const count = computePrimes(limit);
    const processingTime = Date.now() - start;
    sendJson(res, 200, {
      service: SERVICE_NAME,
      endpoint: "/cpu",
      message: `${SERVICE_NAME} calculou ${count} primos até ${limit}`,
      processingTime,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (url.pathname === "/slow") {
    const delay = Math.min(parseInt(url.searchParams.get("ms") || "500", 10), 3000);
    setTimeout(() => {
      sendJson(res, 200, {
        service: SERVICE_NAME,
        endpoint: "/slow",
        message: `${SERVICE_NAME} respondeu após ${delay}ms de delay simulado`,
        processingTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      });
    }, delay);
    return;
  }

  sendJson(res, 200, {
    service: SERVICE_NAME,
    endpoint: "/",
    message: `${SERVICE_NAME} is handling this request`,
    processingTime: Date.now() - start,
    timestamp: new Date().toISOString(),
  });
});

server.on("error", (err) => {
  log(`Server error: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, () => log(`Running on port ${PORT}`));

function shutdown() {
  log("Shutting down...");
  server.close(() => { log("Shutdown complete"); process.exit(0); });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
