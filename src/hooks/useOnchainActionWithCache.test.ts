/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';
import { InMemoryStorage } from '../store/inMemoryStorageService';

jest.mock('../store/inMemoryStorageService', () => ({
  InMemoryStorage: {
    getData: jest.fn(),
    setData: jest.fn(),
  },
}));

describe('useOnchainActionWithCache', () => {
  const mockAction = jest.fn();
  const actionKey = 'testKey';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with loading state and undefined data', () => {
    const { result } = renderHook(() => useOnchainActionWithCache(mockAction, actionKey));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('fetches data and updates state', async () => {
    const testData = 'testData';
    mockAction.mockResolvedValue(testData);

    const { result } = renderHook(() => useOnchainActionWithCache(mockAction, actionKey));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
      expect(result.current.data).toBe(testData);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('caches data when an actionKey is provided', async () => {
    const testData = 'testData';
    mockAction.mockResolvedValue(testData);

    renderHook(() => useOnchainActionWithCache(mockAction, actionKey));
    await waitFor(() => {
      expect(InMemoryStorage.setData).toHaveBeenCalledWith(actionKey, testData);
    });
  });

  it('does not cache data when actionKey is empty', async () => {
    const testData = 'testData';
    mockAction.mockResolvedValue(testData);

    renderHook(() => useOnchainActionWithCache(mockAction, ''));

    await waitFor(() => {
      expect(InMemoryStorage.setData).not.toHaveBeenCalled();
    });
  });
});
