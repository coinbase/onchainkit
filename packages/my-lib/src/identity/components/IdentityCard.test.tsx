import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { goerli, baseSepolia as sepolia } from 'viem/chains';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { OnchainKitProvider } from '../../OnchainKitProvider';
import { IdentityCard } from './IdentityCard';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAccount: vi.fn().mockReturnValue({ address: '123' }),
  };
});

vi.mock('@/identity/hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('./Avatar', () => ({
  Avatar: vi.fn(() => <div data-testid="ockAvatar_Image">Avatar</div>),
}));

vi.mock('./Name', () => ({
  Name: vi.fn(({ children }) => (
    <div data-testid="ockIdentity_Text">
      {mockName || 'Name'} {children}
    </div>
  )),
}));

vi.mock('./Address', () => ({
  Address: vi.fn(({ address }) => (
    <div data-testid="ockAddress">
      {address === 'invalid-address' ? 'Invalid Address' : '0x1234...7890'}
    </div>
  )),
}));

const useAvatarMock = mock(useAvatar);
const useNameMock = mock(useName);

const mockAddress = '0x1234567890123456789012345678901234567890';
const mockName = 'test.eth';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('IdentityCard', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    useNameMock.mockReturnValue({
      data: mockName,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useName>);

    useAvatarMock.mockReturnValue({
      data: 'https://example.com/avatar.png',
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAvatar>);
  });

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={sepolia}>{component}</OnchainKitProvider>
      </QueryClientProvider>,
    );
  };

  it('renders with an Ethereum address', () => {
    renderWithProvider(<IdentityCard address={mockAddress} />);
    expect(screen.getByTestId('ockAddress')).toHaveTextContent('0x1234...7890');
  });

  it('renders with ENS name when available', async () => {
    useNameMock.mockReturnValue({
      data: mockName,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useName>);

    renderWithProvider(<IdentityCard address={mockAddress} />);

    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_Text')).toHaveTextContent(
        mockName,
      );
    });
  });

  it('handles ENS resolution error gracefully', () => {
    useNameMock.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('ENS resolution failed'),
    } as ReturnType<typeof useName>);

    renderWithProvider(<IdentityCard address={mockAddress} />);
    expect(screen.getByTestId('ockAddress')).toHaveTextContent('0x1234...7890');
  });

  it('renders avatar when available', async () => {
    useAvatarMock.mockReturnValue({
      data: 'https://example.com/avatar.png',
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAvatar>);

    renderWithProvider(<IdentityCard address={mockAddress} />);
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
    });
  });

  it('applies custom className prop', () => {
    renderWithProvider(
      <IdentityCard address={mockAddress} className="custom-class" />,
    );
    expect(screen.getByTestId('ockIdentityLayout_container')).toHaveClass(
      'custom-class',
    );
  });

  it('truncates address when truncate prop is true', () => {
    renderWithProvider(<IdentityCard address={mockAddress} />);
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
  });

  it('handles chain switching correctly', async () => {
    useNameMock.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useName>);

    renderWithProvider(<IdentityCard address={mockAddress} chain={goerli} />);

    expect(useNameMock).toHaveBeenCalledWith({
      address: mockAddress,
      chain: goerli,
    });
  });

  it('passes boolean tooltip prop to Badge component', () => {
    renderWithProvider(
      <IdentityCard address={mockAddress} badgeTooltip={true} />,
    );
    expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
  });

  it('passes string tooltip prop to Badge component', () => {
    renderWithProvider(
      <IdentityCard address={mockAddress} badgeTooltip="Custom Tooltip" />,
    );
    expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
  });
});
