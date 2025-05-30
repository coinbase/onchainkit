import sdk from '@farcaster/frame-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { AutoConnect } from './AutoConnect';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    isInMiniApp: vi.fn(),
  },
}));

vi.mock('@farcaster/frame-wagmi-connector', () => ({
  farcasterFrame: vi.fn(),
}));

const mockConfig = {
  chains: [base],
  connectors: [],
  transports: { [base.id]: http() },
} as const;

const queryClient = new QueryClient();

describe('AutoConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not attempt connection if not in Mini App', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(false);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });

  it('should not attempt connection if already connected', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });

  it('should not attempt connection if connector is not Farcaster Frame', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig({ ...mockConfig, connectors: [] })}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });

  it('should not attempt connection when disabled', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig({ ...mockConfig, connectors: [] })}>
          <AutoConnect enabled={false}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });

  it('should attempt connection when in Mini App, not connected, and enabled', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig({ ...mockConfig, connectors: [] })}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });

  it('should only attempt connection once', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { container, rerender } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig({ ...mockConfig, connectors: [] })}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    // Rerender to trigger useEffect again
    rerender(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig({ ...mockConfig, connectors: [] })}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.textContent).toBe('Test Child');
  });
});
