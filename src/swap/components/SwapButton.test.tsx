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

const mockSwapQuoteLoadingState = {
  isFromQuoteLoading: false,
  isToQuoteLoading: false,
};

describe('SwapButton', () => {
  beforeEach(() => {
    mockedUseSwapContext.mockReturnValue({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      toAmount: 5,
      swapQuoteLoadingState: mockSwapQuoteLoadingState,
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
    const setError = jest.fn();
    mockedUseSwapContext.mockReturnValueOnce({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      swapQuoteLoadingState: mockSwapQuoteLoadingState,
      toAmount: 5,
      toToken: 'DAI',
      setError,
    });
    mockedBuildSwapTransaction.mockRejectedValue(
      new Error('Transaction error'),
    );

    const { getByText } = render(
      <SwapButton disabled={false} onSubmit={jest.fn()} />,
    );

    fireEvent.click(getByText('Swap'));

    await waitFor(() =>
      expect(setError).toHaveBeenCalledWith(new Error('Transaction error')),
    );
  });

  it('sets error if response is a swap error', async () => {
    const setError = jest.fn();
    mockedUseSwapContext.mockReturnValueOnce({
      address: '0x123',
      fromAmount: 100,
      fromToken: 'ETH',
      swapQuoteLoadingState: mockSwapQuoteLoadingState,
      toAmount: 5,
      toToken: 'DAI',
      setError,
    });
    mockedBuildSwapTransaction.mockResolvedValue('error-response');
    mockedIsSwapError.mockReturnValueOnce(true);

    const { getByText } = render(
      <SwapButton disabled={false} onSubmit={jest.fn()} />,
    );

    fireEvent.click(getByText('Swap'));

    await waitFor(() =>
      expect(setError).toHaveBeenCalledWith('error-response'),
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
      swapQuoteLoadingState: {
        isFromQuoteLoading: true,
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
