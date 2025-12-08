import { describe, expect, it } from 'vitest';
import { buildErrorStruct } from './buildErrorStruct';

describe('buildErrorStruct', () => {
  it('should return an error struct with the correct code, error, and message', () => {
    const error = buildErrorStruct({
      code: 'test-code',
      error: 'test-error',
      message: 'test-message',
    });

    expect(error).toEqual({
      code: 'test-code',
      error: 'test-error',
      message: 'test-message',
    });
  });

  it('should return with default values if no values are provided', () => {
    const error = buildErrorStruct({
      code: 'UNCAUGHT_ERROR',
    });

    expect(error).toEqual({
      code: 'UNCAUGHT_ERROR',
      error: 'Something went wrong',
      message: 'Request failed, please try again later',
    });
  });
});
