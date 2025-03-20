import { useOnchainKit } from '@/useOnchainKit';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  type Mock,
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useConnect, useConnectors } from 'wagmi';
import type { MetaMaskParameters } from 'wagmi/connectors';
import { WalletModal } from './WalletModal';

vi.mock('wagmi', () => ({
  useConnect: vi.fn(),
  useConnectors: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi/connectors', () => ({
  coinbaseWallet: () => ({ preference: 'all' }),
  metaMask: ({ dappMetadata }: MetaMaskParameters) => ({ dappMetadata }),
  injected: ({ target }: { target: string }) => ({
    target,
  }),
}));

vi.mock('../../internal/components/Dialog', () => ({
  Dialog: vi.fn(
    ({
      children,
      isOpen,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
    }) =>
      isOpen ? (
        <div
          role="dialog"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          {children}
        </div>
      ) : null,
  ),
}));

describe('WalletModal', () => {
  const mockConnect = vi.fn();
  const mockOnClose = vi.fn();
  const mockConnectors = [
    { type: 'smartWallet', name: 'Smart Wallet' },
    { type: 'coinbaseWallet', name: 'Coinbase Wallet' },
    { type: 'metaMask', name: 'MetaMask' },
  ];

  const originalWindowOpen = window.open;

  afterAll(() => {
    window.open = originalWindowOpen;
  });

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

  it('renders null when not open', () => {
    const { container } = render(
      <WalletModal isOpen={false} onClose={mockOnClose} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content correctly', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('passes correct props to Dialog component', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Connect Wallet');
  });

  it('handles focus management through Dialog component', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    expect(focusableElements.length).toBeGreaterThan(0);
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

  it('connects with MetaMask when clicking MetaMask button', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {
          name: 'Test App',
          logo: 'test-logo.png',
        },
        wallet: {},
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('MetaMask'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        dappMetadata: {
          name: 'Test App',
          url: window.location.origin,
          iconUrl: 'test-logo.png',
        },
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('uses default app name for MetaMask when no name provided', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {},
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('MetaMask'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        dappMetadata: {
          name: 'OnchainKit App',
          url: window.location.origin,
          iconUrl: undefined,
        },
      },
    });
  });

  it('handles MetaMask connection errors', () => {
    const mockError = new Error('MetaMask connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('MetaMask'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'MetaMask connection error:',
      mockError,
    );
  });

  it('handles non-Error objects in MetaMask connection errors', () => {
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('MetaMask'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
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

  it('renders terms and privacy links correctly', () => {
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

  it('renders terms and privacy links with correct attributes', () => {
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
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(privacyLink).toHaveAttribute('href', 'https://privacy.test');
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render when shouldRender is false', () => {
    const { container } = render(
      <WalletModal isOpen={false} onClose={mockOnClose} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('handles non-Error objects in MetaMask connection errors', () => {
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('MetaMask'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'MetaMask connection error:',
      'Some string error',
    );
  });

  it('connects with Phantom when clicking Phantom button', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Phantom'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        target: 'phantom',
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles Phantom connection errors', () => {
    const mockError = new Error('Phantom connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Phantom'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Phantom connection error:',
      mockError,
    );
  });

  it('handles non-Error objects in Phantom connection errors', () => {
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Phantom'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'Phantom connection error:',
      'Some string error',
    );
  });
});
