import { BASE_DEFAULT_PROFILE_PICTURES } from '../constants.js';
import { getBaseDefaultProfilePictureIndex } from './getBaseDefaultProfilePictureIndex.js';
const getBaseDefaultProfilePicture = username => {
  const profilePictureIndex = getBaseDefaultProfilePictureIndex(username, BASE_DEFAULT_PROFILE_PICTURES.length);
  const selectedProfilePicture = BASE_DEFAULT_PROFILE_PICTURES[profilePictureIndex];
  const base64Svg = btoa(selectedProfilePicture);
  const dataUri = `data:image/svg+xml;base64,${base64Svg}`;
  return dataUri;
};
export { getBaseDefaultProfilePicture };
//# sourceMappingURL=getBaseDefaultProfilePicture.js.map
