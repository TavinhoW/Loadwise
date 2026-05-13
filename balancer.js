const http = require('http');

const PORT = 8080;
const SERVERS = [
  { host: 'localhost', port: 3001, name: 'Service A' },
  { host: 'localhost', port: 3002, name: 'Service B' },
];
const CONNECT_TIMEOUT_MS = 10000;

let index = 0;
const failures = new Array(SERVERS.length).fill(0);
const unavailableUntil = new Array(SERVERS.length).fill(0);
const FAIL_TIMEOUT_MS = 15000;

function getNextServer() {
  const now = Date.now();
  for (let i = 0; i < SERVERS.length; i++) {
    const idx = (index + i) % SERVERS.length;
    if (now >= unavailableUntil[idx]) {
      index = (idx + 1) % SERVERS.length;
      return idx;
    }
  }
  // todos em baixo — tentar o próximo na mesma
  const idx = index % SERVERS.length;
  index = (index + 1) % SERVERS.length;
  return idx;
}

function markFailure(idx) {
  failures[idx]++;
  unavailableUntil[idx] = Date.now() + FAIL_TIMEOUT_MS;
  console.log(`[balancer] ${SERVERS[idx].name} marcado como indisponível por ${FAIL_TIMEOUT_MS / 1000}s`);
}

function markSuccess(idx) {
  failures[idx] = 0;
  unavailableUntil[idx] = 0;
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const idx = getNextServer();
  const target = SERVERS[idx];
  const start = Date.now();

  const options = {
    host: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${target.host}:${target.port}` },
  };

  const proxy = http.request(options, (proxyRes) => {
    markSuccess(idx);
    const ms = Date.now() - start;
    console.log(`[balancer] ${req.method} ${req.url} → ${target.name} ${proxyRes.statusCode} (${ms}ms)`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.setTimeout(CONNECT_TIMEOUT_MS, () => {
    proxy.destroy();
    markFailure(idx);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service temporarily unavailable', status: 503 }));
  });

  proxy.on('error', () => {
    markFailure(idx);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service temporarily unavailable', status: 503 }));
  });

  req.pipe(proxy);
});

server.listen(PORT, () => {
  console.log(`[balancer] A correr na porta ${PORT}`);
  console.log(`[balancer] Servidores: ${SERVERS.map(s => `${s.name} (porta ${s.port})`).join(' | ')}`);
});
