/**
 * Default cache time for queries (30 minutes)
 */
export const DEFAULT_CACHE_TIME = 1000 * 60 * 30;

/**
 * Default stale time for queries (5 minutes)
 */
export const DEFAULT_STALE_TIME = 1000 * 60 * 5;

/**
 * Default query options used across hooks
 */
export const DEFAULT_QUERY_OPTIONS = {
  /** Determines how long inactive/unused data remains in the cache */
  gcTime: DEFAULT_CACHE_TIME,
  /** Determines how long data remains "fresh" before it's considered stale. */
  staleTime: DEFAULT_STALE_TIME,
  /** Whether the query should refetch when the window is focused */
  refetchOnWindowFocus: false,
} as const;
