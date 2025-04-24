import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({
    address: '0x1234567890',
  }),
}));

vi.mock('../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn().mockReturnValue({
    schemaId: '1',
  }),
}));

vi.mock('@/identity/hooks/useAttestations', () => ({
  useAttestations: () => [{ testAttestation: 'Test Attestation' }],
}));

vi.mock('@/identity/hooks/useAvatar', () => ({
  useAvatar: () => ({ data: null, isLoading: false }),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: () => ({ data: null, isLoading: false }),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletAdvancedAddressDetails', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseIdentityContext = useIdentityContext as ReturnType<typeof vi.fn>;
  const mockClipboard = {
    writeText: vi.fn(),
  };
  Object.assign(navigator, { clipboard: mockClipboard });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletContext.mockReturnValue({
      animations: {
        content: '',
      },
      chain: { id: 8453 },
      address: '0x1234567890',
    });
    (usePortfolio as Mock).mockReturnValue({
      data: {
        portfolioBalanceInUsd: 1000,
      },
      isFetching: false,
    });
  });

  it('renders null when address or chain is null', () => {
    mockUseWalletContext.mockReturnValue({ address: null, chain: 8453 });
    const { rerender } = render(<WalletAdvancedAddressDetails />);
    expect(screen.queryByTestId('address-details')).toBeNull();

    mockUseWalletContext.mockReturnValue({
      address: '0x1234567890',
      chain: null,
    });
    rerender(<WalletAdvancedAddressDetails />);
    expect(screen.queryByTestId('address-details')).toBeNull();
  });

  it('renders Avatar, Name, and AddressBalance when isClosing is false', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      address: '0x1234567890',
      chain: { id: 8453 },
      animations: {
        content: '',
      },
    });

    mockUseIdentityContext.mockReturnValue({
      schemaId: '1',
    });

    render(<WalletAdvancedAddressDetails />);

    expect(screen.getByTestId('ockAvatar_ImageContainer')).toBeDefined();
    expect(screen.getByTestId('ockIdentity_Text')).toBeDefined();
    expect(
      screen.getByTestId('ockWalletAdvanced_AddressBalance'),
    ).toBeDefined();
  });

  it('copies address to clipboard and shows tooltip when Name group is clicked', async () => {
    mockUseWalletContext.mockReturnValue({
      animations: {
        content: '',
      },
      isClosing: false,
      address: '0x1234567890',
      chain: { id: 8453 },
    });

    render(<WalletAdvancedAddressDetails />);

    const nameButton = screen.getByTestId('ockWalletAdvanced_NameButton');
    const tooltip = screen.getByTestId('ockWalletAdvanced_NameTooltip');
    expect(tooltip).toHaveClass('opacity-0');
    expect(tooltip).toHaveClass('group-hover:opacity-100');

    fireEvent.click(nameButton);

    await waitFor(() => {
      expect(tooltip?.textContent).toBe('Copied');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('0x1234567890');
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });

  it('shows error state when clipboard fails', async () => {
    mockUseWalletContext.mockReturnValue({
      animations: {
        content: '',
      },
      isClosing: false,
      address: '0x1234567890',
      chain: { id: 8453 },
    });

    const mockClipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Clipboard failed')),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<WalletAdvancedAddressDetails />);

    const nameButton = screen.getByTestId('ockWalletAdvanced_NameButton');
    const tooltip = screen.getByTestId('ockWalletAdvanced_NameTooltip');

    fireEvent.click(nameButton);

    await waitFor(() => {
      expect(tooltip.textContent).toBe('Failed to copy');
    });
  });

  it('should show spinner when fetching portfolio data', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        portfolioBalanceInUsd: null,
      },
      isFetching: true,
    });

    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      chain: 'base',
      animations: {
        content: '',
      },
    });

    render(<WalletAdvancedAddressDetails />);

    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('should not display formatted portfolio value when not available', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: null,
      isFetching: false,
    });

    render(<WalletAdvancedAddressDetails />);

    expect(screen.queryByTestId('ockWalletAdvanced_AddressBalance')).toBeNull();
  });

  it('should display formatted portfolio value when available', () => {
    (usePortfolio as Mock)
      .mockReturnValueOnce({
        data: {
          portfolioBalanceInUsd: null,
        },
        isFetching: true,
      })
      .mockReturnValueOnce({
        data: {
          portfolioBalanceInUsd: 1234.567,
        },
        isFetching: false,
      });

    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      chain: 'base',
      animations: {
        content: '',
      },
    });

    const { rerender } = render(<WalletAdvancedAddressDetails />);

    expect(screen.queryByTestId('ockWalletAdvanced_AddressBalance')).toBeNull();

    rerender(<WalletAdvancedAddressDetails />);

    expect(
      screen.getByTestId('ockWalletAdvanced_AddressBalance'),
    ).toHaveTextContent('$1,234.57');
  });

  it('applies custom classNames to components', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      address: '0x1234567890',
      chain: { id: 8453 },
      animations: {
        content: '',
      },
    });

    const customClassNames = {
      container: 'custom-container',
      avatar: 'custom-avatar',
      nameButton: 'custom-name',
      fiatBalance: 'custom-balance',
    };

    render(<WalletAdvancedAddressDetails classNames={customClassNames} />);

    expect(screen.getByTestId('ockWalletAdvanced_AddressDetails')).toHaveClass(
      'custom-container',
    );
    expect(screen.getByTestId('ockAvatar_ImageContainer')).toHaveClass(
      'custom-avatar',
    );
    expect(screen.getByTestId('ockIdentity_Text')).toHaveClass('custom-name');
    expect(screen.getByTestId('ockWalletAdvanced_AddressBalance')).toHaveClass(
      'custom-balance',
    );
  });
});
