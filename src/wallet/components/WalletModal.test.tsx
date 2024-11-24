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

// Mock the coinbaseWallet function
vi.mock('wagmi/connectors', () => ({
  coinbaseWallet: () => ({ preference: 'all' }),
}));

describe('WalletModal', () => {
  const mockConnect = vi.fn();
  const mockOnClose = vi.fn();
  const mockConnectors = [
    { type: 'smartWallet', name: 'Smart Wallet' },
    { type: 'coinbaseWallet', name: 'Coinbase Wallet' },
    { type: 'walletConnect', name: 'WalletConnect' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
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

  it('connects with Coinbase Wallet when clicking Sign up', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: { preference: 'all' },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('connects WalletConnect when clicking Other wallets', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Other wallets'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: mockConnectors.find((c) => c.type === 'walletConnect'),
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

  it('applies correct transition classes based on isOpen state', () => {
    const { rerender } = render(
      <WalletModal isOpen={true} onClose={mockOnClose} />,
    );

    const overlay = screen.getByTestId('ockModalOverlay');
    const modal = overlay.children[0];

    expect(overlay).toHaveClass('opacity-100');
    expect(modal).toHaveClass('opacity-100');

    rerender(<WalletModal isOpen={false} onClose={mockOnClose} />);

    expect(overlay).toHaveClass('opacity-0');
    expect(modal).toHaveClass('opacity-0');
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

  it('handles Coinbase Wallet connection errors', () => {
    const mockError = new Error('Connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Coinbase Wallet connection error:',
      mockError,
    );
  });

  it('handles non-Error objects in Coinbase Wallet connection errors', () => {
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
  });

  it('updates shouldRender state when isOpen changes', () => {
    const { rerender } = render(
      <WalletModal isOpen={false} onClose={mockOnClose} />,
    );

    // Initially not rendered
    expect(screen.queryByTestId('ockModalOverlay')).not.toBeInTheDocument();

    // Open modal
    rerender(<WalletModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('ockModalOverlay')).toBeInTheDocument();

    // Close modal and trigger animation end
    rerender(<WalletModal isOpen={false} onClose={mockOnClose} />);
    const overlay = screen.getByTestId('ockModalOverlay');
    fireEvent.transitionEnd(overlay);
    expect(screen.queryByTestId('ockModalOverlay')).not.toBeInTheDocument();
  });

  it('handles WalletConnect connection errors', () => {
    const mockError = new Error('WalletConnect connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });
    (useConnectors as Mock).mockReturnValue([
      { type: 'walletConnect', name: 'WalletConnect' },
    ]);

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Other wallets'));

    expect(console.error).toHaveBeenCalledWith(
      'WalletConnect connection error:',
      mockError,
    );
  });
});
