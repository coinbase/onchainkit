import { convertToNeynarResponseModel } from './convertToNeynarResponseModel';

describe('convertToNeynarResponseModel', () => {
  const mockData = {
    fid: 1234,
    custody_address: '0x00123',
    username: 'coolUsername',
    display_name: 'cool name',
    pfp_url: 'pfp_url',
    profile: {
      bio: {
        text: 'text',
      },
    },
    follower_count: 42,
    verifications: ['0x00123'],
  };

  it('should covert the model correctly', async () => {
    const mockUsersData = {
      users: [mockData],
    };
    const resp = convertToNeynarResponseModel(mockUsersData);
    expect(resp).toEqual(mockUsersData);
  });

  it('should return undefined when data is empty', async () => {
    const resp = convertToNeynarResponseModel(undefined);
    expect(resp).toEqual(undefined);
  });
});
