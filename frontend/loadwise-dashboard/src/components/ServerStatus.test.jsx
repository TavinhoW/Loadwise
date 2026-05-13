import { render, screen } from '@testing-library/react';
import ServerStatus from './ServerStatus';

test('shows ONLINE when active', () => {
  render(
    <ServerStatus
      serverName="Service A"
      requestCount={10}
      averageLatency="12.50"
      isActive={true}
      color="#3b82f6"
    />
  );
  expect(screen.getByText('ONLINE')).toBeInTheDocument();
  expect(screen.getByText('Service A')).toBeInTheDocument();
  expect(screen.getByText('10')).toBeInTheDocument();
});

test('shows OFFLINE when inactive', () => {
  render(
    <ServerStatus
      serverName="Service B"
      requestCount={0}
      averageLatency="0"
      isActive={false}
      color="#10b981"
    />
  );
  expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  expect(screen.getByText('Service B')).toBeInTheDocument();
});

test('shows latency value', () => {
  render(
    <ServerStatus
      serverName="Service A"
      requestCount={5}
      averageLatency="45.20"
      isActive={true}
      color="#3b82f6"
    />
  );
  expect(screen.getByText('45.20')).toBeInTheDocument();
});
