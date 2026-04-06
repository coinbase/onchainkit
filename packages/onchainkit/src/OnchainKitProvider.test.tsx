import '@testing-library/jest-dom';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import type { AppConfig } from '@/core/types';
import type { MiniKitOptions } from '@/minikit/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { useConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import { OnchainKitProvider } from './OnchainKitProvider';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';
import { OnchainKitConfigError } from './core/utils/validateOnchainKitConfig';

vi.mock('wagmi', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('wagmi');
  return {
    ...actual,
    useConfig: vi.fn(),
  };
});

vi.mock('@/internal/hooks/useProviderDependencies', () => ({
  useProviderDependencies: vi.fn(() => ({
    providedWagmiConfig: null,
    providedQueryClient: null,
  })),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
  useThemeRoot: vi.fn(() => 'default-light'),
}));

vi.mock('@farcaster/miniapp-sdk', () => ({
  default: {
    context: Promise.resolve({
      client: {
        clientFid: null,
      },
    }),
  },
}));

// Mock MiniKitProvider
vi.mock('@/minikit/MiniKitProvider', () => ({
  MiniKitProvider: vi.fn(({ children, enabled, notificationProxyUrl }) => (
    <div
      data-testid="minikit-provider"
      data-enabled={enabled}
      data-notification-proxy-url={notificationProxyUrl}
    >
      {children}
    </div>
  )),
  MiniKitContext: {
    _currentValue: null,
  },
}));

// Mock useSessionStorage
vi.mock('usehooks-ts', () => ({
  useSessionStorage: vi.fn(() => ['test-session-id', vi.fn()]),
}));

const queryClient = new QueryClient();

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const TestComponent = () => {
  const context = useOnchainKit();
  return (
    <div>
      <div data-testid="chain-id">{context.chain.id}</div>
      <div data-testid="api-key">{context.apiKey ?? 'no-api-key'}</div>
      <div data-testid="project-id">{context.projectId ?? 'no-project-id'}</div>
      <div data-testid="rpc-url">{context.rpcUrl ?? 'no-rpc-url'}</div>
      <div data-testid="session-id">{context.sessionId}</div>
    </div>
  );
};

describe('OnchainKitProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useConfig as Mock).mockReturnValue({ chains: [base] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context values', () => {
    render(
      <OnchainKitProvider chain={base}>
        <TestComponent />
      </OnchainKitProvider>,
    );

    expect(screen.getByTestId('chain-id').textContent).toBe('8453');
    expect(screen.getByTestId('api-key').textContent).toBe('no-api-key');
    expect(screen.getByTestId('project-id').textContent).toBe('no-project-id');
    expect(screen.getByTestId('rpc-url').textContent).toBe('no-rpc-url');
    expect(screen.getByTestId('session-id').textContent).toBe('test-session-id');
  });

  it('should provide context values with all props', () => {
    render(
      <OnchainKitProvider
        chain={base}
        apiKey="test-api-key"
        projectId="test-project-id"
        rpcUrl="https://test.rpc.url"
      >
        <TestComponent />
      </OnchainKitProvider>,
    );

    expect(screen.getByTestId('api-key').textContent).toBe('test-api-key');
    expect(screen.getByTestId('project-id').textContent).toBe('test-project-id');
    expect(screen.getByTestId('rpc-url').textContent).toBe('https://test.rpc.url');
  });

  it('should call setOnchainKitConfig with correct values', () => {
    const config: AppConfig = {
      appearance: {
        mode: 'dark',
        theme: 'base',
      },
    };

    render(
      <OnchainKitProvider
        chain={base}
        apiKey="test-api-key"
        projectId="test-project-id"
        rpcUrl="https://test.rpc.url"
        config={config}
      >
        <TestComponent />
      </OnchainKitProvider>,
    );

    expect(setOnchainKitConfig).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      chain: base,
      config,
      projectId: 'test-project-id',
      rpcUrl: 'https://test.rpc.url',
    });
  });

  it('should throw OnchainKitConfigError when chain is missing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        // @ts-expect-error Testing invalid props
        <OnchainKitProvider>
          <TestComponent />
        </OnchainKitProvider>,
      );
    }).toThrow(OnchainKitConfigError);

    consoleError.mockRestore();
  });

  it('should throw OnchainKitConfigError when chain is invalid', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <OnchainKitProvider
          // @ts-expect-error Testing invalid props
          chain="invalid-chain"
        >
          <TestComponent />
        </OnchainKitProvider>,
      );
    }).toThrow(OnchainKitConfigError);

    consoleError.mockRestore();
  });

  it('should throw OnchainKitConfigError when apiKey is invalid', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <OnchainKitProvider
          chain={base}
          // @ts-expect-error Testing invalid props
          apiKey={123}
        >
          <TestComponent />
        </OnchainKitProvider>,
      );
    }).toThrow(OnchainKitConfigError);

    consoleError.mockRestore();
  });

  it('should throw OnchainKitConfigError when rpcUrl is invalid', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <OnchainKitProvider
          chain={base}
          rpcUrl="not-a-valid-url"
        >
          <TestComponent />
        </OnchainKitProvider>,
      );
    }).toThrow(OnchainKitConfigError);

    consoleError.mockRestore();
  });

  it('should provide MiniKit context when enabled', () => {
    const miniKitConfig: MiniKitOptions = {
      enabled: true,
      notificationProxyUrl: 'https://notifications.example.com',
    };

    render(
      <OnchainKitProvider chain={base} miniKit={miniKitConfig}>
        <div data-testid="child">Child Content</div>
      </OnchainKitProvider>,
    );

    expect(screen.getByTestId('minikit-provider')).toBeInTheDocument();
    expect(screen.getByTestId('minikit-provider').getAttribute('data-enabled')).toBe('true');
    expect(
      screen.getByTestId('minikit-provider').getAttribute('data-notification-proxy-url'),
    ).toBe('https://notifications.example.com');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should not nest MiniKitProvider when already inside one', () => {
    const TestChild = () => {
      return <div data-testid="test-child">Test Child</div>;
    };

    render(
      <OnchainKitProvider chain={base}>
        <TestChild />
      </OnchainKitProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
