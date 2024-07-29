import { convertToNeynarUserModel } from './convertToNeynarUserModel';

describe('convertToNeynarUserModel', () => {
  it('should covert the model correctly', async () => {
    const resp = convertToNeynarUserModel({
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
    });

    expect(resp?.fid).toEqual(1234);
    expect(resp?.custody_address).toEqual('0x00123');
    expect(resp?.username).toEqual('coolUsername');
    expect(resp?.display_name).toEqual('cool name');
    expect(resp?.pfp_url).toEqual('pfp_url');
    expect(resp?.profile).toEqual({
      bio: {
        text: 'text',
      },
    });
    expect(resp?.follower_count).toEqual(42);
    expect(resp?.verifications).toEqual(['0x00123']);
  });

  it('should return undefined when data is empty', async () => {
    const resp = convertToNeynarUserModel(undefined);
    expect(resp).toEqual(undefined);
  });

  it('should return fid 0 when fid empty', async () => {
    const resp = convertToNeynarUserModel({
      fid: undefined,
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
    });
    expect(resp?.fid).toEqual(0);
  });
});
