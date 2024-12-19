import { beforeEach, describe, expect, it } from 'vitest';
import { isSpinnerDisplayed } from './isSpinnerDisplayed';

describe('isSpinnerDisplayed', () => {
  let transactionHash: string;
  let errorMessage: string;
  let transactionId: string;
  let isInProgress: boolean;

  beforeEach(() => {
    transactionHash = '123';
    errorMessage = '';
    transactionId = '';
    isInProgress = false;
  });

  it('should return true if transaction hash exists', () => {
    const result = isSpinnerDisplayed({
      errorMessage,
      isInProgress,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return true if isInProgress', () => {
    transactionHash = '';
    errorMessage = '';
    transactionId = '';
    isInProgress = true;
    const result = isSpinnerDisplayed({
      errorMessage,
      isInProgress,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });

  it('should return false if errorMessage exists', () => {
    transactionHash = '';
    errorMessage = 'error message';
    transactionId = '';
    isInProgress = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isInProgress,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(false);
  });

  it('should return true if transaction id exists', () => {
    transactionHash = '';
    errorMessage = '';
    transactionId = '123';
    isInProgress = false;
    const result = isSpinnerDisplayed({
      errorMessage,
      isInProgress,
      transactionHash,
      transactionId,
    });
    expect(result).toEqual(true);
  });
});
