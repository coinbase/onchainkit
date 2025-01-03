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
  WalletIslandProvider: ({ children }) => <>{children}</>,
}));

vi.mock('./WalletIslandQrReceive', () => ({
  WalletIslandQrReceive: () => (
    <div data-testid="ockWalletIslandQrReceive">WalletIslandQrReceive</div>
  ),
}));

vi.mock('./WalletIslandSwap', () => ({
  WalletIslandSwap: () => (
    <div data-testid="ockWalletIslandSwap">WalletIslandSwap</div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
  });

  it('renders WalletIslandContent when isClosing is false', () => {
    mockUseWalletContext.mockReturnValue({ isClosing: false });

    render(<WalletIslandContent />);

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

  it('closes WalletIslandContent when isClosing is true', () => {
    mockUseWalletContext.mockReturnValue({ isClosing: true });

    render(<WalletIslandContent />);

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

  it('handles animation end when closing', () => {
    const setIsOpen = vi.fn();
    const setIsClosing = vi.fn();
    mockUseWalletContext.mockReturnValue({
      isClosing: true,
      setIsOpen,
      setIsClosing,
    });

    render(<WalletIslandContent />);

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

    render(<WalletIslandContent />);

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

    render(<WalletIslandContent />);

    expect(screen.getByTestId('ockWalletIslandSwap')).toBeDefined();
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).not.toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('correctly positions WalletIslandContent when there is enough space on the right', () => {
    const mockRect = {
      left: 100,
      right: 200,
      bottom: 450,
      height: 400,
    };
    const mockRef = { current: { getBoundingClientRect: () => mockRect } };

    window.innerWidth = 1000;
    window.innerHeight = 1000;

    mockUseWalletContext.mockReturnValue({
      isClosing: false,
    });

    render(<WalletIslandContent walletContainerRef={mockRef} />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      left: '100px',
    });
  });

  it('correctly positions WalletIslandContent when there is not enough space on the right', () => {
    const mockRect = {
      left: 300,
      right: 400,
      bottom: 450,
      height: 400,
    };
    const mockRef = { current: { getBoundingClientRect: () => mockRect } };

    window.innerWidth = 550;
    window.innerHeight = 1000;

    mockUseWalletContext.mockReturnValue({
      isClosing: false,
    });

    render(<WalletIslandContent walletContainerRef={mockRef} />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      left: '48px',
    });
  });

  it('correctly positions WalletIslandContent when there is enough space on the bottom', () => {
    const mockRect = {
      left: 300,
      right: 400,
      bottom: 450,
      height: 400,
    };
    const mockRef = { current: { getBoundingClientRect: () => mockRect } };

    window.innerWidth = 550;
    window.innerHeight = 1000;

    mockUseWalletContext.mockReturnValue({
      isClosing: false,
    });

    render(<WalletIslandContent walletContainerRef={mockRef} />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      top: '460px',
    });
  });

  it('correctly positions WalletIslandContent when there is not enough space on the bottom', () => {
    const mockRect = {
      left: 300,
      right: 400,
      bottom: 850,
      height: 400,
    };
    const mockRef = { current: { getBoundingClientRect: () => mockRect } };

    window.innerWidth = 550;
    window.innerHeight = 1000;

    mockUseWalletContext.mockReturnValue({
      isClosing: false,
    });

    render(<WalletIslandContent walletContainerRef={mockRef} />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      top: '46px',
    });
  });
});
