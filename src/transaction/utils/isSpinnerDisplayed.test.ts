import { isSpinnerDisplayed } from './isSpinnerDisplayed';

describe('isSpinnerDisplayed', () => {
  it('should return true if transaction hash exists', () => {
    const transactionHash = '123';
    const errorMessage = '';
    const statusSingle = '';
    const statusBatched = '';
    const transactionId = '';
    const isLoading = false;

    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      statusSingle,
      statusBatched,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return true if isLoading', () => {
    const transactionHash = '';
    const errorMessage = '';
    const statusSingle = '';
    const statusBatched = '';
    const transactionId = '';
    const isLoading = true;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      statusSingle,
      statusBatched,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return true if status is pending', () => {
    const transactionHash = '';
    const errorMessage = '';
    const statusSingle = 'pending';
    const statusBatched = '';
    const transactionId = '';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      statusSingle,
      statusBatched,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return false if errorMessage exists', () => {
    const transactionHash = '';
    const errorMessage = 'error message';
    const statusSingle = '';
    const statusBatched = '';
    const transactionId = '';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      statusSingle,
      statusBatched,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(false);
  });

  it('should return true if transaction id exists', () => {
    const transactionHash = '';
    const errorMessage = '';
    const statusSingle = '';
    const statusBatched = '';
    const transactionId = '123';
    const isLoading = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isLoading,
      statusSingle,
      statusBatched,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });
});
