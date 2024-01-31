/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';

describe('useOnchainActionWithCache Hook', () => {
  const mockAction = jest.fn();
  const mockStorageService = {
    getData: jest.fn(),
    setData: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with undefined data', async () => {
    const { result } = renderHook(() =>
      useOnchainActionWithCache(mockAction, 'testKey', mockStorageService),
    );
    expect(result.current).toBeUndefined();
  });

  it('fetches data without caching for empty actionKey', async () => {
    mockAction.mockResolvedValue('fetchedData');
    const { result } = renderHook(() =>
      useOnchainActionWithCache(mockAction, '', mockStorageService),
    );

    await waitFor(() => {
      expect(result.current).toBe('fetchedData');
    });
    expect(mockStorageService.setData).not.toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalled();
  });

  it('fetches and caches data for non-empty actionKey', async () => {
    mockStorageService.getData.mockResolvedValue(undefined);
    mockAction.mockResolvedValue('fetchedData');
    const { result } = renderHook(() =>
      useOnchainActionWithCache(mockAction, 'testKey', mockStorageService),
    );

    await waitFor(() => {
      expect(result.current).toBe('fetchedData');
    });
    expect(mockStorageService.setData).toHaveBeenCalledWith('testKey', 'fetchedData');
  });

  it('retrieves data from cache', async () => {
    mockStorageService.getData.mockResolvedValue('cachedData');
    const { result } = renderHook(() =>
      useOnchainActionWithCache(mockAction, 'testKey', mockStorageService),
    );

    await waitFor(() => {
      expect(result.current).toBe('cachedData');
    });
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('does not update state after unmount', async () => {
    mockAction.mockResolvedValue('fetchedData');
    const { result, unmount } = renderHook(() =>
      useOnchainActionWithCache(mockAction, 'testKey', mockStorageService),
    );
    unmount();

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });
});
