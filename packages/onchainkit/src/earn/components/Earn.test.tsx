import type { Call } from '@/transaction/types';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  mock,
  useAccount,
  useConfig,
} from 'wagmi';
import { Earn } from './Earn';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: () => 'mocked-theme-class',
}));

const queryClient = new QueryClient();

const mockConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useConfig: vi.fn(),
    useCapabilities: vi.fn(),
  };
});

vi.mock('@/transaction', () => ({
  Transaction: ({
    className,
    calls,
    children,
  }: {
    className: string;
    calls: Call[];
    children: React.ReactNode;
  }) => (
    <div
      data-testid="transaction"
      className={className}
      data-calls={JSON.stringify(calls)}
    >
      {children}
    </div>
  ),
  TransactionButton: ({ text }: { text: string }) => (
    <button data-testid="transaction-button" type="button">
      {text}
    </button>
  ),
}));

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('Earn Component', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
    (useConfig as Mock).mockReturnValue({});
  });

  it('renders custom children when provided', () => {
    const customChildren = <p>Custom Children</p>;
    render(<Earn vaultAddress="0x123">{customChildren}</Earn>, { wrapper });

    expect(screen.getByText('Custom Children')).toBeInTheDocument();
    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
  });

  it('renders default tabs and their contents when children are not provided', () => {
    const { container } = render(<Earn vaultAddress="0x123" />, { wrapper });

    const tabs = screen.getByTestId('ockTabs');
    expect(tabs).toBeInTheDocument();

    expect(container).toHaveTextContent('Deposit');
    expect(container).toHaveTextContent('Withdraw');
  });
});
