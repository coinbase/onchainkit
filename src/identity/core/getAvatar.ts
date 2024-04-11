import { publicClient } from '../../network/client';
import { type GetEnsAvatarReturnType, normalize } from 'viem/ens';

export const getAvatar = async (ensName: string): Promise<GetEnsAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(ensName),
  });
};
