import { getSocials } from '@/identity/utils/getSocials';
import { renderHook, waitFor } from '@testing-library/react';
import { base, mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useSocials } from './useSocials';

vi.mock('@/identity/utils/getSocials');

const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type UseQueryType = <TData, _TError = Error>(options: {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    [key: string]: unknown;
  }) => unknown;

  return {
    ...actual,
    useQuery: <TData, TError = Error>(options: {
      queryKey: unknown[];
      queryFn: () => Promise<TData>;
      [key: string]: unknown;
    }) => {
      mockUseQuery(options);
      return (actual.useQuery as UseQueryType)<TData, TError>(options);
    },
  };
});

describe('useSocials', () => {
  const mockGetSocials = getSocials as Mock;
  const testEnsName = 'test.eth';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
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
    const { result } = renderHook(
      () => useSocials({ ensName: testEnsName }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetSocials).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    mockGetSocials.mockResolvedValue({
      twitter: 'twitterHandle',
      github: 'githubUsername',
      farcaster: 'farcasterUsername',
      website: 'https://example.com',
    });

    const { result } = renderHook(() => useSocials({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetSocials).toHaveBeenCalled();
  });

  it('merges custom queryOptions with default options', async () => {
    const customStaleTime = 60000;

    mockGetSocials.mockResolvedValue({
      twitter: 'twitterHandle',
      github: 'githubUsername',
      farcaster: 'farcasterUsername',
      website: 'https://example.com',
    });

    const { result } = renderHook(
      () =>
        useSocials({ ensName: testEnsName }, { staleTime: customStaleTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetSocials).toHaveBeenCalled();
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const mockCacheTime = 60000;
    const mockSocialsData = {
      twitter: 'twitterhandle',
      github: 'githubuser',
      farcaster: 'farcasteruser',
      website: 'https://example.com',
    };

    mockGetSocials.mockResolvedValue(mockSocialsData);

    renderHook(
      () => useSocials({ ensName: testEnsName }, { cacheTime: mockCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithCacheTime = mockUseQuery.mock.calls[0][0];
    expect(optionsWithCacheTime).toHaveProperty('gcTime', mockCacheTime);

    const mockGcTime = 120000;

    mockUseQuery.mockClear();

    renderHook(
      () =>
        useSocials(
          {
            ensName: testEnsName,
          },
          {
            cacheTime: mockCacheTime,
            gcTime: mockGcTime,
          },
        ),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithBoth = mockUseQuery.mock.calls[0][0];
    expect(optionsWithBoth).toHaveProperty('gcTime', mockGcTime);
  });
});
