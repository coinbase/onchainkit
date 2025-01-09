import type { SwapDefaultReact } from '@/swap/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletIslandContent } from './WalletIslandContent';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletIslandQrReceive', () => ({
  WalletIslandQrReceive: () => (
    <div data-testid="ockWalletIslandQrReceive">WalletIslandQrReceive</div>
  ),
}));

vi.mock('./WalletIslandSwap', () => ({
  WalletIslandSwap: ({ from, to }: SwapDefaultReact) => (
    <div
      data-testid="ockWalletIslandSwap"
      data-props={JSON.stringify({ from, to })}
    >
      WalletIslandSwap
    </div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletIslandContent', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletIslandContext = {
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
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
  });

  it('renders WalletIslandContent with correct animations when isClosing is false and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      showSubComponentAbove: false,
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      animations: {
        container:
          'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('renders WalletIslandContent with correct animations when isClosing is false and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      showSubComponentAbove: true,
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      animations: {
        container:
          'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
        content:
          'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
      },
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
    );
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('closes WalletIslandContent with correct animations when isClosing is true and showSubComponentAbove is false', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: true,
      showSubComponentAbove: false,
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      animations: {
        container:
          'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('closes WalletIslandContent with correct animations when isClosing is true and showSubComponentAbove is true', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: true,
      showSubComponentAbove: true,
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      animations: {
        container:
          'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
        content: '',
      },
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
    );
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('handles animation end when closing', () => {
    const setIsOpen = vi.fn();
    const setIsClosing = vi.fn();
    mockUseWalletContext.mockReturnValue({
      isClosing: true,
      setIsOpen,
      setIsClosing,
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    const content = screen.getByTestId('ockWalletIslandContent');
    fireEvent.animationEnd(content);

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(setIsClosing).toHaveBeenCalledWith(false);
  });

  it('renders WalletIslandQrReceive when showQr is true', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandQrReceive')).toBeDefined();
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).not.toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('renders WalletIslandSwap when showSwap is true', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
    });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    expect(screen.getByTestId('ockWalletIslandSwap')).toBeDefined();
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).not.toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
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

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showSwap: true,
      tokenBalances: mockTokenBalances,
    });

    mockUseWalletContext.mockReturnValue({ isClosing: false });

    render(
      <WalletIslandContent>
        <div>WalletIslandContent</div>
      </WalletIslandContent>,
    );

    const swapComponent = screen.getByTestId('ockWalletIslandSwap');
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
});
