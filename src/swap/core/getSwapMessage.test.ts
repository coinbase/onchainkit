import { getSwapMessage, SwapMessage } from './getSwapMessage';
import { LOW_LIQUIDITY_ERROR_CODE } from '../constants';
import type { GetSwapMessageParams } from '../types';
import type { Token } from '../../token';

const mockETHToken: Token = {
  name: 'ETH',
  address: '0x123456789',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

const mockSwapLoadingState = {
  isFromQuoteLoading: false,
  isSwapLoading: false,
  isToQuoteLoading: false,
};

describe('getSwapMessage', () => {
  it('returns BALANCE_ERROR when there is a token balance error', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapErrorState: {
        fromTokenBalanceError: {
          error: 'some error',
          code: 'SWAP_BALANCE_ERROR',
        },
      },
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.BALANCE_ERROR);
  });

  it('returns INSUFFICIENT_BALANCE when the amount exceeds balance', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '50',
      fromAmount: '100',
      fromToken: mockETHToken,
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INSUFFICIENT_BALANCE);
  });

  it('returns SWAP_IN_PROGRESS when the swap is loading', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapLoadingState: { ...mockSwapLoadingState, isSwapLoading: true },
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.SWAP_IN_PROGRESS);
  });

  it('returns FETCHING_QUOTE when a quote is loading', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapLoadingState: { ...mockSwapLoadingState, isFromQuoteLoading: true },
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.FETCHING_QUOTE);
  });

  it('returns INCOMPLETE_FIELD when required fields are missing', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '',
      fromToken: mockETHToken,
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INCOMPLETE_FIELD);
  });

  it('returns LOW_LIQUIDITY when there is a low liquidity error', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapErrorState: {
        quoteError: {
          error: 'some error',
          code: LOW_LIQUIDITY_ERROR_CODE,
        },
      },
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  it('returns the first general error message', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapErrorState: {
        swapError: { error: 'Some error occurred', code: 'GENERAL_SWAP_ERROR' },
      },
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe('Some error occurred');
  });

  it('returns an empty string when there are no errors and no loading states', () => {
    const params: GetSwapMessageParams = {
      convertedFromTokenBalance: '100',
      fromAmount: '50',
      fromToken: mockETHToken,
      swapLoadingState: mockSwapLoadingState,
      toAmount: '50',
      toToken: mockToken,
    };
    expect(getSwapMessage(params)).toBe('');
  });
});
