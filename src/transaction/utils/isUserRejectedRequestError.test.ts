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
});
