import { normalize } from 'viem/ens';
import { publicClient } from '../../network/client';
import type { GetAvatar, GetAvatarReturnType } from '../types';

export const getAvatar = async (
  params: GetAvatar,
): Promise<GetAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(params.ensName),
  });
};
