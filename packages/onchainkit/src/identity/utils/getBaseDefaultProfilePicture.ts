import type { Basename } from '@/identity/types';
import { BASE_DEFAULT_PROFILE_PICTURES } from '../constants';
import { getBaseDefaultProfilePictureIndex } from './getBaseDefaultProfilePictureIndex';

export const getBaseDefaultProfilePicture = (username: Basename) => {
  const profilePictureIndex = getBaseDefaultProfilePictureIndex(
    username,
    BASE_DEFAULT_PROFILE_PICTURES.length,
  );
  const selectedProfilePicture =
    BASE_DEFAULT_PROFILE_PICTURES[profilePictureIndex];
  const base64Svg = btoa(selectedProfilePicture);
  const dataUri = `data:image/svg+xml;base64,${base64Svg}`;
  return dataUri;
};
