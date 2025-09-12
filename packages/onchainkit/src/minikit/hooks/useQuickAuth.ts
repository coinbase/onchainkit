import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import sdk from '@farcaster/miniapp-sdk';
import { useIsInMiniApp } from './useIsInMiniApp';
import { useRef } from 'react';

type FetchParams = Parameters<typeof sdk.quickAuth.fetch>;
type Input = FetchParams[0];
type Init = FetchParams[1];

/**
 * Hook to authenticate user via Farcaster SDK's Quick Auth feature.
 * Runs only in Mini App context, performs a single authenticated fetch to
 * your app's auth endpoint
 * @param input - The endpoint that will process the Quick Auth request
 * @param init - A RequestInit object containing any custom settings that you want to apply to the request
 * @param useQueryOptions - Options to pass to the useQuery hook
 * @returns The React Query result where `data` is `TQuickAuthResponse | null`
 */
export function useQuickAuth<TQuickAuthResponse = unknown>(
  input: Input,
  init?: Init,
  useQueryOptions?: UseQueryOptions<TQuickAuthResponse | null>,
) {
  const { isInMiniApp } = useIsInMiniApp();
  const hasAuthedRef = useRef(false);

  return useQuery<TQuickAuthResponse | null>({
    queryKey: ['useQuickAuth', isInMiniApp],
    queryFn: async () => {
      if (hasAuthedRef.current) {
        return null;
      }

      try {
        const result = await sdk.quickAuth.fetch(input, init);

        if (!result.ok) {
          throw new Error('quickAuth.fetch response was not successful');
        }

        const data = (await result.json()) as TQuickAuthResponse;
        hasAuthedRef.current = true;
        return data;
      } catch (err) {
        console.error('Quick auth error:', err);
        hasAuthedRef.current = true;
        return null;
      }
    },
    enabled: !!isInMiniApp,
    ...useQueryOptions,
  });
}
