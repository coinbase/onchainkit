import { useSwapContext } from '@/swap/components/SwapProvider';
import type { Token } from '@/token';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedSwap } from './WalletAdvancedSwap';
import { useWalletContext } from './WalletProvider';

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

vi.mock('@/swap/components/SwapAmountInput', () => ({
  SwapAmountInput: ({ className }: { className?: string }) => (
    <div data-testid="mock-SwapAmountInput" className={className} />
  ),
}));

vi.mock('@/swap/components/SwapButton', () => ({
  SwapButton: ({ className }: { className?: string }) => (
    <div data-testid="mock-SwapButton" className={className} />
  ),
}));

vi.mock('@/swap/components/SwapToggleButton', () => ({
  SwapToggleButton: ({ className }: { className?: string }) => (
    <div data-testid="mock-SwapToggleButton" className={className} />
  ),
}));

vi.mock('@/swap/components/SwapMessage', () => ({
  SwapMessage: ({ className }: { className?: string }) => (
    <div data-testid="mock-SwapMessage" className={className} />
  ),
}));

vi.mock('../../swap/components/SwapProvider', () => ({
  useSwapContext: vi.fn(),
  SwapProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

describe('WalletAdvancedSwap', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;
  const mockUseSwapContext = useSwapContext as ReturnType<typeof vi.fn>;
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletAdvancedContext = {
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
    mockUseWalletAdvancedContext.mockReturnValue(
      defaultMockUseWalletAdvancedContext,
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
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showSwap: true,
    });

    render(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByTestId('ockWalletAdvancedSwap')).toBeInTheDocument();
  });

  it('should render correctly based on isSwapClosing state', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      isSwapClosing: false,
    });

    const { rerender } = render(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByTestId('ockWalletAdvancedSwap')).toBeInTheDocument();
    expect(screen.getByTestId('ockWalletAdvancedSwap')).toHaveClass(
      'fade-in slide-in-from-right-5 linear animate-in duration-150',
    );

    mockUseWalletAdvancedContext.mockReturnValue({
      isSwapClosing: true,
    });
    rerender(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(screen.getByTestId('ockWalletAdvancedSwap')).toHaveClass(
      'fade-out slide-out-to-right-5 animate-out fill-mode-forwards ease-in-out',
    );
  });

  it('should close swap when back button is clicked', () => {
    const mockSetShowSwap = vi.fn();
    const mockSetIsSwapClosing = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showSwap: true,
      tokenHoldings: [tokens],
      setShowSwap: mockSetShowSwap,
      setIsSwapClosing: mockSetIsSwapClosing,
    });

    const { rerender } = render(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    const backButton = screen.getByRole('button', { name: /back button/i });
    fireEvent.click(backButton);
    expect(mockSetIsSwapClosing).toHaveBeenCalledWith(true);

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      tokenHoldings: [tokens],
      setShowSwap: mockSetShowSwap,
      setIsSwapClosing: mockSetIsSwapClosing,
      isSwapClosing: true,
    });

    rerender(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    const swapContainer = screen.getByTestId('ockWalletAdvancedSwap');
    fireEvent.animationEnd(swapContainer);

    expect(mockSetShowSwap).toHaveBeenCalledWith(false);
    expect(mockSetIsSwapClosing).toHaveBeenCalledWith(false);
  });

  it('should apply custom classNames to all elements', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showSwap: true,
    });

    const customClassNames = {
      container: 'custom-container',
      swapContainer: 'custom-swap',
      settings: {
        container: 'custom-settings',
        slippageTitle: 'custom-slippage-title',
        slippageDescription: 'custom-slippage-desc',
        slippageInput: 'custom-slippage-input',
      },
      fromAmountInput: 'custom-from-input',
      toggleButton: 'custom-toggle',
      toAmountInput: 'custom-to-input',
      swapButton: 'custom-swap-button',
      message: 'custom-message',
      toast: 'custom-toast',
    };

    render(
      <WalletAdvancedSwap
        config={{ maxSlippage: 1 }}
        from={[tokens[0]] as Token[]}
        to={[tokens[1]] as Token[]}
        onError={vi.fn()}
        onStatus={vi.fn()}
        onSuccess={vi.fn()}
        classNames={customClassNames}
      />,
    );

    const container = screen.getByTestId('ockWalletAdvancedSwap');
    expect(container).toHaveClass('custom-container');

    expect(screen.getAllByTestId('mock-SwapAmountInput')[0]).toHaveClass(
      'custom-from-input',
    );
    expect(screen.getAllByTestId('mock-SwapAmountInput')[1]).toHaveClass(
      'custom-to-input',
    );
    expect(screen.getByTestId('mock-SwapToggleButton')).toHaveClass(
      'custom-toggle',
    );
    expect(screen.getByTestId('mock-SwapButton')).toHaveClass(
      'custom-swap-button',
    );
    expect(screen.getByTestId('mock-SwapMessage')).toHaveClass(
      'custom-message',
    );
  });
});
