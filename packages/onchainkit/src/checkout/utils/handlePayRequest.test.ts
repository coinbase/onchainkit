import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';

import { buildPayTransaction } from '@/api';
import { RequestContext } from '@/core/network/constants';
import { handlePayRequest } from './handlePayRequest';

vi.mock('@/api', () => ({
  buildPayTransaction: vi.fn(),
}));

describe('handlePayRequest', () => {
  const mockAddress: Address = '0x1234567890123456789012345678901234567890';

  it('should handle request with chargeHandler', async () => {
    const mockChargeId = 'charge123';
    const mockChargeHandler = vi.fn().mockResolvedValue(mockChargeId);
    const mockResponse = { success: true };
    (buildPayTransaction as Mock).mockResolvedValue(mockResponse);
    const result = await handlePayRequest({
      address: mockAddress,
      chargeHandler: mockChargeHandler,
    });
    expect(mockChargeHandler).toHaveBeenCalled();
    expect(buildPayTransaction).toHaveBeenCalledWith(
      {
        address: mockAddress,
        chargeId: mockChargeId,
      },
      RequestContext.Checkout,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle request with productId', async () => {
    const mockProductId = 'product123';
    const mockResponse = { success: true };
    (buildPayTransaction as Mock).mockResolvedValue(mockResponse);
    const result = await handlePayRequest({
      address: mockAddress,
      productId: mockProductId,
    });
    expect(buildPayTransaction).toHaveBeenCalledWith(
      {
        address: mockAddress,
        productId: mockProductId,
      },
      RequestContext.Checkout,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle request with neither chargeHandler nor productId', async () => {
    const mockResponse = { success: true };
    (buildPayTransaction as Mock).mockResolvedValue(mockResponse);
    const result = await handlePayRequest({ address: mockAddress });
    expect(buildPayTransaction).toHaveBeenCalledWith(
      { address: mockAddress },
      RequestContext.Checkout,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when buildPayTransaction returns an error', async () => {
    const mockError = { error: 'Something went wrong' };
    (buildPayTransaction as Mock).mockResolvedValue(mockError);
    await expect(handlePayRequest({ address: mockAddress })).rejects.toThrow(
      'Something went wrong',
    );
  });
});
