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
import { checkWalletAndRedirect } from '../utils/checkWalletAndRedirect';

vi.mock('wagmi', () => ({
  useConnect: vi.fn(),
  useConnectors: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi/connectors', () => ({
  baseAccount: ({
    appName,
    appLogoUrl,
  }: {
    appName?: string;
    appLogoUrl?: string;
  }) => ({ appName, appLogoUrl }),
  coinbaseWallet: () => ({ preference: 'all' }),
  metaMask: ({ dappMetadata }: MetaMaskParameters) => ({ dappMetadata }),
  injected: ({ target }: { target?: string } = {}) =>
    target ? { target } : {},
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

vi.mock('../utils/checkWalletAndRedirect', () => ({
  checkWalletAndRedirect: vi.fn(),
  redirectToWalletInstall: vi.fn(),
}));

vi.mock('@/internal/hooks/usePreferredColorScheme', () => ({
  usePreferredColorScheme: vi.fn().mockReturnValue('light'),
}));

interface WindowWithPhantom extends Window {
  phantom?: {
    ethereum?: {
      isPhantom?: boolean;
    };
  };
}

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
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });
    (checkWalletAndRedirect as Mock).mockImplementation(() => true);
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
        wallet: {
          supportedWallets: { rabby: false },
        },
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
        wallet: {
          supportedWallets: { rabby: false },
        },
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
        wallet: {
          supportedWallets: { rabby: false },
        },
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
          supportedWallets: { rabby: false },
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
        wallet: {
          supportedWallets: { rabby: false },
        },
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
          supportedWallets: { rabby: false },
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
          supportedWallets: { rabby: false },
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
    const originalEthereum = window.ethereum;
    window.ethereum = { isPhantom: true };

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Phantom'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        target: 'phantom',
      },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('connects with Phantom when only window.phantom is available', () => {
    const originalEthereum = window.ethereum;
    const originalPhantom = (window as WindowWithPhantom).phantom;

    window.ethereum = { isMetaMask: true };
    (window as WindowWithPhantom).phantom = { ethereum: { isPhantom: true } };

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Phantom'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        target: 'phantom',
      },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
    (window as WindowWithPhantom).phantom = originalPhantom;
  });

  it('handles Phantom connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isPhantom: true };

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

    window.ethereum = originalEthereum;
  });

  it('handles non-Error objects in Phantom connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isPhantom: true };

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

    window.ethereum = originalEthereum;
  });

  it('connects with Rabby when clicking Rabby button', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isRabby: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Rabby'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        target: 'rabby',
      },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('handles Rabby connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isRabby: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    const mockError = new Error('Rabby connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Rabby'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Rabby connection error:',
      mockError,
    );

    window.ethereum = originalEthereum;
  });

  it('handles non-Error objects in Rabby connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isRabby: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Rabby'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'Rabby connection error:',
      'Some string error',
    );

    window.ethereum = originalEthereum;
  });

  it('does not show Rabby when disabled in config', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.queryByText('Rabby')).not.toBeInTheDocument();
  });

  it('shows only enabled wallets based on config', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    const { rerender } = render(
      <WalletModal isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('Phantom')).toBeInTheDocument();
    expect(screen.getByText('Rabby')).toBeInTheDocument();

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });

    rerender(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.queryByText('Rabby')).not.toBeInTheDocument();

    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('Phantom')).toBeInTheDocument();
  });

  it('correctly filters wallets based on supportedWallets config', () => {
    const configs = [{ rabby: true }, { rabby: false }, {}];

    const expectedWalletCounts = [5, 4, 4];

    configs.forEach((supportedWallets, index) => {
      (useOnchainKit as Mock).mockReturnValue({
        config: {
          appearance: {},
          wallet: { supportedWallets },
        },
      });

      const { container, unmount } = render(
        <WalletModal isOpen={true} onClose={mockOnClose} />,
      );

      const walletButtons = Array.from(
        container.querySelectorAll('button'),
      ).filter(
        (button) =>
          button.textContent !== 'Sign up' &&
          !button.getAttribute('aria-label')?.includes('Close'),
      );

      expect(walletButtons.length).toBe(expectedWalletCounts[index]);

      if (supportedWallets.rabby === true) {
        expect(screen.getByText('Rabby')).toBeInTheDocument();
      } else {
        expect(screen.queryByText('Rabby')).not.toBeInTheDocument();
      }

      expect(screen.getByText('Base')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
      expect(screen.getByText('Phantom')).toBeInTheDocument();

      unmount();
    });
  });

  it('displays wallet options in correct order', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const walletButtons = Array.from(screen.getAllByRole('button')).filter(
      (button) =>
        button.textContent !== 'Sign up' &&
        !button.getAttribute('aria-label')?.includes('Close'),
    );

    expect(walletButtons[0].textContent).toContain('Base');
    expect(walletButtons[1].textContent).toContain('Coinbase Wallet');
    expect(walletButtons[2].textContent).toContain('MetaMask');
    expect(walletButtons[3].textContent).toContain('Phantom');
    expect(walletButtons[4].textContent).toContain('Rabby');

    expect(walletButtons.length).toBe(5);
  });

  it('renders Trust Wallet button when enabled in config', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: true,
            frame: false,
          },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Trust Wallet')).toBeInTheDocument();
  });

  it('renders Frame Wallet button when enabled in config', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: false,
            frame: true,
          },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Frame')).toBeInTheDocument();
  });

  it('connects with Trust Wallet when clicking Trust Wallet button', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isTrustWallet: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: true,
            frame: false,
          },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Trust Wallet'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: { target: 'trust' },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('connects with Frame when clicking Frame button', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isFrame: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: false,
            frame: true,
          },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Frame'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {},
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('handles Trust Wallet connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isTrustWallet: true };

    const mockError = new Error('Trust Wallet connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: true,
            frame: false,
          },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Trust Wallet'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Trust Wallet connection error:',
      mockError,
    );

    window.ethereum = originalEthereum;
  });

  it('handles non-Error objects in Trust Wallet connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isTrustWallet: true };

    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: true,
            frame: false,
          },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Trust Wallet'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'Trust Wallet connection error:',
      'Some string error',
    );

    window.ethereum = originalEthereum;
  });

  it('handles Frame Wallet connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isFrame: true };

    const mockError = new Error('Frame Wallet connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: false,
            frame: true,
          },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Frame'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Frame Wallet connection error:',
      mockError,
    );

    window.ethereum = originalEthereum;
  });

  it('handles non-Error objects in Frame Wallet connection errors', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isFrame: true };

    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: {
            rabby: false,
            trust: false,
            frame: true,
          },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Frame'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'Frame Wallet connection error:',
      'Some string error',
    );

    window.ethereum = originalEthereum;
  });

  it('redirects to wallet installation when wallet is not installed', () => {
    const mockOnError = vi.fn();
    (checkWalletAndRedirect as Mock).mockImplementation(() => false);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false, trust: false, frame: false },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Phantom'));

    expect(checkWalletAndRedirect).toHaveBeenCalledWith('phantom');
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('redirects to Rabby wallet installation when Rabby is not installed', () => {
    const mockOnError = vi.fn();
    (checkWalletAndRedirect as Mock).mockImplementation(() => false);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true, trust: false, frame: false },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Rabby'));

    expect(checkWalletAndRedirect).toHaveBeenCalledWith('rabby');
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('redirects to Trust Wallet installation when Trust Wallet is not installed', () => {
    const mockOnError = vi.fn();
    (checkWalletAndRedirect as Mock).mockImplementation(() => false);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false, trust: true, frame: false },
        },
      },
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Trust Wallet'));

    expect(checkWalletAndRedirect).toHaveBeenCalledWith('trust');
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it('connects with Rabby when wallet is installed', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isRabby: true };

    (checkWalletAndRedirect as Mock).mockImplementation(() => true);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true, trust: false, frame: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Rabby'));

    expect(checkWalletAndRedirect).toHaveBeenCalledWith('rabby');
    expect(mockConnect).toHaveBeenCalledWith({
      connector: { target: 'rabby' },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('connects with Trust Wallet when wallet is installed', () => {
    const originalEthereum = window.ethereum;
    window.ethereum = { isTrustWallet: true };

    (checkWalletAndRedirect as Mock).mockImplementation(() => true);
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false, trust: true, frame: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Trust Wallet'));

    expect(checkWalletAndRedirect).toHaveBeenCalledWith('trust');
    expect(mockConnect).toHaveBeenCalledWith({
      connector: { target: 'trust' },
    });
    expect(mockOnClose).toHaveBeenCalled();

    window.ethereum = originalEthereum;
  });

  it('redirects to Frame Wallet download page when Frame is not installed', () => {
    const originalEthereum = window.ethereum;
    const originalWindowOpen = window.open;
    const mockWindowOpen = vi.fn();
    window.open = mockWindowOpen;

    window.ethereum = { isMetaMask: true };

    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false, trust: false, frame: true },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Frame'));

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://frame.sh/download',
      '_blank',
    );
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockConnect).not.toHaveBeenCalled();

    window.ethereum = originalEthereum;
    window.open = originalWindowOpen;
  });

  it('does not show Sign Up button when signUpEnabled is set to false', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          signUpEnabled: false,
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
    expect(screen.queryByText('Connect your wallet')).toBeInTheDocument();
  });

  it('shows Sign Up button when signUpEnabled is true', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          signUpEnabled: true,
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('shows Sign Up button by default when signUpEnabled is not specified', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('changes layout when signUpEnabled is false', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          signUpEnabled: false,
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    // "Connect your wallet" should be present
    const connectText = screen.getByText('Connect your wallet');
    expect(connectText).toBeInTheDocument();

    // When signUpEnabled is false, there should be no divider line
    const dialog = screen.getByTestId('ockModalOverlay');
    const dividers = dialog.querySelectorAll('.border-\\[0\\.5px\\]');
    expect(dividers.length).toBe(0);
  });

  it('includes divider line when signUpEnabled is true', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          signUpEnabled: true,
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    // "Connect your wallet" should be present with divider
    expect(
      screen.getByText('or continue with an existing wallet'),
    ).toBeInTheDocument();

    // When signUpEnabled is true, there should be a divider line
    const dialog = screen.getByTestId('ockModalOverlay');
    const dividers = dialog.querySelectorAll('.border-\\[0\\.5px\\]');
    expect(dividers.length).toBe(1);
  });

  it('connects with Base Account when clicking Base button', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {
          name: 'Test App',
          logo: 'test-logo.png',
        },
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Base'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        appName: 'Test App',
        appLogoUrl: 'test-logo.png',
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('connects with Base Account using undefined values when no app name or logo provided', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: false },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Base'));

    expect(mockConnect).toHaveBeenCalledWith({
      connector: {
        appName: undefined,
        appLogoUrl: undefined,
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles Base Account connection errors', () => {
    const mockError = new Error('Base Account connection failed');
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw mockError;
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Base'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledWith(
      'Base Account connection error:',
      mockError,
    );
  });

  it('handles non-Error objects in Base Account connection errors', () => {
    const mockOnError = vi.fn();
    (useConnect as Mock).mockReturnValue({
      connect: vi.fn(() => {
        throw 'Some string error';
      }),
    });

    render(
      <WalletModal isOpen={true} onClose={mockOnClose} onError={mockOnError} />,
    );

    fireEvent.click(screen.getByText('Base'));

    expect(mockOnError).toHaveBeenCalledWith(
      new Error('Failed to connect wallet'),
    );
    expect(console.error).toHaveBeenCalledWith(
      'Base Account connection error:',
      'Some string error',
    );
  });

  it('shows Base Account button in wallet list', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Base')).toBeInTheDocument();
  });

  it('displays wallet options in correct order with Base Account first', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          supportedWallets: { rabby: true },
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    const walletButtons = Array.from(screen.getAllByRole('button')).filter(
      (button) =>
        button.textContent !== 'Sign up' &&
        !button.getAttribute('aria-label')?.includes('Close'),
    );

    expect(walletButtons[0].textContent).toContain('Base');
    expect(walletButtons[1].textContent).toContain('Coinbase Wallet');
    expect(walletButtons[2].textContent).toContain('MetaMask');
    expect(walletButtons[3].textContent).toContain('Phantom');
    expect(walletButtons[4].textContent).toContain('Rabby');

    expect(walletButtons.length).toBe(5);
  });

  it('uses default supportedWallets when config.wallet.supportedWallets is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        wallet: {
          // supportedWallets is undefined, should fallback to default
        },
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    // Should show Base, Coinbase Wallet, MetaMask, Phantom (default enabled wallets)
    // Should NOT show Rabby, Trust Wallet, Frame (default disabled wallets)
    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('Phantom')).toBeInTheDocument();
    expect(screen.queryByText('Rabby')).not.toBeInTheDocument();
    expect(screen.queryByText('Trust Wallet')).not.toBeInTheDocument();
    expect(screen.queryByText('Frame')).not.toBeInTheDocument();
  });

  it('uses default supportedWallets when config.wallet is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: {},
        // wallet is undefined, should fallback to default
      },
    });

    render(<WalletModal isOpen={true} onClose={mockOnClose} />);

    // Should show Base, Coinbase Wallet, MetaMask, Phantom (default enabled wallets)
    // Should NOT show Rabby, Trust Wallet, Frame (default disabled wallets)
    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('Phantom')).toBeInTheDocument();
    expect(screen.queryByText('Rabby')).not.toBeInTheDocument();
    expect(screen.queryByText('Trust Wallet')).not.toBeInTheDocument();
    expect(screen.queryByText('Frame')).not.toBeInTheDocument();
  });
});
