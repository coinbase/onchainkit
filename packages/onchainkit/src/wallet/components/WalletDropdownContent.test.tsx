import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import type {
  WalletAdvancedQrReceiveProps,
  WalletAdvancedSwapProps,
} from '../types';
import { WalletDropdownContent } from './WalletDropdownContent';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAccount } from 'wagmi';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet/hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletAdvancedQrReceive', () => ({
  WalletAdvancedQrReceive: ({ classNames }: WalletAdvancedQrReceiveProps) => (
    <div
      data-testid="ockWalletAdvancedQrReceive"
      className={classNames?.container}
    >
      WalletAdvancedQrReceive
    </div>
  ),
}));

vi.mock('./WalletAdvancedSwap', () => ({
  WalletAdvancedSwap: ({ from, to, classNames }: WalletAdvancedSwapProps) => (
    <div
      data-testid="ockWalletAdvancedSwap"
      data-props={JSON.stringify({ from, to })}
      className={classNames?.container}
    >
      WalletAdvancedSwap
    </div>
  ),
}));

vi.mock('./wallet-advanced-send/components/Send', () => ({
  Send: ({ className }: { className?: string }) => (
    <div data-testid="ockWalletAdvancedSend" className={className}>
      WalletAdvancedSend
    </div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletDropdownContent', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletAdvancedContext = {
    activeFeature: null,
    isActiveFeatureClosing: false,
    tokenHoldings: [],
    animations: {
      container: '',
      content: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [],
      },
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
  });

  it('renders WalletDropdownContent with correct animations when isSubComponentClosing is false and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: false,
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletDropdownContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletDropdownContent')).toHaveClass(
      'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('renders WalletDropdownContent with correct animations when isSubComponentClosing is false and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: true,
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletDropdownContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletDropdownContent')).toHaveClass(
      'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletDropdownContent with correct animations when isSubComponentClosing is true and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: true,
      showSubComponentAbove: false,
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletDropdownContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletDropdownContent')).toHaveClass(
      'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletDropdownContent with correct animations when isSubComponentClosing is true and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: true,
      showSubComponentAbove: true,
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletDropdownContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletDropdownContent')).toHaveClass(
      'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletDropdownContent when mobile tray is closed', () => {
    const setIsSubComponentOpen = vi.fn();
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen,
      breakpoint: 'sm',
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    fireEvent.pointerDown(document.body);

    expect(setIsSubComponentOpen).toHaveBeenCalledWith(false);
  });

  it('handles animation end when closing', () => {
    const setIsSubComponentOpen = vi.fn();
    const setIsSubComponentClosing = vi.fn();
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      isSubComponentOpen: true,
      setIsSubComponentOpen,
      isSubComponentClosing: true,
      setIsSubComponentClosing,
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    const content = screen.getByTestId('ockWalletDropdownContent');
    fireEvent.animationEnd(content);

    expect(setIsSubComponentOpen).toHaveBeenCalledWith(false);
    expect(setIsSubComponentClosing).toHaveBeenCalledWith(false);
  });

  it('renders WalletAdvancedQrReceive when activeFeature is qr', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedQrReceive')).toBeDefined();
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSend'),
    ).not.toBeInTheDocument();
  });

  it('renders WalletAdvancedSwap when activeFeature is swap', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'swap',
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedSwap')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedSwap')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSend'),
    ).not.toBeInTheDocument();
  });

  it('renders WalletAdvancedSend when activeFeature is send', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'send',
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedSend')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedSend')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('handles empty tokenBalances gracefully', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: null,
      },
    });

    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'swap',
      isSubComponentClosing: false,
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    const swapComponent = screen.getByTestId('ockWalletAdvancedSwap');
    const props = JSON.parse(
      swapComponent.getAttribute('data-props') as string,
    );

    expect(props.from).toEqual([]);
  });

  it('correctly maps token balances to the swap component', () => {
    const mockTokenBalances = [
      {
        address: '0x123',
        chainId: 1,
        symbol: 'TEST',
        decimals: 18,
        image: 'test.png',
        name: 'Test Token',
      },
      {
        address: '0x456',
        chainId: 2,
        symbol: 'TEST2',
        decimals: 6,
        image: 'test2.png',
        name: 'Test Token 2',
      },
    ];

    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: mockTokenBalances,
      },
    });

    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'swap',
      isSubComponentClosing: false,
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    const swapComponent = screen.getByTestId('ockWalletAdvancedSwap');
    const props = JSON.parse(
      swapComponent.getAttribute('data-props') as string,
    );

    expect(props.from).toEqual(
      mockTokenBalances.map((token) => ({
        address: token.address,
        chainId: token.chainId,
        symbol: token.symbol,
        decimals: token.decimals,
        image: token.image,
        name: token.name,
      })),
    );
  });

  it('applies custom classNames to components', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: false,
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    const customClassNames = {
      container: 'custom-container',
      qr: {
        container: 'custom-qr-container',
      },
      swap: {
        container: 'custom-swap-container',
      },
    };

    const { rerender } = render(
      <WalletDropdownContent classNames={customClassNames}>
        <div>Content</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockWalletDropdownContent')).toHaveClass(
      'custom-container',
    );

    // Verify both rendered state and passed props
    const qrComponent = screen.getByTestId('ockWalletAdvancedQrReceive');
    expect(qrComponent).toHaveClass('custom-qr-container');
    expect(qrComponent).toHaveProperty('className', 'custom-qr-container');

    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: false,
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'swap',
    });

    rerender(
      <WalletDropdownContent classNames={customClassNames}>
        <div>Content</div>
      </WalletDropdownContent>,
    );

    const swapComponent = screen.getByTestId('ockWalletAdvancedSwap');
    expect(swapComponent).toHaveClass('custom-swap-container');
    expect(swapComponent).toHaveProperty('className', 'custom-swap-container');
  });

  it('renders BottomSheet when breakpoint is sm', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      isSubComponentClosing: false,
      breakpoint: 'sm',
    });

    render(
      <WalletDropdownContent>
        <div>WalletDropdownContent</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockBottomSheet')).toBeDefined();
  });

  it('applies custom classNames to BottomSheet when breakpoint is sm', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      breakpoint: 'sm',
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    const customClassNames = {
      container: 'custom-container',
    };

    render(
      <WalletDropdownContent classNames={customClassNames}>
        <div>Content</div>
      </WalletDropdownContent>,
    );

    expect(screen.getByTestId('ockBottomSheet')).toHaveClass(
      'custom-container',
    );
  });
});
