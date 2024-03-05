/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { publicClient } from '../../network/client';
import { useName, ensNameAction } from './useName';
import { getNewReactQueryTestProvider } from '../../test-utils/hooks/get-new-react-query-test-provider';

jest.mock('../../network/client');

describe('useName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct ENS name and loading state', async () => {
    const testAddress = '0x123';
    const testEnsName = 'test.ens';

    // Mock the getEnsName method of the publicClient
    mockGetEnsName.mockResolvedValue(testEnsName);

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching from ens action', async () => {
    const testAddress = '0x123';

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('ensNameAction', () => {
    it('should return correct value from client getEnsName', async () => {
      const walletAddress = '0x1234';
      const expectedEnsName = 'avatarUrl';

      mockGetEnsName.mockResolvedValue(expectedEnsName);

      const name = await ensNameAction(walletAddress);

      expect(name).toBe(expectedEnsName);
      expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    });

    it('should return null name when client ', async () => {
      const walletAddress = '0x1234';
      const expectedEnsName = 'avatarUrl';

      mockGetEnsName.mockResolvedValue(expectedEnsName);

      const name = await ensNameAction(walletAddress);

      expect(name).toBe(expectedEnsName);
      expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    });

    it('should return null client getEnsName throws an error', async () => {
      const walletAddress = '0x1234';

      mockGetEnsName.mockRejectedValue(new Error('This is an error'));

      await expect(ensNameAction(walletAddress)).rejects.toThrow('This is an error');
    });
  });
});
