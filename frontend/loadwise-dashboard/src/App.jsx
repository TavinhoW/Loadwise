/**
 * App.jsx
 * Aplicação principal com Layout Profissional de Alta Disponibilidade
 */

import { useState, useEffect } from 'react';
import { fetchBackendStatus, getRequestHistory, getAggregatedStats } from './api';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import MetricsPage from './pages/MetricsPage';
import LogsPage from './pages/LogsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    averageLatency: 0,
    serviceACount: 0,
    serviceBCount: 0,
    successRate: 100
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const result = await fetchBackendStatus();
    setCurrentResponse(result);
    const aggregated = getAggregatedStats();
    setStats(aggregated);
    setHistory(getRequestHistory());
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage stats={stats} history={history} currentResponse={currentResponse} />;
      case 'servers':
        return <ServersPage stats={stats} history={history} />;
      case 'metrics':
        return <MetricsPage stats={stats} history={history} />;
      case 'logs':
        return <LogsPage history={history} />;
      default:
        return <DashboardPage stats={stats} history={history} currentResponse={currentResponse} />;
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
      {/* SIDEBAR FIXA ESQUERDA */}
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
        {/* LOGO SECTION */}
        <div style={{ 
          padding: '40px 24px 32px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', // Centraliza imagem e texto
          gap: '12px' 
        }}>
          <img 
            src="/loadwise.png" // Caminho relativo à pasta public
            alt="Loadwise Logo"
            style={{ 
              width: '60px', 
              height: 'auto',
              filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' // Brilho suave cyan
            }} 
            onError={(e) => { e.target.style.display = 'none'; }} // Esconde se a imagem não existir
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
          <Navbar 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            layout="vertical"
          />
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0 
      }}>
        {/* TOPBAR HEADER */}
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
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h2>
          </div>
        </header>

        {/* CONTAINER DAS PÁGINAS */}
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