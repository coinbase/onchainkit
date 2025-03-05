import { getSocials } from '@/identity/utils/getSocials';
import { renderHook, waitFor } from '@testing-library/react';
import { base, mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useSocials } from './useSocials';

vi.mock('@/identity/utils/getSocials');

describe('useSocials', () => {
  const mockGetSocials = getSocials as Mock;
  const testEnsName = 'test.eth';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useSocials({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('calls getSocials with correct parameters', () => {
    renderHook(() => useSocials({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(mockGetSocials).toHaveBeenCalledWith({
      ensName: testEnsName,
      chain: mainnet,
    });
  });

  it('uses the provided chain', () => {
    renderHook(() => useSocials({ ensName: testEnsName, chain: base }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(mockGetSocials).toHaveBeenCalledWith({
      ensName: testEnsName,
      chain: base,
    });
  });

  it('respects the enabled option in queryOptions', async () => {
    // Use the renderHook function to create a test harness for the useSocials hook with enabled: false
    const { result } = renderHook(
      () => useSocials({ ensName: testEnsName }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // The query should not be executed
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetSocials).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    // Mock the getSocials function to return some data
    mockGetSocials.mockResolvedValue({
      twitter: 'twitterHandle',
      github: 'githubUsername',
      farcaster: 'farcasterUsername',
      website: 'https://example.com',
    });

    // Use the renderHook function to create a test harness for the useSocials hook
    const { result } = renderHook(() => useSocials({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the socials
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // The query should be executed with the default options
    expect(mockGetSocials).toHaveBeenCalled();
  });

  it('merges custom queryOptions with default options', async () => {
    const customStaleTime = 60000; // 1 minute

    // Mock the getSocials function to return some data
    mockGetSocials.mockResolvedValue({
      twitter: 'twitterHandle',
      github: 'githubUsername',
      farcaster: 'farcasterUsername',
      website: 'https://example.com',
    });

    // Use the renderHook function to create a test harness for the useSocials hook with custom staleTime
    const { result } = renderHook(
      () =>
        useSocials({ ensName: testEnsName }, { staleTime: customStaleTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Wait for the hook to finish fetching the socials
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // The query should be executed with the custom staleTime
    expect(mockGetSocials).toHaveBeenCalled();
  });
});
