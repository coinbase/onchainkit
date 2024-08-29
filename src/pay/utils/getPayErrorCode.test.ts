import { describe, expect, it } from 'vitest';
import {
  GENERAL_PAY_ERROR_CODE,
  PAY_INVALID_CHARGE_ERROR_CODE,
  PAY_INVALID_PARAMETER_ERROR_CODE,
  PAY_TOO_MANY_REQUESTS_ERROR_CODE,
} from '../constants';
import { getPayErrorCode } from './getPayErrorCode';

describe('getPayErrorCode', () => {
  it('should return TOO_MANY_REQUESTS_ERROR_CODE for errorCode -32001', () => {
    const result = getPayErrorCode(-32001);
    expect(result).toBe(PAY_TOO_MANY_REQUESTS_ERROR_CODE);
  });

  it('should return PAY_INVALID_CHARGE_ERROR_CODE for errorCode -32601', () => {
    const result = getPayErrorCode(-32601);
    expect(result).toBe(PAY_INVALID_CHARGE_ERROR_CODE);
  });

  it('should return PAY_INVALID_PARAMETER_ERROR_CODE for errorCode -32602', () => {
    const result = getPayErrorCode(-32602);
    expect(result).toBe(PAY_INVALID_PARAMETER_ERROR_CODE);
  });

  it('should return GENERAL_PAY_ERROR_CODE for misc errorCode', () => {
    const result = getPayErrorCode(-32603);
    expect(result).toBe(GENERAL_PAY_ERROR_CODE);
  });

  it('should return GENERAL_PAY_ERROR_CODE for no errorCode', () => {
    const result = getPayErrorCode();
    expect(result).toBe(GENERAL_PAY_ERROR_CODE);
  });
});
