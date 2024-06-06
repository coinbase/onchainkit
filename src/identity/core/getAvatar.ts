import { normalize } from 'viem/ens';
import { publicClient } from '../../network/client';
import { GetAvatarReturnType } from '../types';

export const getAvatar = async (params: { name: string }): Promise<GetAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(params.name),
  });
};
