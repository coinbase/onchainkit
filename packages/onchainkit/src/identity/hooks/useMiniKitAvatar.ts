import { useMiniKit } from '../../minikit/hooks/useMiniKit';

/**
 * A React hook that retrieves the avatar from the MiniKit context.
 * @returns The avatar from the MiniKit context.
 */

export const useMiniKitAvatar = () => {
  const { context } = useMiniKit();
  return context?.user.pfpUrl;
};
