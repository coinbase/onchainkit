import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnect, useConnectors } from 'wagmi';
import { useOnchainKit } from '../../useOnchainKit';
import { WalletModal } from './WalletModal';

vi.mock('wagmi', () => ({
  useConnect: vi.fn(),
  useConnectors: vi.fn(),
}));

vi.mock('../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

describe('WalletModal', () => {
  const mockConnect = vi.fn();
  const mockOnClose = vi.fn();
  const mockConnectors = [
    { id: 'smartWallet', name: 'Smart Wallet' },
    { id: 'coinbaseWallet', name: 'Coinbase Wallet' },
    { id: 'walletConnect', name: 'WalletConnect' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useConnect as Mock).mockReturnValue({ connect: mockConnect });
    (useConnectors as Mock).mockReturnValue(mockConnectors);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {},
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders null when not open and animation completed', () => {
    const { container } = render(
      <WalletModal isOpen={false} onClose={mockOnClose} />,
    );

    vi.advanceTimersByTime(100);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when open', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    expect(screen.getByText('Other wallets')).toBeInTheDocument();
  });

  it('renders app logo and name when provided', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {
          logo: 'test-logo.png',
          name: 'Test App',
        },
        wallet: {},
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByAltText('Test App icon')).toBeInTheDocument();
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('connects smart wallet when clicking Sign up', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: mockConnectors[0],
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('connects Coinbase wallet when clicking Coinbase Wallet', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Coinbase Wallet'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: mockConnectors[1],
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('connects WalletConnect when clicking Other wallets', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Other wallets'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: mockConnectors[2],
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when clicking overlay', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const overlay = screen.getByTestId('ockModalOverlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when clicking close button', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders terms and privacy links when URLs provided', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          termsUrl: 'https://terms.test',
          privacyUrl: 'https://privacy.test',
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const termsLink = screen.getByText('Terms of Service');
    const privacyLink = screen.getByText('Privacy Policy');

    expect(termsLink).toHaveAttribute('href', 'https://terms.test');
    expect(privacyLink).toHaveAttribute('href', 'https://privacy.test');
  });

  it('applies custom className when provided', () => {
    render(
      <WalletModal
        isOpen={true}
        onClose={mockOnClose}
        className="custom-class"
      />,
    );

    const overlay = screen.getByTestId('ockModalOverlay');
    expect(overlay).toHaveClass('custom-class');
  });

  it('handles case when WalletConnect connector is not found', () => {
    const mockConnectorsWithoutWC = [
      { id: 'smartWallet', name: 'Smart Wallet' },
      { id: 'coinbaseWallet', name: 'Coinbase Wallet' },
      { id: 'other', name: 'Other' },
    ];
    (useConnectors as Mock).mockReturnValue(mockConnectorsWithoutWC);

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Other wallets'));

    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('applies correct animation classes based on isOpen state', () => {
    const { rerender } = render(
      <WalletModal isOpen={true} onClose={mockOnClose} />,
    );

    // Check open state
    const overlay = screen.getByTestId('ockModalOverlay');
    const modal = overlay.children[0];

    expect(overlay).toHaveClass('animate-fadeIn');
    expect(modal).toHaveClass('animate-fadeIn');

    // Check closing state
    rerender(<WalletModal isOpen={false} onClose={mockOnClose} />);

    expect(overlay).toHaveClass('animate-fadeOut');
    expect(modal).toHaveClass('animate-fadeOut');
  });

  it('uses "App" as fallback in alt text when appName is not provided', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {
          logo: 'test-logo.png',
        },
        wallet: {},
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByAltText('App icon')).toBeInTheDocument();
  });

  it('propagates className to both overlay and modal', () => {
    const customClass = 'my-custom-class';
    render(
      <WalletModal
        isOpen={true}
        onClose={mockOnClose}
        className={customClass}
      />,
    );

    const overlay = screen.getByTestId('ockModalOverlay');
    expect(overlay).toHaveClass(customClass, 'bg-black/70');
  });

  it('closes modal on Enter, Space, or Escape key press', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);
    const overlay = screen.getByTestId('ockModalOverlay');

    fireEvent.keyDown(overlay, { key: 'Enter' });
    expect(mockOnClose).toHaveBeenCalled();

    mockOnClose.mockClear();

    fireEvent.keyDown(overlay, { key: ' ' });
    expect(mockOnClose).toHaveBeenCalled();

    mockOnClose.mockClear();

    fireEvent.keyDown(overlay, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
