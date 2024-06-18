/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useIdentityContext } from './context';

describe('useIdentityContext', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the identity context', () => {
    const { result } = renderHook(() => useIdentityContext());
    expect(result.current).toEqual({});
  });
});
