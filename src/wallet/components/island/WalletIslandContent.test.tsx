import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletContext } from '../WalletProvider';
import { WalletIslandContent } from './WalletIslandContent';
import { useWalletIslandContext } from './WalletIslandProvider';

vi.mock('../WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
}));

vi.mock('../../../useTheme', () => ({
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

describe('WalletIslandContent', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders WalletIslandContent when isClosing is false', () => {
    mockUseWalletContext.mockReturnValue({ isClosing: false });
    mockUseWalletIslandContext.mockReturnValue({
      showQr: false,
      showSwap: false,
      tokenHoldings: [],
    });

    render(<WalletIslandContent />);

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'animate-walletIslandContainerIn',
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
    mockUseWalletIslandContext.mockReturnValue({
      showQr: false,
      showSwap: false,
      tokenHoldings: [],
    });

    render(<WalletIslandContent />);

    expect(screen.getByTestId('ockWalletIslandContent')).toBeDefined();
    expect(screen.queryByTestId('ockWalletIslandContent')).toHaveClass(
      'animate-walletIslandOut',
    );
    expect(
      screen.queryByTestId('ockWalletIslandQrReceive')?.parentElement,
    ).toHaveClass('hidden');
    expect(
      screen.queryByTestId('ockWalletIslandSwap')?.parentElement,
    ).toHaveClass('hidden');
  });

  it('renders WalletIslandQrReceive when showQr is true', () => {
    mockUseWalletIslandContext.mockReturnValue({
      showQr: true,
      showSwap: false,
      tokenHoldings: [],
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
      showQr: false,
      showSwap: true,
      tokenHoldings: [],
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
      containerRef: mockRef,
    });

    render(<WalletIslandContent />);

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
      containerRef: mockRef,
    });

    render(<WalletIslandContent />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      left: '16px',
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
      containerRef: mockRef,
    });

    render(<WalletIslandContent />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      top: '455px',
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
      containerRef: mockRef,
    });

    render(<WalletIslandContent />);

    const draggable = screen.getByTestId('ockDraggable');
    expect(draggable).toHaveStyle({
      top: '51px',
    });
  });
});
