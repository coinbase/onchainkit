import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { OnchainKitProvider } from '@/OnchainKitProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  Mock,
  vi,
} from 'vitest';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';
import { useOnchainKit } from '@/useOnchainKit';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useAccount: vi.fn().mockReturnValue({
      address: '0x1234567890',
    }),
  };
});

vi.mock('@/useOnchainKit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/useOnchainKit')>();
  return {
    ...actual,
    useOnchainKit: vi.fn().mockReturnValue({
      chain: { id: 8453 },
    }),
  };
});

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: () => ({ data: null, isLoading: false }),
}));

vi.mock('../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const originalClipboard = navigator.clipboard;

// Mock clipboard
beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  });
});

afterAll(() => {
  Object.assign(navigator, { clipboard: originalClipboard });
});

// Helper to wrap components with OnchainKitProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <OnchainKitProvider chain={base} apiKey="test-api-key">
    {children}
  </OnchainKitProvider>
);

describe('WalletAdvancedAddressDetails', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseIdentityContext = useIdentityContext as ReturnType<typeof vi.fn>;
  const mockUseAccount = useAccount as ReturnType<typeof vi.fn>;
  const mockUseOnchainKit = useOnchainKit as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletContext.mockReturnValue({
      animations: {
        content: '',
      },
    });
    mockUseAccount.mockReturnValue({
      address: '0x1234567890',
    });
    mockUseOnchainKit.mockReturnValue({
      chain: { id: 8453 },
    });
    (usePortfolio as Mock).mockReturnValue({
      data: {
        portfolioBalanceInUsd: 1000,
      },
      isFetching: false,
    });
  });

  it('renders null when address or chain is null', () => {
    mockUseAccount.mockReturnValue({ address: null });
    const { rerender } = render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );
    expect(screen.queryByTestId('address-details')).toBeNull();

    mockUseAccount.mockReturnValue({ address: '0x1234567890' });
    mockUseOnchainKit.mockReturnValue({ chain: null });
    rerender(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );
    expect(screen.queryByTestId('address-details')).toBeNull();
  });

  it('renders Avatar, Name, and AddressBalance when address and chain are available', () => {
    mockUseIdentityContext.mockReturnValue({
      schemaId: '1',
    });

    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

    expect(screen.getByTestId('ockAvatar_ImageContainer')).toBeDefined();
    expect(screen.getByTestId('ockIdentity_Text')).toBeDefined();
    expect(
      screen.getByTestId('ockWalletAdvanced_AddressBalance'),
    ).toBeDefined();
  });

  it('copies address to clipboard and shows tooltip when Name group is clicked', async () => {
    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

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
    const mockClipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Clipboard failed')),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

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

    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('should not display formatted portfolio value when not available', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: null,
      isFetching: false,
    });

    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

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

    const { rerender } = render(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

    expect(screen.queryByTestId('ockWalletAdvanced_AddressBalance')).toBeNull();

    rerender(
      <TestWrapper>
        <WalletAdvancedAddressDetails />
      </TestWrapper>,
    );

    expect(
      screen.getByTestId('ockWalletAdvanced_AddressBalance'),
    ).toHaveTextContent('$1,234.57');
  });

  it('applies custom classNames to components', () => {
    const customClassNames = {
      container: 'custom-container',
      avatar: 'custom-avatar',
      nameButton: 'custom-name',
      fiatBalance: 'custom-balance',
    };

    render(
      <TestWrapper>
        <WalletAdvancedAddressDetails classNames={customClassNames} />
      </TestWrapper>,
    );

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
