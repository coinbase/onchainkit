import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdentityContext } from '../../core-react/identity/providers/IdentityProvider';
import { AddressDetails } from './WalletIslandAddressDetails';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

vi.mock('../../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../../identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn().mockReturnValue({
    schemaId: '1',
  }),
}));

vi.mock('../../../identity/hooks/useAttestations', () => ({
  useAttestations: () => [{ testAttestation: 'Test Attestation' }],
}));

vi.mock('../../../identity/hooks/useAvatar', () => ({
  useAvatar: () => ({ data: null, isLoading: false }),
}));

vi.mock('../../../identity/hooks/useName', () => ({
  useName: () => ({ data: null, isLoading: false }),
}));

vi.mock('../WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }) => <>{children}</>,
}));

describe('WalletIslandAddressDetails', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseIdentityContext = useIdentityContext as ReturnType<typeof vi.fn>;
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const mockClipboard = {
    writeText: vi.fn(),
  };
  Object.assign(navigator, { clipboard: mockClipboard });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletIslandContext.mockReturnValue({
      animationClasses: {
        addressDetails: 'animate-walletIslandContainerItem2',
      },
    });
  });

  it('renders null when isClosing is true', () => {
    mockUseWalletContext.mockReturnValue({ isClosing: true });

    render(<AddressDetails />);

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

    render(<AddressDetails />);

    expect(screen.getByTestId('ockAvatar_ImageContainer')).toBeDefined();
    expect(screen.getByTestId('ockAvatar_BadgeContainer')).toBeDefined();
    expect(screen.getByTestId('ockIdentity_Text')).toBeDefined();
    expect(screen.getByTestId('ockWalletIsland_AddressBalance')).toBeDefined();
  });

  it('copies address to clipboard and shows tooltip when Name group is clicked', async () => {
    mockUseWalletContext.mockReturnValue({
      isClosing: false,
      address: '0x1234567890',
      chain: { id: 8453 },
    });

    render(<AddressDetails />);

    const nameButton = screen.getByTestId('ockWalletIsland_NameButton');
    const tooltip = screen.getByTestId('ockWalletIsland_NameTooltip');
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

    render(<AddressDetails />);

    const nameButton = screen.getByTestId('ockWalletIsland_NameButton');
    const tooltip = screen.getByTestId('ockWalletIsland_NameTooltip');

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

    render(<AddressDetails />);

    const nameButton = screen.getByTestId('ockWalletIsland_NameButton');

    fireEvent.click(nameButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
  });
});
