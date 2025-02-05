import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  WalletAdvancedQrReceiveProps,
  WalletAdvancedSwapProps,
} from '../types';
import { WalletAdvancedContent } from './WalletAdvancedContent';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

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

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletAdvancedContent', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletAdvancedContext = {
    showSwap: false,
    isSwapClosing: false,
    showQr: false,
    isQrClosing: false,
    tokenHoldings: [],
    animations: {
      container: '',
      content: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletAdvancedContext.mockReturnValue(
      defaultMockUseWalletAdvancedContext,
    );
  });

  it('renders WalletAdvancedContent with correct animations when isSubComponentClosing is false and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: false,
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedContent')).toHaveClass(
      'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('renders WalletAdvancedContent with correct animations when isSubComponentClosing is false and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      showSubComponentAbove: true,
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedContent')).toHaveClass(
      'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletAdvancedContent with correct animations when isSubComponentClosing is true and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: true,
      showSubComponentAbove: false,
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedContent')).toHaveClass(
      'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletAdvancedContent with correct animations when isSubComponentClosing is true and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: true,
      showSubComponentAbove: true,
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      animations: {
        container:
          'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedContent')).toHaveClass(
      'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('closes WalletAdvancedContent when mobile tray is closed', () => {
    const setIsSubComponentOpen = vi.fn();
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen,
      breakpoint: 'sm',
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    fireEvent.pointerDown(document.body);

    expect(setIsSubComponentOpen).toHaveBeenCalledWith(false);
  });

  it('handles animation end when closing', () => {
    const setIsSubComponentOpen = vi.fn();
    const setIsSubComponentClosing = vi.fn();
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen,
      isSubComponentClosing: true,
      setIsSubComponentClosing,
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    const content = screen.getByTestId('ockWalletAdvancedContent');
    fireEvent.animationEnd(content);

    expect(setIsSubComponentOpen).toHaveBeenCalledWith(false);
    expect(setIsSubComponentClosing).toHaveBeenCalledWith(false);
  });

  it('renders WalletAdvancedQrReceive when showQr is true', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showQr: true,
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedQrReceive')).toBeDefined();
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedSwap'),
    ).not.toBeInTheDocument();
  });

  it('renders WalletAdvancedSwap when showSwap is true', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showSwap: true,
    });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedSwap')).toBeDefined();
    expect(screen.queryByTestId('ockWalletAdvancedSwap')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockWalletAdvancedQrReceive'),
    ).not.toBeInTheDocument();
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

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showSwap: true,
      tokenBalances: mockTokenBalances,
    });

    mockUseWalletContext.mockReturnValue({ isSubComponentClosing: false });

    render(
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
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
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showQr: true,
      showSwap: false,
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
      <WalletAdvancedContent classNames={customClassNames}>
        <div>Content</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContent')).toHaveClass(
      'custom-container',
    );

    // Verify both rendered state and passed props
    const qrComponent = screen.getByTestId('ockWalletAdvancedQrReceive');
    expect(qrComponent).toHaveClass('custom-qr-container');
    expect(qrComponent).toHaveProperty('className', 'custom-qr-container');

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showQr: false,
      showSwap: true,
    });

    rerender(
      <WalletAdvancedContent classNames={customClassNames}>
        <div>Content</div>
      </WalletAdvancedContent>,
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
      <WalletAdvancedContent>
        <div>WalletAdvancedContent</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockBottomSheet')).toBeDefined();
  });

  it('applies custom classNames to BottomSheet when breakpoint is sm', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      breakpoint: 'sm',
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      showQr: true,
      showSwap: false,
    });

    const customClassNames = {
      container: 'custom-container',
    };

    render(
      <WalletAdvancedContent classNames={customClassNames}>
        <div>Content</div>
      </WalletAdvancedContent>,
    );

    expect(screen.getByTestId('ockBottomSheet')).toHaveClass(
      'custom-container',
    );
  });
});
