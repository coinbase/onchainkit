import sdk from '@farcaster/frame-sdk';
import { useQuery } from '@tanstack/react-query';

/**
 * Check if the app is being viewed in a mini app context.
 */
export function useIsInMiniApp() {
  const { data, ...rest } = useQuery({
    queryKey: ['useIsInMiniApp'],
    queryFn: sdk.isInMiniApp,
  });

  return {
    ...rest,
    isInMiniApp: data,
  };
}
