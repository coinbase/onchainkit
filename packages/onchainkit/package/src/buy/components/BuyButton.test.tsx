import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Config,
  type UseAccountReturnType,
  type UseConnectReturnType,
  useAccount,
  useConnect,
} from 'wagmi';
import { BuyButton } from './BuyButton';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('../../internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

vi.mock('../../internal/svg/checkmarkSvg', () => ({
  checkmarkSvg: <svg data-testid="checkmarkSvg" />,
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

describe('BuyButton', () => {
  const mockSetIsDropdownOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
      address: '0x123',
    });
  });

  it('renders the button with default content', () => {
    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Buy');
    expect(button).not.toBeDisabled();
  });

  it('shows a spinner when loading', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: true },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
      address: '0x123',
    });

    render(<BuyButton />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays a checkmark when statusName is success', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'success' },
      address: '0x123',
    });

    render(<BuyButton />);

    expect(screen.getByTestId('checkmarkSvg')).toBeInTheDocument();
  });

  it('updates status when required fields are missing', () => {
    const mockUpdateLifecycleStatus = vi.fn();
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: null, token: null },
      lifecycleStatus: { statusName: 'idle' },
      address: '0x123',
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    fireEvent.click(button);
    expect(button).not.toBeDisabled();
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmBPc05',
        error: 'Missing required fields',
        message: 'Complete the field to continue',
      },
    });
  });

  it('calls setIsDropdownOpen when clicked', () => {
    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    fireEvent.click(button);

    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(true);
  });

  it('calls setIsDropdownOpen when clicked and dropdown is open', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      isDropdownOpen: true,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
      address: '0x123',
    });

    render(<BuyButton />);

    const button = screen.getByTestId('ockBuyButton_Button');
    fireEvent.click(button);

    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
  });

  it('should render ConnectWallet if disconnected and no missing fields', () => {
    (useBuyContext as Mock).mockReturnValue({
      setIsDropdownOpen: mockSetIsDropdownOpen,
      from: { loading: false },
      fromETH: { loading: false },
      fromUSDC: { loading: false },
      to: { loading: false, amount: 10, token: 'ETH' },
      lifecycleStatus: { statusName: 'idle' },
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'disconnected',
    } as unknown as UseAccountReturnType<Config>);
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    } as unknown as UseConnectReturnType<Config, unknown>);
    render(<BuyButton />);
    const button = screen.getByTestId('ockConnectWallet_Container');
    expect(button).toBeDefined();
  });
});
