import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

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

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const mockClipboard = {
    writeText: vi.fn(),
  };
  Object.assign(navigator, { clipboard: mockClipboard });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletAdvancedContext.mockReturnValue({
      animations: {
        content: '',
      },
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
    });

    mockUseIdentityContext.mockReturnValue({
      schemaId: '1',
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      portfolioFiatValue: 1000,
      animations: {
        content: '',
      },
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
    mockUseWalletAdvancedContext.mockReturnValue({
      isFetchingPortfolioData: true,
      animations: {
        content: '',
      },
    });

    render(<WalletAdvancedAddressDetails />);

    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('should display formatted portfolio value when available', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      isFetchingPortfolioData: false,
      portfolioFiatValue: null,
      animations: {
        content: '',
      },
    });

    const { rerender } = render(<WalletAdvancedAddressDetails />);

    expect(screen.queryByTestId('ockWalletAdvanced_AddressBalance')).toBeNull();

    mockUseWalletAdvancedContext.mockReturnValue({
      isFetchingPortfolioData: false,
      portfolioFiatValue: 1234.567,
      animations: {
        content: '',
      },
    });

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
    });

    mockUseWalletAdvancedContext.mockReturnValue({
      portfolioFiatValue: 1000,
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
