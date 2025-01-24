import { getTokenDetails } from '@/api/getTokenDetails';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTokenDetails } from './useTokenDetails';

vi.mock('@/api/getTokenDetails');

describe('useTokenDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct token details and loading state', async () => {
    const mockData = { data: 'mockData' };
    (getTokenDetails as Mock).mockResolvedValue(mockData);

    const testContractAddress = '0x1234' as `0x${string}`;
    const testTokenId = '1';
    const testTokenDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useTokenDetails(testTokenDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(mockData);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return the loading state true while still fetching token details', async () => {
    const testContractAddress = '0x1234' as `0x${string}`;
    const testTokenId = '1';
    const testTokenDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useTokenDetails(testTokenDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should return the correct error when fetching token details fails', async () => {
    const mockError = { error: 'mockError' };
    (getTokenDetails as Mock).mockResolvedValue(mockError);

    const testContractAddress = '0x1234' as `0x${string}`;
    const testTokenId = '1';
    const testTokenDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useTokenDetails(testTokenDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
