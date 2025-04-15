/**
 * @vitest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Address } from 'viem';
import { getBuilderScore } from '../../api/getBuilderScore';
import { useBuilderScore } from './useBuilderScore';

// Mock the getBuilderScore function
vi.mock('../../api/getBuilderScore', () => ({
  getBuilderScore: vi.fn(),
}));

// Mock useQuery
const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  type QueryOptions = {
    queryKey: unknown;
    queryFn: () => unknown;
    [key: string]: unknown;
  };

  return {
    ...actual,
    useQuery: (options: QueryOptions) => {
      mockUseQuery(options);
      return (
        actual as { useQuery: (options: QueryOptions) => unknown }
      ).useQuery(options);
    },
  };
});

// Create a wrapper for the React Query Provider
const TestReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

TestReactQueryProvider.displayName = 'TestReactQueryProvider';

describe('useBuilderScore', () => {
  const testAddress = '0x123' as Address;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
    (getBuilderScore as Mock).mockReset();
  });

  it('returns the correct builder score and loading state', async () => {
    (getBuilderScore as Mock).mockResolvedValue({
      points: 100,
      last_calculated_at: '2023-01-01T00:00:00.000Z',
    });

    const { result } = renderHook(
      () => useBuilderScore({ address: testAddress }),
      {
        wrapper: TestReactQueryProvider,
      },
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({
        points: 100,
        last_calculated_at: '2023-01-01T00:00:00.000Z',
      });
    });

    // Check that getBuilderScore was called with the correct address
    expect(getBuilderScore).toHaveBeenCalledWith(testAddress);
  });

  it('handles error state correctly', async () => {
    const errorMessage = 'Failed to fetch builder score: Unauthorized';
    (getBuilderScore as Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(
      () => useBuilderScore({ address: testAddress }),
      {
        wrapper: TestReactQueryProvider,
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });

  it('disables the query when address is empty', async () => {
    (getBuilderScore as Mock).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    renderHook(() => useBuilderScore({ address: undefined }), {
      wrapper: TestReactQueryProvider,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getBuilderScore).not.toHaveBeenCalled();
  });

  it('respects custom query options', async () => {
    (getBuilderScore as Mock).mockResolvedValue({
      points: 100,
      last_calculated_at: '2023-01-01T00:00:00.000Z',
    });

    const customQueryOptions = {
      staleTime: 60000,
      refetchOnWindowFocus: true,
    };

    renderHook(
      () => useBuilderScore({ address: testAddress }, customQueryOptions),
      {
        wrapper: TestReactQueryProvider,
      },
    );

    await waitFor(() => {
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          staleTime: 60000,
          refetchOnWindowFocus: true,
        }),
      );
    });
  });
});
