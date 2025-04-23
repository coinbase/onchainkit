import { getMintDetails } from '@/api/getMintDetails';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMintDetails } from './useMintDetails';

vi.mock('@/api/getMintDetails');

describe('useMintDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct token details and loading state', async () => {
    const mockData = { data: 'mockData' };
    (getMintDetails as Mock).mockResolvedValue(mockData);

    const testContractAddress = '0x1234' as `0x${string}`;
    const testTokenId = '1';
    const testMintDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useMintDetails(testMintDetails), {
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
    const testMintDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useMintDetails(testMintDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should return the correct error when fetching token details fails', async () => {
    const mockError = { error: 'mockError' };
    (getMintDetails as Mock).mockResolvedValue(mockError);

    const testContractAddress = '0x1234' as `0x${string}`;
    const testTokenId = '1';
    const testMintDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
    };
    const { result } = renderHook(() => useMintDetails(testMintDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
