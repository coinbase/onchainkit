/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapButton } from './SwapButton';
import { useSwapContext } from '../context';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { isSwapError } from '../core/isSwapError';
import type { SwapError } from '../types';

jest.mock('../context');
jest.mock('../core/buildSwapTransaction');
jest.mock('../core/isSwapError');

const mockedUseSwapContext = useSwapContext as jest.Mock;
const mockedBuildSwapTransaction = buildSwapTransaction as jest.Mock;
const mockedIsSwapError = isSwapError as jest.MockedFunction<
  (response: unknown) => response is SwapError
>;

const mockSwapLoadingState = {
  isFromQuoteLoading: false,
  isSwapLoading: false,
  isToQuoteLoading: false,
};

describe('SwapButton', () => {
  beforeEach(() => {
    mockedUseSwapContext.mockReturnValue({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      toAmount: 5,
      setSwapErrorState: jest.fn(),
      setSwapLoadingState: jest.fn(),
      swapLoadingState: mockSwapLoadingState,
      toToken: 'DAI',
      setError: jest.fn(),
    });
    mockedBuildSwapTransaction.mockResolvedValue('mocked-response');
    mockedIsSwapError.mockReturnValue(false);
  });

  it('calls onSubmit with the transaction response if no error occurs', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <SwapButton disabled={false} onSubmit={onSubmit} />,
    );

    fireEvent.click(getByText('Swap'));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith('mocked-response'),
    );
  });

  it('sets error if buildSwapTransaction throws an error', async () => {
    const setSwapErrorState = jest.fn();
    mockedUseSwapContext.mockReturnValueOnce({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      swapLoadingState: mockSwapLoadingState,
      setSwapErrorState,
      setSwapLoadingState: jest.fn(),
      toAmount: 5,
      toToken: 'DAI',
    });
    mockedBuildSwapTransaction.mockRejectedValue({
      error: 'Transaction error',
      code: 'SWAP_ERROR',
    });

    const { getByText } = render(
      <SwapButton disabled={false} onSubmit={jest.fn()} />,
    );

    fireEvent.click(getByText('Swap'));

    const mockErrorState = {
      swapError: { error: 'Transaction error', code: 'SWAP_ERROR' },
    };

    await waitFor(() =>
      expect(setSwapErrorState).toHaveBeenCalledWith(mockErrorState),
    );
  });

  it('sets error if response is a swap error', async () => {
    const setSwapErrorState = jest.fn();
    mockedUseSwapContext.mockReturnValueOnce({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      setSwapErrorState,
      setSwapLoadingState: jest.fn(),
      swapLoadingState: mockSwapLoadingState,
      toAmount: 5,
      toToken: 'DAI',
    });
    mockedBuildSwapTransaction.mockResolvedValue('error-response');
    mockedIsSwapError.mockReturnValueOnce(true);

    const { getByText } = render(
      <SwapButton disabled={false} onSubmit={jest.fn()} />,
    );

    fireEvent.click(getByText('Swap'));

    await waitFor(() =>
      expect(setSwapErrorState).toHaveBeenCalledWith({
        swapError: 'error-response',
      }),
    );
  });

  it('does not call handleSubmit when disabled is true', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<SwapButton disabled onSubmit={onSubmit} />);

    const button = getByText('Swap');
    fireEvent.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does renders a loading icon when swap is loading', () => {
    const onSubmit = jest.fn();
    mockedUseSwapContext.mockReturnValueOnce({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      setSwapErrorState: jest.fn(),
      setSwapLoadingState: jest.fn(),
      swapLoadingState: {
        isFromQuoteLoading: false,
        isSwapLoading: true,
        isToQuoteLoading: false,
      },
      toAmount: 5,
      toToken: 'DAI',
    });
    const { getByTestId } = render(
      <SwapButton disabled={false} onSubmit={onSubmit} />,
    );

    const spinner = getByTestId('ockSpinner');

    expect(spinner).toBeInTheDocument();
  });
});
