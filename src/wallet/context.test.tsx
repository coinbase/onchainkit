/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useWalletContext } from './context';

describe('useWalletContext', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the wallet context', () => {
    const { result } = renderHook(() => useWalletContext());
    expect(result.current).toEqual({});
  });
});
