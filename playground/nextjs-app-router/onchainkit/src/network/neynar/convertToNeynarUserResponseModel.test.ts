import { describe, expect, it } from 'vitest';
import { convertToNeynarUserResponseModel } from './convertToNeynarUserResponseModel';

describe('convertToNeynarUserResponseModel', () => {
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
    const resp = convertToNeynarUserResponseModel(mockUsersData);
    expect(resp).toEqual(mockUsersData);
  });

  it('should return undefined when data is empty', async () => {
    const resp = convertToNeynarUserResponseModel(undefined);
    expect(resp).toEqual(undefined);
  });
});
