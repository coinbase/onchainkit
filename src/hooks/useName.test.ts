/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { publicClient } from '../network/client';
import { useName, ensNameAction } from './useName';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';

jest.mock('../network/client');
jest.mock('./useOnchainActionWithCache');

describe('useName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;
  const mockUseOnchainActionWithCache = useOnchainActionWithCache as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct ENS name and loading state', async () => {
    const testAddress = '0x123';
    const testEnsName = 'test.ens';

    // Mock the getEnsName method of the publicClient
    mockGetEnsName.mockResolvedValue(testEnsName);
    mockUseOnchainActionWithCache.mockImplementation(() => {
      return {
        data: testEnsName,
        isLoading: false,
      };
    });

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName(testAddress));

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.ensName).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching from ens action', async () => {
    const testAddress = '0x123';

    // Mock the getEnsName method of the publicClient
    // mockGetEnsName.mockResolvedValue(testEnsName);
    mockUseOnchainActionWithCache.mockImplementation(() => {
      return {
        data: undefined,
        isLoading: true,
      };
    });

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName(testAddress));

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.ensName).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('ensNameAction', () => {
    it('should return correct value from client getEnsName', async () => {
      const walletAddress = '0x1234';
      const expectedEnsName = 'avatarUrl';

      mockGetEnsName.mockResolvedValue(expectedEnsName);

      const action = ensNameAction(walletAddress);
      const name = await action();

      expect(name).toBe(expectedEnsName);
      expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    });

    it('should return null name when client ', async () => {
      const walletAddress = '0x1234';
      const expectedEnsName = 'avatarUrl';

      mockGetEnsName.mockResolvedValue(expectedEnsName);

      const action = ensNameAction(walletAddress);
      const name = await action();

      expect(name).toBe(expectedEnsName);
      expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    });

    it('should return null client getEnsName throws an error', async () => {
      const walletAddress = '0x1234';

      mockGetEnsName.mockRejectedValue(new Error('This is an error'));

      const action = ensNameAction(walletAddress);
      const name = await action();

      expect(name).toBe(null);
    });
  });
});
