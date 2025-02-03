import {
  CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE,
  UNCAUGHT_CHECKOUT_ERROR_MESSAGE,
} from '@/checkout/constants';
import { RequestContext } from '@/core/network/constants';
import {
  CDP_CREATE_PRODUCT_CHARGE,
  CDP_HYDRATE_CHARGE,
} from '@/core/network/definitions/pay';
import { sendRequest } from '@/core/network/request';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
/**
 * @vitest-environment node
 */
import { buildPayTransaction } from './buildPayTransaction';
import {
  MOCK_CREATE_PRODUCT_CHARGE_SUCCESS_RESPONSE,
  MOCK_HYDRATE_CHARGE_INVALID_CHARGE_ERROR_RESPONSE,
  MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE,
  MOCK_INVALID_CHARGE_ID,
  MOCK_VALID_CHARGE_ID,
  MOCK_VALID_PAYER_ADDRESS,
  MOCK_VALID_PRODUCT_ID,
} from './mocks';
import type {
  BuildPayTransactionParams,
  CreateProductChargeParams,
  HydrateChargeAPIParams,
} from './types';

vi.mock('@/core/network/request');

describe('buildPayTransaction', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a Pay Transaction with chargeId', async () => {
    const mockParams: BuildPayTransactionParams = {
      address: MOCK_VALID_PAYER_ADDRESS,
      chargeId: MOCK_VALID_CHARGE_ID,
    };
    const mockAPIParams: HydrateChargeAPIParams = {
      sender: MOCK_VALID_PAYER_ADDRESS,
      chargeId: MOCK_VALID_CHARGE_ID,
    };
    (sendRequest as Mock).mockResolvedValue(
      MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE,
    );
    const payTransaction = await buildPayTransaction(mockParams);
    expect(payTransaction).toEqual(MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE.result);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_HYDRATE_CHARGE,
      [mockAPIParams],
      RequestContext.API,
    );
  });

  it('should return a Pay Transaction with productId', async () => {
    const mockParams: BuildPayTransactionParams = {
      address: MOCK_VALID_PAYER_ADDRESS,
      productId: MOCK_VALID_PRODUCT_ID,
    };
    const mockAPIParams: CreateProductChargeParams = {
      sender: MOCK_VALID_PAYER_ADDRESS,
      productId: MOCK_VALID_PRODUCT_ID,
    };
    (sendRequest as Mock).mockResolvedValue(
      MOCK_CREATE_PRODUCT_CHARGE_SUCCESS_RESPONSE,
    );
    const payTransaction = await buildPayTransaction(mockParams);
    expect(payTransaction).toEqual(
      MOCK_CREATE_PRODUCT_CHARGE_SUCCESS_RESPONSE.result,
    );
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_CREATE_PRODUCT_CHARGE,
      [mockAPIParams],
      RequestContext.API,
    );
  });

  it('should return an error if neither chargeId nor productId is provided', async () => {
    const mockParams: BuildPayTransactionParams = {
      address: MOCK_VALID_PAYER_ADDRESS,
    };
    const error = await buildPayTransaction(mockParams);
    expect(error).toEqual({
      code: 'AmBPTa01',
      error: 'No chargeId or productId provided',
      message: UNCAUGHT_CHECKOUT_ERROR_MESSAGE,
    });
    expect(sendRequest).not.toHaveBeenCalled();
  });

  it('should return an error if sendRequest fails', async () => {
    const mockParams: BuildPayTransactionParams = {
      address: MOCK_VALID_PAYER_ADDRESS,
      chargeId: MOCK_VALID_CHARGE_ID,
    };
    const mockError = new Error(
      'buildPayTransaction: Error: Failed to send request',
    );
    (sendRequest as Mock).mockRejectedValue(mockError);
    const error = await buildPayTransaction(mockParams);
    expect(error).toEqual({
      code: 'AmBPTa03',
      error: 'Something went wrong',
      message: UNCAUGHT_CHECKOUT_ERROR_MESSAGE,
    });
  });

  it('should return an error object when hydrating an invalid charge', async () => {
    const mockParams: BuildPayTransactionParams = {
      address: MOCK_VALID_PAYER_ADDRESS,
      chargeId: MOCK_INVALID_CHARGE_ID,
    };
    const mockAPIParams: HydrateChargeAPIParams = {
      sender: MOCK_VALID_PAYER_ADDRESS,
      chargeId: MOCK_INVALID_CHARGE_ID,
    };
    (sendRequest as Mock).mockResolvedValue(
      MOCK_HYDRATE_CHARGE_INVALID_CHARGE_ERROR_RESPONSE,
    );
    const error = await buildPayTransaction(mockParams);
    expect(error).toEqual({
      code: 'AmBPTa02',
      error: 'method not found - Not found',
      message: CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE,
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_HYDRATE_CHARGE,
      [mockAPIParams],
      RequestContext.API,
    );
  });
});
