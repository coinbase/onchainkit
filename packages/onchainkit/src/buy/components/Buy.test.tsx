import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { degenToken } from '@/token/constants';
import { useOnchainKit } from '@/useOnchainKit';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Config,
  type UseConnectReturnType,
  useAccount,
  useConnect,
} from 'wagmi';
import { Buy } from './Buy';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
  BuyProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-BuyProvider">{children}</div>
  ),
}));

vi.mock('./BuyDropdown', () => ({
  BuyDropdown: () => <div data-testid="mock-BuyDropdown">BuyDropdown</div>,
}));

vi.mock('./BuyButton', () => ({
  BuyButton: () => <div data-testid="mock-BuyButton">Buy</div>,
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/internal/hooks/useOutsideClick', () => ({
  useOutsideClick: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

type useOutsideClickType = ReturnType<
  typeof vi.fn<
    (
      ref: React.RefObject<HTMLElement>,
      callback: (event: MouseEvent) => void,
    ) => void
  >
>;

describe('Buy', () => {
  let mockSetIsOpen: ReturnType<typeof vi.fn>;
  let mockOutsideClickCallback: (e: MouseEvent) => void;

  beforeEach(() => {
    mockSetIsOpen = vi.fn();
    (useBuyContext as Mock).mockReturnValue({
      isDropdownOpen: false,
      setIsDropdownOpen: mockSetIsOpen,
      lifecycleStatus: {
        statusName: 'idle',
        statusData: {
          maxSlippage: 10,
        },
      },
      to: {
        token: degenToken,
        amount: 10,
        setAmount: vi.fn(),
      },
      address: '0x123',
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });

    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'connected',
    } as unknown as UseConnectReturnType<Config, unknown>);

    (useOutsideClick as unknown as useOutsideClickType).mockImplementation(
      (_, callback) => {
        mockOutsideClickCallback = callback;
      },
    );

    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'mock-project-id',
    });

    vi.clearAllMocks();
  });

  it('renders the Buy component', () => {
    render(<Buy className="test-class" toToken={degenToken} />);

    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('DEGEN')).toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside the container', () => {
    (useBuyContext as Mock).mockReturnValue({
      isDropdownOpen: true,
      setIsDropdownOpen: mockSetIsOpen,
      lifecycleStatus: {
        statusName: 'idle',
        statusData: {
          maxSlippage: 10,
        },
      },
      to: {
        token: degenToken,
        amount: 10,
        setAmount: vi.fn(),
      },
    });

    render(<Buy className="test-class" toToken={degenToken} />);

    expect(screen.getByTestId('mock-BuyDropdown')).toBeDefined();
    mockOutsideClickCallback({} as MouseEvent);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('does not close the dropdown when clicking inside the container', () => {
    (useBuyContext as Mock).mockReturnValue({
      isDropdownOpen: true,
      setIsDropdownOpen: mockSetIsOpen,
      lifecycleStatus: {
        statusName: 'idle',
        statusData: {
          maxSlippage: 10,
        },
      },
      to: {
        token: degenToken,
        amount: 10,
        setAmount: vi.fn(),
      },
    });

    render(<Buy className="test-class" toToken={degenToken} />);

    expect(screen.getByTestId('mock-BuyDropdown')).toBeDefined();
    fireEvent.click(screen.getByTestId('mock-BuyDropdown'));
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('should not trigger click handler when dropdown is closed', () => {
    render(<Buy className="test-class" toToken={degenToken} />);
    expect(screen.queryByTestId('mock-BuyDropdown')).not.toBeInTheDocument();
  });
});
