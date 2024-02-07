import { publicClient } from '../network/client';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';
import { GetEnsAvatarReturnType, normalize } from 'viem/ens';

export const ensAvatarAction = (ensName: string) => async (): Promise<GetEnsAvatarReturnType> => {
  try {
    return await publicClient.getEnsAvatar({
      name: normalize(ensName),
    });
  } catch (err) {
    return null;
  }
};

export const useAvatar = (ensName: string) => {
  const ensActionKey = `ens-avatar-${ensName}` ?? '';
  const { data: ensAvatar, isLoading } = useOnchainActionWithCache(
    ensAvatarAction(ensName),
    ensActionKey,
  );
  return { ensAvatar, isLoading };
};
