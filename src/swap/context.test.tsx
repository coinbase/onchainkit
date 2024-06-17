/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useSwapContext } from './context';

describe('useSwapContext', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should throw an error if used outside of SwapProvider', () => {
    expect(() => renderHook(() => useSwapContext())).toThrow(
      'useSwapContext must be used within a Swap component',
    );
  });
});
