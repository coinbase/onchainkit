import { describe, expect, it } from 'vitest';
import {
  GENERAL_PAY_ERROR_MESSAGE,
  PAY_INVALID_CHARGE_ERROR_MESSAGE,
  PAY_INVALID_PARAMETER_ERROR_MESSAGE,
  PAY_TOO_MANY_REQUESTS_ERROR_MESSAGE,
  UNCAUGHT_PAY_ERROR_MESSAGE,
} from '../../pay/constants';
import { getPayErrorMessage } from './getPayErrorMessage';

describe('getPayErrorMessage', () => {
  it('should return TOO_MANY_REQUESTS_ERROR_MESSAGE for errorCode -32001', () => {
    const result = getPayErrorMessage(-32001);
    expect(result).toBe(PAY_TOO_MANY_REQUESTS_ERROR_MESSAGE);
  });

  it('should return PAY_INVALID_CHARGE_ERROR_MESSAGE for errorCode -32601', () => {
    const result = getPayErrorMessage(-32601);
    expect(result).toBe(PAY_INVALID_CHARGE_ERROR_MESSAGE);
  });

  it('should return PAY_INVALID_PARAMETER_ERROR_MESSAGE for errorCode -32602', () => {
    const result = getPayErrorMessage(-32602);
    expect(result).toBe(PAY_INVALID_PARAMETER_ERROR_MESSAGE);
  });

  it('should return GENERAL_PAY_ERROR_MESSAGE for misc errorCode', () => {
    const result = getPayErrorMessage(-32603);
    expect(result).toBe(GENERAL_PAY_ERROR_MESSAGE);
  });

  it('should return UNCAUGHT_PAY_ERROR_MESSAGE for no errorCode', () => {
    const result = getPayErrorMessage();
    expect(result).toBe(UNCAUGHT_PAY_ERROR_MESSAGE);
  });
});
