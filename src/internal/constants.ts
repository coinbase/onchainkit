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
  enabled: true,
  gcTime: DEFAULT_CACHE_TIME,
  cacheTime: DEFAULT_CACHE_TIME,
  staleTime: DEFAULT_STALE_TIME,
  refetchOnWindowFocus: false,
} as const;
