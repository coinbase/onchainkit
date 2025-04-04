import { getAttestations } from '@/identity/utils/getAttestations';
/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAttestations } from './useAttestations';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';

vi.mock('@/identity/utils/getAttestations', () => ({
  getAttestations: vi.fn(),
}));

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
      const result = (actual.useQuery as UseQueryType)<TData, TError>(options);
      return result;
    },
  };
});

describe('useAttestations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
  });

  it('returns an empty array if no attestations found', async () => {
    (getAttestations as Mock).mockReturnValue([]);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;
    const { result } = renderHook(
      () => useAttestations({ address, chain, schemaId }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(getAttestations).toHaveBeenCalledWith(address, chain, {
      schemas: [schemaId],
    });
  });

  it('returns attestations if found', async () => {
    const mockAttestations = [
      {
        schemaId: '0xschema',
      },
    ];
    (getAttestations as Mock).mockResolvedValue(mockAttestations);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;
    const { result } = renderHook(
      () => useAttestations({ address, chain, schemaId }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual(mockAttestations);
    });
  });

  it('is disabled when address or schemaId is not provided', async () => {
    (getAttestations as Mock).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const address = '0xaddress';
    const chain = base;

    const { result } = renderHook(
      () => useAttestations({ address, chain, schemaId: '' as `0x${string}` }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getAttestations).not.toHaveBeenCalled();
    expect(result.current).toEqual([]);
  });

  it('respects the enabled option in queryOptions', async () => {
    const mockAttestations = [{ schemaId: '0xschema' }];
    (getAttestations as Mock).mockResolvedValue(mockAttestations);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;

    const { result } = renderHook(
      () => useAttestations({ address, chain, schemaId }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getAttestations).not.toHaveBeenCalled();
    expect(result.current).toEqual([]);
  });

  it('merges custom queryOptions with default options', async () => {
    const mockAttestations = [{ schemaId: '0xschema' }];
    (getAttestations as Mock).mockResolvedValue(mockAttestations);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;
    const customGcTime = 120000;

    const { result } = renderHook(
      () =>
        useAttestations({ address, chain, schemaId }, { gcTime: customGcTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual(mockAttestations);
    });

    expect(getAttestations).toHaveBeenCalled();
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const mockCacheTime = 60000;
    const mockAttestations = [{ schemaId: '0xschema' }];

    (getAttestations as Mock).mockResolvedValue(mockAttestations);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;

    renderHook(
      () =>
        useAttestations(
          { address, chain, schemaId },
          { cacheTime: mockCacheTime },
        ),
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
        useAttestations(
          { address, chain, schemaId },
          { cacheTime: mockCacheTime, gcTime: mockGcTime },
        ),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithBoth = mockUseQuery.mock.calls[0][0];
    expect(optionsWithBoth).toHaveProperty('gcTime', mockGcTime);
  });

  it('creates a stable query key based on address, chain, and schemaId', async () => {
    const mockAttestations = [{ schemaId: '0xschema' }];
    (getAttestations as Mock).mockResolvedValue(mockAttestations);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema' as `0x${string}`;

    const { result, rerender } = renderHook(
      (props: { address: string; schemaId: `0x${string}` }) =>
        useAttestations({
          address: props.address as `0x${string}`,
          chain,
          schemaId: props.schemaId,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
        initialProps: { address: address as `0x${string}`, schemaId },
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual(mockAttestations);
    });

    vi.clearAllMocks();

    rerender({ address: address as `0x${string}`, schemaId });

    expect(getAttestations).not.toHaveBeenCalled();
  });
});
