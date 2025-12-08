import { buildSendTransaction } from '@/api/buildSendTransaction';
import { renderHook } from '@testing-library/react';
import { type Address, parseUnits } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSendCalldata } from './getSendCalldata';

vi.mock('@/api/buildSendTransaction', () => ({
  buildSendTransaction: vi.fn(),
}));

vi.mock('@/internal/utils/isApiResponseError', () => ({
  isApiError: vi.fn((response) => response && 'code' in response),
}));

describe('getSendCalldata', () => {
  const mockToken = {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
    decimals: 6,
    cryptoBalance: 5000000,
    fiatBalance: 5,
    chainId: 8453,
    image: '',
  };

  const mockEthToken = {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '' as const,
    decimals: 18,
    cryptoBalance: 200000000000000,
    fiatBalance: 4000,
    chainId: 8453,
    image: '',
  };

  const mockRecipientAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
  const mockAmount = '1.0';
  const mockCall = { to: mockRecipientAddress, data: '0x123456' };

  const mockBuildSendTransaction = buildSendTransaction as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBuildSendTransaction.mockReturnValue(mockCall);
  });

  it('should return null calldata and error when parameters are missing', () => {
    const { result: result1 } = renderHook(() =>
      getSendCalldata({
        recipientAddress: null,
        token: mockToken,
        amount: mockAmount,
      }),
    );
    expect(result1.current.calldata).toBeNull();
    expect(result1.current.error).toEqual({
      code: 'SemBSeTx01',
      error: 'Invalid transaction parameters',
      message: 'Could not build send transaction',
    });

    const { result: result2 } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: null,
        amount: mockAmount,
      }),
    );
    expect(result2.current.calldata).toBeNull();
    expect(result2.current.error).toEqual({
      code: 'SemBSeTx01',
      error: 'Invalid transaction parameters',
      message: 'Could not build send transaction',
    });

    const { result: result3 } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockToken,
        amount: null,
      }),
    );
    expect(result3.current.calldata).toBeNull();
    expect(result3.current.error).toEqual({
      code: 'SemBSeTx01',
      error: 'Invalid transaction parameters',
      message: 'Could not build send transaction',
    });
  });

  it('should return error for non-ETH token without address', () => {
    const invalidToken = {
      ...mockToken,
      symbol: 'TEST',
      decimals: 18,
      address: null as unknown as Address,
    };

    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: invalidToken,
        amount: mockAmount,
      }),
    );

    expect(result.current.calldata).toBeNull();
    expect(result.current.error).toEqual({
      code: 'SemBSeTx02',
      error: 'No token address provided for non-ETH token',
      message: 'Could not build send transaction',
    });
  });

  it('should handle ETH token correctly', () => {
    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockEthToken,
        amount: mockAmount,
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: null,
      amount: parseUnits(mockAmount, 18),
    });

    expect(result.current.calldata).toEqual(mockCall);
    expect(result.current.error).toBeNull();
  });

  it('should handle regular token correctly', () => {
    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockToken,
        amount: mockAmount,
      }),
    );

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: mockToken.address,
      amount: parseUnits(mockAmount, mockToken.decimals),
    });

    expect(result.current.calldata).toEqual(mockCall);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors from buildSendTransaction', () => {
    const apiError = {
      code: 'API_ERROR',
      error: 'API error occurred',
      message: 'Failed to build transaction',
    };

    mockBuildSendTransaction.mockReturnValue(apiError);

    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockToken,
        amount: mockAmount,
      }),
    );

    expect(result.current.calldata).toBeNull();
    expect(result.current.error).toEqual(apiError);
  });

  it('should handle exceptions during transaction building', () => {
    const errorMessage = 'Invalid amount format';
    mockBuildSendTransaction.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockToken,
        amount: mockAmount,
      }),
    );

    expect(result.current.calldata).toBeNull();
    expect(result.current.error).toEqual({
      code: 'SemBSeTx03',
      error: errorMessage,
      message: 'Could not build send transaction',
    });
  });

  it('should handle non-Error exceptions', () => {
    mockBuildSendTransaction.mockImplementation(() => {
      throw 'String error';
    });

    const { result } = renderHook(() =>
      getSendCalldata({
        recipientAddress: mockRecipientAddress,
        token: mockToken,
        amount: mockAmount,
      }),
    );

    expect(result.current.calldata).toBeNull();
    expect(result.current.error).toEqual({
      code: 'SemBSeTx03',
      error: 'Unknown error',
      message: 'Could not build send transaction',
    });
  });

  it('should update when parameters change', async () => {
    const { result, rerender } = renderHook((props) => getSendCalldata(props), {
      initialProps: {
        recipientAddress: mockRecipientAddress as Address,
        token: mockToken,
        amount: mockAmount,
      },
    });

    expect(result.current.calldata).toEqual(mockCall);

    const newAmount = '2.0';
    rerender({
      recipientAddress: mockRecipientAddress,
      token: mockToken,
      amount: newAmount,
    });

    expect(buildSendTransaction).toHaveBeenCalledWith({
      recipientAddress: mockRecipientAddress,
      tokenAddress: mockToken.address,
      amount: parseUnits(newAmount, mockToken.decimals),
    });
  });
});
