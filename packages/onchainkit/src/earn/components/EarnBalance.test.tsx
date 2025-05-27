import { EarnProvider, useEarnContext } from '@/earn/components/EarnProvider';
import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import type { EarnContextType } from '@/earn/types';
import type { MakeRequired } from '@/internal/types';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig, mock, useAccount } from 'wagmi';
import { useConfig } from 'wagmi';
import { EarnBalance } from './EarnBalance';

const baseContext: MakeRequired<EarnContextType, 'recipientAddress'> = {
  ...MOCK_EARN_CONTEXT,
  recipientAddress: '0x123' as Address,
};

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
    <QueryClientProvider client={queryClient}>
      <EarnProvider vaultAddress="0x123">{children}</EarnProvider>
    </QueryClientProvider>
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

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('./EarnProvider', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./EarnProvider')>()),
  useEarnContext: vi.fn(),
}));

describe('EarnBalance', () => {
  beforeEach(() => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
    (useConfig as Mock).mockReturnValue({});
  });
  it('renders the title and subtitle correctly', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={false}
        onActionPress={() => {}}
      />,
      { wrapper },
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders the action button when showAction is true', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={() => {}}
      />,
      { wrapper },
    );

    expect(screen.getByText('Use max')).toBeInTheDocument();
  });

  it('does not render the action button when showAction is false', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={false}
        onActionPress={() => {}}
      />,
      { wrapper },
    );

    expect(screen.queryByText('Use max')).not.toBeInTheDocument();
  });

  it('calls onActionPress when the action button is clicked', () => {
    const mockOnActionPress = vi.fn();

    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={mockOnActionPress}
      />,
      { wrapper },
    );

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mockOnActionPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';

    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        className={customClass}
        showAction={false}
        onActionPress={() => {}}
      />,
      { wrapper },
    );

    const container = screen.getByTestId('ockEarnBalance');
    expect(container).toHaveClass(customClass);
  });
});
