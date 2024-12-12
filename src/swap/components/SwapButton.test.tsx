import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Config,
  type UseAccountReturnType,
  type UseConnectReturnType,
  useAccount,
  useConnect,
} from 'wagmi';
import { SwapButton } from './SwapButton';
import { useSwapContext } from './SwapProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('../../internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

const useSwapContextMock = useSwapContext as Mock;

describe('SwapButton', () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('should render button with text "Swap" when not loading', () => {
    useSwapContextMock.mockReturnValue({
      address: '0x123',
      to: { loading: false, amount: 1, token: { name: 'ETH', address: '123' } },
      from: {
        loading: false,
        amount: 1,
        token: { name: 'BTC', address: '456' },
      },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toHaveTextContent('Swap');
    expect(button).not.toBeDisabled();
  });

  it('should render Spinner when loading', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: true, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render Spinner when transaction is pending', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      lifecycleStatus: { statusName: 'transactionPending' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render Spinner when transaction is approved', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      lifecycleStatus: { statusName: 'transactionApproved' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should disable button when required fields are missing', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: null, token: 'BTC' },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toBeDisabled();
  });

  it('should call handleSubmit with mockHandleSubmit when clicked', () => {
    useSwapContextMock.mockReturnValue({
      address: '0x123',
      to: { loading: false, amount: 1, token: { name: 'ETH', address: '123' } },
      from: {
        loading: false,
        amount: 1,
        token: { name: 'BTC', address: '456' },
      },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
    });
    render(<SwapButton />);
    const button = screen.getByTestId('ockSwapButton_Button');
    fireEvent.click(button);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should apply additional className correctly', () => {
    useSwapContextMock.mockReturnValue({
      address: '0x123',
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
    });
    const customClass = 'custom-class';
    render(<SwapButton className={customClass} />);
    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toHaveClass(customClass);
  });

  it('should render ConnectWallet if disconnected and no missing fields', () => {
    useSwapContextMock.mockReturnValue({
      to: { loading: false, amount: 1, token: 'ETH' },
      from: { loading: false, amount: 1, token: 'BTC' },
      lifecycleStatus: { statusName: 'init' },
      handleSubmit: mockHandleSubmit,
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
    render(<SwapButton />);
    const button = screen.getByTestId('ockConnectWallet_Container');
    expect(button).toBeDefined();
  });
});
