import { describe, expect, it } from 'vitest';
import {
  CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE,
  CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE,
  CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE,
  GENERAL_CHECKOUT_ERROR_MESSAGE,
  UNCAUGHT_CHECKOUT_ERROR_MESSAGE,
} from '../../checkout/constants';
import { getPayErrorMessage } from './getPayErrorMessage';

describe('getPayErrorMessage', () => {
  it('should return TOO_MANY_REQUESTS_ERROR_MESSAGE for errorCode -32001', () => {
    const result = getPayErrorMessage(-32001);
    expect(result).toBe(CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE);
  });

  it('should return CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE for errorCode -32601', () => {
    const result = getPayErrorMessage(-32601);
    expect(result).toBe(CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE);
  });

  it('should return CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE for errorCode -32602', () => {
    const result = getPayErrorMessage(-32602);
    expect(result).toBe(CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE);
  });

  it('should return GENERAL_CHECKOUT_ERROR_MESSAGE for misc errorCode', () => {
    const result = getPayErrorMessage(-32603);
    expect(result).toBe(GENERAL_CHECKOUT_ERROR_MESSAGE);
  });

  it('should return UNCAUGHT_CHECKOUT_ERROR_MESSAGE for no errorCode', () => {
    const result = getPayErrorMessage();
    expect(result).toBe(UNCAUGHT_CHECKOUT_ERROR_MESSAGE);
  });
});
