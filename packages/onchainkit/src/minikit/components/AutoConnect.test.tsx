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

const mockConnect = vi.fn();
const mockFarcasterFrame = {
  type: 'farcasterFrame',
};

const mockOtherConnector = {
  type: 'otherConnector',
};

vi.mock('@farcaster/frame-wagmi-connector', () => ({
  farcasterFrame: {
    type: 'farcasterFrame',
  },
}));

// We'll override this mock in individual tests
const mockUseAccount = vi.fn();
const mockUseConnect = vi.fn();

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useConnect: () => mockUseConnect(),
    useAccount: () => mockUseAccount(),
  };
});

const mockConfig = {
  chains: [base],
  connectors: [],
  transports: { [base.id]: http() },
} as const;

const queryClient = new QueryClient();

describe('AutoConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseAccount.mockReturnValue({
      isConnected: false,
      isConnecting: false,
    });

    mockUseConnect.mockReturnValue({
      connectors: [mockFarcasterFrame],
      connect: mockConnect,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not attempt connection if not in Mini App', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(false);

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should not attempt connection if already connected', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    // Mock account to be already connected
    mockUseAccount.mockReturnValue({
      isConnected: true,
      isConnecting: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should not attempt connection if connector is not Farcaster Frame', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    // Mock connectors to have a different type of connector
    mockUseConnect.mockReturnValue({
      connectors: [mockOtherConnector],
      connect: mockConnect,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should not attempt connection when disabled', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect enabled={false}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should attempt connection when in Mini App, not connected, and enabled', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).toHaveBeenCalledWith({ connector: mockFarcasterFrame });
  });

  it('should only attempt connection once', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
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
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    // Should only be called once despite rerender
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith({ connector: mockFarcasterFrame });
  });

  it('should call connect with connector when in Mini App and all conditions are met', async () => {
    // Mock isInMiniApp to return true
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect enabled={true}>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    // Wait for the async effect to complete
    await act(() => Promise.resolve());

    // Verify that connect was called with the correct connector
    expect(mockConnect).toHaveBeenCalledWith({ connector: mockFarcasterFrame });
  });

  it('should not attempt connection if currently connecting', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    // Mock account to be currently connecting
    mockUseAccount.mockReturnValue({
      isConnected: false,
      isConnecting: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('should not attempt connection if no connectors available', async () => {
    vi.mocked(sdk.isInMiniApp).mockResolvedValue(true);

    // Mock empty connectors array
    mockUseConnect.mockReturnValue({
      connectors: [],
      connect: mockConnect,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={createConfig(mockConfig)}>
          <AutoConnect>
            <div>Test Child</div>
          </AutoConnect>
        </WagmiProvider>
      </QueryClientProvider>,
    );

    await act(() => Promise.resolve());

    expect(mockConnect).not.toHaveBeenCalled();
  });
});
