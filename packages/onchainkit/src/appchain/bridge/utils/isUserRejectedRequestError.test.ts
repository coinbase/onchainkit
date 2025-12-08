import { describe, expect, it } from 'vitest';
import { isUserRejectedRequestError } from './isUserRejectedRequestError';

describe('isUserRejectedRequestError', () => {
  it('should return true if error is UserRejectedRequestError', () => {
    const error = {
      cause: {
        name: 'UserRejectedRequestError',
      },
    };
    expect(isUserRejectedRequestError(error)).toBe(true);
  });

  it('should return false if error is not UserRejectedRequestError', () => {
    const error = {
      cause: {
        name: 'Error',
      },
    };
    expect(isUserRejectedRequestError(error)).toBe(false);
  });

  it('should return true if error message includes User rejected the request.', () => {
    const error = {
      shortMessage: 'User rejected the request.',
    };
    expect(isUserRejectedRequestError(error)).toBe(true);
  });

  it('should return false if error message does not include User rejected the request.', () => {
    const error = {
      message: 'Error',
    };
    expect(isUserRejectedRequestError(error)).toBe(false);
  });
});
