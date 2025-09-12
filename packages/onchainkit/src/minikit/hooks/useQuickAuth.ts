import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import sdk from '@farcaster/miniapp-sdk';
import { useIsInMiniApp } from './useIsInMiniApp';
import { useRef } from 'react';

type FetchParams = Parameters<typeof sdk.quickAuth.fetch>;
type Input = FetchParams[0];
type Init = FetchParams[1];

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
      // If we're in a mini app context, all we have to do to make an authenticated
      // request is to use `sdk.quickAuth.fetch`. This will automatically include the
      // necessary `Authorization` header for the backend to verify.

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
        return null;
      } finally {
        hasAuthedRef.current = true;
      }
    },
    enabled: !!isInMiniApp,
    ...useQueryOptions,
  });
}
