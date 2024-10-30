import { convertToNeynarUserModel } from './convertToNeynarUserModel';
import type { NeynarBulkUserLookupModel } from './types';

export function convertToNeynarUserResponseModel(
  /* biome-ignore lint: code needs to be deprecated */
  data: any,
): NeynarBulkUserLookupModel | undefined {
  if (!data) {
    return;
  }
  const response: NeynarBulkUserLookupModel = {
    users: [],
  };
  for (const user of data.users) {
    const formattedUser = convertToNeynarUserModel(user);
    if (formattedUser) {
      response.users.push(formattedUser);
    }
  }
  return response;
}
