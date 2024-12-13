import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useSwapContext } from '../../../swap/components/SwapProvider';
import type { Token } from '../../../token';
import { useWalletContext } from '../WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandSwap } from './WalletIslandSwap';

const tokens = [
  {
    name: 'Ether',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
    balance: 0.42,
    valueInFiat: 1386,
  },
  {
    name: 'USD Coin',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjMZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
    balance: 69,
    valueInFiat: 69,
  },
];

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock(import('../../../swap'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    SwapAmountInput: () => <div data-testid="mock-SwapAmountInput" />,
    SwapButton: () => <div data-testid="mock-SwapButton" />,
    SwapMessage: () => <div data-testid="mock-SwapMessage" />,
    SwapSettings: ({ children }) => (
      <div data-testid="mock-SwapSettings">{children}</div>
    ),
    SwapSettingsSlippageDescription: () => (
      <div data-testid="mock-SwapSettingsSlippageDescription" />
    ),
    SwapSettingsSlippageInput: () => (
      <div data-testid="mock-SwapSettingsSlippageInput" />
    ),
    SwapSettingsSlippageTitle: () => (
      <div data-testid="mock-SwapSettingsSlippageTitle" />
    ),
    SwapToast: () => <div data-testid="mock-SwapToast" />,
    SwapToggleButton: () => <div data-testid="mock-SwapToggleButton" />,
  };
});

vi.mock('../../../swap/components/SwapProvider', () => ({
  useSwapContext: vi.fn(),
  SwapProvider: ({ children }) => <>{children}</>,
}));

vi.mock('../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
}));

describe('WalletIslandSwap', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;
  const mockUseSwapContext = useSwapContext as ReturnType<typeof vi.fn>;
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletIslandContext = {
    showSwap: false,
    setShowSwap: vi.fn(),
    setIsSwapClosing: vi.fn(),
    animationClasses: {
      swap: 'animate-slideInFromLeft',
    },
  };

  const defaultMockUseSwapContext = {
    address: '0x123',
    config: {},
    from: [tokens[0]],
    to: [tokens[1]],
    handleAmountChange: vi.fn(),
    handleToggle: vi.fn(),
    handleSubmit: vi.fn(),
    lifecycleStatus: {
      statusName: '',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 1,
      },
    },
    updateLifecycleStatus: vi.fn(),
    isToastVisible: false,
    setIsToastVisible: vi.fn(),
    setTransactionHash: vi.fn(),
    transactionHash: null,
  };

  beforeEach(() => {
    mockUseWalletContext.mockReturnValue({
      isOpen: true,
      isClosing: false,
    });
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
    mockUseSwapContext.mockReturnValue(defaultMockUseSwapContext);
    mockUseAccount.mockReturnValue({
      address: '0x123',
      chainId: 8453,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should render correctly', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
    });

    render(
      <WalletIslandSwap
        config={{}}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByTestId('ockWalletIslandSwap')).toBeInTheDocument();
  });

  it('should focus swapDivRef when showSwap is true', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
    });

    render(
      <WalletIslandSwap
        config={{}}
        from={[tokens[0].token] as Token[]}
        to={[tokens[1].token] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    const swapDiv = screen.getByTestId('ockWalletIslandSwap');
    expect(swapDiv).toHaveFocus();
  });

  it('should close swap when back button is clicked', () => {
    vi.useFakeTimers();

    const mockSetShowSwap = vi.fn();
    const mockSetIsSwapClosing = vi.fn();
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
      tokenHoldings: [tokens],
      setShowSwap: mockSetShowSwap,
      setIsSwapClosing: mockSetIsSwapClosing,
    });

    render(
      <WalletIslandSwap
        config={{}}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByTestId('ockWalletIslandSwap')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back button/i });
    fireEvent.click(backButton);
    expect(mockSetIsSwapClosing).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(200);
    expect(mockSetShowSwap).toHaveBeenCalledWith(false);

    vi.advanceTimersByTime(200);
    expect(mockSetIsSwapClosing).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  it('should set tabIndex to -1 when showSwap is true', () => {
    const mockSetShowSwap = vi.fn();
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
    });

    const { rerender } = render(
      <WalletIslandSwap
        config={{}}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByTestId('ockWalletIslandSwap')).toHaveAttribute(
      'tabindex',
      '-1',
    );

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: false,
      setShowSwap: mockSetShowSwap,
    });

    rerender(
      <WalletIslandSwap
        config={{}}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByTestId('ockWalletIslandSwap')).not.toHaveAttribute(
      'tabIndex',
    );
  });
});
