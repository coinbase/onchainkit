import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from '../../identity/hooks/getNewReactQueryTestProvider';
import { getTokenDetails } from '../utils/getTokenDetails';
import { useTokenDetails } from './useTokenDetails';

vi.mock('../utils/getTokenDetails');

describe('useTokenDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct token details and loading state', async () => {
    const mockData = { data: 'mockData' };
    (getTokenDetails as Mock).mockResolvedValue(mockData);

    const testContractAddress = '0x1234';
    const testTokenId = '1';
    const testUserAddress = '0x5678';
    const testTokenDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
      userAddress: testUserAddress,
      chainId: 1,
      includeFloorPrice: false,
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
    const testContractAddress = '0x1234';
    const testTokenId = '1';
    const testUserAddress = '0x5678';
    const testTokenDetails = {
      contractAddress: testContractAddress,
      tokenId: testTokenId,
      userAddress: testUserAddress,
      chainId: 1,
      includeFloorPrice: false,
    };
    const { result } = renderHook(() => useTokenDetails(testTokenDetails), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });
});
