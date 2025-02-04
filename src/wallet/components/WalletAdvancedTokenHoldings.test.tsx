import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletAdvancedTokenHoldings', () => {
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletAdvancedContext = {
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
    mockUseWalletAdvancedContext.mockReturnValue(
      defaultMockUseWalletAdvancedContext,
    );
  });

  it('does not render token lists with zero tokens', () => {
    render(<WalletAdvancedTokenHoldings />);

    expect(screen.queryByTestId('ockWalletAdvanced_TokenHoldings')).toBeNull();
  });

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      isFetchingPortfolioData: true,
    });

    render(<WalletAdvancedTokenHoldings />);

    const placeholder = screen.getByTestId(
      'ockWalletAdvanced_LoadingPlaceholder',
    );
    expect(placeholder).toHaveClass('my-2 h-44 w-80');
  });

  it('renders the WalletAdvancedTokenHoldings component with tokens when user has tokens and fetcher is not loading', () => {
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

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      tokenBalances: tokens,
    });

    render(<WalletAdvancedTokenHoldings />);

    expect(screen.getByTestId('ockWalletAdvanced_TokenHoldings')).toBeDefined();
  });

  it('trims whitespace from token names', () => {
    const tokens = [
      {
        address: '0x123',
        chainId: 1,
        symbol: 'SPACE',
        decimals: 18,
        image: 'test.png',
        name: '  Spaced Token  ',
        cryptoBalance: '1000000000000000000', // 1 token in wei
        fiatBalance: '100',
      },
    ];

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      tokenBalances: tokens,
    });

    render(<WalletAdvancedTokenHoldings />);

    expect(screen.getByText('Spaced Token')).toBeInTheDocument();
  });

  it('applies custom classNames when provided', () => {
    const tokens = [
      {
        address: '0x123',
        chainId: 1,
        symbol: 'TEST',
        decimals: 18,
        image: 'test.png',
        name: 'Test Token',
        cryptoBalance: '1000000000000000000',
        fiatBalance: '100',
      },
    ];

    const customClassNames = {
      container: 'custom-container',
      tokenDetails: {
        container: 'custom-token-details-container',
        tokenImage: 'custom-token-img',
        tokenName: 'custom-token-name',
        tokenBalance: 'custom-token-balance',
        fiatValue: 'custom-fiat-value',
      },
    };

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      tokenBalances: tokens,
    });

    render(<WalletAdvancedTokenHoldings classNames={customClassNames} />);

    const container = screen.getByTestId('ockWalletAdvanced_TokenHoldings');
    expect(container).toHaveClass('custom-container');

    const tokenImageContainer = screen.getByTestId(
      'ockWalletAdvanced_TokenDetails_TokenImage',
    );
    expect(tokenImageContainer).toHaveClass('custom-token-img');

    const tokenName = screen.getByText('Test Token');
    expect(tokenName).toHaveClass('custom-token-name');

    const tokenBalance = screen.getByText('1.00 TEST');
    expect(tokenBalance).toHaveClass('custom-token-balance');

    const fiatValue = screen.getByText('$100.00');
    expect(fiatValue).toHaveClass('custom-fiat-value');
  });
});
