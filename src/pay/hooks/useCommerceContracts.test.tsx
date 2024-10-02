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
    (getUSDCBalance as Mock).mockResolvedValue('15');
    (formatUnits as Mock).mockReturnValue('10');

    const { result } = renderHook(() => useCommerceContracts({}));
    const callback = result.current;
    const response = await callback(mockAddress);

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
    expect(response).toEqual({
      chargeId: 'charge123',
      contracts: mockCommerceContracts,
      insufficientBalance: false,
      priceInUSDC: '10',
    });
  });

  it('should handle insufficient balance', async () => {
    (handlePayRequest as Mock).mockResolvedValue({
      id: 'charge123',
      callData: { feeAmount: '5000000', recipientAmount: '5000000' },
    });
    (getUSDCBalance as Mock).mockResolvedValue('5');
    (formatUnits as Mock).mockReturnValue('10');

    const { result } = renderHook(() => useCommerceContracts({}));
    const callback = result.current;
    const response = await callback(mockAddress);

    expect(response.insufficientBalance).toBe(true);
    expect(response.priceInUSDC).toBe('10');
  });

  it('should handle error during contract retrieval', async () => {
    const mockError = new Error('Test error');
    (handlePayRequest as Mock).mockRejectedValue(mockError);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    const { result } = renderHook(() => useCommerceContracts({}));
    const callback = result.current;
    const response = await callback(mockAddress);

    expect(response).toEqual({
      chargeId: '',
      contracts: null,
      insufficientBalance: false,
      error: mockError,
    });
    consoleError.mockRestore();
  });
});
