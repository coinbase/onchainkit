import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdentityContext } from '../../identity/components/IdentityProvider';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../core-react/identity/providers/IdentityProvider', () => ({
  useIdentityContext: vi.fn().mockReturnValue({
    schemaId: '1',
  }),
}));

vi.mock('../../core-react/identity/hooks/useAttestations', () => ({
  useAttestations: () => [{ testAttestation: 'Test Attestation' }],
}));

vi.mock('../../core-react/identity/hooks/useAvatar', () => ({
  useAvatar: () => ({ data: null, isLoading: false }),
}));

vi.mock('../../core-react/identity/hooks/useName', () => ({
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

  it('renders null when isClosing is true', () => {
    mockUseWalletContext.mockReturnValue({ isClosing: true });

    render(<WalletAdvancedAddressDetails />);

    expect(screen.queryByTestId('address-details')).toBeNull();
  });

  it('renders Avatar, Badge, Name, and AddressBalance when isClosing is false', () => {
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
    expect(screen.getByTestId('ockAvatar_BadgeContainer')).toBeDefined();
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

  it('copies empty string when address is null', () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      address: null,
      chain: { id: 8453 },
    });

    render(<WalletAdvancedAddressDetails />);

    const nameButton = screen.getByTestId('ockWalletAdvanced_NameButton');

    fireEvent.click(nameButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
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
});
