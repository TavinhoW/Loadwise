import { render, screen } from '@testing-library/react';
import MetricsCard from './MetricsCard';

test('renders title and value', () => {
  render(<MetricsCard title="Total Requisições" value={42} unit="requisições" color="#8b5cf6" />);
  expect(screen.getByText('Total Requisições')).toBeInTheDocument();
  expect(screen.getByText('42')).toBeInTheDocument();
  expect(screen.getByText('requisições')).toBeInTheDocument();
});

test('renders icon when provided', () => {
  render(<MetricsCard title="Teste" value={1} icon="📊" />);
  expect(screen.getByText('📊')).toBeInTheDocument();
});

test('renders without unit', () => {
  render(<MetricsCard title="Sem unidade" value={0} />);
  expect(screen.getByText('Sem unidade')).toBeInTheDocument();
  expect(screen.getByText('0')).toBeInTheDocument();
});
