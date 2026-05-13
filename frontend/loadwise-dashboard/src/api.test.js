import { fetchBackendStatus, computeStats } from './api';

describe('computeStats', () => {
  test('returns defaults for empty history', () => {
    const stats = computeStats([], 0);
    expect(stats.totalRequests).toBe(0);
    expect(stats.averageLatency).toBe(0);
    expect(stats.serviceACount).toBe(0);
    expect(stats.serviceBCount).toBe(0);
    expect(stats.successRate).toBe(100);
    expect(stats.throughput).toBe('0.0');
    expect(stats.p95Latency).toBe('0.00');
  });

  test('uses totalRequests from argument, not history length', () => {
    const history = [
      { server: 'Service A', latency: 10, status: 'success', timestamp: Date.now() },
    ];
    const stats = computeStats(history, 999);
    expect(stats.totalRequests).toBe(999);
  });

  test('counts services correctly', () => {
    const history = [
      { server: 'Service A', latency: 10, status: 'success', timestamp: Date.now() },
      { server: 'Service B', latency: 20, status: 'success', timestamp: Date.now() },
      { server: 'Service A', latency: 30, status: 'success', timestamp: Date.now() },
    ];
    const stats = computeStats(history, 3);
    expect(stats.serviceACount).toBe(2);
    expect(stats.serviceBCount).toBe(1);
  });

  test('calculates average latency for successful requests only', () => {
    const history = [
      { server: 'Service A', latency: 10, status: 'success', timestamp: Date.now() },
      { server: 'Service B', latency: 30, status: 'success', timestamp: Date.now() },
      { server: 'Unknown', latency: 0, status: 'error', timestamp: Date.now() },
    ];
    const stats = computeStats(history, 3);
    expect(stats.averageLatency).toBe('20.00');
  });

  test('calculates success rate correctly', () => {
    const history = [
      { server: 'Service A', latency: 10, status: 'success', timestamp: Date.now() },
      { server: 'Unknown', latency: 0, status: 'error', timestamp: Date.now() },
    ];
    const stats = computeStats(history, 2);
    expect(stats.successRate).toBe('50.0');
  });

  test('calculates p95 latency correctly', () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      server: 'Service A',
      latency: (i + 1) * 10,
      status: 'success',
      timestamp: Date.now(),
    }));
    const stats = computeStats(history, 20);
    // p95 index = ceil(20 * 0.95) - 1 = ceil(19) - 1 = 18, latency at index 18 = 190
    expect(stats.p95Latency).toBe('190.00');
  });

  test('returns throughput as string with one decimal', () => {
    const history = [
      { server: 'Service A', latency: 10, status: 'success', timestamp: Date.now() },
    ];
    const stats = computeStats(history, 1);
    expect(typeof stats.throughput).toBe('string');
    expect(stats.throughput).toMatch(/^\d+\.\d$/);
  });
});

describe('fetchBackendStatus', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.performance = { now: jest.fn().mockReturnValue(0) };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns success result on valid response from Service A', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ service: 'Service A', message: 'Service A is handling this request', processingTime: 5 }),
    });

    const result = await fetchBackendStatus();
    expect(result.status).toBe('success');
    expect(result.serverName).toBe('Service A');
    expect(result.message).toContain('Service A');
    expect(result.serverLatency).toBe(5);
  });

  test('returns success result on valid response from Service B', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ service: 'Service B', message: 'Service B is handling this request', processingTime: 3 }),
    });

    const result = await fetchBackendStatus();
    expect(result.status).toBe('success');
    expect(result.serverName).toBe('Service B');
    expect(result.serverLatency).toBe(3);
  });

  test('returns error on fetch failure', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const result = await fetchBackendStatus();
    expect(result.status).toBe('error');
    expect(result.serverName).toBe('Unknown');
    expect(result.message).toBe('Erro na ligação');
    expect(result.latency).toBe(0);
    expect(result.serverLatency).toBe(0);
  });

  test('returns error on non-ok HTTP response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await fetchBackendStatus();
    expect(result.status).toBe('error');
  });

  test('passes custom endpoint to fetch URL', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ service: 'Service A', message: 'cpu result', processingTime: 42 }),
    });

    const result = await fetchBackendStatus('/cpu');
    expect(result.endpoint).toBe('/cpu');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/cpu'));
  });
});
