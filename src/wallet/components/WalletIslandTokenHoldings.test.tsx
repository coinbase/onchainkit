import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandTokenHoldings } from './WalletIslandTokenHoldings';

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletIslandTokenHoldings', () => {
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletIslandContext = {
    tokenBalances: [],
    portfolioFiatValue: 0,
    refetchPortfolioData: vi.fn(),
    isFetchingPortfolioData: false,
    portfolioDataUpdatedAt: new Date(),
    animations: {
      content: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
  });

  it('does not render token lists with zero tokens', () => {
    render(<WalletIslandTokenHoldings />);

    expect(screen.queryByTestId('ockWalletIsland_TokenHoldings')).toBeNull();
  });

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      isFetchingPortfolioData: true,
    });

    render(<WalletIslandTokenHoldings />);

    const placeholder = screen.getByTestId(
      'ockWalletIsland_LoadingPlaceholder',
    );
    expect(placeholder).toHaveClass('my-2 h-44 w-full');
  });

  it('renders the WalletIslandTokenHoldings component with tokens when user has tokens and fetcher is not loading', () => {
    const tokens = [
      {
        token: {
          name: 'Ether',
          address: '',
          symbol: 'ETH',
          decimals: 18,
          image:
            'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
          chainId: 8453,
        },
        balance: 0.42,
        valueInFiat: 1386,
      },
      {
        token: {
          name: 'USD Coin',
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          symbol: 'USDC',
          decimals: 6,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
          chainId: 8453,
        },
        balance: 69,
        valueInFiat: 69,
      },
      {
        token: {
          name: 'Ether',
          address: '',
          symbol: 'ETH',
          decimals: 18,
          image:
            'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
          chainId: 8453,
        },
        balance: 0.42,
        valueInFiat: 1386,
      },
    ];

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      tokenBalances: tokens,
    });

    render(<WalletIslandTokenHoldings />);

    expect(screen.getByTestId('ockWalletIsland_TokenHoldings')).toBeDefined();
  });

  it('trims whitespace from token names', () => {
    const tokens = [{
      address: '0x123',
      chainId: 1,
      symbol: 'SPACE',
      decimals: 18,
      image: 'test.png',
      name: '  Spaced Token  ',
      cryptoBalance: '1000000000000000000', // 1 token in wei
      fiatBalance: '100',
    }];

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      tokenBalances: tokens,
    });

    render(<WalletIslandTokenHoldings />);

    expect(screen.getByText('Spaced Token')).toBeInTheDocument();
  });
});
