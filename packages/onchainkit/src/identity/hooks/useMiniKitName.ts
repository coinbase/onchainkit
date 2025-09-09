import { useMiniKit } from '../../minikit/hooks/useMiniKit';

/**
 * A React hook that retrieves the username from the MiniKit context.
 * @returns The username from the MiniKit context.
 */

export const useMiniKitName = () => {
  const { context } = useMiniKit();
  return context?.user.username;
};
