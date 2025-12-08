import { render, screen, fireEvent } from '@testing-library/react';
import {
  RenderDepositButton,
  type RenderDepositButtonProps,
} from './RenderDepositButton';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionReceipt } from 'viem';

vi.mock('@/internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('RenderDepositButton', () => {
  const defaultProps = {
    context: {
      receipt: null,
      errorMessage: null,
      isLoading: false,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    isDisabled: false,
    depositAmountError: null,
    depositedAmount: '100',
    vaultToken: { symbol: 'ETH' },
  } as unknown as RenderDepositButtonProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders deposit button in default state', () => {
    const button = RenderDepositButton(defaultProps);
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Deposit' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).not.toBeDisabled();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders disabled deposit button', () => {
    const button = RenderDepositButton({
      ...defaultProps,
      isDisabled: true,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Deposit' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });

  it('renders loading state with spinner', () => {
    const button = RenderDepositButton({
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
    const button = RenderDepositButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        errorMessage: 'Some error occurred',
      },
      depositAmountError: errorMessage,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: errorMessage });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders error state with default message when depositAmountError is null', () => {
    const button = RenderDepositButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        errorMessage: 'Some error occurred',
      },
      depositAmountError: null,
    });
    render(button);

    const buttonElement = screen.getByRole('button', { name: 'Try again' });
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders success state with deposited amount', () => {
    const button = RenderDepositButton({
      ...defaultProps,
      context: {
        ...defaultProps.context,
        receipt: {} as unknown as TransactionReceipt,
      },
    });
    render(button);

    const expectedText = `Deposited ${defaultProps.depositedAmount} ${defaultProps?.vaultToken?.symbol}`;
    const buttonElement = screen.getByRole('button', { name: expectedText });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles missing vaultToken gracefully', () => {
    const button = RenderDepositButton({
      ...defaultProps,
      vaultToken: undefined,
      context: {
        ...defaultProps.context,
        receipt: {} as unknown as TransactionReceipt,
      },
    });
    render(button);

    const expectedText = `Deposited ${defaultProps.depositedAmount} undefined`;
    const buttonElement = screen.getByRole('button', { name: expectedText });
    expect(buttonElement).toBeInTheDocument();
  });
});
