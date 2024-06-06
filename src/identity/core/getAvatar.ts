import { normalize } from 'viem/ens';
import { publicClient } from '../../network/client';
import { GetAvatarReturnType } from '../types';

export const getAvatar = async (ensName: string): Promise<GetAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(ensName),
  });
};
