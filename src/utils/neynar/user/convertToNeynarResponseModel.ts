import { convertToNeynarUserModel } from './convertToNeynarUserModel';
import { NeynarBulkUserLookupModel } from './types';

export function convertToNeynarResponseModel(data: any): NeynarBulkUserLookupModel | undefined {
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
