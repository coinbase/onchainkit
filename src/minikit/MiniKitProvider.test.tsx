import sdk, { type Context } from '@farcaster/frame-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { act, useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { MiniKitContext, MiniKitProvider } from './MiniKitProvider';
import type { MiniKitContextType } from './types';

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

vi.mock('@farcaster/frame-wagmi-connector', () => ({
  farcasterFrame: vi.fn(),
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
    }) as unknown as Promise<Context.FrameContext>;
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

    expect(sdk.on).toHaveBeenCalledWith('frameAdded', expect.any(Function));
    expect(sdk.on).toHaveBeenCalledWith('frameRemoved', expect.any(Function));
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
      sdk.emit('frameAdded', {
        notificationDetails,
      });
    });

    expect(contextValue?.context?.client.notificationDetails).toEqual(
      notificationDetails,
    );
    expect(contextValue?.context?.client.added).toBe(true);

    act(() => {
      sdk.emit('frameRemoved');
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

    sdk.emit('frameAddRejected', {
      reason: 'invalid_domain_manifest',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Frame add rejected',
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
});
