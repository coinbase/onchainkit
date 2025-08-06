import sdk, { type Context } from '@farcaster/frame-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { act, useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { MiniKitContext, MiniKitProvider } from './MiniKitProvider';
import type { MiniKitContextType } from './types';
import { coinbaseWallet } from 'wagmi/connectors';

vi.mock('@farcaster/frame-sdk', () => {
  let listeners: Record<string, (data: object) => void> = {};

  return {
    default: {
      emit: vi.fn((event: string, data: object) => {
        if (listeners[event]) {
          listeners[event](data);
        }
      }),
      on: vi.fn((event, callback) => {
        listeners[event] = callback;
      }),
      removeAllListeners: vi.fn(() => {
        listeners = {};
      }),
      context: vi.fn(),
    },
  };
});

vi.mock('@farcaster/miniapp-wagmi-connector', () => ({
  farcasterFrame: vi.fn(),
}));

vi.mock('wagmi/connectors', () => ({
  coinbaseWallet: vi.fn(),
}));

const mockConfig = {
  chains: [base],
  connectors: [],
  transports: { [base.id]: http() },
} as const;

const queryClient = new QueryClient();

describe('MiniKitProvider', () => {
  beforeEach(() => {
    vi.mocked(sdk).context = Promise.resolve({
      client: {
        notificationDetails: null,
        added: false,
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      },
    }) as unknown as Promise<Context.MiniAppContext>;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load context initially', async () => {
    let contextValue: MiniKitContextType | undefined;

    function TestComponent() {
      contextValue = useContext(MiniKitContext);
      return null;
    }

    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider
            chain={mockConfig.chains[0]}
            config={{
              appearance: {
                name: 'Test App',
                logo: 'https://example.com/icon.png',
              },
            }}
          >
            <TestComponent />
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    expect(contextValue?.context).toBeNull();
    expect(contextValue?.notificationProxyUrl).toBe('/api/notify');
    expect(typeof contextValue?.updateClientContext).toBe('function');

    await act(() => Promise.resolve());

    expect(contextValue?.context).not.toBeNull();
  });

  it('should handle rejected context', async () => {
    let contextValue: MiniKitContextType | undefined;

    function TestComponent() {
      contextValue = useContext(MiniKitContext);
      contextValue?.updateClientContext({
        details: {
          url: 'https://example.com',
          token: '1234567890',
        },
      });
      return null;
    }

    vi.mocked(sdk).context = Promise.reject();

    await act(async () => {
      render(
        <WagmiProvider config={createConfig(mockConfig)}>
          <QueryClientProvider client={queryClient}>
            <MiniKitProvider chain={mockConfig.chains[0]}>
              <TestComponent />
            </MiniKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    });

    expect(contextValue?.context).toBeNull();
  });

  it('should render children with safe area insets', async () => {
    const { container } = render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    expect(container.querySelector('div')).toHaveStyle({
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
    });
  });

  it('should set up frame event listeners', async () => {
    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    expect(sdk.on).toHaveBeenCalledWith('miniAppAdded', expect.any(Function));
    expect(sdk.on).toHaveBeenCalledWith(
      'miniAppAddRejected',
      expect.any(Function),
    );
    expect(sdk.on).toHaveBeenCalledWith('miniAppRemoved', expect.any(Function));
    expect(sdk.on).toHaveBeenCalledWith(
      'notificationsEnabled',
      expect.any(Function),
    );
    expect(sdk.on).toHaveBeenCalledWith(
      'notificationsDisabled',
      expect.any(Function),
    );
  });

  it('should clean up listeners on unmount', async () => {
    const { unmount } = render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());
    unmount();

    expect(sdk.removeAllListeners).toHaveBeenCalled();
  });

  it('should update context when frame is added and removed', async () => {
    let contextValue: MiniKitContextType | undefined;

    function TestComponent() {
      const context = useContext(MiniKitContext);
      contextValue = context;
      return null;
    }

    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <TestComponent />
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    const notificationDetails = {
      url: 'https://example.com',
      token: '1234567890',
    };

    act(() => {
      sdk.emit('miniAppAdded', {
        notificationDetails,
      });
    });

    expect(contextValue?.context?.client.notificationDetails).toEqual(
      notificationDetails,
    );
    expect(contextValue?.context?.client.added).toBe(true);

    act(() => {
      sdk.emit('miniAppRemoved');
    });

    expect(contextValue?.context?.client.notificationDetails).toBeUndefined();
    expect(contextValue?.context?.client.added).toBe(false);
  });

  it('should log an error when frameAddRejected is emitted', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(vi.fn());

    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    sdk.emit('miniAppAddRejected', {
      reason: 'invalid_domain_manifest',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Mini app add rejected',
      'invalid_domain_manifest',
    );
  });

  it('should update context when notifications are enabled and remove when disabled', async () => {
    let contextValue: MiniKitContextType | undefined;

    function TestComponent() {
      const context = useContext(MiniKitContext);
      contextValue = context;
      return null;
    }

    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]}>
            <TestComponent />
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    const notificationDetails = {
      url: 'https://example.com',
      token: '1234567890',
    };

    act(() => {
      sdk.emit('notificationsEnabled', {
        notificationDetails,
      });
    });

    expect(contextValue?.context?.client.notificationDetails).toEqual(
      notificationDetails,
    );

    act(() => {
      sdk.emit('notificationsDisabled');
    });

    expect(contextValue?.context?.client.notificationDetails).toBeUndefined();
  });

  it('should handle context fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(sdk).context = Promise.reject(new Error('Test error'));

    let contextValue: MiniKitContextType | undefined;
    function TestComponent() {
      contextValue = useContext(MiniKitContext);
      return null;
    }

    await act(async () => {
      render(
        <WagmiProvider config={createConfig(mockConfig)}>
          <QueryClientProvider client={queryClient}>
            <MiniKitProvider chain={mockConfig.chains[0]}>
              <TestComponent />
            </MiniKitProvider>
          </QueryClientProvider>
        </WagmiProvider>,
      );
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching context:',
      expect.any(Error),
    );
    expect(contextValue?.context).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should pass wallet preference from config to coinbaseWallet connector', async () => {
    const mockPreference = 'smartWalletOnly';

    // Reject the context promise to ensure we use coinbaseWallet
    vi.mocked(sdk).context = Promise.reject(new Error('No context'));

    render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider
            chain={mockConfig.chains[0]}
            config={{
              wallet: {
                preference: mockPreference,
              },
            }}
          >
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    expect(coinbaseWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        preference: mockPreference,
      }),
    );
  });

  it('should not render AutoConnect when autoConnect is false', async () => {
    const { container } = render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]} autoConnect={false}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    // Should only have the test child div, no AutoConnect wrapper
    expect(container.children.length).toBe(1);
    expect(container.textContent).toBe('Test Child');
  });

  it('should render AutoConnect when autoConnect is true', async () => {
    const { container } = render(
      <WagmiProvider config={createConfig(mockConfig)}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider chain={mockConfig.chains[0]} autoConnect={true}>
            <div>Test Child</div>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    );

    await act(() => Promise.resolve());

    // Should have the test child div wrapped in AutoConnect
    expect(container.textContent).toBe('Test Child');
  });
});
