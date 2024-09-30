import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { CDP_HYDRATE_CHARGE } from '../network/definitions/pay';
import { sendRequest } from '../network/request';
import {
  PAY_INVALID_CHARGE_ERROR_MESSAGE,
  UNCAUGHT_PAY_ERROR_MESSAGE,
} from '../pay/constants';
/**
 * @vitest-environment node
 */
import { buildPayTransaction } from './buildPayTransaction';
import {
  MOCK_HYDRATE_CHARGE_INVALID_CHARGE_ERROR_RESPONSE,
  MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE,
  MOCK_INVALID_CHARGE_ID,
  MOCK_VALID_CHARGE_ID,
  MOCK_VALID_PAYER_ADDRESS,
} from './mocks';
import type {
  BuildPayTransactionParams,
  HydrateChargeAPIParams,
} from './types';

vi.mock('../network/request');

describe('buildPayTransaction', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a Pay Transaction', async () => {
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
    expect(sendRequest).toHaveBeenCalledWith(CDP_HYDRATE_CHARGE, [
      mockAPIParams,
    ]);
  });

  it('should return an error if sendRequest fails', async () => {
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
    const hydratedCharge = await buildPayTransaction(mockParams);
    expect(hydratedCharge).toEqual(MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE.result);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_HYDRATE_CHARGE, [
      mockAPIParams,
    ]);
    const mockError = new Error(
      'buildPayTransaction: Error: Failed to send request',
    );
    (sendRequest as Mock).mockRejectedValue(mockError);
    const error = await buildPayTransaction(mockParams);
    expect(error).toEqual({
      code: 'AmBPTa03',
      error: 'Something went wrong',
      message: UNCAUGHT_PAY_ERROR_MESSAGE,
    });
  });

  it('should return an error object from buildPayTransaction', async () => {
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
      message: PAY_INVALID_CHARGE_ERROR_MESSAGE,
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_HYDRATE_CHARGE, [
      mockAPIParams,
    ]);
  });
});
