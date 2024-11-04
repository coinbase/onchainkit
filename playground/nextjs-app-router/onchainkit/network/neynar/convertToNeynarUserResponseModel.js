import { convertToNeynarUserModel } from './convertToNeynarUserModel.js';
function convertToNeynarUserResponseModel( /* biome-ignore lint: code needs to be deprecated */
data) {
  if (!data) {
    return;
  }
  const response = {
    users: []
  };
  for (const user of data.users) {
    const formattedUser = convertToNeynarUserModel(user);
    if (formattedUser) {
      response.users.push(formattedUser);
    }
  }
  return response;
}
export { convertToNeynarUserResponseModel };
//# sourceMappingURL=convertToNeynarUserResponseModel.js.map
