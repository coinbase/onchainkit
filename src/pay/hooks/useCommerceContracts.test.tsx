import { renderHook } from '@testing-library/react';
import { formatUnits } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfig } from 'wagmi';
import { getCommerceContracts } from '../utils/getCommerceContracts';
import { getUSDCBalance } from '../utils/getUSDCBalance';
import { handlePayRequest } from '../utils/handlePayRequest';
import { useCommerceContracts } from './useCommerceContracts';

vi.mock('wagmi', () => ({
  useConfig: vi.fn(),
}));

vi.mock('../utils/handlePayRequest', () => ({
  handlePayRequest: vi.fn(),
}));

vi.mock('../utils/getCommerceContracts', () => ({
  getCommerceContracts: vi.fn(),
}));

vi.mock('../utils/getUSDCBalance', () => ({
  getUSDCBalance: vi.fn(),
}));

vi.mock('viem', () => ({
  formatUnits: vi.fn(),
}));

describe('useCommerceContracts', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockChargeIdRef = { current: undefined };
  const mockContractsRef = { current: undefined };
  const mockSetErrorMessage = vi.fn();
  const mockUserHasInsufficientBalanceRef = { current: false };
  const mockConfig = {};

  beforeEach(() => {
    vi.resetAllMocks();
    (useConfig as Mock).mockReturnValue(mockConfig);
  });

  it('should handle successful contract retrieval and balance check', async () => {
    const mockHandlePayRequestResponse = {
      id: 'charge123',
      callData: { feeAmount: '1000000', recipientAmount: '9000000' },
    };
    const mockCommerceContracts = [
      { abi: [], address: '0x1234', functionName: 'test' },
    ];
    (handlePayRequest as Mock).mockResolvedValue(mockHandlePayRequestResponse);
    (getCommerceContracts as Mock).mockReturnValue(mockCommerceContracts);
    (getUSDCBalance as Mock).mockResolvedValue('15.000000');
    (formatUnits as Mock).mockReturnValue('10.000000');
    const { result } = renderHook(() =>
      useCommerceContracts({
        address: mockAddress,
        chargeIdRef: mockChargeIdRef,
        contractsRef: mockContractsRef,
        setErrorMessage: mockSetErrorMessage,
        userHasInsufficientBalanceRef: mockUserHasInsufficientBalanceRef,
      }),
    );
    await result.current();
    expect(handlePayRequest).toHaveBeenCalledWith({
      address: mockAddress,
      chargeHandler: undefined,
      productId: undefined,
    });
    expect(getCommerceContracts).toHaveBeenCalledWith({
      transaction: mockHandlePayRequestResponse,
    });
    expect(getUSDCBalance).toHaveBeenCalledWith({
      address: mockAddress,
      config: mockConfig,
    });
    expect(mockChargeIdRef.current).toBe('charge123');
    expect(mockContractsRef.current).toEqual(mockCommerceContracts);
    expect(mockUserHasInsufficientBalanceRef.current).toBe(false);
  });

  it('should handle insufficient balance', async () => {
    (handlePayRequest as Mock).mockResolvedValue({
      id: 'charge123',
      callData: { feeAmount: '1000000', recipientAmount: '9000000' },
    });
    (getUSDCBalance as Mock).mockResolvedValue('5.000000');
    (formatUnits as Mock).mockReturnValue('10.000000');
    const { result } = renderHook(() =>
      useCommerceContracts({
        address: mockAddress,
        chargeIdRef: mockChargeIdRef,
        contractsRef: mockContractsRef,
        setErrorMessage: mockSetErrorMessage,
        userHasInsufficientBalanceRef: mockUserHasInsufficientBalanceRef,
      }),
    );
    await result.current();
    expect(mockUserHasInsufficientBalanceRef.current).toBe(true);
  });

  it('should handle error during contract retrieval', async () => {
    const mockError = new Error('Test error');
    (handlePayRequest as Mock).mockRejectedValue(mockError);
    const { result } = renderHook(() =>
      useCommerceContracts({
        address: mockAddress,
        chargeIdRef: mockChargeIdRef,
        contractsRef: mockContractsRef,
        setErrorMessage: mockSetErrorMessage,
        userHasInsufficientBalanceRef: mockUserHasInsufficientBalanceRef,
      }),
    );
    await result.current();
    expect(mockSetErrorMessage).toHaveBeenCalledWith('Test error');
  });

  it('should do nothing if address is not provided', async () => {
    const { result } = renderHook(() =>
      useCommerceContracts({
        address: undefined,
        chargeIdRef: mockChargeIdRef,
        contractsRef: mockContractsRef,
        setErrorMessage: mockSetErrorMessage,
        userHasInsufficientBalanceRef: mockUserHasInsufficientBalanceRef,
      }),
    );
    await result.current();
    expect(handlePayRequest).not.toHaveBeenCalled();
  });
});
