/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { publicClient } from '../../network/client';
import { useAvatar, ensAvatarAction } from './useAvatar';

jest.mock('../../network/client');

describe('useAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct ENS avatar and loading state', async () => {
    const queryClient = new QueryClient();
    function ReactQueryTestProvider({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';

    // Mock the getEnsAvatar method of the publicClient
    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(() => useAvatar({ ensName: testEnsName }), {
      wrapper: ReactQueryTestProvider,
    });

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the ENS avatar and loading state are correct
      expect(result.current.data).toBe(testEnsAvatar);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching ENS avatar', async () => {
    const queryClient = new QueryClient();
    function ReactQueryTestProvider({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const testEnsName = 'test.ens';

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(() => useAvatar({ ensName: testEnsName }), {
      wrapper: ReactQueryTestProvider,
    });

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the loading state is correct
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('ensAvatarAction', () => {
    it('should return correct avatar URL from client getEnsAvatar', async () => {
      const ensName = 'test.ens';
      const expectedAvatarUrl = 'avatarUrl';

      mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

      const avatarUrl = await ensAvatarAction(ensName);

      expect(avatarUrl).toBe(expectedAvatarUrl);
      expect(mockGetEnsAvatar).toHaveBeenCalledWith({ name: ensName });
    });

    it('should return null when client getEnsAvatar throws an error', async () => {
      const ensName = 'test.ens';

      mockGetEnsAvatar.mockRejectedValue(new Error('This is an error'));

      await expect(ensAvatarAction(ensName)).rejects.toThrow('This is an error');
    });
  });
});
