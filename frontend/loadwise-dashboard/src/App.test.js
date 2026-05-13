import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.useFakeTimers();

jest.mock('./api', () => ({
  fetchBackendStatus: jest.fn(() => new Promise(() => {})),
  computeStats: jest.fn(() => ({
    totalRequests: 0,
    averageLatency: 0,
    serviceACount: 0,
    serviceBCount: 0,
    successRate: 100,
    throughput: '0.5',
    p95Latency: '15.00',
  })),
}));

test('renders LOADWISE title', () => {
  render(<App />);
  expect(screen.getByText('LOADWISE')).toBeInTheDocument();
});

test('renders all navigation items', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Dashboard/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Servers/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Metrics/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Logs/ })).toBeInTheDocument();
});

test('shows dashboard page by default', () => {
  render(<App />);
  expect(screen.getByText('Visão Geral do Sistema')).toBeInTheDocument();
});

test('renders endpoint selector with Padrão and Lento, without CPU', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: 'Padrão' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Lento' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'CPU' })).not.toBeInTheDocument();
});

test('renders burst test button', () => {
  render(<App />);
  expect(screen.getByText(/Teste de Carga/)).toBeInTheDocument();
});

test('navigates to Servers page on click', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Servers/ }));
  expect(screen.getByText('Estado dos Servidores')).toBeInTheDocument();
});

test('navigates to Metrics page on click', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Metrics/ }));
  expect(screen.getByText('Métricas e Análises')).toBeInTheDocument();
});

test('navigates to Logs page on click', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Logs/ }));
  expect(screen.getByText('Histórico de Requisições')).toBeInTheDocument();
});

test('calls fetchBackendStatus on mount', () => {
  const { fetchBackendStatus } = require('./api');
  render(<App />);
  expect(fetchBackendStatus).toHaveBeenCalled();
});
