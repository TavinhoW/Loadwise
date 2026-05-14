const http = require('http');

const PORT = 8080;

// Lista dos servidores de backend disponíveis para balanceamento
const SERVERS = [
  { host: 'localhost', port: 3001, name: 'Service A' },
  { host: 'localhost', port: 3002, name: 'Service B' },
];

// Tempo máximo de espera por resposta de um servidor (em ms)
// Deve ser superior ao delay do endpoint /slow (500ms) para evitar falsos timeouts
const CONNECT_TIMEOUT_MS = 10000;

// Índice do próximo servidor a receber um pedido (algoritmo round-robin)
let index = 0;
const failures = new Array(SERVERS.length).fill(0);
const unavailableUntil = new Array(SERVERS.length).fill(0);

// Após uma falha, o servidor fica bloqueado durante este período antes de ser tentado novamente
const FAIL_TIMEOUT_MS = 15000;

// Seleciona o próximo servidor disponível em round-robin
// Ignora servidores marcados como indisponíveis até o seu tempo de bloqueio expirar
function getNextServer() {
  const now = Date.now();
  for (let i = 0; i < SERVERS.length; i++) {
    const idx = (index + i) % SERVERS.length;
    if (now >= unavailableUntil[idx]) {
      index = (idx + 1) % SERVERS.length;
      return idx;
    }
  }
  // Fallback: todos os servidores em baixo — tenta o próximo na mesma
  const idx = index % SERVERS.length;
  index = (index + 1) % SERVERS.length;
  return idx;
}

// Regista uma falha e bloqueia o servidor temporariamente (failover automático)
function markFailure(idx) {
  failures[idx]++;
  unavailableUntil[idx] = Date.now() + FAIL_TIMEOUT_MS;
  console.log(`[balancer] ${SERVERS[idx].name} marcado como indisponível por ${FAIL_TIMEOUT_MS / 1000}s`);
}

// Repõe o estado do servidor após uma resposta bem-sucedida
function markSuccess(idx) {
  failures[idx] = 0;
  unavailableUntil[idx] = 0;
}

const server = http.createServer((req, res) => {
  // Cabeçalhos CORS para permitir pedidos do frontend React (porta 3000)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde ao preflight do browser sem reencaminhar para o backend
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

  // Reencaminha o pedido para o servidor selecionado e devolve a resposta ao cliente
  const proxy = http.request(options, (proxyRes) => {
    markSuccess(idx);
    const ms = Date.now() - start;
    console.log(`[balancer] ${req.method} ${req.url} → ${target.name} ${proxyRes.statusCode} (${ms}ms)`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  // Timeout: servidor demorou demasiado a responder
  proxy.setTimeout(CONNECT_TIMEOUT_MS, () => {
    proxy.destroy();
    markFailure(idx);
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service temporarily unavailable', status: 503 }));
  });

  // Erro de ligação: servidor inacessível (ex: container parado)
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
