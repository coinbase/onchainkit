import { isSpinnerDisplayed } from './utils';

describe('isSpinnerDisplayed', () => {
  it('should return false if transaction hash exists', () => {
    const transactionHash = '123';
    const errorMessage = '';
    const status = '';
    const transactionId = '';
    const isLoading = false;

    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      status,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(false);
  });

  it('should return true if isLoading', () => {
    const transactionHash = '';
    const errorMessage = '';
    const status = '';
    const transactionId = '';
    const isLoading = true;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      status,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return true if status is pending', () => {
    const transactionHash = '';
    const errorMessage = '';
    const status = 'pending';
    const transactionId = '';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      status,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return false if errorMessage exists', () => {
    const transactionHash = '';
    const errorMessage = 'error message';
    const status = '';
    const transactionId = '';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      status,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(false);
  });

  it('should return true if transaction id exists', () => {
    const transactionHash = '';
    const errorMessage = '';
    const status = '';
    const transactionId = '123';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      status,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });
});
