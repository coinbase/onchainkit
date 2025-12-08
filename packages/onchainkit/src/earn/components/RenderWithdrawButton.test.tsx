import { render, screen, fireEvent } from '@testing-library/react';
import {
  RenderWithdrawButton,
  type RenderWithdrawButtonProps,
} from './RenderWithdrawButton';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionReceipt } from 'node_modules/viem/_types/types/transaction';

vi.mock('@/internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('RenderWithdrawButton', () => {
  const defaultProps = {
    context: {
      receipt: null,
      errorMessage: null,
      isLoading: false,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    isDisabled: false,
    withdrawAmountError: null,
    withdrawnAmount: '100',
    vaultToken: { symbol: 'ETH' },
  } as unknown as RenderWithdrawButtonProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders withdraw button in default state', () => {
    const button = RenderWithdrawButton(defaultProps);
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Withdraw' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).not.toBeDisabled();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders disabled withdraw button', () => {
    const button = RenderWithdrawButton({
      ...defaultProps,
      isDisabled: true,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Withdraw' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });

  it('renders loading state with spinner', () => {
    const button = RenderWithdrawButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        isLoading: true,
      },
    });
    render(button);

    const buttonElement = screen.getByRole('button');
    const spinner = screen.getByTestId('spinner');

    expect(buttonElement).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state with error message', () => {
    const errorMessage = 'Insufficient funds';
    const button = RenderWithdrawButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        errorMessage: 'Some error occurred',
      },
      withdrawAmountError: errorMessage,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: errorMessage });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders error state with default message when withdrawAmountError is null', () => {
    const button = RenderWithdrawButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        errorMessage: 'Some error occurred',
      },
      withdrawAmountError: null,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Try again' });
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders success state with withdrawn amount', () => {
    const button = RenderWithdrawButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        receipt: {} as unknown as TransactionReceipt,
      },
    });
    render(button);

    const expectedText = `Withdrew ${defaultProps.withdrawnAmount} ${defaultProps?.vaultToken?.symbol}`;
    const buttonElement = screen.getByRole('button', { name: expectedText });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles missing vaultToken gracefully', () => {
    const button = RenderWithdrawButton({
      ...defaultProps,
      vaultToken: undefined,
      context: {
        ...defaultProps.context,
        receipt: {} as unknown as TransactionReceipt,
      },
    });
    render(button);

    const expectedText = `Withdrew ${defaultProps.withdrawnAmount} undefined`;
    const buttonElement = screen.getByRole('button', { name: expectedText });
    expect(buttonElement).toBeInTheDocument();
  });
});
