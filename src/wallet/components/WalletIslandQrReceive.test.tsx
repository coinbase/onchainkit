import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedQrReceive } from './WalletAdvancedQrReceive';
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

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockSetCopyText = vi.fn();
const mockSetCopyButtonText = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi
      .fn()
      .mockImplementation((init) => [
        init,
        init === 'Copy' ? mockSetCopyText : mockSetCopyButtonText,
      ]),
  };
});

const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  configurable: true,
});

describe('WalletIslandQrReceive', () => {
  const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletIslandContext = {
    showQr: false,
    setShowQr: vi.fn(),
    animationClasses: {
      qr: 'animate-slideInFromLeft',
    },
  };

  beforeEach(() => {
    mockUseTheme.mockReturnValue('');
    mockUseWalletContext.mockReturnValue({
      isSubComponentOpen: true,
      isSubComponentClosing: false,
    });
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
    mockSetCopyText.mockClear();
    mockSetCopyButtonText.mockClear();
    mockClipboard.writeText.mockReset();
  });

  it('should render correctly based on isClosing state', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: true,
    });

    const { rerender } = render(<WalletAdvancedQrReceive />);
    expect(screen.queryByTestId('ockWalletIslandQrReceive')).toBeNull();

    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
    });
    rerender(<WalletAdvancedQrReceive />);
    expect(screen.getByTestId('ockWalletIslandQrReceive')).toBeInTheDocument();
  });

  it('should render correctly based on isQrClosing state', () => {
    mockUseWalletIslandContext.mockReturnValue({
      isQrClosing: false,
    });

    const { rerender } = render(<WalletAdvancedQrReceive />);
    expect(screen.getByTestId('ockWalletIslandQrReceive')).toBeInTheDocument();
    expect(screen.getByTestId('ockWalletIslandQrReceive')).toHaveClass(
      'fade-in slide-in-from-left-5 linear animate-in duration-150',
    );

    mockUseWalletIslandContext.mockReturnValue({
      isQrClosing: true,
    });
    rerender(<WalletAdvancedQrReceive />);
    expect(screen.getByTestId('ockWalletIslandQrReceive')).toHaveClass(
      'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out',
    );
  });

  it('should close when back button is clicked', () => {
    const mockSetShowQr = vi.fn();
    const mockSetIsQrClosing = vi.fn();
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
      setShowQr: mockSetShowQr,
      setIsQrClosing: mockSetIsQrClosing,
    });

    const { rerender } = render(<WalletAdvancedQrReceive />);

    const backButton = screen.getByRole('button', { name: /back button/i });
    fireEvent.click(backButton);
    expect(mockSetIsQrClosing).toHaveBeenCalledWith(true);

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
      setShowQr: mockSetShowQr,
      setIsQrClosing: mockSetIsQrClosing,
      isQrClosing: true,
    });

    rerender(<WalletAdvancedQrReceive />);

    const qrContainer = screen.getByTestId('ockWalletIslandQrReceive');
    fireEvent.animationEnd(qrContainer);

    expect(mockSetShowQr).toHaveBeenCalledWith(false);
    expect(mockSetIsQrClosing).toHaveBeenCalledWith(false);
  });

  it('should copy address when the copy icon is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
    });

    render(<WalletAdvancedQrReceive />);

    const copyIcon = screen.getByTestId('ockWalletIslandQrReceive_CopyIcon');

    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByTestId('ockWalletIslandQrReceive_CopyTooltip');
    expect(tooltip).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyText).toHaveBeenCalledWith('Copy');

    expect(mockSetCopyButtonText.mock.calls.length).toBe(1); // setCopyButtonText is only called at initial render

    vi.useRealTimers();
  });

  it('should copy address when the copy tooltip is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
    });

    render(<WalletAdvancedQrReceive />);

    const copyTooltip = screen.getByTestId(
      'ockWalletIslandQrReceive_CopyTooltip',
    );

    await act(async () => {
      fireEvent.click(copyTooltip);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByTestId('ockWalletIslandQrReceive_CopyTooltip');
    expect(tooltip).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyText).toHaveBeenCalledWith('Copy');

    expect(mockSetCopyButtonText.mock.calls.length).toBe(1); // setCopyButtonText is only called at initial render

    vi.useRealTimers();
  });

  it('should copy address when the copy button is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      showQr: true,
    });

    render(<WalletAdvancedQrReceive />);

    const copyButton = screen.getByTestId(
      'ockWalletIslandQrReceive_CopyButton',
    );

    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyButtonText).toHaveBeenCalledWith('Address copied');

    vi.advanceTimersByTime(2000);
    expect(mockSetCopyButtonText).toHaveBeenCalledWith('Copy address');

    expect(mockSetCopyText.mock.calls.length).toBe(1); // setCopyText is only called at initial render

    vi.useRealTimers();
  });

  it('should handle clipboard errors gracefully', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
    });

    render(<WalletAdvancedQrReceive />);

    mockSetCopyText.mockClear();
    const copyIcon = screen.getByTestId('ockWalletIslandQrReceive_CopyIcon');
    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockSetCopyText).toHaveBeenCalledWith('Failed to copy');

    vi.advanceTimersByTime(2000);

    mockSetCopyButtonText.mockClear();
    const copyButton = screen.getByTestId(
      'ockWalletIslandQrReceive_CopyButton',
    );
    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockSetCopyButtonText).toHaveBeenCalledWith(
      'Failed to copy address',
    );

    vi.useRealTimers();
  });

  it('should copy empty string when address is empty', () => {
    mockUseWalletContext.mockReturnValue({
      address: undefined,
    });

    render(<WalletAdvancedQrReceive />);

    const copyIcon = screen.getByTestId('ockWalletIslandQrReceive_CopyIcon');
    fireEvent.click(copyIcon);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('');
  });
});
