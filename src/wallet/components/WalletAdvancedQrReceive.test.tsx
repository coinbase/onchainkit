import { useTheme } from '@/internal/hooks/useTheme';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletAdvancedQrReceive } from './WalletAdvancedQrReceive';
import { useWalletContext } from './WalletProvider';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
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

const defaultWalletContext = {
  isSubComponentOpen: true,
  isSubComponentClosing: false,
};

describe('WalletAdvancedQrReceive', () => {
  const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletAdvancedContext = {
    activeFeature: null,
    setActiveFeature: vi.fn(),
    isActiveFeatureClosing: false,
    setIsActiveFeatureClosing: vi.fn(),
    animationClasses: {
      qr: 'animate-slideInFromLeft',
    },
  };

  beforeEach(() => {
    mockUseTheme.mockReturnValue('');
    mockUseWalletContext.mockReturnValue({
      ...defaultWalletContext,
      ...defaultMockUseWalletAdvancedContext,
    });
    mockSetCopyText.mockClear();
    mockSetCopyButtonText.mockClear();
    mockClipboard.writeText.mockReset();
  });

  it('should render correctly based on isQrClosing state', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultWalletContext,
      isActiveFeatureClosing: false,
    });

    const { rerender } = render(<WalletAdvancedQrReceive />);
    expect(
      screen.getByTestId('ockWalletAdvancedQrReceive'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('ockWalletAdvancedQrReceive')).toHaveClass(
      'fade-in slide-in-from-left-5 linear animate-in duration-150',
    );

    mockUseWalletContext.mockReturnValue({
      isActiveFeatureClosing: true,
    });
    rerender(<WalletAdvancedQrReceive />);
    expect(screen.getByTestId('ockWalletAdvancedQrReceive')).toHaveClass(
      'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out',
    );
  });

  it('should close when back button is clicked', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultWalletContext,
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    const { rerender } = render(<WalletAdvancedQrReceive />);

    const backButton = screen.getByRole('button', { name: /back button/i });
    fireEvent.click(backButton);
    expect(
      defaultMockUseWalletAdvancedContext.setIsActiveFeatureClosing,
    ).toHaveBeenCalledWith(true);

    mockUseWalletContext.mockReturnValue({
      ...defaultWalletContext,
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
      isActiveFeatureClosing: true,
    });

    rerender(<WalletAdvancedQrReceive />);

    const qrContainer = screen.getByTestId('ockWalletAdvancedQrReceive');
    fireEvent.animationEnd(qrContainer);

    expect(
      defaultMockUseWalletAdvancedContext.setActiveFeature,
    ).toHaveBeenCalledWith(null);
    expect(
      defaultMockUseWalletAdvancedContext.setIsActiveFeatureClosing,
    ).toHaveBeenCalledWith(false);
  });

  it('should copy address when the copy icon is clicked', async () => {
    vi.useFakeTimers();

    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    render(<WalletAdvancedQrReceive />);

    const copyIcon = screen.getByRole('button', {
      name: 'Copy your address by clicking the icon',
    });

    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByRole('button', {
      name: 'Copy your address by clicking the tooltip',
    });
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
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    render(<WalletAdvancedQrReceive />);

    const copyTooltip = screen.getByRole('button', {
      name: 'Copy your address by clicking the tooltip',
    });

    await act(async () => {
      fireEvent.click(copyTooltip);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(mockSetCopyText).toHaveBeenCalledWith('Copied');

    const tooltip = screen.getByRole('button', {
      name: 'Copy your address by clicking the tooltip',
    });
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
      ...defaultMockUseWalletAdvancedContext,
      activeFeature: 'qr',
    });

    render(<WalletAdvancedQrReceive />);

    const copyButton = screen.getByRole('button', {
      name: 'Copy your address by clicking the button',
    });

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
    const copyIcon = screen.getByRole('button', {
      name: 'Copy your address by clicking the icon',
    });
    await act(async () => {
      fireEvent.click(copyIcon);
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(mockSetCopyText).toHaveBeenCalledWith('Failed to copy');

    vi.advanceTimersByTime(2000);

    mockSetCopyButtonText.mockClear();
    const copyButton = screen.getByRole('button', {
      name: 'Copy your address by clicking the button',
    });
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

    const copyIcon = screen.getByRole('button', {
      name: 'Copy your address by clicking the icon',
    });
    fireEvent.click(copyIcon);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('');
  });

  it('applies custom classNames to components', () => {
    mockUseWalletContext.mockReturnValue({
      isSubComponentClosing: false,
      address: '0x1234567890',
    });

    const customClassNames = {
      container: 'custom-container',
      header: 'custom-header',
      copyButton: 'custom-copy-button',
    };

    render(<WalletAdvancedQrReceive classNames={customClassNames} />);

    expect(screen.getByTestId('ockWalletAdvancedQrReceive')).toHaveClass(
      'custom-container',
    );
    expect(
      screen
        .getByTestId('ockWalletAdvancedQrReceive')
        .querySelector('[class*="custom-header"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Copy your address by clicking the button',
      }),
    ).toHaveClass('custom-copy-button');
  });
});
