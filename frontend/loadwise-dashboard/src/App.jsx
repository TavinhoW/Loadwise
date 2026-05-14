import { useState, useEffect } from 'react';
import { fetchBackendStatus, computeStats } from './api';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import MetricsPage from './pages/MetricsPage';
import LogsPage from './pages/LogsPage';

// Número máximo de entradas no histórico — as mais antigas são descartadas automaticamente
const MAX_HISTORY = 200;

// Intervalo de polling ao balanceador (em ms) — atualiza o dashboard a cada 2 segundos
const POLL_INTERVAL_MS = 2000;

const ENDPOINTS = [
  { path: '/', label: 'Padrão' },
  { path: '/slow', label: 'Lento' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [serviceATotal, setServiceATotal] = useState(0);
  const [serviceBTotal, setServiceBTotal] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState('/');

  const rawStats = computeStats(requestHistory, totalRequests);
  const stats = { ...rawStats, serviceACount: serviceATotal, serviceBCount: serviceBTotal };

  // Regista o resultado de cada pedido no histórico e atualiza os contadores por servidor
  const addResult = (result) => {
    if (!result) return;
    setCurrentResponse(result);
    setTotalRequests(prev => prev + 1);
    if (result.serverName === 'Service A') setServiceATotal(prev => prev + 1);
    if (result.serverName === 'Service B') setServiceBTotal(prev => prev + 1);
    setRequestHistory(prev => {
      const entry = {
        server: result.serverName,
        latency: result.latency,
        serverLatency: result.serverLatency,
        timestamp: Date.now(),
        status: result.status,
        endpoint: result.endpoint,
      };
      const updated = [...prev, entry];
      // Mantém apenas as MAX_HISTORY entradas mais recentes
      return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
    });
  };

  const fetchData = async (ep = selectedEndpoint) => {
    const result = await fetchBackendStatus(ep);
    addResult(result);
  };

  // Teste de carga: envia 10 pedidos com 100ms de intervalo entre cada um
  // O escalonamento evita sobrecarregar o browser (máx. 6 ligações simultâneas por host)
  const runBurstTest = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        fetchBackendStatus(selectedEndpoint).then(addResult);
      }, i * 100);
    }
  };

  // Inicia o polling automático ao montar o componente e reinicia quando o endpoint muda
  // O cleanup garante que não ficam intervalos ativos após desmontagem
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(selectedEndpoint), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEndpoint]);


  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage stats={stats} history={requestHistory} currentResponse={currentResponse} />;
      case 'servers':
        return <ServersPage stats={stats} history={requestHistory} />;
      case 'metrics':
        return <MetricsPage stats={stats} history={requestHistory} />;
      case 'logs':
        return <LogsPage history={requestHistory} />;
      default:
        return <DashboardPage stats={stats} history={requestHistory} currentResponse={currentResponse} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#020617',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{
          padding: '40px 24px 32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img
            src="/loadwise.png"
            alt="Loadwise Logo"
            style={{ width: '60px', height: 'auto', filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 style={{
            color: '#22d3ee',
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '2px',
            margin: 0,
            textAlign: 'center'
          }}>
            LOADWISE
          </h1>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          <Navbar currentPage={currentPage} onNavigate={setCurrentPage} layout="vertical" />
        </nav>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: '70px',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 9
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Endpoint selector */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {ENDPOINTS.map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => setSelectedEndpoint(path)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    backgroundColor: selectedEndpoint === path ? '#22d3ee' : '#1e293b',
                    color: selectedEndpoint === path ? '#020617' : '#94a3b8',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Burst test */}
            <button
              onClick={runBurstTest}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: '1px solid #f59e0b',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: 'transparent',
                color: '#f59e0b',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f59e0b'; e.currentTarget.style.color = '#020617'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#f59e0b'; }}
            >
              Teste de Carga
            </button>
          </div>
        </header>

        {parseFloat(stats.successRate) < 95 && totalRequests > 10 && (
          <div style={{
            backgroundColor: '#7f1d1d',
            borderBottom: '1px solid #ef4444',
            padding: '12px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fca5a5',
          }}>
            <span>
              ALERTA: Taxa de sucesso abaixo de 95% ({stats.successRate}%) — Possível falha num serviço
            </span>
          </div>
        )}

        <div style={{ padding: '40px', maxWidth: '1600px' }}>
          {renderPage()}
        </div>
      </main>

      <style>{`
        body { margin: 0; padding: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}

export default App;
